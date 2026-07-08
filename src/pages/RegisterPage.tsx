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
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { clearError(); }, []);

  const displayError = localError || authError;

  // Password Validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  
  const isPasswordValid = hasMinLength && hasNumber && hasUppercase;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    
    if (!name || !email || !password) { 
      setLocalError('Name, email, and password are required fields.'); 
      return; 
    }
    if (!isPasswordValid) { 
      setLocalError('Please ensure your password meets all the security requirements below.'); 
      return; 
    }
    
    setLoading(true);
    try {
      await register(name, email, password, phone || undefined);
      setSuccessMsg('Account successfully created! Logging you in...');
    } catch {
      // Error already set in authError via context
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
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 10s infinite alternate ease-in-out' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 12s infinite alternate-reverse ease-in-out' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px -4px rgba(236, 72, 153, 0.5)'
          }}>
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>NovaPay</span>
        </div>

        <div style={{ margin: 'auto 0', position: 'relative', zIndex: 10, maxWidth: '500px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(to right, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Start Your Journey Today.
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '40px' }}>
            Join thousands of users who are taking control of their financial future with NovaPay's premium tools.
          </p>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
             {[
               { icon: '🌍', title: 'Global Access', desc: 'Hold multiple currencies easily.' },
               { icon: '🛡️', title: 'Bank-Grade Security', desc: 'Your data is strictly encrypted.' },
               { icon: '⚡', title: 'Instant Transfers', desc: 'Send money in a heartbeat.' }
             ].map((feature, i) => (
                <div key={i} style={{ 
                  background: 'rgba(30,41,59,0.5)', backdropFilter: 'blur(10px)', padding: '16px', borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)', width: 'calc(50% - 12px)', boxSizing: 'border-box'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{feature.icon}</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>{feature.title}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{feature.desc}</div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', position: 'relative', overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '440px', animation: 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)', padding: '40px 0' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', letterSpacing: '-0.5px' }}>Create Account</h2>
            <p style={{ fontSize: '15px', color: '#94a3b8' }}>Join NovaPay and manage your finances securely.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Input Row for Name and Phone */}
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                    color: '#f8fafc', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = 'rgba(236,72,153,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  style={{
                    width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                    color: '#f8fafc', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = 'rgba(236,72,153,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                  color: '#f8fafc', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = 'rgba(236,72,153,0.05)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  style={{
                    width: '100%', padding: '16px 48px 16px 16px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                    color: '#f8fafc', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = 'rgba(236,72,153,0.05)'; }}
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
              
              {/* Password Requirements Checklist */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: password.length === 0 ? '#64748b' : (hasMinLength ? '#10b981' : '#f43f5e'), transition: 'color 0.2s' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: password.length === 0 ? '#334155' : (hasMinLength ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  At least 8 characters
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: password.length === 0 ? '#64748b' : (hasNumber ? '#10b981' : '#f43f5e'), transition: 'color 0.2s' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: password.length === 0 ? '#334155' : (hasNumber ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  Contains at least one number
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: password.length === 0 ? '#64748b' : (hasUppercase ? '#10b981' : '#f43f5e'), transition: 'color 0.2s' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: password.length === 0 ? '#334155' : (hasUppercase ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  Contains at least one uppercase letter
                </div>
              </div>
            </div>

            {displayError && (
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {displayError}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {successMsg}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '16px', marginTop: '8px',
                background: loading ? 'rgba(236,72,153,0.5)' : '#ec4899',
                border: 'none', borderRadius: '16px', color: 'white', fontSize: '16px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: loading ? 'none' : '0 10px 20px -5px rgba(236,72,153,0.4)'
              }}
              onMouseOver={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#be185d'; } }}
              onMouseOut={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#ec4899'; } }}
            >
              {loading ? (
                <><div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Processing...</>
              ) : 'Sign Up'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
            Already have an account?{' '}
            <button type="button" onClick={onSwitch} style={{
              background: 'none', border: 'none', color: '#f8fafc', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '14px', transition: 'color 0.2s', textDecoration: 'underline'
            }} onMouseOver={e => e.currentTarget.style.color = '#ec4899'} onMouseOut={e => e.currentTarget.style.color = '#f8fafc'}>
              Sign in
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
