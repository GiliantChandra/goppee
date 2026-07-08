import { useState, useEffect } from 'react';
import type { PageName } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransferPage from './pages/TransferPage';
import TransactionsPage from './pages/TransactionsPage';
import CardsPage from './pages/CardsPage';
import SettingsPage from './pages/SettingsPage';
import LoansPage from './pages/LoansPage';
import InvestmentsPage from './pages/InvestmentsPage';
import PocketsPage from './pages/PocketsPage';
import ValasPage from './pages/ValasPage';
import TopUpPage from './pages/TopUpPage';

function AppInner() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageName>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Loading state while restoring session from stored token
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#020617',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{
          width: '48px', height: '48px', border: '3px solid rgba(99,102,241,0.3)',
          borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ color: '#64748b', fontSize: '14px' }}>Restoring session...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  function renderPage() {
    switch (currentPage) {
      case 'dashboard':    return <DashboardPage onNavigate={setCurrentPage} />;
      case 'transfer':     return <TransferPage />;
      case 'transactions': return <TransactionsPage />;
      case 'cards':        return <CardsPage />;
      case 'settings':     return <SettingsPage />;
      case 'loans':        return <LoansPage />;
      case 'investments':  return <InvestmentsPage />;
      case 'pockets':      return <PocketsPage />;
      case 'valas':        return <ValasPage />;
      case 'topup':        return <TopUpPage />;
      default:             return <DashboardPage onNavigate={setCurrentPage} />;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={logout}
        />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
