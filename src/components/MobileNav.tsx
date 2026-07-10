import type { PageName } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface MobileNavProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  onLogout: () => void;
}

// Primary nav items shown in the bottom bar (max 5 for mobile)
const mobileNavItems: { page: PageName; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { page: 'transfer', label: 'Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { page: 'topup', label: 'Top-Up', icon: 'M12 4v16m8-8H4' },
  { page: 'transactions', label: 'History', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { page: 'settings', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'NP';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: '72px',
      background: 'rgba(9, 13, 26, 0.95)',
      backdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(99,102,241,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 100,
      boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
    }}>
      {mobileNavItems.map(({ page, label, icon }) => {
        const active = currentPage === page;
        const isProfile = page === 'settings';

        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              flex: 1,
              borderRadius: '12px',
              position: 'relative',
              transition: 'all 0.2s',
            }}
          >
            {/* Active indicator dot */}
            {active && (
              <span style={{
                position: 'absolute',
                top: '6px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#6366f1',
                boxShadow: '0 0 6px #6366f1',
              }} />
            )}

            {/* Icon or Avatar for Profile */}
            {isProfile ? (
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: active
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(100,116,139,0.3)',
                border: active ? '2px solid rgba(99,102,241,0.6)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 800, color: 'white',
                transition: 'all 0.2s',
              }}>{initials}</div>
            ) : (
              <svg
                width="22" height="22"
                fill="none"
                stroke={active ? '#a5b4fc' : '#475569'}
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                style={{ transition: 'stroke 0.2s' }}
              >
                {icon.split(' M').map((d, i) => (
                  <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? d : 'M' + d} />
                ))}
              </svg>
            )}

            <span style={{
              fontSize: '10px',
              fontWeight: active ? 700 : 400,
              color: active ? '#a5b4fc' : '#475569',
              transition: 'all 0.2s',
              letterSpacing: active ? '0.3px' : '0px',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
