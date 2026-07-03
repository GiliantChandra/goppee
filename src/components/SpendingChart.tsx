import type { SpendingData } from '../types';

interface SpendingChartProps {
  data: SpendingData[];
}

function formatK(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return String(amount);
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const max = Math.max(...data.map(d => d.amount));
  const currentMonth = data[data.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Summary row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Spending
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
            Rp {new Intl.NumberFormat('id-ID').format(currentMonth.amount)}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>↓ 14.8%</span>
            <span style={{ color: '#64748b' }}>vs last month</span>
          </div>
        </div>
        <div style={{
          background: 'rgba(99,102,241,0.12)', borderRadius: '8px', padding: '4px 10px',
          fontSize: '12px', color: '#a5b4fc', fontWeight: 500,
        }}>
          July 2026
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', flex: 1, paddingTop: '8px' }}>
        {data.map((item, i) => {
          const isLast = i === data.length - 1;
          const heightPct = (item.amount / max) * 100;
          return (
            <div
              key={item.month}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}
            >
              <div style={{ fontSize: '10px', color: isLast ? '#a5b4fc' : 'transparent', fontWeight: 600 }}>
                {formatK(item.amount)}
              </div>
              <div
                style={{
                  width: '100%', borderRadius: '8px 8px 4px 4px',
                  height: `${heightPct}%`,
                  background: isLast
                    ? 'linear-gradient(180deg, #6366f1, #4f46e5)'
                    : 'rgba(99,102,241,0.18)',
                  transition: 'height 0.6s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative',
                  cursor: 'pointer',
                  minHeight: '8px',
                  boxShadow: isLast ? '0 0 16px rgba(99,102,241,0.4)' : 'none',
                }}
                title={`${item.month}: Rp ${new Intl.NumberFormat('id-ID').format(item.amount)}`}
              />
              <div style={{ fontSize: '11px', color: isLast ? '#a5b4fc' : '#475569', fontWeight: isLast ? 700 : 400 }}>
                {item.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
