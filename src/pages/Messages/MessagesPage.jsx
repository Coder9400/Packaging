import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Search,
  CheckCheck,
  Check,
  ShieldCheck,
  Truck,
  Package,
  FileText,
  Phone,
  MoreVertical,
  ArrowLeft,
  MessageSquarePlus,
  Building2,
  Star,
  Clock,
  Paperclip,
  X,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────── */

const MOCK_THREADS = [
  {
    id: 'th_buyer_1',
    type: 'buyer',
    participantName: 'Rohan Desai',
    company: 'Gujarat Packaging Hub Pvt. Ltd.',
    role: 'Buyer',
    avatarInitials: 'RD',
    avatarColor: 'bg-emerald-600',
    verified: true,
    status: 'online',
    linkedOrder: 'ORD-9482',
    linkedMaterial: 'Double-Wall Corrugated Cartons',
    time: '10:52 AM',
    unread: 2,
    messages: [
      {
        id: 'm1', sender: 'them', type: 'text',
        text: 'Hi! We\'re interested in the 2,500 kg corrugated carton lot listed under SKU CE-COR-2247. Are the bales triple-tied?',
        time: '10:20 AM', delivered: true
      },
      {
        id: 'm2', sender: 'me', type: 'text',
        text: 'Hello Rohan! Yes, all bales are triple-tied and shrink-wrapped. Stored in a climate-controlled indoor dock since April 2026. Moisture content tested at 9.1%.',
        time: '10:28 AM', delivered: true
      },
      {
        id: 'm3', sender: 'them', type: 'text',
        text: 'Excellent. Can you share the grade certificate and a dock photo? Our recycling plant requires Grade #11 OCC for the repulping line.',
        time: '10:34 AM', delivered: true
      },
      {
        id: 'm4', sender: 'me', type: 'system',
        systemType: 'file',
        text: 'Material Certificate · OCC Grade #11',
        subtext: 'GradeCert_OCC_CE2247.pdf · 1.2 MB',
        time: '10:36 AM', delivered: true
      },
      {
        id: 'm5', sender: 'me', type: 'text',
        text: 'Grade certificate attached. Also happy to arrange a sample shipment of 100 kg before you commit to the full lot.',
        time: '10:37 AM', delivered: true
      },
      {
        id: 'm6', sender: 'them', type: 'text',
        text: 'A sample shipment works perfectly. Can you confirm the pickup address and which logistics partner you work with on Circular Exchange?',
        time: '10:45 AM', delivered: true
      },
      {
        id: 'm7', sender: 'me', type: 'text',
        text: 'Pickup from: Plot 14, GIDC Industrial Estate, Vatva, Ahmedabad 382445. We usually coordinate with EcoFreight or Mahindra Logistics through the platform.',
        time: '10:49 AM', delivered: true
      },
      {
        id: 'm8', sender: 'them', type: 'text',
        text: 'Perfect. Placing a sample request now through the platform. Looking forward to the trial batch!',
        time: '10:52 AM', delivered: false
      },
      {
        id: 'm9', sender: 'them', type: 'system',
        systemType: 'order',
        text: 'Material Request Submitted',
        subtext: 'ORD-9482 · 100 kg trial batch · ₹1,500',
        time: '10:52 AM', delivered: false
      },
    ]
  },
  {
    id: 'th_logistics_1',
    type: 'logistics',
    participantName: 'Dispatch Coordinator',
    company: 'EcoFreight Consolidated Lines',
    role: 'Logistics Provider',
    avatarInitials: 'EF',
    avatarColor: 'bg-teal-600',
    verified: true,
    status: 'online',
    linkedOrder: 'ORD-8921',
    linkedMaterial: 'GMA Wooden Pallets',
    time: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 'm1', sender: 'them', type: 'text',
        text: 'Hello! This is EcoFreight Dispatch for Shipment CE-TRK-00142. Our driver, Ravi Patel (GJ-01-AB-2310), is assigned and confirmed for tomorrow\'s pickup.',
        time: 'Yesterday, 4:10 PM', delivered: true
      },
      {
        id: 'm2', sender: 'me', type: 'text',
        text: 'Thanks for confirming! The 450 pallets will be staged at Dock 3 from 8:00 AM. Please ensure the vehicle is a flatbed or curtain-side truck.',
        time: 'Yesterday, 4:17 PM', delivered: true
      },
      {
        id: 'm3', sender: 'them', type: 'text',
        text: 'Confirmed — we\'ve dispatched a 32ft curtainsider. Ravi will carry a chain-of-custody transfer form. Please have your warehouse manager sign on pickup.',
        time: 'Yesterday, 4:22 PM', delivered: true
      },
      {
        id: 'm4', sender: 'them', type: 'system',
        systemType: 'shipment',
        text: 'Shipment CE-TRK-00142 · Status: Pickup Scheduled',
        subtext: 'ETA: Tomorrow 09:00 AM · Driver: Ravi Patel · GJ-01-AB-2310',
        time: 'Yesterday, 4:22 PM', delivered: true
      },
      {
        id: 'm5', sender: 'me', type: 'text',
        text: 'Understood. Our site manager Priya Shah will coordinate. Her number is +91 98765 43210 if needed.',
        time: 'Yesterday, 4:28 PM', delivered: true
      },
      {
        id: 'm6', sender: 'them', type: 'text',
        text: 'Driver is 45 minutes out from the Vatva GIDC dock. The backhaul route has been optimised — we\'ll save approx. 18 km on the return leg.',
        time: 'Yesterday, 8:15 AM', delivered: true
      },
    ]
  },
  {
    id: 'th_seller_1',
    type: 'seller',
    participantName: 'Priya Mehta',
    company: 'Apex Industrial Containers',
    role: 'Seller',
    avatarInitials: 'PM',
    avatarColor: 'bg-indigo-600',
    verified: true,
    status: 'away',
    linkedOrder: 'ORD-7741',
    linkedMaterial: '275-Gallon IBC Totes',
    time: 'Mon',
    unread: 0,
    messages: [
      {
        id: 'm1', sender: 'me', type: 'text',
        text: 'Hi Priya, I saw your listing for 275-gallon IBC totes. Are these UN-rated for food-grade liquids or only industrial use?',
        time: 'Mon, 2:00 PM', delivered: true
      },
      {
        id: 'm2', sender: 'them', type: 'text',
        text: 'Hello! These are reconditioned to UN 31HA1 standard — suitable for non-hazardous industrial liquids. We have a separate food-grade batch available on request.',
        time: 'Mon, 2:11 PM', delivered: true
      },
      {
        id: 'm3', sender: 'me', type: 'text',
        text: 'Industrial use is fine. We need them for glycerine transport. What\'s the minimum order quantity and can you arrange delivery to Surat?',
        time: 'Mon, 2:15 PM', delivered: true
      },
      {
        id: 'm4', sender: 'them', type: 'text',
        text: 'MOQ is 10 totes. Yes, we coordinate with Mahindra Logistics for Surat delivery — typically 2-3 business days after order confirmation.',
        time: 'Mon, 2:19 PM', delivered: true
      },
      {
        id: 'm5', sender: 'me', type: 'text',
        text: 'Sounds good. I\'ll place a request for 25 totes. Please confirm availability.',
        time: 'Mon, 2:25 PM', delivered: true
      },
      {
        id: 'm6', sender: 'them', type: 'text',
        text: 'Confirmed — 25 units available and reserved for you for the next 48 hours. Looking forward to the transaction!',
        time: 'Mon, 2:30 PM', delivered: true
      },
    ]
  },
  {
    id: 'th_buyer_2',
    type: 'buyer',
    participantName: 'Karan Joshi',
    company: 'EcoPolymer Recyclers Pvt. Ltd.',
    role: 'Buyer',
    avatarInitials: 'KJ',
    avatarColor: 'bg-rose-600',
    verified: false,
    status: 'offline',
    linkedOrder: 'ORD-8302',
    linkedMaterial: 'Clean HDPE Flakes',
    time: 'Sun',
    unread: 0,
    messages: [
      {
        id: 'm1', sender: 'them', type: 'text',
        text: 'Hi, we\'re interested in the HDPE regrind flakes. What\'s the MFI and contamination level?',
        time: 'Sun, 11:00 AM', delivered: true
      },
      {
        id: 'm2', sender: 'me', type: 'text',
        text: 'MFI is approx. 4.2 g/10min at 190°C / 2.16 kg. Contamination is below 0.3%. We can share a full QC report.',
        time: 'Sun, 11:14 AM', delivered: true
      },
      {
        id: 'm3', sender: 'them', type: 'text',
        text: 'That meets our spec. Please send the QC report and we\'ll move forward with 3,200 kg.',
        time: 'Sun, 11:20 AM', delivered: true
      },
    ]
  },
];

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */

