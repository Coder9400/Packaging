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
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'in transit':
    case 'processing':
    case 'reviewing offers':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'pending':
    case 'escrow held':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'cancelled':
    case 'expired':
    case 'rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
