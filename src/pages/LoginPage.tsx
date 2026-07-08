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
    <div className="auth-container" style={{
      minHeight: '100vh',
      background: '#020617',
      backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.15), transparent 25%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div className="auth-bg-shape shape-1" />
      <div className="auth-bg-shape shape-2" />

      <div style={{
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px',
        padding: '48px', width: '100%', maxWidth: '440px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.05)',
        animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative', zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)'
          }}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Welcome back</h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0 }}>Sign in to continue to NovaPay</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px', color: '#f8fafc', fontSize: '15px', outline: 'none',
                transition: 'all 0.2s ease', boxSizing: 'border-box'
              }}
              onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 500 }}>Password</label>
              <a href="#" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '14px 48px 14px 16px',
                  background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px', color: '#f8fafc', fontSize: '15px', outline: 'none',
                  transition: 'all 0.2s ease', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s'
              }} onMouseOver={e => e.currentTarget.style.color = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {showPass ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                </svg>
              </button>
            </div>
          </div>

          {displayError && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {displayError}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', marginTop: '8px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: loading ? 'none' : '0 10px 20px -10px rgba(99,102,241,0.6)'
            }}
            onMouseOver={e => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -10px rgba(99,102,241,0.7)'; }}
            onMouseOut={e => { if(!loading) e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(99,102,241,0.6)'; }}
          >
            {loading ? (
              <><div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Authenticating...</>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <button onClick={onSwitch} style={{
            background: 'none', border: 'none', color: '#a855f7', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '14px', transition: 'color 0.2s'
          }} onMouseOver={e => e.currentTarget.style.color = '#c084fc'} onMouseOut={e => e.currentTarget.style.color = '#a855f7'}>
            Sign up now
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-bg-shape {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 1; opacity: 0.6;
        }
        .shape-1 {
          width: 500px; height: 500px; background: rgba(99, 102, 241, 0.4); top: -200px; left: -150px; animation: float1 15s infinite alternate ease-in-out;
        }
        .shape-2 {
          width: 400px; height: 400px; background: rgba(168, 85, 247, 0.4); bottom: -150px; right: -100px; animation: float2 12s infinite alternate ease-in-out;
        }
        @keyframes float1 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, 50px) scale(1.1); } }
        @keyframes float2 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-40px, -60px) scale(1.05); } }
      `}</style>
    </div>
  );
}