// Presence dot
const StatusDot = ({ status }) => {
  const colors = { online: 'bg-emerald-400', away: 'bg-amber-400', offline: 'bg-slate-600' };
  return (
    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${colors[status] || colors.offline}`} />
  );
};

// Avatar with initials fallback
const ConvoAvatar = ({ initials, color, status, size = 'md' }) => {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm';
  return (
    <div className={`relative shrink-0 ${sz} rounded-2xl ${color} flex items-center justify-center font-bold text-white`}>
      {initials}
      <StatusDot status={status} />
    </div>
  );
};

// Role badge
const ROLE_BADGE = {
  buyer:     { variant: 'brand',   label: 'Buyer' },
  seller:    { variant: 'teal',    label: 'Seller' },
  logistics: { variant: 'amber',   label: 'Logistics' },
};

// System message card (order, shipment, file)
const SystemMessageCard = ({ msg, isMine }) => {
  const icons = { order: Package, shipment: Truck, file: FileText };
  const Icon = icons[msg.systemType] || FileText;
  const border = isMine ? 'border-brand-500/30 bg-brand-600/15' : 'border-slate-700 bg-slate-800/60';
  const iconColor = isMine ? 'text-brand-400' : 'text-teal-400';

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${border} max-w-xs`}>
      <div className={`shrink-0 mt-0.5 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-semibold text-white">{msg.text}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{msg.subtext}</p>
        <p className="text-[9px] text-slate-500 mt-1">{msg.time}</p>
      </div>
    </div>
  );
};

// Empty state (no conversation selected)
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
      <MessageSquarePlus className="w-8 h-8 text-slate-500" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-slate-300">No conversation selected</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">
        Select a conversation from the list to view messages, or start a new B2B conversation with a buyer, seller, or logistics partner.
      </p>
    </div>
    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition">
      <MessageSquarePlus className="w-4 h-4" />
      New Conversation
    </button>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export const MessagesPage = () => {
  const [threads, setThreads] = useState(MOCK_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Mobile: 'list' | 'chat'
  const [mobileView, setMobileView] = useState('list');

  const messagesEndRef = useRef(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || null;

  // Scroll to bottom when active thread changes or messages added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages?.length, activeThreadId]);

  // Open a conversation
  const openThread = (threadId) => {
    setActiveThreadId(threadId);
    setMobileView('chat');
    // Clear unread
    setThreads(prev => prev.map(t =>
      t.id === threadId ? { ...t, unread: 0 } : t
    ));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'me',
      type: 'text',
      text: inputText.trim(),
      time: 'Just now',
      delivered: true,
    };
    setThreads(prev => prev.map(t =>
      t.id === activeThreadId
        ? { ...t, lastMessage: newMsg.text, time: 'Just now', messages: [...t.messages, newMsg] }
        : t
    ));
    setInputText('');
  };

  const filteredThreads = threads.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.participantName.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  /* ── Conversation List Panel ─────────────────────────────── */
  const ConversationList = () => (
    <div
      className={`
        flex flex-col bg-slate-900 border-r border-slate-800
        w-full md:w-80 lg:w-96 shrink-0
        ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
      `}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">Messages</h2>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white">
                {totalUnread}
              </span>
            )}
          </div>
          <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <MessageSquarePlus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredThreads.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <Search className="w-6 h-6 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500">No conversations match your search.</p>
          </div>
        ) : (
          filteredThreads.map(thread => {
            const isActive = activeThreadId === thread.id;
            const rb = ROLE_BADGE[thread.type] || ROLE_BADGE.buyer;
            const lastMsg = thread.messages[thread.messages.length - 1];
            const preview = lastMsg?.type === 'system'
              ? `📎 ${lastMsg.text}`
              : thread.lastMessage;

            return (
              <button
                key={thread.id}
                onClick={() => openThread(thread.id)}
                className={`
                  w-full p-4 text-left flex items-start gap-3 transition-all duration-150
                  ${isActive
                    ? 'bg-brand-500/10 border-l-2 border-brand-500'
                    : 'hover:bg-slate-800/50 border-l-2 border-transparent'}
                `}
              >
                <ConvoAvatar initials={thread.avatarInitials} color={thread.avatarColor} status={thread.status} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {thread.participantName}
                        </span>
                        {thread.verified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{thread.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[9px] text-slate-500 whitespace-nowrap">{thread.time}</span>
                      {thread.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={rb.variant} size="xs">{rb.label}</Badge>
                    <p className={`text-[11px] truncate flex-1 ${thread.unread > 0 ? 'text-white font-semibold' : 'text-slate-400'}`}>
                      {preview}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  /* ── Chat Panel ──────────────────────────────────────────── */
  const ChatPanel = () => {
    if (!activeThread) {
      return (
        <div className="hidden md:flex flex-1 flex-col bg-slate-950/40">
          <EmptyState />
        </div>
      );
    }

    const rb = ROLE_BADGE[activeThread.type] || ROLE_BADGE.buyer;

    return (
      <div
        className={`
          flex-1 flex flex-col bg-slate-950/30 min-w-0
          ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
        `}
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center gap-3">
          {/* Mobile back button */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            onClick={() => setMobileView('list')}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <ConvoAvatar initials={activeThread.avatarInitials} color={activeThread.avatarColor} status={activeThread.status} size="sm" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-white truncate">{activeThread.participantName}</h3>
              {activeThread.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Verified Business" />
              )}
              <Badge variant={rb.variant} size="xs">{rb.label}</Badge>
            </div>
            <p className="text-[10px] text-slate-400 truncate">{activeThread.company}</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {activeThread.linkedOrder && (
              <span className="text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg">
                {activeThread.linkedOrder}
              </span>
            )}
            <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Context Strip (linked material) */}
        {activeThread.linkedMaterial && (
          <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/40 flex items-center gap-2 text-[11px]">
            <Package className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="text-slate-400">Re:</span>
            <span className="font-semibold text-white truncate">{activeThread.linkedMaterial}</span>
            <ChevronRight className="w-3 h-3 text-slate-600 ml-auto shrink-0" />
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeThread.messages.map((msg, idx) => {
            const isMine = msg.sender === 'me';
            const showAvatar = !isMine && (idx === 0 || activeThread.messages[idx - 1]?.sender !== 'them');

            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                {/* Their avatar — only on first in run */}
                {!isMine && (
                  <div className="shrink-0 mb-0.5">
                    {showAvatar
                      ? <div className={`w-7 h-7 rounded-xl ${activeThread.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                          {activeThread.avatarInitials}
                        </div>
                      : <div className="w-7" />
                    }
                  </div>
                )}

                <div className={`flex flex-col gap-0.5 max-w-[75%] sm:max-w-md ${isMine ? 'items-end' : 'items-start'}`}>
                  {msg.type === 'system' ? (
                    <SystemMessageCard msg={msg} isMine={isMine} />
                  ) : (
                    <div
                      className={`
                        px-4 py-2.5 rounded-2xl text-xs leading-relaxed
                        ${isMine
                          ? 'bg-brand-600 text-white rounded-br-sm'
                          : 'bg-slate-800 text-slate-200 rounded-bl-sm'}
                      `}
                    >
                      {msg.text}
                    </div>
                  )}

                  <div className={`flex items-center gap-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[9px] text-slate-500">{msg.time}</span>
                    {isMine && (
                      msg.delivered
                        ? <CheckCheck className="w-3 h-3 text-brand-400" />
                        : <Check className="w-3 h-3 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing indicator area (static for now) */}
        <div className="px-4 py-1.5 text-[10px] text-slate-500 italic h-6">
          {activeThread.status === 'online' && activeThread.id === 'th_buyer_1' && (
            <span className="animate-pulse">{activeThread.participantName} is typing…</span>
          )}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSend}
          className="px-4 py-3 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center gap-2"
        >
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
            placeholder="Type a message, technical inquiry, or logistics note…"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`
              p-2.5 rounded-xl transition shrink-0 flex items-center justify-center
              ${inputText.trim()
                ? 'bg-brand-600 hover:bg-brand-500 text-white'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  };

  /* ── Page Render ─────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] -m-6 sm:-m-8">
      {/* Page Header (visible above panel) */}
      <div className="px-6 sm:px-8 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">B2B Messaging</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct coordination with buyers, sellers, and logistics partners
          </p>
        </div>
        <div className="flex items-center gap-2">
          {totalUnread > 0 && (
            <span className="text-xs text-slate-400">
              <span className="font-bold text-white">{totalUnread}</span> unread
            </span>
          )}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        <ConversationList />
        <ChatPanel />
      </div>
    </div>
  );
};

export default MessagesPage;
