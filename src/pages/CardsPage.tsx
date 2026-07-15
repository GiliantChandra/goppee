import { useState, useEffect } from 'react';
import AccountCard from '../components/AccountCard';
import { getAccounts, type Account } from '../services/account.service';

export default function CardsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [frozenCards, setFrozenCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const card = accounts[selectedCard];
  const isFrozen = card ? frozenCards.has(card.id) : false;

  function toggleFreeze() {
    setFrozenCards(prev => {
      const next = new Set(prev);
      if (next.has(card.id)) next.delete(card.id);
      else next.add(card.id);
      return next;
    });
  }

  const cardActions = [
    { icon: '🔒', label: isFrozen ? 'Unfreeze Card' : 'Freeze Card', onClick: toggleFreeze, color: isFrozen ? '#10b981' : '#f59e0b', bg: isFrozen ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' },
    { icon: '🔑', label: showDetails ? 'Hide Details' : 'Show Details', onClick: () => setShowDetails(v => !v), color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { icon: '📋', label: 'Copy Number', onClick: () => navigator.clipboard?.writeText(card.accountNumber), color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
    { icon: '🔄', label: 'Reset PIN', onClick: () => alert('PIN reset flow'), color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    { icon: '📊', label: 'Statements', onClick: () => {}, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { icon: '🚫', label: 'Block Card', onClick: () => alert('Card blocking requested'), color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  const limits = [
    { label: 'Daily Transfer', used: 2_000_000, total: 50_000_000, color: '#6366f1' },
    { label: 'Online Shopping', used: 1_993_000, total: 10_000_000, color: '#14b8a6' },
    { label: 'ATM Withdrawal', used: 500_000, total: 5_000_000, color: '#f59e0b' },
  ];

  if (loading) {
    return <div style={{ padding: '40px', color: '#64748b' }}>Loading...</div>;
  }

  if (accounts.length === 0) {
    return <div style={{ padding: '40px', color: '#64748b' }}>No accounts found.</div>;
  }

  return (
    <div className="page-padding" style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {/* Card tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {accounts.map((acc, i) => (
          <button
            key={acc.id}
            onClick={() => { setSelectedCard(i); setShowDetails(false); }}
            style={{
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
              background: selectedCard === i ? `${acc.gradient?.[0] ?? '#6366f1'}22` : 'rgba(255,255,255,0.03)',
              border: selectedCard === i ? `1px solid ${acc.gradient?.[0] ?? '#6366f1'}66` : '1px solid rgba(255,255,255,0.06)',
              color: selectedCard === i ? '#f8fafc' : '#64748b',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {acc.label}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {/* Card display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <AccountCard account={accounts[selectedCard]} active size="large" />
              {isFrozen && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '24px',
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px',
                }}>
                  <div style={{ fontSize: '36px' }}>🔒</div>
                  <div style={{ color: 'white', fontWeight: 700 }}>Card Frozen</div>
                </div>
              )}
            </div>

            {/* Card details (revealed on demand) */}
            <div style={{
              width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
              opacity: showDetails ? 1 : 0,
              filter: showDetails ? 'none' : 'blur(6px)',
              transition: 'all 0.3s',
              userSelect: showDetails ? 'text' : 'none',
            }}>
              {[
                { label: 'Account No.', value: card.accountNumber },
                { label: 'Expiry', value: card.expiryDate },
                { label: 'CVV', value: '***' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace', letterSpacing: '1px' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card actions */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>Card Controls</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {cardActions.map(({ icon, label, onClick, color, bg }) => (
                <button
                  key={label}
                  onClick={onClick}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px', borderRadius: '12px',
                    background: bg, border: `1px solid ${color}22`,
                    cursor: 'pointer', color, transition: 'all 0.2s', textAlign: 'left',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'none')}
                >
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Balance breakdown */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>Balance Details</h3>
            {[
              { label: 'Available Balance', value: `Rp ${new Intl.NumberFormat('id-ID').format(parseInt(card.balance, 10))}`, color: '#10b981' },
              { label: 'Pending Transactions', value: 'Rp 673.000', color: '#f59e0b' },
              { label: 'Reserved Funds', value: 'Rp 500.000', color: '#64748b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Spending limits */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>Spending Limits</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {limits.map(({ label, used, total, color }) => {
                const pct = (used / total) * 100;
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Rp {new Intl.NumberFormat('id-ID').format(used)} / {new Intl.NumberFormat('id-ID').format(total)}
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{
                        height: '100%', borderRadius: '3px', width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                        boxShadow: `0 0 8px ${color}66`,
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                      {pct.toFixed(1)}% used
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security status */}
          <div style={{
            background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
            borderRadius: '20px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{ fontSize: '32px' }}>🛡️</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>Card Secured</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>3D Secure & EMV chip protection active</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
