import { useState } from 'react';
import type { PageName } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { mockNotifications } from '../data/mockData';

interface HeaderProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  onLogout: () => void;
  isMobile?: boolean;
}

const pageTitles: Record<PageName, string> = {
  login: 'Login',
  dashboard: 'Dashboard',
  transfer: 'Transfer Money',
  transactions: 'Transactions',
  cards: 'My Cards',
  settings: 'Settings',
  loans: 'My Loans',
  investments: 'Investments',
  pockets: 'My Pockets',
  valas: 'Valas',
  topup: 'Top-Up',
};

export default function Header({ currentPage, onNavigate, onLogout, isMobile = false }: HeaderProps) {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'NP';
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <header style={{
      height: isMobile ? '60px' : '72px',
      background: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(99,102,241,0.12)',
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '0 16px' : '0 32px',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: isMobile ? '17px' : '20px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
          {pageTitles[currentPage]}
        </h1>
        {!isMobile && (
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* Search bar - hidden on mobile */}
      {!isMobile && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg width="15" height="15" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"
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
              color: '#f8fafc', fontSize: '13px', outline: 'none',
              width: '220px', transition: 'all 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.width = '260px'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.15)'; e.target.style.width = '220px'; }}
          />
        </div>
      )}

      {/* Notification bell */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen(v => !v)}
          style={{
            position: 'relative',
            background: notifOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '10px', padding: '8px', cursor: 'pointer',
            color: notifOpen ? '#a5b4fc' : '#94a3b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '5px', right: '5px',
              minWidth: '16px', height: '16px', borderRadius: '8px',
              background: '#ef4444', border: '2px solid #0a0f1e',
              fontSize: '9px', fontWeight: 800, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 3px',
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification dropdown */}
        {notifOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
            width: '360px', zIndex: 100,
            background: 'rgba(15,23,42,0.98)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '18px', padding: '20px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(24px)',
            animation: 'dropDown 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>Notifications</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{unreadCount} unread</div>
              </div>
              <button onClick={markAllRead} style={{
                background: 'none', border: 'none', color: '#a5b4fc', fontSize: '12px', cursor: 'pointer',
              }}>Mark all read</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.map(n => (
                <div key={n.id}
                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px', borderRadius: '12px',
                    background: n.read ? 'transparent' : 'rgba(99,102,241,0.08)',
                    border: n.read ? '1px solid transparent' : '1px solid rgba(99,102,241,0.2)',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{n.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: n.read ? 400 : 700, color: '#f8fafc' }}>{n.title}</span>
                      {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{n.body}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar - hidden on mobile since nav bar has profile */}
      {!isMobile && (
        <button
          onClick={() => onNavigate('settings')}
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: '2px solid rgba(99,102,241,0.4)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: 'white', transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(99,102,241,0.5)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = 'none')}
          title="Settings"
        >{initials}</button>
      )}

      {/* Logout - hidden on mobile (handled in profile page or via button) */}
      {!isMobile && (
        <button onClick={onLogout} style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: '#f87171',
          fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)')}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      )}

      <style>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
