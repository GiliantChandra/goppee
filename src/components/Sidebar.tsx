import type { PageName } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { page: PageName; label: string; icon: string; badge?: string; emoji?: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { page: 'transfer', label: 'Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { page: 'transactions', label: 'Transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { page: 'cards', label: 'My Cards', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { page: 'pockets', label: 'Pockets', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { page: 'topup', label: 'Top-Up', icon: 'M12 4v16m8-8H4', emoji: '📲' },
  { page: 'valas', label: 'Valas', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { page: 'loans', label: 'Loans', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', badge: '3' },
  { page: 'investments', label: 'Investments', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
];

const bottomItems: { page: PageName; label: string; icon: string }[] = [
  { page: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

function NavButton({ page, label, icon, badge, active, collapsed, onNavigate }: {
  page: PageName; label: string; icon: string; badge?: string;
  active: boolean; collapsed: boolean; onNavigate: (p: PageName) => void;
}) {
  return (
    <button
      key={page}
      onClick={() => onNavigate(page)}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: collapsed ? '12px' : '11px 14px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: '12px', border: 'none', cursor: 'pointer',
        background: active
          ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))'
          : 'transparent',
        color: active ? '#a5b4fc' : '#64748b',
        transition: 'all 0.2s',
        width: '100%', textAlign: 'left', whiteSpace: 'nowrap',
        position: 'relative',
        boxShadow: active ? 'inset 3px 0 0 #6366f1' : 'inset 3px 0 0 transparent',
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)';
          (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
        }
      }}
    >
      <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        {icon.split(' M').map((d, i) => (
          <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? d : 'M' + d} />
        ))}
      </svg>
      {!collapsed && (
        <>
          <span style={{ fontSize: '13.5px', fontWeight: active ? 600 : 400, flex: 1 }}>{label}</span>
          {badge && (
            <span style={{
              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', fontSize: '10px', fontWeight: 700,
              padding: '2px 6px', borderRadius: '8px',
            }}>{badge}</span>
          )}
        </>
      )}
    </button>
  );
}

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'NP';
  const displayName = user?.name ? `${user.name.split(' ')[0]} ${user.name.split(' ')[1]?.[0] ?? ''}.` : 'User';
  return (
    <aside
      style={{
        width: collapsed ? '68px' : '235px',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #090d1a 0%, #070b14 100%)',
        borderRight: '1px solid rgba(99,102,241,0.12)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'sticky', top: 0, zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', gap: '10px', minHeight: '68px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 18px rgba(99,102,241,0.45)',
        }}>
          <svg width="19" height="19" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
              NovaPay
            </div>
            <div style={{ fontSize: '10px', color: '#4f4f72', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Digital Bank</div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft: 'auto', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)',
            borderRadius: '7px', cursor: 'pointer', padding: '5px', color: '#4f4f72',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.18)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4f4f72'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)'; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
          </svg>
        </button>
      </div>

      {/* Separator */}
      <div style={{ height: '1px', background: 'rgba(99,102,241,0.08)', margin: '0 16px' }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {!collapsed && (
          <div style={{ fontSize: '10px', color: '#334155', letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: 600, padding: '4px 6px 8px', marginTop: '4px' }}>
            Main Menu
          </div>
        )}
        {navItems.map(item => (
          <NavButton
            key={item.page}
            {...item}
            active={currentPage === item.page}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}

        {!collapsed && (
          <div style={{ fontSize: '10px', color: '#334155', letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: 600, padding: '12px 6px 8px', marginTop: '8px' }}>
            Account
          </div>
        )}
        {collapsed && <div style={{ height: '10px' }} />}
        {bottomItems.map(item => (
          <NavButton
            key={item.page}
            {...item}
            active={currentPage === item.page}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Bottom user badge */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '12px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.1)',
          justifyContent: collapsed ? 'center' : 'flex-start',
          cursor: 'pointer', transition: 'background 0.2s',
        }}
          onClick={() => onNavigate('settings')}
          onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.12)')}
          onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.06)')}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 800, color: 'white',
            boxShadow: '0 0 10px rgba(99,102,241,0.3)',
          }}>{initials}</div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
              <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: 600 }}>✦ Premium</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
