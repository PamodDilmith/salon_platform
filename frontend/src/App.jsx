import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Admin components
import Sidebar from './components/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import Registrations from './pages/Registrations';
import Categories from './pages/Categories';
import Subscriptions from './pages/Subscriptions';
import Reviews from './pages/Reviews';
import SupportTickets from './pages/SupportTickets';

// Customer / Public components
import LandingPage from './pages/LandingPage';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';

// --- Admin Layout (requires admin auth) ---
const AdminLayout = () => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)',
      }}>
        <span>Initializing Admin Console...</span>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/support" element={<SupportTickets />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// --- Customer Protected Route ---
const ProtectedCustomerRoute = ({ children }) => {
  const { customer, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)',
      }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// --- Main App ---
const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<CustomerRegister />} />
      <Route path="/login" element={<CustomerLogin />} />

      {/* Protected Customer Route */}
      <Route path="/dashboard" element={
        <ProtectedCustomerRoute>
          <CustomerDashboard />
        </ProtectedCustomerRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
