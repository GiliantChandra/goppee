import { useState } from 'react';
import type { PageName } from './types';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageName>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
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
          onLogout={() => setIsLoggedIn(false)}
        />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
