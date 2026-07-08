import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('arjuna@novapay.id');
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
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 50%), #020617',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', top: '-200px', left: '-100px', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)', bottom: '-100px', right: '-50px', pointerEvents: 'none', animation: 'float 10s ease-in-out infinite reverse' }} />

      <div style={{
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(40px)',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: '28px',
        padding: '48px 40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
        animation: 'slideUp 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>NovaPay</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Digital Banking Platform</div>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>Welcome back</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 28px' }}>Sign in to access your account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input id="login-password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#f8fafc', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {showPass ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                </svg>
              </button>
            </div>
          </div>

          {displayError && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '13px' }}>
              {displayError}
            </div>
          )}

          <button id="login-submit" type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', marginTop: '4px' }}>
            {loading ? (
              <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '12px 16px', background: 'rgba(99,102,241,0.05)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '20px' }}>💡</div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Demo account</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>arjuna@novapay.id / Password1!</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
      `}</style>
    </div>
  );
}
