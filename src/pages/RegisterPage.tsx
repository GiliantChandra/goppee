import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterPageProps {
  onSwitch: () => void;
}

export default function RegisterPage({ onSwitch }: RegisterPageProps) {
  const { register, error: authError, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => { clearError(); }, []);

  const displayError = localError || authError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    if (!name || !email || !password) { setLocalError('Name, email, and password are required.'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(name, email, password, phone || undefined);
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
      backgroundImage: 'radial-gradient(circle at 85% 50%, rgba(168, 85, 247, 0.15), transparent 25%), radial-gradient(circle at 15% 30%, rgba(99, 102, 241, 0.15), transparent 25%)',
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.5)'
          }}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Create an Account</h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0 }}>Join NovaPay and manage your finances</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                transition: 'all 0.2s ease', boxSizing: 'border-box'
              }}
              onFocus={e => { e.target.style.borderColor = '#d8b4fe'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(216, 180, 254, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                transition: 'all 0.2s ease', boxSizing: 'border-box'
              }}
              onFocus={e => { e.target.style.borderColor = '#d8b4fe'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(216, 180, 254, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Phone Number (Optional)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+62 812 3456 7890"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                transition: 'all 0.2s ease', boxSizing: 'border-box'
              }}
              onFocus={e => { e.target.style.borderColor = '#d8b4fe'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(216, 180, 254, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Create a strong password"
                style={{
                  width: '100%', padding: '12px 48px 12px 16px',
                  background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none',
                  transition: 'all 0.2s ease', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#d8b4fe'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(216, 180, 254, 0.1)'; }}
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
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {displayError}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', marginTop: '8px',
              background: loading ? 'rgba(168,85,247,0.5)' : 'linear-gradient(135deg, #a855f7, #ec4899)',
              border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: loading ? 'none' : '0 10px 20px -10px rgba(168,85,247,0.6)'
            }}
            onMouseOver={e => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -10px rgba(168,85,247,0.7)'; }}
            onMouseOut={e => { if(!loading) e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(168,85,247,0.6)'; }}
          >
            {loading ? (
              <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Creating account...</>
            ) : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
          Already have an account?{' '}
          <button onClick={onSwitch} style={{
            background: 'none', border: 'none', color: '#d8b4fe', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '14px', transition: 'color 0.2s'
          }} onMouseOver={e => e.currentTarget.style.color = '#e9d5ff'} onMouseOut={e => e.currentTarget.style.color = '#d8b4fe'}>
            Sign in
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
          width: 500px; height: 500px; background: rgba(168, 85, 247, 0.4); top: -200px; right: -150px; animation: float1 15s infinite alternate ease-in-out;
        }
        .shape-2 {
          width: 400px; height: 400px; background: rgba(236, 72, 153, 0.4); bottom: -150px; left: -100px; animation: float2 12s infinite alternate ease-in-out;
        }
        @keyframes float1 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-50px, 50px) scale(1.1); } }
        @keyframes float2 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(40px, -60px) scale(1.05); } }
      `}</style>
    </div>
  );
}
