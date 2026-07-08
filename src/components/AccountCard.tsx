import type { Account } from '../services/account.service';

interface AccountCardProps {
  account: Account;
  active?: boolean;
  onClick?: () => void;
  size?: 'large' | 'small';
}

function formatBalance(amountStr: number | string): string {
  const amount = typeof amountStr === 'string' ? parseInt(amountStr, 10) : amountStr;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function AccountCard({ account, active = false, onClick, size = 'large' }: AccountCardProps) {
  const isLarge = size === 'large';

  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${account.gradient[0]}, ${account.gradient[1]})`,
        borderRadius: isLarge ? '24px' : '16px',
        padding: isLarge ? '28px' : '18px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s, box-shadow 0.25s',
        boxShadow: active
          ? `0 20px 60px ${account.gradient[0]}55`
          : `0 8px 32px ${account.gradient[0]}33`,
        transform: active ? 'translateY(-4px)' : 'none',
        border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
        minWidth: isLarge ? '320px' : '220px',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (onClick) {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 64px ${account.gradient[0]}66`;
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          (e.currentTarget as HTMLDivElement).style.transform = active ? 'translateY(-4px)' : 'none';
          (e.currentTarget as HTMLDivElement).style.boxShadow = active
            ? `0 20px 60px ${account.gradient[0]}55`
            : `0 8px 32px ${account.gradient[0]}33`;
        }
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '20px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div>
          <div style={{ fontSize: isLarge ? '12px' : '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {account.label}
          </div>
          <div style={{ fontSize: isLarge ? '28px' : '20px', fontWeight: 800, color: 'white', marginTop: '6px', letterSpacing: '-0.5px' }}>
            {formatBalance(account.balance)}
          </div>
        </div>
        {/* Chip icon */}
        <div style={{
          width: isLarge ? '44px' : '34px', height: isLarge ? '32px' : '26px',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          borderRadius: '6px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '2px',
          padding: '4px',
        }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '2px' }} />
          ))}
        </div>
      </div>

      {/* Card number */}
      <div style={{
        fontSize: isLarge ? '15px' : '12px',
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'monospace',
        letterSpacing: '2px',
        marginTop: isLarge ? '24px' : '14px',
        position: 'relative',
      }}>
        {account.cardNumberMasked || '**** **** **** 1234'}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: isLarge ? '20px' : '12px', position: 'relative' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Card Holder</div>
          <div style={{ fontSize: isLarge ? '13px' : '11px', color: 'white', fontWeight: 600, marginTop: '2px' }}>Arjuna Pratama</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expires</div>
          <div style={{ fontSize: isLarge ? '13px' : '11px', color: 'white', fontWeight: 600, marginTop: '2px' }}>{account.expiryDate || '12/28'}</div>
        </div>
        {/* Mastercard logo */}
        <div style={{ display: 'flex' }}>
          <div style={{ width: isLarge ? '28px' : '20px', height: isLarge ? '28px' : '20px', borderRadius: '50%', background: '#ef4444', opacity: 0.9 }} />
          <div style={{ width: isLarge ? '28px' : '20px', height: isLarge ? '28px' : '20px', borderRadius: '50%', background: '#f97316', opacity: 0.9, marginLeft: '-10px' }} />
        </div>
      </div>
    </div>
  );
}
