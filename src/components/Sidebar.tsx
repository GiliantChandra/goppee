import type { PageName } from '../types';

interface SidebarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { page: PageName; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { page: 'transfer', label: 'Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { page: 'transactions', label: 'Transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { page: 'cards', label: 'My Cards', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { page: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? '72px' : '240px',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)',
        borderRight: '1px solid rgba(99,102,241,0.15)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 16px 16px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '72px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99,102,241,0.4)',
        }}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {!collapsed && (
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            NovaPay
          </span>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft: 'auto', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '8px', cursor: 'pointer', padding: '4px', color: '#94a3b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.1)'; }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(({ page, label, icon }) => {
          const active = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: collapsed ? '12px' : '12px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: active ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))' : 'transparent',
                borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                color: active ? '#a5b4fc' : '#64748b',
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'left',
                whiteSpace: 'nowrap',
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
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                {icon.split(' M').map((d, i) => (
                  <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? d : 'M' + d} />
                ))}
              </svg>
              {!collapsed && (
                <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400 }}>{label}</span>
              )}
              {active && !collapsed && (
                <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom user badge */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px', borderRadius: '12px',
          background: 'rgba(99,102,241,0.05)',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: 'white',
          }}>AP</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>Arjuna P.</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Premium</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
