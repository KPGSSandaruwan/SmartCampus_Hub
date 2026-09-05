import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ridesAPI from '../services/ridesApi';
import { useAuth } from '../context/AuthContext';
import { Car, Plus, MapPin, Compass, DollarSign, User, Clock, ArrowRight, Search, ShieldAlert } from 'lucide-react';

const RideList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const res = await ridesAPI.getAllRides();
      setRides(res.data);
    } catch (err) {
      console.error('Failed to fetch rides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async (rideId) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      await ridesAPI.requestRide(rideId);
      setMessage({ type: 'success', text: 'Ride request submitted successfully! You can contact the rider.' });
      fetchRides();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to request ride';
      setMessage({ type: 'error', text: errMsg });
    }
  };

  const filteredRides = rides.filter(ride => 
    ride.startLocation.toLowerCase().includes(search.toLowerCase()) ||
    ride.endLocation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem 0' }}>
      {/* Header section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 800, color: '#09090B' }}>
            PickRide
          </h1>
          <p style={{ color: '#71717a' }}>Find a quick bike/car ride or list a route to share travel costs.</p>
        </div>
        <Link to="/rides/create" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
          <Plus size={18} />
          <span>Post a Ride</span>
        </Link>
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

      {/* Search and Filters */}
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
          placeholder="Search by start or destination location..."
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

      {/* Grid of rides */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>
          Loading active rides...
        </div>
      ) : filteredRides.length === 0 ? (
        <div className="clean-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Car size={48} style={{ color: '#a1a1aa', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Rides Available</h3>
          <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>Be the first to list a bike ride route today!</p>
          <Link to="/rides/create" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
            <Plus size={18} />
            <span>Post a Ride</span>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredRides.map((ride) => (
            <div key={ride.id} className="clean-panel" style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/rides/${ride.id}`)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                {/* Route Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: '#e0e7ff',
                    color: '#0066FF'
                  }}>
                    Active Ride
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090B' }}>
                    Rs. {ride.price}
                  </span>
                </div>

                {/* Locations Flow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#0066FF" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ride.startLocation}</span>
                  </div>
                  <div style={{ paddingLeft: '0.5rem', borderLeft: '2px dashed #d4d4d8', height: '12px', marginLeft: '7px' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={16} color="#16a34a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ride.endLocation}</span>
                  </div>
                </div>

                {/* Bike & Rider details */}
                <div style={{
                  padding: '0.85rem',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#71717a' }}>
                    <User size={14} />
                    <span>Bike: <strong>{ride.riderDetails?.bikeModel}</strong> ({ride.riderDetails?.bikeNumber})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717a' }}>
                    <Clock size={14} />
                    <span>Distance: <strong>{ride.distanceKm} km</strong></span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <Link to={`/rides/${ride.id}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>
                  View Details
                </Link>
                {user?.id !== ride.riderDetails?.userId && (
                  <button 
                    onClick={() => handleRequestRide(ride.id)} 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '0.5rem', backgroundColor: '#0066FF' }}
                  >
                    Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideList;
