import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from '../components/dashboard/UserDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { ShieldCheck, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)' }}>Please log in to view your requests and active campus listings.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: '#fff' }}>
            {user.role === 'admin' ? 'Admin Dashboard' : `Welcome, ${user.name}`}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Campus ID: {user.universityId} | Role: <span style={{ textTransform: 'capitalize', color: 'var(--accent-primary)', fontWeight: 700 }}>{user.role}</span>
          </p>
        </div>
      </div>

      {user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default Dashboard;
