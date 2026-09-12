import { supabase } from '../config/supabase.js';

/**
 * Get active conversations for the authenticated company
 */
export const getConversations = async (req, res) => {
  try {
    const companyId = req.companyId;
    if (!companyId) {
      return res.status(200).json({ conversations: [] });
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*, participant_a:participant_a_company_id(*), participant_b:participant_b_company_id(*)')
      .or(`participant_a_company_id.eq.${companyId},participant_b_company_id.eq.${companyId}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      return res.status(200).json({ conversations: [] });
    }

    const formatted = (data || []).map((item) => {
      const otherCompany = item.participant_a_company_id === companyId ? item.participant_b : item.participant_a;
      return {
        id: item.id,
        participantId: otherCompany?.id,
        participantName: otherCompany?.name || 'Trading Partner',
        participantType: otherCompany?.type || 'Enterprise',
        participantAvatar: otherCompany?.avatar_url || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=150&q=80',
        lastMessage: item.last_message || 'Conversation initiated',
        lastMessageAt: item.last_message_at,
        timestamp: item.last_message_at,
        unreadCount: 0,
      };
    });

    return res.status(200).json({ conversations: formatted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

/**
 * Get messages in a conversation thread
 */
export const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId || req.params.id;
    const companyId = req.companyId;

    // Verify participant authorization
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conv) {
      return res.status(404).json({ error: 'Conversation thread not found' });
    }

    if (conv.participant_a_company_id !== companyId && conv.participant_b_company_id !== companyId && !req.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to view this conversation' });
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:sender_company_id(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(200).json({ messages: [] });
    }

    const formatted = (data || []).map((msg) => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      senderId: msg.sender_company_id,
      senderCompanyId: msg.sender_company_id,
      senderName: msg.sender?.name || 'Trading Partner',
      text: msg.text,
      timestamp: msg.created_at,
      createdAt: msg.created_at,
      isMe: msg.sender_company_id === companyId,
    }));

    return res.status(200).json({ messages: formatted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

/**
 * Create or retrieve a company-to-company conversation
 */
export const createConversation = async (req, res) => {
  try {
    const senderCompanyId = req.companyId;
    const { recipientCompanyId, targetCompanyId } = req.body;

    const partnerId = recipientCompanyId || targetCompanyId;
    if (!senderCompanyId || !partnerId) {
      return res.status(400).json({ error: 'Sender and recipient company IDs are required' });
    }

    // Normalize participant ordering (participant_a < participant_b) to prevent duplicates
    const [partA, partB] = senderCompanyId < partnerId ? [senderCompanyId, partnerId] : [partnerId, senderCompanyId];

    // Check existing
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('participant_a_company_id', partA)
      .eq('participant_b_company_id', partB)
      .single();

    if (existing) {
      return res.status(200).json({ conversation: existing });
    }

    // Create new
    const { data: created, error } = await supabase
      .from('conversations')
      .insert([
        {
          participant_a_company_id: partA,
          participant_b_company_id: partB,
          last_message: 'Conversation started',
          last_message_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ conversation: created });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create conversation' });
  }
};

/**
 * Send a chat message in a conversation thread
 */
export const sendMessage = async (req, res) => {
  try {
    const conversationId = req.params.conversationId || req.params.id || req.body.conversationId;
    const { text } = req.body;
    const senderCompanyId = req.companyId;

    if (!conversationId || !text) {
      return res.status(400).json({ error: 'Conversation ID and message text are required' });
    }

    // Verify sender participation in conversation
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conv.participant_a_company_id !== senderCompanyId && conv.participant_b_company_id !== senderCompanyId && !req.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to post messages in this conversation' });
    }

    // Insert message
    const { data: message, error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_company_id: senderCompanyId,
          text,
        },
      ])
      .select('*, sender:sender_company_id(*)')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Update conversation header last_message
    await supabase
      .from('conversations')
      .update({
        last_message: text,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    const formattedMessage = {
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_company_id,
      senderCompanyId: message.sender_company_id,
      senderName: message.sender?.name || 'Sender',
      text: message.text,
      timestamp: message.created_at,
      createdAt: message.created_at,
      isMe: true,
    };

    return res.status(201).json({
      message: 'Message sent successfully',
      messageItem: formattedMessage,
      data: formattedMessage,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
