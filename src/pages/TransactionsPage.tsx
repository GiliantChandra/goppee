import { useState, useMemo, useEffect } from 'react';
import TransactionItem from '../components/TransactionItem';
import { categorySpending } from '../data/mockData';
import { getTransactions, type Transaction } from '../services/transaction.service';
import type { TransactionCategory, TransactionType } from '../types';

const categories: { value: TransactionCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '✦' },
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'health', label: 'Health', icon: '❤️' },
  { value: 'transfer', label: 'Transfer', icon: '↔️' },
  { value: 'salary', label: 'Salary', icon: '💼' },
  { value: 'utilities', label: 'Utilities', icon: '⚡' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
];

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function groupByDate(txns: Transaction[]) {
  const groups: { label: string; items: Transaction[] }[] = [];
  txns.forEach(t => {
    const label = formatDateLabel(t.createdAt);
    const g = groups.find(g => g.label === label);
    if (g) g.items.push(t);
    else groups.push({ label, items: [t] });
  });
  return groups;
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TransactionCategory | 'all'>('all');
  const [type, setType] = useState<TransactionType | 'all'>('all');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions().then(res => {
      setTransactions(res.transactions);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.subtitle?.toLowerCase() || '').includes(search.toLowerCase());
      const matchCat = category === 'all' || t.category === category;
      const tType = (t.type === 'CREDIT' || t.type === 'TOPUP') ? 'credit' : 'debit';
      const matchType = type === 'all' || tType === type;
      return matchSearch && matchCat && matchType;
    }).sort((a, b) => sortDir === 'desc'
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [search, category, type, sortDir, transactions]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const totalDebit = filtered.filter(t => t.type !== 'CREDIT' && t.type !== 'TOPUP').reduce((s, t) => s + parseInt(t.amount, 10), 0);
  const totalCredit = filtered.filter(t => t.type === 'CREDIT' || t.type === 'TOPUP').reduce((s, t) => s + parseInt(t.amount, 10), 0);

  function exportCSV() {
    const rows = ['Date,Title,Category,Type,Amount,Status', ...filtered.map(t =>
      `${new Date(t.createdAt).toLocaleDateString()},${t.title},${t.category},${t.type},${t.amount},${t.status}`
    )];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transactions.csv'; a.click();
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px', animation: 'fadeIn 0.4s ease' }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {[
          { label: 'Transactions', value: String(filtered.length), sub: 'in selected period', color: '#6366f1', bg: 'rgba(99,102,241,0.07)', icon: '📋' },
          { label: 'Total Spending', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalDebit)}`, sub: 'outgoing', color: '#ef4444', bg: 'rgba(239,68,68,0.07)', icon: '↑' },
          { label: 'Total Income', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalCredit)}`, sub: 'incoming', color: '#10b981', bg: 'rgba(16,185,129,0.07)', icon: '↓' },
        ].map(({ label, value, sub, color, bg, icon }) => (
          <div key={label} style={{
            background: bg, border: `1px solid ${color}20`, borderRadius: '18px', padding: '18px 22px',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
              background: `${color}18`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color,
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini category bar */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '18px', padding: '18px 22px',
      }}>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: 600 }}>Spending breakdown</div>
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
          {categorySpending.map(cat => {
            const total = categorySpending.reduce((s, c) => s + c.amount, 0);
            return (
              <div key={cat.label} title={`${cat.label}: ${(cat.amount / total * 100).toFixed(1)}%`}
                style={{ flex: cat.amount, background: cat.color, cursor: 'default', transition: 'flex 0.5s' }} />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
          {categorySpending.map(cat => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, flexShrink: 0, display: 'inline-block' }} />
              <span style={{ fontSize: '11px', color: '#64748b' }}>{cat.icon} {cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '18px', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '14px',
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg width="15" height="15" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="transactions-search"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 36px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.18)',
                borderRadius: '11px', color: '#f8fafc', fontSize: '13px', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.18)')}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'debit', 'credit'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '9px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                background: type === t ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                border: type === t ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: type === t ? '#a5b4fc' : '#64748b',
                cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
              }}>{t}</button>
            ))}
          </div>
          <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')} style={{
            padding: '9px 12px', borderRadius: '10px', fontSize: '12px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
            transition: 'all 0.2s',
          }}
            title={`Sort ${sortDir === 'desc' ? 'oldest first' : 'newest first'}`}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={sortDir === 'desc' ? 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12' : 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'} />
            </svg>
            {sortDir === 'desc' ? 'Newest' : 'Oldest'}
          </button>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {categories.map(({ value, label, icon }) => (
            <button key={value} onClick={() => setCategory(value)} style={{
              padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
              background: category === value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
              border: category === value ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
              color: category === value ? '#a5b4fc' : '#64748b',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list grouped by date */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '18px', padding: '18px 22px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            {filtered.length} transactions
          </h3>
          <button onClick={exportCSV} style={{
            padding: '7px 14px', borderRadius: '10px', fontSize: '12px',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            color: '#a5b4fc', cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.15)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)')}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '56px', color: '#64748b' }}>
            Loading transactions...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px', color: '#64748b' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8' }}>No transactions found</div>
            <div style={{ fontSize: '13px', marginTop: '6px' }}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {grouped.map(group => (
              <div key={group.label}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>{group.label}</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                  <span style={{ fontSize: '11px', color: '#334155', whiteSpace: 'nowrap' }}>
                    {group.items.length} txn{group.items.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {group.items.map(t => <TransactionItem key={t.id} transaction={t} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
