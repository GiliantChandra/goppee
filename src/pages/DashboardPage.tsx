import { useState } from 'react';
import AccountCard from '../components/AccountCard';
import TransactionItem from '../components/TransactionItem';
import SpendingChart from '../components/SpendingChart';
import { mockAccounts, mockTransactions, mockSpending } from '../data/mockData';
import type { PageName } from '../types';

interface DashboardPageProps {
  onNavigate: (page: PageName) => void;
}

const quickActions = [
  { label: 'Transfer', icon: '↑', page: 'transfer' as PageName, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { label: 'Pay Bills', icon: '📄', page: 'transfer' as PageName, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
  { label: 'Top Up', icon: '⚡', page: 'transfer' as PageName, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { label: 'History', icon: '🕐', page: 'transactions' as PageName, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
];

function StatCard({ label, value, delta, color }: { label: string; value: string; delta: string; color: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px', padding: '20px 22px',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = `${color}44`)}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)')}
    >
      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: '12px', color, marginTop: '4px' }}>{delta}</div>
    </div>
  );
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeAccount, setActiveAccount] = useState(0);
  const recent = mockTransactions.slice(0, 5);
  const totalBalance = mockAccounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px', animation: 'fadeIn 0.4s ease' }}>
      {/* Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>
            Good afternoon, Arjuna 👋
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
            Here's your financial overview for today.
          </p>
        </div>
        <button
          onClick={() => onNavigate('transfer')}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px',
            color: 'white', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)')}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Transfer
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard label="Total Net Worth" value={`Rp ${new Intl.NumberFormat('id-ID').format(totalBalance)}`} delta="↑ 8.2% this month" color="#10b981" />
        <StatCard label="Monthly Income" value="Rp 12.500.000" delta="↑ Salary received" color="#6366f1" />
        <StatCard label="Monthly Spending" value="Rp 5.829.000" delta="↓ 14.8% vs last month" color="#f59e0b" />
        <StatCard label="Savings Rate" value="53.4%" delta="↑ On track for goal" color="#14b8a6" />
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Cards carousel */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>My Accounts</h3>
            <button onClick={() => onNavigate('cards')} style={{ fontSize: '13px', color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer' }}>
              View all →
            </button>
          </div>
          <AccountCard
            account={mockAccounts[activeAccount]}
            active
            size="large"
          />
          {/* Dots */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {mockAccounts.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveAccount(i)}
                style={{
                  width: i === activeAccount ? '24px' : '8px', height: '8px',
                  borderRadius: '4px',
                  background: i === activeAccount ? '#6366f1' : 'rgba(99,102,241,0.25)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Spending chart */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Spending Overview</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Last 6 months</span>
          </div>
          <div style={{ height: '200px' }}>
            <SpendingChart data={mockSpending} />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', padding: '20px 24px',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {quickActions.map(({ label, icon, page, color, bg }) => (
            <button
              key={label}
              onClick={() => onNavigate(page)}
              style={{
                flex: '1 1 120px',
                padding: '16px', borderRadius: '14px',
                background: bg, border: `1px solid ${color}33`,
                cursor: 'pointer', color,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s', fontSize: '24px',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${color}33`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <span>{icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', padding: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Recent Transactions</h3>
          <button onClick={() => onNavigate('transactions')} style={{ fontSize: '13px', color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer' }}>
            View all →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recent.map(t => <TransactionItem key={t.id} transaction={t} />)}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
