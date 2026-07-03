import type { PageName } from '../types';

interface HeaderProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  onLogout: () => void;
}

const pageTitles: Record<PageName, string> = {
  login: 'Login',
  dashboard: 'Dashboard',
  transfer: 'Transfer Money',
  transactions: 'Transactions',
  cards: 'My Cards',
  settings: 'Settings',
};

export default function Header({ currentPage, onNavigate, onLogout }: HeaderProps) {
  return (
    <header style={{
      height: '72px',
      background: 'rgba(10, 15, 30, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99,102,241,0.12)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
          {pageTitles[currentPage]}
        </h1>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"
          style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          placeholder="Search transactions..."
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '10px',
            padding: '8px 16px 8px 36px',
            color: '#f8fafc',
            fontSize: '13px',
            outline: 'none',
            width: '220px',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.15)')}
        />
      </div>

      {/* Notification bell */}
      <button style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '10px',
        padding: '8px',
        cursor: 'pointer',
        color: '#94a3b8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#a5b4fc'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#6366f1', border: '2px solid #0a0f1e',
        }} />
      </button>

      {/* Avatar */}
      <button
        onClick={() => onNavigate('settings')}
        style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: '2px solid rgba(99,102,241,0.4)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: 'white',
          transition: 'box-shadow 0.2s',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(99,102,241,0.5)')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = 'none')}
        title="Go to Settings"
      >AP</button>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px',
          padding: '8px 14px',
          cursor: 'pointer',
          color: '#f87171',
          fontSize: '13px',
          fontWeight: 500,
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; }}
      >
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </header>
  );
}
