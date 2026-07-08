import { useState, useEffect, useRef } from 'react';
import { getPockets, createPocket, deletePocket, type Pocket } from '../services/pocket.service';
import { getAccounts, type Account } from '../services/account.service';
import { pocketDeposit, pocketWithdraw } from '../services/transaction.service';
import { getApiError } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const EMOJIS = ['💰', '🏖️', '🏠', '💻', '✈️', '🎓', '🚗', '💍', '🏥', '🐾', '🎮', '👶', '🔑', '📱', '🎸'];
const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#10b981', '#ec4899', '#f97316', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16'];

function PocketCard({ pocket, accounts, onUpdate, onDelete }: {
  pocket: Pocket;
  accounts: Account[];
  onUpdate: () => void;
  onDelete: (id: string) => void;
}) {
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDirection, setTransferDirection] = useState<'in' | 'out'>('in');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id ?? '');
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [err, setErr] = useState('');
  const barRef = useRef<HTMLDivElement>(null);

  const balance = parseInt(pocket.balance, 10);
  const goal = pocket.goalAmount ? parseInt(pocket.goalAmount, 10) : null;
  const pct = goal ? Math.min((balance / goal) * 100, 100) : 0;

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }, 400);
    return () => clearTimeout(t);
  }, [pct]);

  async function handleTransfer() {
    const amount = parseInt(transferAmount.replace(/\D/g, ''), 10);
    if (!amount || amount < 1000) { setErr('Minimum Rp 1.000'); return; }
    setErr(''); setTransferring(true);
    try {
      const key = uuidv4();
      if (transferDirection === 'in') {
        await pocketDeposit({ fromAccountId: selectedAccount, toPocketId: pocket.id, amount, idempotencyKey: key });
      } else {
        await pocketWithdraw({ pocketId: pocket.id, toAccountId: selectedAccount, amount, idempotencyKey: key });
      }
      setTransferAmount('');
      setShowTransfer(false);
      onUpdate();
    } catch (e) {
      setErr(getApiError(e));
    } finally {
      setTransferring(false);
    }
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: `1px solid ${pocket.color}22`,
      borderRadius: '20px', padding: '22px', transition: 'all 0.25s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', fontSize: '22px',
            background: `${pocket.color}18`, border: `1px solid ${pocket.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{pocket.emoji}</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{pocket.name}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: pocket.color }}>
              Rp {new Intl.NumberFormat('id-ID').format(balance)}
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(pocket.id)} style={{
          background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px', padding: '4px',
        }}>🗑️</button>
      </div>

      {goal && (
        <>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '6px' }}>
            <div ref={barRef} style={{
              height: '100%', borderRadius: '3px', width: '0%',
              background: `linear-gradient(90deg, ${pocket.color}, ${pocket.color}cc)`,
              boxShadow: `0 0 8px ${pocket.color}66`,
              transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
            <span>{pct.toFixed(0)}% of goal</span>
            <span>Goal: Rp {new Intl.NumberFormat('id-ID').format(goal)}</span>
          </div>
        </>
      )}

      {!showTransfer ? (
        <button onClick={() => setShowTransfer(true)} style={{
          width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          background: `${pocket.color}18`, border: `1px solid ${pocket.color}33`, color: pocket.color, cursor: 'pointer',
        }}>Transfer Fund</button>
      ) : (
        <div style={{ marginTop: '4px' }}>
          {/* Direction toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {(['in', 'out'] as const).map(d => (
              <button key={d} onClick={() => setTransferDirection(d)} style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                background: transferDirection === d ? `${pocket.color}28` : 'transparent',
                border: `1px solid ${transferDirection === d ? pocket.color : 'rgba(255,255,255,0.06)'}`,
                color: transferDirection === d ? pocket.color : '#64748b',
              }}>{d === 'in' ? '📥 Deposit' : '📤 Withdraw'}</button>
            ))}
          </div>

          {/* Account select */}
          <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} style={{
            width: '100%', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#f8fafc', fontSize: '12px',
          }}>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>

          <input
            type="number" placeholder="Amount (Rp)" value={transferAmount}
            onChange={e => setTransferAmount(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box',
            }}
          />

          {err && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>{err}</div>}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleTransfer} disabled={transferring} style={{
              flex: 1, padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
              background: `linear-gradient(135deg, ${pocket.color}, ${pocket.color}cc)`,
              border: 'none', color: 'white', cursor: 'pointer',
            }}>{transferring ? '...' : 'Confirm'}</button>
            <button onClick={() => { setShowTransfer(false); setErr(''); }} style={{
              padding: '9px 14px', borderRadius: '8px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer', fontSize: '13px',
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PocketsPage() {
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  // New pocket form state
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('💰');
  const [newColor, setNewColor] = useState('#6366f1');
  const [newGoal, setNewGoal] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [newAccountId, setNewAccountId] = useState('');
  const [creating, setCreating] = useState(false);

  async function loadAll() {
    try {
      const [p, a] = await Promise.all([getPockets(), getAccounts()]);
      setPockets(p); setAccounts(a);
      if (!newAccountId && a.length) setNewAccountId(a[0].id);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  async function handleCreate() {
    if (!newName.trim()) { setError('Pocket name is required'); return; }
    setCreating(true); setError('');
    try {
      await createPocket({
        accountId: newAccountId,
        name: newName.trim(),
        emoji: newEmoji,
        color: newColor,
        goalAmount: newGoal ? parseInt(newGoal) : undefined,
        goalDate: newGoalDate ? new Date(newGoalDate).toISOString() : undefined,
      });
      setNewName(''); setNewGoal(''); setNewGoalDate(''); setShowCreate(false);
      await loadAll();
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this pocket? Funds must be withdrawn first.')) return;
    try {
      await deletePocket(id);
      await loadAll();
    } catch (e) {
      setError(getApiError(e));
    }
  }

  const totalBalance = pockets.reduce((s, p) => s + parseInt(p.balance, 10), 0);

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
      {/* Header summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px',
      }}>
        {[
          { label: 'Total Pockets', value: String(pockets.length), color: '#6366f1', icon: '🗂️' },
          { label: 'Total Saved', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalBalance)}`, color: '#10b981', icon: '💰' },
          { label: 'Goals Active', value: String(pockets.filter(p => p.goalAmount).length), color: '#f59e0b', icon: '🎯' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{
            background: `${color}0c`, border: `1px solid ${color}22`,
            borderRadius: '18px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{ fontSize: '24px' }}>{icon}</div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '14px' }}>{error}</div>}

      {/* Create pocket */}
      {!showCreate ? (
        <button onClick={() => setShowCreate(true)} style={{
          padding: '14px', borderRadius: '14px', fontSize: '14px', fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
        }}>+ Create New Pocket</button>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>New Pocket</h3>
          
          {/* Emoji picker */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Icon</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)} style={{
                  width: '38px', height: '38px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer',
                  background: newEmoji === e ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                  border: newEmoji === e ? '1px solid #6366f1' : '1px solid transparent',
                }}>{e}</button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Color</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setNewColor(c)} style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: c, border: newColor === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer',
                }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Pocket Name *</div>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Bali Vacation" style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box',
              }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Link to Account</div>
              <select value={newAccountId} onChange={e => setNewAccountId(e.target.value)} style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', fontSize: '13px',
              }}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Goal Amount (optional)</div>
              <input type="number" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Rp" style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box',
              }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Target Date (optional)</div>
              <input type="date" value={newGoalDate} onChange={e => setNewGoalDate(e.target.value)} style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', fontSize: '13px', colorScheme: 'dark',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={handleCreate} disabled={creating} style={{
              flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer',
            }}>{creating ? 'Creating...' : `${newEmoji} Create Pocket`}</button>
            <button onClick={() => { setShowCreate(false); setError(''); }} style={{
              padding: '12px 18px', borderRadius: '12px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading pockets...</div>
      ) : pockets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <div style={{ fontSize: '16px', marginBottom: '8px', color: '#94a3b8' }}>No pockets yet</div>
          <div style={{ fontSize: '13px' }}>Create your first pocket to start saving for a goal</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {pockets.map(pocket => (
            <PocketCard key={pocket.id} pocket={pocket} accounts={accounts} onUpdate={loadAll} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
