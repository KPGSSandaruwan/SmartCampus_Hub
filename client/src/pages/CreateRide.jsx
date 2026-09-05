import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ridesAPI from '../services/ridesApi';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldAlert, KeyRound, MapPin, Compass, ArrowRight, DollarSign } from 'lucide-react';

const CreateRide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [riderProfile, setRiderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rider Registration State
  const [bikeNumber, setBikeNumber] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Post Ride State
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    checkRiderProfile();
  }, [user]);

  const checkRiderProfile = async () => {
    setLoading(true);
    try {
      const res = await ridesAPI.getRiderProfile();
      setRiderProfile(res.data);
    } catch (err) {
      console.error('Failed to get rider profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRider = async (e) => {
    e.preventDefault();
    setError(null);
    setRegLoading(true);
    try {
      const res = await ridesAPI.registerRider({ bikeNumber, bikeModel, licenseNumber });
      setRiderProfile(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Rider registration failed.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleCreateRide = async (e) => {
    e.preventDefault();
    setError(null);
    setPostLoading(true);
    try {
      await ridesAPI.createRide({
        startLocation,
        endLocation,
        distanceKm: parseFloat(distanceKm)
      });
      navigate('/rides');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post ride');
    } finally {
      setPostLoading(false);
    }
  };

  const calculatePreviewPrice = (distStr) => {
    const dist = parseFloat(distStr);
    if (isNaN(dist) || dist <= 0) return 0;
    if (dist <= 1) return 40;
    return 40 + Math.ceil(dist - 1) * 20;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>
        Checking Rider Profile Status...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px', margin: '2rem auto' }}>
      {!riderProfile ? (
        <div className="clean-panel" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0e7ff',
              color: '#0066FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <KeyRound size={28} />
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#09090B' }}>
              Register as a Rider
            </h2>
            <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Before you can post rides or pick up parcel deliveries, please register your bike details.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegisterRider} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
                Bike Model Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. Honda CD125 / Yamaha FZ"
                value={bikeModel}
                onChange={(e) => setBikeModel(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#f4f4f5'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
                Bike Number Plate
              </label>
              <input 
                type="text" 
                placeholder="e.g. WP BCX-1234"
                value={bikeNumber}
                onChange={(e) => setBikeNumber(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#f4f4f5'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
                Driving License Number
              </label>
              <input 
                type="text" 
                placeholder="e.g. B1234567"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#f4f4f5'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={regLoading}
              style={{ backgroundColor: '#0066FF', width: '100%', marginTop: '0.5rem' }}
            >
              {regLoading ? 'Registering...' : 'Complete Rider Registration'}
            </button>
          </form>
        </div>
      ) : (
        <div className="clean-panel" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0e7ff',
              color: '#0066FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Car size={28} />
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#09090B' }}>
              Post a New Ride
            </h2>
            <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Set your route details. Price will be automatically calculated based on distance.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateRide} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
                Pickup Location
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={16} color="#0066FF" style={{ position: 'absolute', left: '12px' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Kamburupitiya Campus"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e4e4e7',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#f4f4f5'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
                Destination Location
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Compass size={16} color="#16a34a" style={{ position: 'absolute', left: '12px' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Matara Bus Stand"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e4e4e7',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#f4f4f5'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
                Estimated Route Distance (km)
              </label>
              <input 
                type="number" 
                step="0.1"
                placeholder="e.g. 21"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#f4f4f5'
                }}
              />
            </div>

            {parseFloat(distanceKm) > 0 && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>
                    Calculated Fare
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#0284c7' }}>
                    Base: Rs. 40 + Rs. 20/additional km
                  </div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1' }}>
                  Rs. {calculatePreviewPrice(distanceKm)}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={postLoading}
              style={{ backgroundColor: '#0066FF', width: '100%', marginTop: '0.5rem' }}
            >
              {postLoading ? 'Posting...' : 'Post Ride Offer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateRide;
