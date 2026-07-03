import { useState } from 'react';
import AccountCard from '../components/AccountCard';
import { mockAccounts, mockContacts } from '../data/mockData';
import type { Contact } from '../types';

export default function TransferPage() {
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [fromAcc, setFromAcc] = useState(mockAccounts[0].id);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferType, setTransferType] = useState<'contact' | 'account'>('contact');
  const [destAccount, setDestAccount] = useState('');

  const from = mockAccounts.find(a => a.id === fromAcc) ?? mockAccounts[0];

  function formatRp(val: string): string {
    const num = val.replace(/\D/g, '');
    return num ? new Intl.NumberFormat('id-ID').format(Number(num)) : '';
  }

  function handleAmountChange(val: string) {
    const raw = val.replace(/\D/g, '');
    setAmount(raw);
  }

  function canProceed() {
    if (!amount || Number(amount) <= 0) return false;
    if (transferType === 'contact') return selectedContact !== null;
    return destAccount.length > 6;
  }

  if (step === 'success') {
    return (
      <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', animation: 'fadeIn 0.4s ease' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '24px', padding: '52px 48px', maxWidth: '420px', width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px',
            background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}>✓</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>Transfer Successful!</h2>
          <p style={{ color: '#64748b', margin: '0 0 8px', fontSize: '14px' }}>
            You've sent <strong style={{ color: '#10b981' }}>Rp {formatRp(amount)}</strong> to
          </p>
          <p style={{ color: '#94a3b8', margin: '0 0 28px', fontSize: '15px', fontWeight: 600 }}>
            {selectedContact?.name ?? destAccount}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px 18px',
            border: '1px solid rgba(255,255,255,0.06)', marginBottom: '28px',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Transaction ID</span>
            <span style={{ fontSize: '13px', color: '#f8fafc', fontFamily: 'monospace' }}>TXN{Date.now().toString().slice(-8)}</span>
          </div>
          <button
            onClick={() => { setStep('form'); setAmount(''); setSelectedContact(null); setNote(''); }}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: '12px', color: 'white',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Make Another Transfer
          </button>
        </div>
        <style>{`
          @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div style={{ padding: '28px 32px', animation: 'fadeIn 0.3s ease' }}>
        <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '24px' }}>
          ← Back
        </button>
        <div style={{
          maxWidth: '480px', margin: '0 auto',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px', padding: '36px',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', margin: '0 0 24px' }}>Confirm Transfer</h2>
          {[
            { label: 'From', value: `${from.label} (${from.cardNumber})` },
            { label: 'To', value: selectedContact ? `${selectedContact.name} — ${selectedContact.bank}` : destAccount },
            { label: 'Amount', value: `Rp ${formatRp(amount)}`, highlight: true },
            { label: 'Note', value: note || '—' },
          ].map(({ label, value, highlight }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
              <span style={{ fontSize: highlight ? '18px' : '14px', color: highlight ? '#10b981' : '#f8fafc', fontWeight: highlight ? 800 : 500 }}>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button onClick={() => setStep('form')} style={{
              flex: 1, padding: '13px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: '#94a3b8', fontSize: '14px', cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={() => setStep('success')} style={{
              flex: 2, padding: '13px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: '12px', color: 'white',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}>Confirm Transfer</button>
          </div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* From account */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>From Account</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {mockAccounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => setFromAcc(acc.id)}
                  style={{
                    flex: '1 1 140px', padding: '12px 14px', borderRadius: '12px',
                    background: fromAcc === acc.id ? `${acc.gradient[0]}22` : 'rgba(255,255,255,0.03)',
                    border: fromAcc === acc.id ? `1px solid ${acc.gradient[0]}66` : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{acc.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                    Rp {new Intl.NumberFormat('id-ID').format(acc.balance)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transfer type */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['contact', 'account'] as const).map(t => (
                <button key={t} onClick={() => setTransferType(t)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  background: transferType === t ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: transferType === t ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  color: transferType === t ? '#a5b4fc' : '#64748b',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {t === 'contact' ? '👤 Saved Contact' : '🏦 Bank Account'}
                </button>
              ))}
            </div>

            {transferType === 'contact' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Select Contact</label>
                {mockContacts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', borderRadius: '12px',
                      background: selectedContact?.id === c.id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                      border: selectedContact?.id === c.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>{c.avatar}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{c.bank} • {c.accountNumber}</div>
                    </div>
                    {selectedContact?.id === c.id && (
                      <div style={{ marginLeft: 'auto', color: '#6366f1', fontSize: '18px' }}>✓</div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Account Number</label>
                <input
                  value={destAccount}
                  onChange={e => setDestAccount(e.target.value)}
                  placeholder="Enter account number"
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box', letterSpacing: '1px',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
                />
              </div>
            )}
          </div>

          {/* Amount & note */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Amount (IDR)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px' }}>Rp</span>
                <input
                  id="transfer-amount"
                  value={formatRp(amount)}
                  onChange={e => handleAmountChange(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%', padding: '14px 16px 14px 40px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '12px', color: '#f8fafc', fontSize: '20px', fontWeight: 700,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
                />
              </div>
              {/* Quick amounts */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {[50000, 100000, 250000, 500000, 1000000].map(v => (
                  <button key={v} onClick={() => setAmount(String(v))} style={{
                    flex: 1, padding: '6px 4px', borderRadius: '8px', fontSize: '11px',
                    background: amount === String(v) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    border: amount === String(v) ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: amount === String(v) ? '#a5b4fc' : '#64748b', cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Note (optional)</label>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note..."
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
              />
            </div>
            <button
              id="transfer-proceed"
              disabled={!canProceed()}
              onClick={() => setStep('confirm')}
              style={{
                padding: '14px',
                background: canProceed() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.2)',
                border: 'none', borderRadius: '12px', color: canProceed() ? 'white' : '#64748b',
                fontSize: '15px', fontWeight: 700,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              Continue to Confirm →
            </button>
          </div>
        </div>

        {/* Preview card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From Card</h3>
            <AccountCard account={from} size="small" />
          </div>
          <div style={{
            background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '20px', padding: '20px',
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transfer Summary</div>
            {[
              { label: 'Transfer Fee', value: 'Free' },
              { label: 'Processing Time', value: 'Instant' },
              { label: 'Daily Limit', value: 'Rp 50.000.000' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
