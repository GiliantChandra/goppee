import { useState } from 'react';

const portfolio = [
  { name: 'Reksa Dana Saham', symbol: 'RDS', units: 1250, nav: 18_540, change: +3.2, color: '#6366f1', icon: '📈', category: 'Reksa Dana' },
  { name: 'Bitcoin (BTC)', symbol: 'BTC', units: 0.0062, nav: 1_624_500_000 / 15, change: +5.8, color: '#f59e0b', icon: '₿', category: 'Kripto' },
  { name: 'Obligasi Pemerintah', symbol: 'OBL', units: 10, nav: 10_200_000, change: +0.3, color: '#14b8a6', icon: '🏛️', category: 'Obligasi' },
  { name: 'Saham BBCA', symbol: 'BBCA', units: 400, nav: 10_100, change: +1.5, color: '#10b981', icon: '🏦', category: 'Saham' },
  { name: 'Emas Digital', symbol: 'GOLD', units: 25.5, nav: 1_420_000, change: -0.4, color: '#f97316', icon: '🥇', category: 'Komoditas' },
];

const allocationData = [
  { label: 'Reksa Dana', pct: 25, color: '#6366f1' },
  { label: 'Kripto', pct: 18, color: '#f59e0b' },
  { label: 'Obligasi', pct: 22, color: '#14b8a6' },
  { label: 'Saham', pct: 22, color: '#10b981' },
  { label: 'Komoditas', pct: 13, color: '#f97316' },
];

const history = [
  { month: 'Feb', value: 130 }, { month: 'Mar', value: 138 }, { month: 'Apr', value: 134 },
  { month: 'May', value: 145 }, { month: 'Jun', value: 151 }, { month: 'Jul', value: 156.2 },
];

function MiniLineChart() {
  const max = Math.max(...history.map(h => h.value));
  const min = Math.min(...history.map(h => h.value));
  const w = 300, h = 100;
  const points = history.map((item, i) => {
    const x = (i / (history.length - 1)) * (w - 20) + 10;
    const y = h - ((item.value - min) / (max - min)) * (h - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`10,${h} ${points} ${w - 10},${h}`}
        fill="url(#chartGrad)" stroke="none"
      />
      <polyline
        points={points}
        fill="none" stroke="#6366f1" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {history.map((item, i) => {
        const [x, y] = points.split(' ')[i].split(',').map(Number);
        return (
          <g key={i}>
            {i === history.length - 1 && (
              <circle cx={x} cy={y} r="5" fill="#6366f1" stroke="#0a0f1e" strokeWidth="2">
                <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <text x={x} y={h + 14} textAnchor="middle" fill="#475569" fontSize="10">{item.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function InvestmentsPage() {
  const [tab, setTab] = useState<'all' | 'stocks' | 'crypto' | 'bonds'>('all');
  const totalValue = portfolio.reduce((s, p) => s + p.units * p.nav, 0);
  const totalReturn = 26_200_000;

  const filtered = portfolio.filter(p => {
    if (tab === 'all') return true;
    if (tab === 'stocks') return p.category === 'Saham' || p.category === 'Reksa Dana';
    if (tab === 'crypto') return p.category === 'Kripto';
    if (tab === 'bonds') return p.category === 'Obligasi' || p.category === 'Komoditas';
    return true;
  });

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
      {/* Hero stats */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '24px', padding: '28px 32px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 260px', gap: '24px', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Portfolio Value</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1px' }}>Rp {new Intl.NumberFormat('id-ID').format(totalValue)}</div>
          <div style={{ fontSize: '13px', color: '#10b981', marginTop: '4px' }}>↑ +Rp {new Intl.NumberFormat('id-ID').format(totalReturn)} all time</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Today's Change</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', letterSpacing: '-0.5px' }}>+Rp 1.840.000</div>
          <div style={{ fontSize: '13px', color: '#10b981', marginTop: '4px' }}>↑ +1.19% today</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Return Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1', letterSpacing: '-0.5px' }}>+20.13%</div>
          <div style={{ fontSize: '13px', color: '#6366f1', marginTop: '4px' }}>↑ Since Jan 2022</div>
        </div>
        {/* Mini chart */}
        <div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>6-Month Performance</div>
          <MiniLineChart />
        </div>
      </div>

      {/* Grid: Portfolio list + Allocation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '18px', alignItems: 'start' }}>
        {/* Holdings */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Holdings</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['all', 'stocks', 'crypto', 'bonds'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                  background: tab === t ? 'rgba(99,102,241,0.2)' : 'transparent',
                  border: tab === t ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  color: tab === t ? '#a5b4fc' : '#64748b', cursor: 'pointer', textTransform: 'capitalize',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(p => {
              const value = p.units * p.nav;
              const isPos = p.change >= 0;
              return (
                <div key={p.symbol} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                  transition: 'all 0.2s', cursor: 'default',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `${p.color}10`; (e.currentTarget as HTMLDivElement).style.borderColor = `${p.color}33`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.04)'; }}
                >
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '13px', flexShrink: 0,
                    background: `${p.color}18`, border: `1px solid ${p.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                  }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{p.units.toLocaleString()} units • {p.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Rp {new Intl.NumberFormat('id-ID').format(value)}</div>
                    <div style={{ fontSize: '12px', color: isPos ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {isPos ? '↑' : '↓'} {Math.abs(p.change)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button style={{
            width: '100%', marginTop: '16px', padding: '13px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '13px', color: 'white', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            + Add Investment
          </button>
        </div>

        {/* Allocation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '22px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>Allocation</h3>
            {allocationData.map(a => (
              <div key={a.label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{a.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: a.color }}>{a.pct}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{
                    height: '100%', width: `${a.pct}%`, borderRadius: '3px',
                    background: `linear-gradient(90deg, ${a.color}, ${a.color}aa)`,
                    boxShadow: `0 0 8px ${a.color}55`,
                    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Risk indicator */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>Risk Level</div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
              {['Low', 'Med', 'High', 'V.High'].map((r, i) => (
                <div key={r} style={{
                  flex: 1, height: '8px', borderRadius: '4px',
                  background: i <= 2 ? ['#10b981', '#f59e0b', '#f97316'][i] : 'rgba(255,255,255,0.06)',
                }} />
              ))}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f97316' }}>⚡ Moderate-High</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Based on crypto & equity exposure</div>
          </div>

          {/* News */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>Market Update</div>
            {[
              { title: 'IHSG naik 0.8% ke level 7,890', time: '2h ago', color: '#10b981' },
              { title: 'Bitcoin menembus $65,000', time: '4h ago', color: '#f59e0b' },
              { title: 'BI tahan suku bunga di 5.75%', time: '1d ago', color: '#6366f1' },
            ].map(({ title, time, color }) => (
              <div key={title} style={{
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'flex-start', gap: '8px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '5px' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>{title}</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
