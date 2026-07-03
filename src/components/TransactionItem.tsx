import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const categoryConfig: Record<string, { icon: string; color: string; bg: string }> = {
  food:          { icon: '🍔', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  transport:     { icon: '🚗', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  shopping:      { icon: '🛍️', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  entertainment: { icon: '🎬', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  health:        { icon: '❤️', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  transfer:      { icon: '↔️', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  salary:        { icon: '💼', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  utilities:     { icon: '⚡', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  travel:        { icon: '✈️', color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: '#10b981', label: 'Completed' },
  pending:   { color: '#f59e0b', label: 'Pending' },
  failed:    { color: '#ef4444', label: 'Failed' },
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const cat = categoryConfig[transaction.category] ?? categoryConfig.transfer;
  const status = statusConfig[transaction.status];

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '16px 20px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.06)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
      }}
    >
      {/* Icon */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
        background: cat.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px',
      }}>
        {cat.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {transaction.title}
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
          {transaction.subtitle}
        </div>
      </div>

      {/* Date */}
      <div style={{ fontSize: '12px', color: '#475569', textAlign: 'right', flexShrink: 0 }}>
        {formatDate(transaction.date)}
      </div>

      {/* Status dot */}
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: status.color, flexShrink: 0,
        boxShadow: `0 0 6px ${status.color}88`,
      }} title={status.label} />

      {/* Amount */}
      <div style={{
        fontSize: '15px', fontWeight: 700, flexShrink: 0,
        color: transaction.type === 'credit' ? '#10b981' : '#f8fafc',
        textAlign: 'right', minWidth: '120px',
      }}>
        {transaction.type === 'credit' ? '+' : '-'}
        Rp {formatAmount(transaction.amount)}
      </div>
    </div>
  );
}
