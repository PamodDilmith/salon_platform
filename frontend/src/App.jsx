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
import CustomerManagement from './pages/CustomerManagement';
import CustomerSupportTickets from './pages/CustomerSupportTickets';

// Customer / Public components
import LandingPage from './pages/LandingPage';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerSupportPage from './pages/CustomerSupportPage';

// Beautician components
import BeauticianRegister from './pages/BeauticianRegister';
import BeauticianDashboard from './pages/BeauticianDashboard';
import BeauticianList from './pages/BeauticianList';
import BeauticianProfilePublic from './pages/BeauticianProfilePublic';

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
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/customer-tickets" element={<CustomerSupportTickets />} />
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
      
      {/* Beautician Public Routes */}
      <Route path="/beautician-register" element={<BeauticianRegister />} />
      
      {/* Protected Customer Routes */}
      <Route path="/dashboard" element={
        <ProtectedCustomerRoute>
          <CustomerDashboard />
        </ProtectedCustomerRoute>
      } />
      <Route path="/dashboard/support" element={
        <ProtectedCustomerRoute>
          <CustomerSupportPage />
        </ProtectedCustomerRoute>
      } />
      <Route path="/beauticians" element={
        <ProtectedCustomerRoute>
          <BeauticianList />
        </ProtectedCustomerRoute>
      } />
      <Route path="/beauticians/:id" element={
        <ProtectedCustomerRoute>
          <BeauticianProfilePublic />
        </ProtectedCustomerRoute>
      } />

      {/* Beautician Dashboard Route */}
      <Route path="/beautician-dashboard" element={<BeauticianDashboard />} />

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
