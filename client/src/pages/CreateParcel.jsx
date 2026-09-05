import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import parcelsAPI from '../services/parcelsApi';
import { useAuth } from '../context/AuthContext';
import { Package, ShieldAlert, MapPin, Compass } from 'lucide-react';

const CreateParcel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user]);

  const calculatePreviewPrice = () => {
    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) return 0;

    const route = `${pickupLocation} -> ${dropLocation}`.toLowerCase();
    const isIntercity = route.includes('matara') || route.includes('weligama');

    if (isIntercity) {
      if (weight <= 1) return 200;
      return 200 + Math.ceil(weight - 1) * 100;
    } else {
      if (weight <= 1) return 100;
      return Math.ceil(weight) * 200;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await parcelsAPI.createParcel({
        pickupLocation,
        dropLocation,
        weightKg: parseFloat(weightKg)
      });
      navigate('/parcels');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit parcel request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '2rem auto' }}>
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
            <Package size={28} />
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#09090B' }}>
            Send a New Parcel
          </h2>
          <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Provide pickup, destination, and package weight details.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
              Pickup Location
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MapPin size={16} color="#0066FF" style={{ position: 'absolute', left: '12px' }} />
              <select 
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#f4f4f5',
                  appearance: 'none'
                }}
              >
                <option value="">-- Select Pickup Point --</option>
                <option value="Kamburupitiya Campus">Kamburupitiya Campus</option>
                <option value="Matara">Matara</option>
                <option value="Weligama">Weligama</option>
                <option value="Local Area">Local Area (~7km)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
              Dropoff Location
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Compass size={16} color="#16a34a" style={{ position: 'absolute', left: '12px' }} />
              <select 
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                  borderRadius: '8px',
                  border: '1px solid #e4e4e7',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#f4f4f5',
                  appearance: 'none'
                }}
              >
                <option value="">-- Select Destination Point --</option>
                <option value="Kamburupitiya Campus">Kamburupitiya Campus</option>
                <option value="Matara">Matara</option>
                <option value="Weligama">Weligama</option>
                <option value="Local Area">Local Area (~7km)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#09090B' }}>
              Weight (kg)
            </label>
            <input 
              type="number"
              step="0.1"
              placeholder="e.g. 1.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
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

          {parseFloat(weightKg) > 0 && pickupLocation && dropLocation && (
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
                  Delivery Fare Preview
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0284c7' }}>
                  Auto-calculated rate based on weight & route
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1' }}>
                Rs. {calculatePreviewPrice()}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ backgroundColor: '#0066FF', width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Submitting Request...' : 'Create Parcel Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateParcel;
