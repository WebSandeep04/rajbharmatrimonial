import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Users, Settings, LogOut, Activity, Bell, Database } from 'lucide-react';
import api from '../services/api';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user: adminUser, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  if (!adminUser) return null;

  const isOverview = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  const isUsers = location.pathname.includes('/dashboard/users');
  const isMasters = location.pathname.includes('/dashboard/masters');

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2><LayoutDashboard className="text-accent-primary" /> Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-link ${isOverview ? 'active' : ''}`}>
            <Activity size={20} />
            Overview
          </Link>
          <Link to="/dashboard/users" className={`nav-link ${isUsers ? 'active' : ''}`}>
            <Users size={20} />
            User Management
          </Link>
          <Link to="/dashboard/masters" className={`nav-link ${isMasters ? 'active' : ''}`}>
            <Database size={20} />
            Master Data
          </Link>
          <a href="#" className="nav-link">
            <Settings size={20} />
            Settings
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div>
            <h1>Welcome back, {adminUser.name}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your platform today.</p>
          </div>
          <div className="user-menu">
            <button className="btn-icon">
              <Bell size={20} />
            </button>
            <button className="btn-icon" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {isOverview ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p>12,345</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Activity size={24} />
                </div>
                <div className="stat-info">
                  <h3>Active Sessions</h3>
                  <p>1,234</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Activity</h2>
              <div style={{ color: 'var(--text-secondary)' }}>
                No recent activity to display.
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
