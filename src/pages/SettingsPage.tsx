import { useState } from 'react';
import { mockUser } from '../data/mockData';

export default function SettingsPage() {
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    transactions: true,
    marketing: false,
    security: true,
    statements: true,
  });

  const [twoFa, setTwoFa] = useState(true);
  const [biometric, setBiometric] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
    return (
      <button
        onClick={onChange}
        style={{
          width: '48px', height: '26px', borderRadius: '13px',
          background: value ? '#6366f1' : 'rgba(255,255,255,0.1)',
          border: 'none', cursor: 'pointer',
          position: 'relative', transition: 'background 0.3s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: '3px', left: value ? '25px' : '3px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'white', transition: 'left 0.3s',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }} />
      </button>
    );
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', padding: '24px',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 20px' }}>{title}</h3>
        {children}
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start', animation: 'fadeIn 0.4s ease' }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Profile */}
        <Section title="Profile Information">
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 800, color: 'white',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}>AP</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Member since {mockUser.joinDate}</div>
              <button style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                color: '#a5b4fc', cursor: 'pointer',
              }}>Change Photo</button>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { id: 'settings-name', label: 'Full Name', value: name, setter: setName, type: 'text' },
              { id: 'settings-email', label: 'Email Address', value: email, setter: setEmail, type: 'email' },
              { id: 'settings-phone', label: 'Phone Number', value: phone, setter: setPhone, type: 'tel' },
            ].map(({ id, label, value, setter, type }) => (
              <div key={id}>
                <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: '6px' }}>{label}</label>
                <input
                  id={id}
                  type={type}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '10px', color: '#f8fafc', fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')}
                />
              </div>
            ))}

            <button
              id="settings-save"
              type="submit"
              style={{
                padding: '12px',
                background: saved ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: saved ? '1px solid rgba(16,185,129,0.4)' : 'none',
                borderRadius: '12px', color: saved ? '#10b981' : 'white',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {saved ? '✓ Changes Saved!' : 'Save Changes'}
            </button>
          </form>
        </Section>

        {/* Danger zone */}
        <div style={{
          background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: '20px', padding: '24px',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f87171', margin: '0 0 16px' }}>⚠️ Danger Zone</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Close Account', desc: 'Permanently delete your account and all data' },
              { label: 'Reset All Settings', desc: 'Revert all customizations to defaults' },
            ].map(({ label, desc }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fca5a5' }}>{label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
                </div>
                <button style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px',
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171', cursor: 'pointer',
                }}>{label.split(' ')[0]}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Notifications */}
        <Section title="Notifications">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, value]) => {
            const labels: Record<string, { label: string; desc: string }> = {
              transactions: { label: 'Transaction Alerts', desc: 'Get notified on every transaction' },
              marketing: { label: 'Promotions & Offers', desc: 'Receive marketing emails and offers' },
              security: { label: 'Security Alerts', desc: 'Login attempts and unusual activity' },
              statements: { label: 'Monthly Statements', desc: 'Auto-send PDF statements' },
            };
            const info = labels[key];
            return (
              <div key={key} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 500 }}>{info.label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{info.desc}</div>
                </div>
                <Toggle value={value} onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))} />
              </div>
            );
          })}
        </Section>

        {/* Security */}
        <Section title="Security & Privacy">
          {[
            { label: '2-Factor Authentication', desc: 'OTP via SMS or authenticator app', value: twoFa, setter: setTwoFa },
            { label: 'Biometric Login', desc: 'Use Face ID or fingerprint to sign in', value: biometric, setter: setBiometric },
          ].map(({ label, desc, value, setter }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div>
                <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
              </div>
              <Toggle value={value} onChange={() => setter(v => !v)} />
            </div>
          ))}
          <button style={{
            width: '100%', padding: '12px', marginTop: '16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px', color: '#a5b4fc', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer',
          }}>
            🔑 Change Password
          </button>
        </Section>

        {/* App info */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
          }}>🏦</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>NovaPay v2.6.0</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>All systems operational · Secured by 256-bit TLS</div>
          </div>
          <button style={{
            marginLeft: 'auto', padding: '8px 14px', borderRadius: '8px', fontSize: '12px',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
            color: '#a5b4fc', cursor: 'pointer',
          }}>Update</button>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
