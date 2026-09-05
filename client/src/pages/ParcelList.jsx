import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import parcelsAPI from '../services/parcelsApi';
import ridesAPI from '../services/ridesApi';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, MapPin, Compass, ShieldAlert, CheckCircle, Search, User, Navigation, Truck, Copy } from 'lucide-react';
import ParcelTrackingModal from '../components/parcels/ParcelTrackingModal';

const ParcelList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [message, setMessage] = useState(null);
  const [riderProfile, setRiderProfile] = useState(null);

  const [activeTrackingCode, setActiveTrackingCode] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  useEffect(() => {
    fetchParcels();
    fetchRiderProfile();
  }, []);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const res = await parcelsAPI.getAllParcels();
      setParcels(res.data);
    } catch (err) {
      console.error('Failed to fetch parcels:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiderProfile = async () => {
    if (!user) return;
    try {
      const res = await ridesAPI.getRiderProfile();
      setRiderProfile(res.data);
    } catch (err) {
      console.error('Rider lookup error:', err);
    }
  };

  const handleAssignToMe = async (parcelId) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!riderProfile) {
      setMessage({ type: 'error', text: 'You must register as a Rider first. Go to Rides page to register.' });
      return;
    }
    try {
      await parcelsAPI.assignParcel(parcelId, riderProfile.id);
      setMessage({ type: 'success', text: 'Delivery assigned to you successfully! Go to details to contact the sender.' });
      fetchParcels();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Assignment failed' });
    }
  };

  const handleOpenTracking = (code) => {
    setActiveTrackingCode(code);
    setIsTrackingModalOpen(true);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingCodeInput.trim()) {
      handleOpenTracking(trackingCodeInput.trim());
    }
  };

  const filteredParcels = parcels.filter(parcel =>
    parcel.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
    parcel.dropLocation.toLowerCase().includes(search.toLowerCase()) ||
    (parcel.trackingCode && parcel.trackingCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '1rem 0' }}>
      
      {/* Header section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 800, color: '#09090B' }}>
            Campus Parcel Delivery & Live Tracking
          </h1>
          <p style={{ color: '#71717a' }}>Send items across campus or track package delivery status in real-time.</p>
        </div>
        <Link to="/parcels/create" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
          <Plus size={18} />
          <span>Send a Parcel</span>
        </Link>
      </div>

      {/* Customer Live Tracking Bar Banner */}
      <div className="clean-panel" style={{
        padding: '1.25rem',
        marginBottom: '2rem',
        backgroundColor: '#f0f7ff',
        border: '1px solid #bae6fd',
        borderRadius: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Truck size={22} color="#0066FF" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
            Track Your Package Delivery
          </h3>
        </div>

        <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{
            flex: 1,
            minWidth: '240px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #93c5fd',
            borderRadius: '8px',
            padding: '0.4rem 0.75rem',
            gap: '0.5rem'
          }}>
            <Navigation size={18} color="#0284c7" />
            <input
              type="text"
              placeholder="Enter Tracking Code (e.g. TRK-892347 or TRK-415902)..."
              value={trackingCodeInput}
              onChange={(e) => setTrackingCodeInput(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#09090B'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0066FF', padding: '0.5rem 1.5rem' }}>
            <Search size={16} />
            <span>Track Live</span>
          </button>
        </form>
      </div>

      {/* Notifications */}
      {message && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: message.type === 'success' ? '#15803d' : '#b91c1c',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldAlert size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="clean-panel" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        marginBottom: '2rem',
        gap: '0.5rem'
      }}>
        <Search size={20} color="#71717a" />
        <input 
          type="text"
          placeholder="Filter by pickup location, destination, or tracking code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            padding: '0.5rem 0',
            background: 'transparent'
          }}
        />
      </div>

      {/* Grid of Parcels */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>
          Loading active parcel requests...
        </div>
      ) : filteredParcels.length === 0 ? (
        <div className="clean-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Package size={48} style={{ color: '#a1a1aa', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Parcels Requested</h3>
          <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>Be the first to list a parcel request today!</p>
          <Link to="/parcels/create" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
            <Plus size={18} />
            <span>Send a Parcel</span>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredParcels.map((parcel) => (
            <div key={parcel.id} className="clean-panel" style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/parcels/${parcel.id}`)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                {/* Header Status & Price */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge" style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: parcel.status === 'pending' ? '#fff7ed' : parcel.status === 'in_transit' ? '#fef3c7' : parcel.status === 'assigned' ? '#eff6ff' : '#f0fdf4',
                    color: parcel.status === 'pending' ? '#c2410c' : parcel.status === 'in_transit' ? '#b45309' : parcel.status === 'assigned' ? '#1d4ed8' : '#15803d'
                  }}>
                    {parcel.status === 'pending' && 'Pending Rider'}
                    {parcel.status === 'assigned' && 'Assigned'}
                    {parcel.status === 'in_transit' && 'In Transit'}
                    {parcel.status === 'completed' && 'Delivered'}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090B' }}>
                    Rs. {parcel.price}
                  </span>
                </div>

                {/* Tracking Code Badge */}
                {parcel.trackingCode && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f8fafc',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem'
                  }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Code: <strong style={{ color: '#0f172a' }}>{parcel.trackingCode}</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTracking(parcel.trackingCode);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0066FF',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <Navigation size={12} />
                      <span>Track Live</span>
                    </button>
                  </div>
                )}

                {/* Locations Flow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#0066FF" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{parcel.pickupLocation}</span>
                  </div>
                  <div style={{ paddingLeft: '0.5rem', borderLeft: '2px dashed #d4d4d8', height: '12px', marginLeft: '7px' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={16} color="#16a34a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{parcel.dropLocation}</span>
                  </div>
                </div>

                {/* Sender & Weight */}
                <div style={{
                  padding: '0.85rem',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  color: '#71717a'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <User size={14} />
                    <span>Sender: <strong>{parcel.senderProfile?.name || 'Student'}</strong></span>
                  </div>
                  <div>
                    Weight: <strong>{parcel.weightKg} kg</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <Link to={`/parcels/${parcel.id}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>
                  View Details
                </Link>
                {parcel.status === 'pending' && user?.id !== parcel.senderId && (
                  <button 
                    onClick={() => handleAssignToMe(parcel.id)}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.5rem', backgroundColor: '#0066FF' }}
                  >
                    Deliver This
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Tracking Modal */}
      {isTrackingModalOpen && (
        <ParcelTrackingModal
          initialTrackingCode={activeTrackingCode}
          onClose={() => setIsTrackingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ParcelList;
