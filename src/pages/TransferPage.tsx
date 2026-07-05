import { useState } from 'react';
import AccountCard from '../components/AccountCard';
import { mockAccounts, mockContacts } from '../data/mockData';
import type { Contact } from '../types';

// PIN Modal
function PinModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const correctPin = '1234';

  function handleKey(k: string) {
    if (pin.length >= 6) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      if (next === correctPin) {
        setTimeout(onConfirm, 300);
      } else {
        setShake(true);
        setTimeout(() => { setPin(''); setShake(false); }, 600);
      }
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeInBg 0.2s ease',
    }}>
      <div style={{
        background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: '24px', padding: '40px 36px', width: '320px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'scaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
          }}>🔐</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Enter PIN</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Enter your 4-digit PIN to authorize</div>
        </div>

        {/* PIN dots */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '28px',
          animation: shake ? 'shake 0.5s ease' : 'none',
        }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: '16px', height: '16px', borderRadius: '50%',
              background: pin.length > i ? '#6366f1' : 'rgba(255,255,255,0.1)',
              border: pin.length > i ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
              transition: 'all 0.15s',
              boxShadow: pin.length > i ? '0 0 8px #6366f166' : 'none',
            }} />
          ))}
        </div>

        {/* PIN pad */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
            k === '' ? <div key={i} /> :
            <button key={i} onClick={() => k === '⌫' ? setPin(p => p.slice(0, -1)) : handleKey(k)} style={{
              padding: '16px', borderRadius: '12px', fontSize: k === '⌫' ? '18px' : '18px', fontWeight: 700,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#f8fafc', cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >{k}</button>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: '#334155', textAlign: 'center', marginTop: '16px' }}>Demo PIN: <strong style={{ color: '#6366f1' }}>1234</strong></div>

        <button onClick={onCancel} style={{
          width: '100%', marginTop: '14px', padding: '11px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '12px', color: '#f87171', fontSize: '13px', cursor: 'pointer',
        }}>Cancel</button>
      </div>
      <style>{`
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}

export default function TransferPage() {
  const [step, setStep] = useState<'form' | 'confirm' | 'pin' | 'success'>('form');
  const [fromAcc, setFromAcc] = useState(mockAccounts[0].id);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferType, setTransferType] = useState<'contact' | 'account'>('contact');
  const [destAccount, setDestAccount] = useState('');
  const [destBank, setDestBank] = useState('BCA');

  const from = mockAccounts.find(a => a.id === fromAcc) ?? mockAccounts[0];
  const banks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB', 'BSI', 'Permata', 'Danamon'];

  function formatRp(val: string): string {
    const num = val.replace(/\D/g, '');
    return num ? new Intl.NumberFormat('id-ID').format(Number(num)) : '';
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
          background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '28px', padding: '52px 48px', maxWidth: '420px', width: '100%', textAlign: 'center',
        }}>
          <div style={{
            width: '84px', height: '84px', borderRadius: '50%', margin: '0 auto 24px',
            background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}>✓</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>Transfer Successful!</h2>
          <p style={{ color: '#64748b', margin: '0 0 4px', fontSize: '14px' }}>
            You've sent <strong style={{ color: '#10b981' }}>Rp {formatRp(amount)}</strong> to
          </p>
          <p style={{ color: '#94a3b8', margin: '0 0 28px', fontSize: '16px', fontWeight: 700 }}>
            {selectedContact?.name ?? destAccount}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px 20px',
            border: '1px solid rgba(255,255,255,0.06)', marginBottom: '10px',
          }}>
            {[
              { label: 'Transaction ID', value: `TXN${Date.now().toString().slice(-9)}` },
              { label: 'Date & Time', value: new Date().toLocaleString('id-ID') },
              { label: 'Status', value: '✅ Completed' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: '12px', color: '#f8fafc', fontFamily: 'monospace' }}>{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setStep('form'); setAmount(''); setSelectedContact(null); setNote(''); }}
            style={{
              width: '100%', padding: '14px', marginTop: '18px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            }}
          >Make Another Transfer</button>
        </div>
        <style>{`
          @keyframes bounceIn { from { transform: scale(0); } to { transform: scale(1); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <>
        {step === 'confirm' && (
          <div style={{ padding: '24px 28px', animation: 'fadeIn 0.3s ease' }}>
            <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '24px' }}>
              ← Back to Transfer
            </button>
            <div style={{ maxWidth: '480px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '36px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Transfer Amount</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#10b981', letterSpacing: '-1px' }}>Rp {formatRp(amount)}</div>
              </div>
              {[
                { label: 'From', value: `${from.label}` },
                { label: 'To', value: selectedContact ? `${selectedContact.name} — ${selectedContact.bank}` : `${destBank} • ${destAccount}` },
                { label: 'Transfer Fee', value: 'Free' },
                { label: 'Note', value: note || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <button onClick={() => setStep('pin')} style={{
                width: '100%', marginTop: '28px', padding: '14px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none',
                borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                🔐 Confirm with PIN
              </button>
            </div>
          </div>
        )}
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </>
    );
  }

  return (
    <>
      {step === 'pin' && (
        <PinModal onConfirm={() => setStep('success')} onCancel={() => setStep('confirm')} />
      )}

      <div style={{ padding: '24px 28px', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* From account */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '22px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px' }}>From Account</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {mockAccounts.map(acc => (
                  <button key={acc.id} onClick={() => setFromAcc(acc.id)} style={{
                    flex: '1 1 140px', padding: '12px 14px', borderRadius: '12px',
                    background: fromAcc === acc.id ? `${acc.gradient[0]}22` : 'rgba(255,255,255,0.03)',
                    border: fromAcc === acc.id ? `1px solid ${acc.gradient[0]}66` : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{acc.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                      Rp {new Intl.NumberFormat('id-ID').format(acc.balance)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* To */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '22px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                {(['contact', 'account'] as const).map(t => (
                  <button key={t} onClick={() => setTransferType(t)} style={{
                    flex: 1, padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                    background: transferType === t ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: transferType === t ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: transferType === t ? '#a5b4fc' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {t === 'contact' ? '👤 Saved Contact' : '🏦 Bank Account'}
                  </button>
                ))}
              </div>

              {transferType === 'contact' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {mockContacts.map(c => (
                    <button key={c.id} onClick={() => setSelectedContact(c)} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '11px 14px', borderRadius: '12px',
                      background: selectedContact?.id === c.id ? `${c.color}14` : 'rgba(255,255,255,0.02)',
                      border: selectedContact?.id === c.id ? `1px solid ${c.color}44` : '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                    }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: `${c.color}22`, border: `1px solid ${c.color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 800, color: c.color, flexShrink: 0,
                      }}>{c.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.bank} • {c.accountNumber}</div>
                      </div>
                      {selectedContact?.id === c.id && (
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', color: 'white', fontWeight: 700,
                        }}>✓</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '7px' }}>Select Bank</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {banks.map(b => (
                        <button key={b} onClick={() => setDestBank(b)} style={{
                          padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                          background: destBank === b ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                          border: destBank === b ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                          color: destBank === b ? '#a5b4fc' : '#64748b', cursor: 'pointer',
                        }}>{b}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '7px' }}>Account Number</label>
                    <input value={destAccount} onChange={e => setDestAccount(e.target.value)} placeholder="Enter account number"
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '11px', color: '#f8fafc', fontSize: '15px', outline: 'none',
                        boxSizing: 'border-box', letterSpacing: '2px', fontFamily: 'monospace',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#6366f1')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Amount + note */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Amount (IDR)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '16px', fontWeight: 700 }}>Rp</span>
                  <input
                    id="transfer-amount"
                    value={formatRp(amount)}
                    onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="0"
                    style={{
                      width: '100%', padding: '14px 16px 14px 48px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '12px', color: '#f8fafc', fontSize: '22px', fontWeight: 800,
                      outline: 'none', boxSizing: 'border-box', letterSpacing: '-0.5px',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#6366f1')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
                  />
                </div>
                <div style={{ display: 'flex', gap: '7px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {[50000, 100000, 250000, 500000, 1000000, 2000000].map(v => (
                    <button key={v} onClick={() => setAmount(String(v))} style={{
                      flex: '1 1 80px', padding: '6px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                      background: amount === String(v) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      border: amount === String(v) ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      color: amount === String(v) ? '#a5b4fc' : '#64748b', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      {v >= 1000000 ? `${v / 1000000}JT` : `${v / 1000}RB`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '7px' }}>Note (optional)</label>
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..."
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '11px', color: '#f8fafc', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
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
                  background: canProceed() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.15)',
                  border: 'none', borderRadius: '13px',
                  color: canProceed() ? 'white' : '#475569',
                  fontSize: '14px', fontWeight: 700, cursor: canProceed() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: canProceed() ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                Continue →
              </button>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '22px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Sending From</h3>
              <AccountCard account={from} size="small" />
            </div>

            {/* Transfer info */}
            <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '18px', padding: '18px 20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transfer Info</div>
              {[
                { label: 'Fee', value: 'Free', icon: '🎁' },
                { label: 'Processing', value: 'Instant', icon: '⚡' },
                { label: 'Daily Limit', value: 'Rp 50.000.000', icon: '📊' },
                { label: 'Security', value: 'PIN Protected', icon: '🔐' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span>{icon}</span> {label}
                  </span>
                  <span style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Exchange rates */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px', padding: '18px 20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exchange Rates</div>
              {[
                { currency: 'USD', flag: '🇺🇸', rate: '16,245' },
                { currency: 'SGD', flag: '🇸🇬', rate: '12,180' },
                { currency: 'EUR', flag: '🇪🇺', rate: '17,890' },
              ].map(({ currency, flag, rate }) => (
                <div key={currency} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>{flag} {currency}</span>
                  <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 600, fontFamily: 'monospace' }}>Rp {rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
