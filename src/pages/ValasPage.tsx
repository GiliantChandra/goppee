import { useState, useEffect } from 'react';
import { getValas, convertCurrency, type ValasData } from '../services/topup.service';
import { getAccounts, type Account } from '../services/account.service';
import { getApiError } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const CURRENCY_INFO: Record<string, { flag: string; name: string; symbol: string; color: string }> = {
  USD: { flag: '🇺🇸', name: 'US Dollar', symbol: '$', color: '#10b981' },
  SGD: { flag: '🇸🇬', name: 'Singapore Dollar', symbol: 'S$', color: '#6366f1' },
  EUR: { flag: '🇪🇺', name: 'Euro', symbol: '€', color: '#3b82f6' },
  JPY: { flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥', color: '#ef4444' },
  GBP: { flag: '🇬🇧', name: 'British Pound', symbol: '£', color: '#8b5cf6' },
  SAR: { flag: '🇸🇦', name: 'Saudi Riyal', symbol: '﷼', color: '#f59e0b' },
};

export default function ValasPage() {
  const [data, setData] = useState<ValasData | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Conversion form
  const [fromCurrency, setFromCurrency] = useState('IDR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [pin, setPin] = useState('');
  const [converting, setConverting] = useState(false);
  const [convertResult, setConvertResult] = useState<string | null>(null);

  async function loadAll() {
    try {
      const [v, a] = await Promise.all([getValas(), getAccounts()]);
      setData(v); setAccounts(a);
      if (!accountId && a.length) setAccountId(a[0].id);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  function getPreview(): string {
    if (!data || !amount) return '';
    const num = parseFloat(amount);
    if (!num) return '';
    if (fromCurrency === 'IDR') {
      const rate = parseFloat(data.rates[toCurrency] ?? '0');
      if (!rate) return '';
      return `≈ ${CURRENCY_INFO[toCurrency]?.symbol}${(num / rate).toFixed(4)}`;
    } else {
      const rate = parseFloat(data.rates[fromCurrency] ?? '0');
      return `≈ Rp ${new Intl.NumberFormat('id-ID').format(Math.round(num * rate))}`;
    }
  }

  async function handleConvert() {
    const numAmount = parseFloat(amount);
    if (!numAmount) { setError('Enter a valid amount'); return; }
    if (!pin.match(/^\d{4,6}$/)) { setError('Enter your 4-6 digit PIN'); return; }
    if (fromCurrency === toCurrency) { setError('Select different currencies'); return; }

    setConverting(true); setError(''); setConvertResult(null);
    try {
      const result = await convertCurrency({
        fromCurrency,
        toCurrency,
        amount: numAmount,
        accountId: fromCurrency === 'IDR' || toCurrency === 'IDR' ? accountId : undefined,
        idempotencyKey: uuidv4(),
        pin,
      });
      setConvertResult(`✅ Converted: ${result.foreignAmount} ${result.currency} — ${fromCurrency === 'IDR' ? '+' : '-'}Rp ${new Intl.NumberFormat('id-ID').format(result.idrAmount)}`);
      setAmount(''); setPin('');
      await loadAll();
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setConverting(false);
    }
  }

  const preview = getPreview();

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.06))',
        border: '1px solid rgba(99,102,241,0.15)', borderRadius: '20px', padding: '22px 26px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{ fontSize: '36px' }}>🌍</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>Foreign Currency Accounts</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>Hold & convert currencies with live exchange rates</div>
        </div>
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '14px' }}>{error}</div>}
      {convertResult && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7', fontSize: '14px' }}>{convertResult}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '18px', alignItems: 'start' }}>
        {/* Currency cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {loading ? (
            <div style={{ color: '#64748b', padding: '40px' }}>Loading...</div>
          ) : (
            Object.entries(CURRENCY_INFO).map(([currency, info]) => {
              const acc = data?.accounts.find(a => a.currency === currency);
              const balance = acc ? parseFloat(acc.balance) : 0;
              const rate = data?.rates[currency] ? parseFloat(data.rates[currency]) : 0;
              const idrValue = balance * rate;
              return (
                <div key={currency} style={{
                  background: 'rgba(255,255,255,0.02)', border: `1px solid ${info.color}22`,
                  borderRadius: '18px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${info.color}55`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${info.color}22`; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
                  onClick={() => { setFromCurrency('IDR'); setToCurrency(currency); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '22px' }}>{info.flag}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{currency}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{info.name}</div>
                      </div>
                    </div>
                    <div style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: `${info.color}15`, color: info.color }}>
                      1 = Rp {new Intl.NumberFormat('id-ID').format(rate)}
                    </div>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: info.color }}>
                    {info.symbol}{balance.toFixed(currency === 'JPY' ? 0 : 2)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    ≈ Rp {new Intl.NumberFormat('id-ID').format(Math.round(idrValue))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Conversion panel */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>💱 Convert Currency</h3>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>From</div>
            <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '13px',
            }}>
              <option value="IDR">🇮🇩 IDR (Indonesian Rupiah)</option>
              {Object.entries(CURRENCY_INFO).map(([c, i]) => <option key={c} value={c}>{i.flag} {c} ({i.name})</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>To</div>
            <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '13px',
            }}>
              <option value="IDR">🇮🇩 IDR (Indonesian Rupiah)</option>
              {Object.entries(CURRENCY_INFO).map(([c, i]) => <option key={c} value={c}>{i.flag} {c} ({i.name})</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Amount</div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box',
            }} />
            {preview && <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>{preview}</div>}
          </div>

          {(fromCurrency === 'IDR' || toCurrency === 'IDR') && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>IDR Account</div>
              <select value={accountId} onChange={e => setAccountId(e.target.value)} style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '13px',
              }}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>PIN 🔐</div>
            <input type="password" inputMode="numeric" maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px', letterSpacing: '6px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '16px', boxSizing: 'border-box',
            }} />
          </div>

          <button onClick={handleConvert} disabled={converting} style={{
            width: '100%', padding: '13px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer',
          }}>{converting ? 'Converting...' : '💱 Convert Now'}</button>

          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>LIVE RATES</div>
            {Object.entries(CURRENCY_INFO).map(([c, i]) => {
              const rate = data?.rates[c] ? parseFloat(data.rates[c]) : 0;
              return (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{i.flag} {c}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Rp {new Intl.NumberFormat('id-ID').format(rate)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
