import { STATUS_OPTIONS, MOTIVASI_QUOTES } from './constants';

export function getStatusConfig(status) {
  return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

export function formatDateTime(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  } catch { return isoStr; }
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function getRandomQuote() {
  return MOTIVASI_QUOTES[Math.floor(Math.random() * MOTIVASI_QUOTES.length)];
}

export function groupByStatus(applications) {
  return STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = applications.filter(a => a.status === s.value).length;
    return acc;
  }, {});
}

export function getThisMonthApplications(applications) {
  const now = new Date();
  return applications.filter(app => {
    if (!app.tanggal_lamar) return false;
    const d = new Date(app.tanggal_lamar);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}

export function formatCurrency(value) {
  if (!value) return '';
  const num = parseInt(String(value).replace(/\D/g, ''));
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

export function truncate(str, n = 50) {
  if (!str) return '';
  return str.length > n ? str.substring(0, n) + '…' : str;
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
