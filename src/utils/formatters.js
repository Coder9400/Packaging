/**
 * Circular Exchange - Utility Helpers
 */

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: amount < 1 ? 2 : 2,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusBadgeStyle = (status) => {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'active':
    case 'delivered':
    case 'completed':
    case 'settled':
    case 'open':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'in transit':
    case 'processing':
    case 'reviewing offers':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'pending':
    case 'escrow held':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'cancelled':
    case 'expired':
    case 'rejected':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-700/40 text-slate-300 border-slate-600/30';
  }
};
