import React, { useState, useEffect } from 'react';
import { listingsAPI } from '../../services/api';
import { ShieldCheck, Users, ShoppingBag, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await listingsAPI.getAll({ status: 'all' });
      setListings(res.data);
    } catch (error) {
      console.error('Failed to fetch listings for admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Admin Action: Delete this listing from campus marketplace?')) return;
    try {
      await listingsAPI.delete(id);
      fetchListings();
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Admin Portal...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <ShieldCheck size={28} color="var(--accent-primary)" />
        <h2 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          Campus Platform Administration
        </h2>
      </div>

      {/* Stats KPI Widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: 'Total Marketplace Items', val: listings.length, icon: <ShoppingBag size={20} color="var(--accent-primary)" /> },
          { label: 'Verified Campus Users', val: '450+', icon: <Users size={20} color="var(--accent-cyan)" /> },
          { label: 'Successful Bookings', val: '1,280', icon: <CheckCircle size={20} color="var(--accent-emerald)" /> },
          { label: 'Moderation Flags', val: '0 Pending', icon: <AlertTriangle size={20} color="var(--accent-amber)" /> }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{kpi.label}</span>
              {kpi.icon}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* All Listings Moderation Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Active Marketplace Moderation</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Title</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Owner</th>
                <th style={{ padding: '0.75rem' }}>Price</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem', color: '#fff', fontWeight: 600 }}>{item.title}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge badge-${item.category}`}>{item.category}</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.owner?.name || 'Student'}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    Rs. {item.price}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteListing(item._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} /> Moderation Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
