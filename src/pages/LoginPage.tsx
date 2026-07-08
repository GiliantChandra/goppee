import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onSwitch: () => void;
}

export default function LoginPage({ onSwitch }: LoginPageProps) {
  const { login, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => { clearError(); }, []);

  const displayError = localError || authError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) { setLocalError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      // Error already set in authError via context
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: 'white', fontFamily: '"Inter", sans-serif' }}>
      {/* Left side: Beautiful branding showcase */}
      <div style={{
        flex: 1, display: 'none', '@media (min-width: 1024px)': { display: 'flex' },
        flexDirection: 'column', padding: '60px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }} className="desktop-only-flex">
        
        {/* Animated Background Gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 10s infinite alternate ease-in-out' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 12s infinite alternate-reverse ease-in-out' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.5)'
          }}>
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>NovaPay</span>
        </div>

        <div style={{ margin: 'auto 0', position: 'relative', zIndex: 10, maxWidth: '500px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(to right, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            The Future of Digital Banking is Here.
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '40px' }}>
            Experience seamless transactions, intuitive pocket management, and global currency access all in one premium platform.
          </p>
          
          {/* Floating UI Elements Showcase */}
          <div style={{ position: 'relative', height: '200px' }}>
             <div style={{ 
               position: 'absolute', top: 0, left: 0, width: '280px', padding: '20px', 
               background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(20px)', borderRadius: '20px',
               border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
               animation: 'float 8s infinite ease-in-out'
             }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Total Balance</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc' }}>$24,500.00</div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <div style={{ height: '4px', flex: 2, background: '#6366f1', borderRadius: '2px' }}/>
                  <div style={{ height: '4px', flex: 1, background: '#10b981', borderRadius: '2px' }}/>
                  <div style={{ height: '4px', flex: 1, background: '#f59e0b', borderRadius: '2px' }}/>
                </div>
             </div>

             <div style={{ 
               position: 'absolute', top: '80px', left: '180px', width: '240px', padding: '16px', 
               background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
               border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
               animation: 'float 9s infinite alternate-reverse ease-in-out', display: 'flex', alignItems: 'center', gap: '16px'
             }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Transfer Success</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Sent $150.00 to Sarah</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', position: 'relative'
      }}>
        <div style={{ width: '100%', maxWidth: '420px', animation: 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', letterSpacing: '-0.5px' }}>Sign In</h2>
            <p style={{ fontSize: '15px', color: '#94a3b8' }}>Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                  color: '#f8fafc', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <a href="#" style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%', padding: '16px 48px 16px 16px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                    color: '#f8fafc', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px'
                }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {showPass ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                  </svg>
                </button>
              </div>
            </div>

            {displayError && (
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {displayError}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '16px', marginTop: '8px',
                background: loading ? 'rgba(99,102,241,0.5)' : '#6366f1',
                border: 'none', borderRadius: '16px', color: 'white', fontSize: '16px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: loading ? 'none' : '0 10px 20px -5px rgba(99,102,241,0.4)'
              }}
              onMouseOver={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#4f46e5'; } }}
              onMouseOut={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#6366f1'; } }}
            >
              {loading ? (
                <><div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
            Don't have an account?{' '}
            <button type="button" onClick={onSwitch} style={{
              background: 'none', border: 'none', color: '#f8fafc', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '14px', transition: 'color 0.2s', textDecoration: 'underline'
            }} onMouseOver={e => e.currentTarget.style.color = '#6366f1'} onMouseOut={e => e.currentTarget.style.color = '#f8fafc'}>
              Sign up now
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-only-flex { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .desktop-only-flex { display: none !important; }
        }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(20px, 30px); } }
      `}</style>
    </div>
  );
}
