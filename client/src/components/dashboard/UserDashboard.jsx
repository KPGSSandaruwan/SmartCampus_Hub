import React, { useState, useEffect } from 'react';
import { listingsAPI, ordersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Package, 
  Car, 
  Key, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Send,
  Inbox,
  List
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'my-requests' | 'my-listings'
  const [myListings, setMyListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsRes, requestsRes, incomingRes] = await Promise.all([
        listingsAPI.getAll({ status: 'all' }),
        ordersAPI.getMyRequests(),
        ordersAPI.getMyIncoming()
      ]);

      // Filter listings owned by user
      const userListings = listingsRes.data.filter(l => l.owner?._id === user._id || l.owner === user._id);
      setMyListings(userListings);
      setMyRequests(requestsRes.data);
      setIncomingRequests(incomingRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await listingsAPI.delete(listingId);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Dashboard Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'incoming', label: `Incoming Requests (${incomingRequests.length})`, icon: <Inbox size={18} /> },
          { id: 'my-requests', label: `My Sent Requests (${myRequests.length})`, icon: <Send size={18} /> },
          { id: 'my-listings', label: `My Active Listings (${myListings.length})`, icon: <List size={18} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn"
            style={{
              background: activeTab === tab.id ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: activeTab === tab.id ? 'none' : '1px solid var(--border-color)',
              fontSize: '0.88rem'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Incoming Requests Tab */}
      {activeTab === 'incoming' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Requests from Other Students</h3>
          {incomingRequests.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No incoming booking requests yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incomingRequests.map((req) => (
                <div 
                  key={req._id}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span className={`badge badge-${req.listing?.category || 'rides'}`}>
                        {req.listing?.category}
                      </span>
                      <span className={`badge badge-status-${req.status}`}>{req.status}</span>
                    </div>
                    <h4 style={{ color: '#fff', fontSize: '1rem' }}>{req.listing?.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <strong>Requester:</strong> {req.requester?.name} ({req.requester?.email})
                    </p>
                    {req.notes && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                        "{req.notes}"
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      Rs. {req.totalPrice}
                    </div>
                    {req.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'accepted')}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'rejected')}
                          className="btn btn-danger btn-sm"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Requests Tab */}
      {activeTab === 'my-requests' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Bookings & Service Requests Sent</h3>
          {myRequests.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You haven't placed any requests yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myRequests.map((req) => (
                <div 
                  key={req._id}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className={`badge badge-status-${req.status}`} style={{ marginBottom: '0.4rem' }}>{req.status}</span>
                    <h4 style={{ color: '#fff', fontSize: '1rem' }}>{req.listing?.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Provider: {req.provider?.name || 'Student'} ({req.provider?.email})
                    </p>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    Rs. {req.totalPrice}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Listings Tab */}
      {activeTab === 'my-listings' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>My Created Listings</h3>
          {myListings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You have no active listings posted.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {myListings.map((item) => (
                <div 
                  key={item._id}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span className={`badge badge-${item.category}`}>{item.category}</span>
                      <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>Rs. {item.price}</span>
                    </div>
                    <h4 style={{ color: '#fff', fontSize: '0.98rem' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{item.location}</p>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleDeleteListing(item._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
