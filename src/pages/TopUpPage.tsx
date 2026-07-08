import { useState, useEffect } from 'react';
import { initiateTopup, verifyTopup } from '../services/topup.service';
import { getAccounts, type Account } from '../services/account.service';
import { getApiError } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const METHODS = [
  { id: 'VIRTUAL_ACCOUNT', label: 'Virtual Account', icon: '🏦', desc: 'Transfer ke nomor VA NovaPay', color: '#6366f1' },
  { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '💸', desc: 'Transfer dari bank lain', color: '#14b8a6' },
  { id: 'CREDIT_CARD', label: 'Credit Card', icon: '💳', desc: 'Bayar dengan kartu kredit', color: '#f59e0b' },
] as const;

type Method = typeof METHODS[number]['id'];
type Step = 'form' | 'otp' | 'success';

export default function TopUpPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [method, setMethod] = useState<Method>('VIRTUAL_ACCOUNT');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [idempotencyKey] = useState(uuidv4());
  const [successTxn, setSuccessTxn] = useState<Record<string, unknown> | null>(null);

  const PRESETS = [50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000];

  useEffect(() => {
    getAccounts().then(a => {
      setAccounts(a);
      if (a.length) setSelectedAccount(a[0].id);
    });
  }, []);

  async function handleInitiate() {
    const numAmount = parseInt(amount.replace(/\D/g, ''), 10);
    if (!numAmount || numAmount < 10_000) { setError('Minimum top-up adalah Rp 10.000'); return; }
    if (numAmount > 50_000_000) { setError('Maximum top-up adalah Rp 50.000.000'); return; }
    if (!selectedAccount) { setError('Pilih rekening tujuan'); return; }

    setLoading(true); setError('');
    try {
      await initiateTopup({ accountId: selectedAccount, amount: numAmount, method });
      setStep('otp');
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (otp.length !== 6) { setError('OTP harus 6 digit'); return; }
    setLoading(true); setError('');
    try {
      const result = await verifyTopup({ accountId: selectedAccount, otp, idempotencyKey });
      setSuccessTxn(result.transaction);
      setStep('success');
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  const numAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const selectedAcc = accounts.find(a => a.id === selectedAccount);

  if (step === 'success') {
    return (
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', animation: 'fadeIn 0.4s ease', paddingTop: '60px' }}>
        <div style={{ fontSize: '72px', animation: 'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>🎉</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>Top-Up Berhasil!</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>
            +Rp {new Intl.NumberFormat('id-ID').format(numAmount)}
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
            Saldo berhasil ditambahkan ke {selectedAcc?.label}
          </div>
        </div>
        {successTxn && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '380px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detail Transaksi</div>
            {[
              ['ID Transaksi', (successTxn.id as string).slice(0, 12) + '...'],
              ['Metode', METHODS.find(m => m.id === method)?.label],
              ['Rekening', selectedAcc?.label],
              ['Waktu', new Date().toLocaleString('id-ID')],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>{v as string}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { setStep('form'); setAmount(''); setOtp(''); setSuccessTxn(null); }} style={{
          padding: '13px 32px', borderRadius: '14px', fontWeight: 700, fontSize: '14px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
        }}>Top-Up Lagi</button>
        <style>{`@keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } } @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', animation: 'fadeIn 0.4s ease', maxWidth: '640px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>Top-Up Saldo</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Isi saldo rekening dengan aman menggunakan OTP</p>
      </div>

      {step === 'form' && (
        <>
          {/* Method selection */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, marginBottom: '10px' }}>PILIH METODE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                  borderRadius: '14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  background: method === m.id ? `${m.color}12` : 'rgba(255,255,255,0.02)',
                  border: method === m.id ? `1.5px solid ${m.color}55` : '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', fontSize: '20px', flexShrink: 0,
                    background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{m.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{m.desc}</div>
                  </div>
                  {method === m.id && <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Target account */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>REKENING TUJUAN</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {accounts.map(a => (
                <button key={a.id} onClick={() => setSelectedAccount(a.id)} style={{
                  padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  background: selectedAccount === a.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: selectedAccount === a.id ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                  color: selectedAccount === a.id ? '#a5b4fc' : '#64748b',
                }}>{a.label}</button>
              ))}
            </div>
          </div>

          {/* Amount presets */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>NOMINAL</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {PRESETS.map(p => (
                <button key={p} onClick={() => setAmount(String(p))} style={{
                  padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  background: numAmount === p ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: numAmount === p ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                  color: numAmount === p ? '#a5b4fc' : '#94a3b8',
                }}>Rp {new Intl.NumberFormat('id-ID').format(p)}</button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Rp</span>
              <input
                type="text"
                value={amount ? new Intl.NumberFormat('id-ID').format(numAmount) : ''}
                onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                style={{
                  width: '100%', padding: '12px 12px 12px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f8fafc', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Security note */}
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px' }}>🛡️</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#a5b4fc', marginBottom: '3px' }}>Proses Aman dengan OTP</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Setelah klik Lanjutkan, kode OTP 6 digit akan dikirimkan. Kode berlaku 5 menit dan hanya bisa digunakan 3 kali.</div>
            </div>
          </div>

          {error && <div style={{ color: '#fca5a5', fontSize: '13px', marginBottom: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

          <button onClick={handleInitiate} disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}>{loading ? 'Memproses...' : `Lanjutkan — Rp ${new Intl.NumberFormat('id-ID').format(numAmount)}`}</button>
        </>
      )}

      {step === 'otp' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>Masukkan Kode OTP</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Kode OTP dikirim ke nomor terdaftar. Berlaku 5 menit.</div>
            {import.meta.env.DEV && <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '8px', padding: '6px 12px', background: 'rgba(245,158,11,0.1)', borderRadius: '8px' }}>⚠️ DEMO MODE: Lihat OTP di terminal server</div>}
          </div>

          {/* 6 OTP digit boxes */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                width: '52px', height: '64px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: `2px solid ${otp.length > i ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', fontWeight: 800, color: '#f8fafc', letterSpacing: '2px',
              }}>{otp[i] || ''}</div>
            ))}
          </div>

          {/* Hidden input for typing */}
          <input
            type="number"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            autoFocus
            style={{
              position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none',
            }}
          />

          {/* Keypad for tapping */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {[1,2,3,4,5,6,7,8,9,'⌫',0,'✓'].map((k) => (
              <button key={String(k)} onClick={() => {
                if (k === '⌫') setOtp(p => p.slice(0, -1));
                else if (k === '✓') handleVerify();
                else if (otp.length < 6) setOtp(p => p + String(k));
              }} style={{
                padding: '18px', borderRadius: '14px', fontSize: '20px', fontWeight: 700, cursor: 'pointer',
                background: k === '✓' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)',
                border: k === '✓' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                color: k === '✓' ? 'white' : '#f8fafc',
              }}>{k}</button>
            ))}
          </div>

          {error && <div style={{ color: '#fca5a5', fontSize: '13px', marginBottom: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', textAlign: 'center' }}>{error}</div>}

          <button onClick={handleVerify} disabled={loading || otp.length !== 6} style={{
            width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
            background: otp.length === 6 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
            border: 'none', color: 'white', cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
          }}>{loading ? 'Memverifikasi...' : 'Verifikasi OTP'}</button>

          <button onClick={() => { setStep('form'); setOtp(''); setError(''); }} style={{
            width: '100%', marginTop: '10px', padding: '12px', borderRadius: '14px', fontSize: '14px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b', cursor: 'pointer',
          }}>← Kembali</button>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
