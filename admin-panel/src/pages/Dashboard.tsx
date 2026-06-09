import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Activity, Bell } from 'lucide-react';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (!token || !user) {
      navigate('/login');
    } else {
      setAdminUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      navigate('/login');
    }
  };

  if (!adminUser) return null;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2><LayoutDashboard className="text-accent-primary" /> Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-link active">
            <Activity size={20} />
            Overview
          </a>
          <a href="#" className="nav-link">
            <Users size={20} />
            User Management
          </a>
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
      </main>
    </div>
  );
};

export default Dashboard;
