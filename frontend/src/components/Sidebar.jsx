import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getApiMode, setApiMode } from '../api';
import {
  LayoutDashboard,
  UserCheck,
  FolderHeart,
  CreditCard,
  Star,
  LifeBuoy,
  LogOut,
  Database,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { admin, logout } = useContext(AuthContext);
  const [apiMode, setApiModeState] = useState(getApiMode());

  useEffect(() => {
    const handleModeChange = () => {
      setApiModeState(getApiMode());
    };
    window.addEventListener('api_mode_changed', handleModeChange);
    return () => window.removeEventListener('api_mode_changed', handleModeChange);
  }, []);

  const toggleApiMode = () => {
    const newMode = apiMode === 'live' ? 'mock' : 'live';
    setApiMode(newMode);
    setApiModeState(newMode);
    window.dispatchEvent(new Event('api_mode_changed'));
    window.location.reload(); // Refresh the page to reload state
  };

  return (
    <div className="sidebar-container">
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)',
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <ShieldCheck size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Aura<span style={{ color: 'var(--accent)' }}>Glow</span>
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Admin Console
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/admin/registrations"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <UserCheck size={18} />
          <span>Registrations</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <FolderHeart size={18} />
          <span>Categories</span>
        </NavLink>

        <NavLink
          to="/admin/subscriptions"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <CreditCard size={18} />
          <span>Subscriptions</span>
        </NavLink>

        <NavLink
          to="/admin/reviews"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Star size={18} />
          <span>User Reviews</span>
        </NavLink>

        <NavLink
          to="/admin/support"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LifeBuoy size={18} />
          <span>Support Desk</span>
        </NavLink>
      </nav>

      {/* Footer Info & Logout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        {/* Toggle Mode */}
        <div style={{
          background: apiMode === 'live' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(139, 92, 246, 0.05)',
          border: '1px dashed ' + (apiMode === 'live' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)'),
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: apiMode === 'live' ? 'var(--success)' : 'var(--accent)', fontWeight: 600 }}>
            <Database size={14} />
            <span>{apiMode === 'live' ? 'Live DB Mode' : 'Sandbox Sandbox'}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
            {apiMode === 'live' ? 'Connecting to live MongoDB.' : 'Using local browser store.'}
          </p>
          <button
            onClick={toggleApiMode}
            className="btn btn-sm"
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              width: '100%',
              display: 'block',
              textAlign: 'center'
            }}
          >
            Switch to {apiMode === 'live' ? 'Sandbox' : 'Live DB'}
          </button>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--accent)'
          }}>
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '0.85rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {admin?.name || 'Administrator'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
              {admin?.email || 'admin@salon.com'}
            </span>
          </div>
          <button
            onClick={logout}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Styled JSX for the NavLink transitions */}
      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          font-weight: 500;
          font-size: 0.95rem;
        }
        .sidebar-link:hover {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.03);
          padding-left: 1.25rem;
        }
        .sidebar-link.active {
          color: white;
          background-color: var(--bg-surface);
          border-left: 3px solid var(--accent);
          box-shadow: inset 5px 0 10px -5px var(--accent-glow);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
