import { useRef, useEffect } from 'react';
import { mockLoans } from '../data/mockData';
import type { Loan } from '../types';

function LoanCard({ loan }: { loan: Loan }) {
  const paid = loan.totalAmount - loan.remaining;
  const pct = (paid / loan.totalAmount) * 100;
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }, 400);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '20px', padding: '24px', transition: 'all 0.25s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${loan.color}22`;
        (e.currentTarget as HTMLDivElement).style.borderColor = `${loan.color}44`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: `${loan.color}18`, border: `1px solid ${loan.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
          }}>{loan.icon}</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{loan.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{loan.interestRate}% per annum</div>
          </div>
        </div>
        <div style={{
          padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
          background: `${loan.color}18`, color: loan.color, border: `1px solid ${loan.color}33`,
        }}>
          {pct.toFixed(0)}% paid
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '16px' }}>
        <div ref={barRef} style={{
          height: '100%', borderRadius: '4px', width: '0%',
          background: `linear-gradient(90deg, ${loan.color}, ${loan.color}cc)`,
          boxShadow: `0 0 10px ${loan.color}66`,
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        {[
          { label: 'Remaining', value: `Rp ${new Intl.NumberFormat('id-ID').format(loan.remaining)}`, color: '#ef4444' },
          { label: 'Monthly', value: `Rp ${new Intl.NumberFormat('id-ID').format(loan.monthlyPayment)}`, color: '#f59e0b' },
          { label: 'Paid Off', value: `Rp ${new Intl.NumberFormat('id-ID').format(paid)}`, color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          Next due: <span style={{ color: '#f59e0b', fontWeight: 600 }}>
            {new Date(loan.nextDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <button style={{
          padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
          background: `${loan.color}18`, border: `1px solid ${loan.color}33`,
          color: loan.color, cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = `${loan.color}30`)}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = `${loan.color}18`)}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default function LoansPage() {
  const totalRemaining = mockLoans.reduce((s, l) => s + l.remaining, 0);
  const totalMonthly = mockLoans.reduce((s, l) => s + l.monthlyPayment, 0);
  const totalPaid = mockLoans.reduce((s, l) => s + (l.totalAmount - l.remaining), 0);
  const totalPrincipal = mockLoans.reduce((s, l) => s + l.totalAmount, 0);

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {[
          { label: 'Active Loans', value: String(mockLoans.length), color: '#6366f1', bg: 'rgba(99,102,241,0.08)', icon: '📋' },
          { label: 'Total Remaining', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalRemaining)}`, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: '💰' },
          { label: 'Monthly Payment', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalMonthly)}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '📅' },
          { label: 'Total Paid', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalPaid)}`, color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: '✅' },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${color}22`, borderRadius: '18px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Overall Repayment Progress</h3>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>
            {(totalPaid / totalPrincipal * 100).toFixed(1)}% complete
          </span>
        </div>
        <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${totalPaid / totalPrincipal * 100}%`, borderRadius: '5px',
            background: 'linear-gradient(90deg, #6366f1, #10b981)',
            boxShadow: '0 0 12px rgba(99,102,241,0.5)',
            transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Rp {new Intl.NumberFormat('id-ID').format(totalPaid)} paid</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Rp {new Intl.NumberFormat('id-ID').format(totalPrincipal)} total</span>
        </div>
      </div>

      {/* Loan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {mockLoans.map(loan => <LoanCard key={loan.id} loan={loan} />)}
      </div>

      {/* Loan application CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '20px', padding: '28px',
        display: 'flex', alignItems: 'center', gap: '24px',
      }}>
        <div style={{ fontSize: '48px' }}>🏛️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>Need a New Loan?</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>Apply for personal, home, or business loans with competitive rates starting from 6.5%</div>
        </div>
        <button style={{
          padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', color: 'white', cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
        }}>Apply Now →</button>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
