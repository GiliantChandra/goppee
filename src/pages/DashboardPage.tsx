import { useState, useEffect, useRef } from 'react';
import AccountCard from '../components/AccountCard';
import TransactionItem from '../components/TransactionItem';
import SpendingChart from '../components/SpendingChart';
import { mockAccounts, mockTransactions, mockSpending, mockGoals, categorySpending } from '../data/mockData';
import type { PageName } from '../types';

interface DashboardPageProps {
  onNavigate: (page: PageName) => void;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function StatCard({ label, value, rawValue, delta, color, icon }: { label: string; value: string; rawValue: number; delta: string; color: string; icon: string }) {
  const animated = useCountUp(rawValue, 1000);
  const display = rawValue > 0 ? value.replace(new Intl.NumberFormat('id-ID').format(rawValue), new Intl.NumberFormat('id-ID').format(animated)) : value;
  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(${color},0.06) 0%, rgba(0,0,0,0) 100%)`,
      border: `1px solid rgba(${color},0.15)`,
      borderRadius: '18px', padding: '20px 22px',
      transition: 'all 0.3s', cursor: 'default',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px rgba(${color},0.15)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '60px', opacity: 0.07, pointerEvents: 'none' }}>{icon}</div>
      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>{display}</div>
      <div style={{ fontSize: '12px', color: `rgb(${color})`, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {delta}
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: typeof categorySpending }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  const size = 160;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="22" />
          {data.map((item, i) => {
            const pct = item.amount / total;
            const dash = pct * circumference;
            const currentOffset = offset;
            offset += dash;
            return (
              <circle
                key={i}
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={hovered === item.label ? 26 : 22}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
                style={{ transition: 'stroke-width 0.2s', cursor: 'pointer', opacity: hovered && hovered !== item.label ? 0.5 : 1 }}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {hovered ? (
            <>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{hovered}</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                {((data.find(d => d.label === hovered)?.amount ?? 0) / total * 100).toFixed(0)}%
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Total</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>Rp {new Intl.NumberFormat('id-ID').format(total)}</div>
            </>
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '120px' }}>
        {data.map(item => (
          <div key={item.label}
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default',
              opacity: hovered && hovered !== item.label ? 0.4 : 1, transition: 'opacity 0.2s',
            }}
          >
            <span style={{ fontSize: '13px' }}>{item.icon}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8', flex: 1 }}>{item.label}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: item.color }}>
              {(item.amount / total * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: typeof mockGoals[0] }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100);
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }, 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px', padding: '16px', transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${goal.color}33`;
        (e.currentTarget as HTMLDivElement).style.background = `rgba(${goal.color.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(',')},0.05)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '22px' }}>{goal.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{goal.name}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Target: {goal.deadline}</div>
        </div>
        <div style={{
          fontSize: '12px', fontWeight: 700, color: goal.color,
          background: `${goal.color}18`, padding: '3px 8px', borderRadius: '6px',
        }}>{pct.toFixed(0)}%</div>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div ref={barRef} style={{
          height: '100%', borderRadius: '3px', width: '0%',
          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)`,
          boxShadow: `0 0 8px ${goal.color}66`,
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Rp {new Intl.NumberFormat('id-ID').format(goal.current)}</span>
        <span style={{ fontSize: '11px', color: '#475569' }}>of Rp {new Intl.NumberFormat('id-ID').format(goal.target)}</span>
      </div>
    </div>
  );
}

const quickActions = [
  { label: 'Transfer', icon: '↗', page: 'transfer' as PageName, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', desc: 'Send money' },
  { label: 'Pay Bills', icon: '📄', page: 'transfer' as PageName, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', desc: 'Utilities' },
  { label: 'Loans', icon: '🏦', page: 'loans' as PageName, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', desc: 'My loans' },
  { label: 'Invest', icon: '📈', page: 'investments' as PageName, color: '#ec4899', bg: 'rgba(236,72,153,0.1)', desc: 'Portfolio' },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeAccount, setActiveAccount] = useState(0);
  const recent = mockTransactions.slice(0, 5);
  const totalBalance = mockAccounts.reduce((s, a) => s + a.balance, 0);

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px', animation: 'fadeIn 0.4s ease' }}>
      {/* Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>
            {getGreeting()}, Arjuna 👋
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0' }}>
            Here's your financial overview for today.
          </p>
        </div>
        <button
          onClick={() => onNavigate('transfer')}
          style={{
            padding: '11px 22px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px',
            color: 'white', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(99,102,241,0.55)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)')}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Transfer
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <StatCard label="Total Net Worth" value={`Rp ${new Intl.NumberFormat('id-ID').format(totalBalance)}`} rawValue={totalBalance} delta="↑ 8.2% this month" color="16,185,129" icon="💎" />
        <StatCard label="Monthly Income" value="Rp 12.500.000" rawValue={12_500_000} delta="↑ Salary received Jul 1" color="99,102,241" icon="💼" />
        <StatCard label="Monthly Spending" value="Rp 5.829.000" rawValue={5_829_000} delta="↓ 14.8% vs June" color="245,158,11" icon="🛒" />
        <StatCard label="Savings Rate" value="53.4%" rawValue={0} delta="↑ On track for goals" color="20,184,166" icon="🎯" />
      </div>

      {/* Row 2: Cards + Spending bar chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px' }}>
        {/* Account carousel */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>My Accounts</h3>
            <button onClick={() => onNavigate('cards')} style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View all →
            </button>
          </div>
          <AccountCard account={mockAccounts[activeAccount]} active size="large" />
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {mockAccounts.map((_, i) => (
              <button key={i} onClick={() => setActiveAccount(i)} style={{
                width: i === activeAccount ? '22px' : '7px', height: '7px',
                borderRadius: '4px',
                background: i === activeAccount ? mockAccounts[i].gradient[0] : 'rgba(255,255,255,0.15)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0,
              }} />
            ))}
          </div>
        </div>

        {/* Spending bar chart */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '20px', padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Monthly Spending</h3>
            <span style={{ fontSize: '11px', color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '8px' }}>Last 6 months</span>
          </div>
          <div style={{ height: '190px' }}>
            <SpendingChart data={mockSpending} />
          </div>
        </div>
      </div>

      {/* Row 3: Quick actions + Donut chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        {/* Quick actions */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '20px', padding: '22px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {quickActions.map(({ label, icon, page, color, bg, desc }) => (
              <button key={label} onClick={() => onNavigate(page)} style={{
                padding: '16px', borderRadius: '14px',
                background: bg, border: `1px solid ${color}22`,
                cursor: 'pointer', transition: 'all 0.25s',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', textAlign: 'left',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${color}33`;
                  (e.currentTarget as HTMLButtonElement).style.background = `${bg.replace('0.1)', '0.18)')}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLButtonElement).style.background = bg;
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${color}18`, border: `1px solid ${color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spending by category donut */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '20px', padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Spending by Category</h3>
            <span style={{ fontSize: '11px', color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '8px' }}>July 2026</span>
          </div>
          <DonutChart data={categorySpending} />
        </div>
      </div>

      {/* Row 4: Goals + Recent transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '18px' }}>
        {/* Goals */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '20px', padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Financial Goals</h3>
            <span style={{
              fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)', padding: '3px 10px', borderRadius: '8px', fontWeight: 600,
            }}>4 active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          </div>
        </div>

        {/* Recent transactions */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '20px', padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Recent Transactions</h3>
            <button onClick={() => onNavigate('transactions')} style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {recent.map(t => <TransactionItem key={t.id} transaction={t} />)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
