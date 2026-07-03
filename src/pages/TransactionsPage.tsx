import { useState, useMemo } from 'react';
import TransactionItem from '../components/TransactionItem';
import { mockTransactions } from '../data/mockData';
import type { TransactionCategory, TransactionType } from '../types';

const categories: { value: TransactionCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '🔷' },
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

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TransactionCategory | 'all'>('all');
  const [type, setType] = useState<TransactionType | 'all'>('all');

  const filtered = useMemo(() => {
    return mockTransactions.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.subtitle.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || t.category === category;
      const matchType = type === 'all' || t.type === type;
      return matchSearch && matchCat && matchType;
    });
  }, [search, category, type]);

  const totalDebit = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalCredit = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {[
          { label: 'Total Transactions', value: String(filtered.length), color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
          { label: 'Total Spending', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalDebit)}`, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Total Income', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalCredit)}`, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${color}22`, borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {/* Search + type filter */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="transactions-search"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '11px 16px 11px 36px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'debit', 'credit'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                background: type === t ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: type === t ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: type === t ? '#a5b4fc' : '#64748b',
                cursor: 'pointer', transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                background: category === value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                border: category === value ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                color: category === value ? '#a5b4fc' : '#64748b',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            {filtered.length} transactions
          </h3>
          <button style={{
            padding: '8px 14px', borderRadius: '10px', fontSize: '13px',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            color: '#a5b4fc', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8' }}>No transactions found</div>
            <div style={{ fontSize: '13px', marginTop: '6px' }}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(t => <TransactionItem key={t.id} transaction={t} />)}
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
