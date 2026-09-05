import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import parcelsAPI from '../services/parcelsApi';
import ridesAPI from '../services/ridesApi';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, Compass, ShieldAlert, CheckCircle, Phone, MessageSquare, User, Clock } from 'lucide-react';

const ParcelDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riderProfile, setRiderProfile] = useState(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchParcelDetails();
    fetchRiderProfile();
  }, [id]);

  const fetchParcelDetails = async () => {
    setLoading(true);
    try {
      const res = await parcelsAPI.getParcelById(id);
      setParcel(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load parcel details');
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
      console.error('Failed to get rider profile:', err);
    }
  };

  const handleAssignToMe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!riderProfile) {
      setError('You must register as a Rider first. Navigate to the Rides page to register.');
      return;
    }
    try {
      await parcelsAPI.assignParcel(parcel.id, riderProfile.id);
      fetchParcelDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign parcel');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await parcelsAPI.updateParcelStatus(parcel.id, newStatus);
      fetchParcelDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update parcel status');
    }
  };

  const handleCompleteDelivery = async () => {
    try {
      await parcelsAPI.completeDelivery(parcel.id);
      fetchParcelDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete delivery');
    }
  };

  const handleCopyCode = () => {
    if (!parcel?.trackingCode) return;
    navigator.clipboard.writeText(parcel.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = (phone) => {
    return phone ? phone.replace(/[^\d+]/g, '') : '';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>Loading parcel details...</div>;
  }

  if (!parcel) {
    return (
      <div className="clean-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <ShieldAlert size={48} style={{ color: '#dc2626', marginBottom: '1rem' }} />
        <h3>Parcel Request Not Found</h3>
        <p style={{ color: '#71717a', margin: '0.5rem 0 1.5rem 0' }}>The requested parcel does not exist or has been removed.</p>
        <Link to="/parcels" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>Back to Parcels</Link>
      </div>
    );
  }

  const isSender = user && user.id === parcel.senderId;
  const isAssignedRider = user && parcel.assignment?.riderDetails && user.id === parcel.assignment.riderDetails.userId;

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto' }}>
      <div className="clean-panel" style={{ padding: '2rem' }}>
        
        {/* Header Route Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge" style={{
                backgroundColor: parcel.status === 'pending' ? '#fff7ed' : parcel.status === 'in_transit' ? '#fef3c7' : parcel.status === 'assigned' ? '#eff6ff' : '#f0fdf4',
                color: parcel.status === 'pending' ? '#c2410c' : parcel.status === 'in_transit' ? '#b45309' : parcel.status === 'assigned' ? '#1d4ed8' : '#15803d',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                {parcel.status === 'pending' && 'Pending Rider'}
                {parcel.status === 'assigned' && 'Rider Assigned'}
                {parcel.status === 'in_transit' && 'In Transit'}
                {parcel.status === 'completed' && 'Delivered'}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>Posted by {parcel.senderProfile?.name || 'Sender'}</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#09090B', margin: 0 }}>
              Parcel Delivery Request
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#09090B' }}>Rs. {parcel.price}</span>
            <div style={{ fontSize: '0.85rem', color: '#71717a' }}>Cash on Delivery</div>
          </div>
        </div>

        {/* Tracking Code Banner */}
        {parcel.trackingCode && (
          <div style={{
            padding: '1rem',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Tracking Code</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e3a8a', fontFamily: "'Outfit', sans-serif" }}>
                {parcel.trackingCode}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#ffffff' }}
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              <span>{copied ? 'Copied Code' : 'Copy Tracking Code'}</span>
            </button>
          </div>
        )}

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

        {/* Locations Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#fafafa', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={18} color="#0066FF" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Pickup From</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#09090B' }}>{parcel.pickupLocation}</div>
            </div>
          </div>
          <div style={{ paddingLeft: '0.5rem', borderLeft: '2px dashed #d4d4d8', height: '20px', marginLeft: '8px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass size={18} color="#16a34a" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Dropoff To</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#09090B' }}>{parcel.dropLocation}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#71717a', borderTop: '1px solid #e4e4e7', paddingTop: '0.5rem' }}>
            <Clock size={14} />
            <span>Package Weight: <strong>{parcel.weightKg} kg</strong></span>
          </div>
        </div>

        {/* Sender details */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#09090B' }}>Sender Details</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid #e4e4e7', borderRadius: '10px', marginBottom: '2rem' }}>
          <img 
            src={parcel.senderProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt="Sender" 
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#09090B' }}>{parcel.senderProfile?.name || 'Sender Student'}</div>
            <div style={{ fontSize: '0.85rem', color: '#71717a' }}>UniConnect Verified Student</div>
          </div>
          {(isSender || isAssignedRider) && parcel.senderProfile?.phone && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <a href={`https://wa.me/${cleanPhone(parcel.senderProfile.phone)}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: '#fff', padding: '0.4rem 0.6rem' }}>
                <MessageSquare size={16} />
              </a>
              <a href={`tel:${parcel.senderProfile.phone}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
                <Phone size={16} />
              </a>
            </div>
          )}
        </div>

        {/* Assigned Rider details */}
        {parcel.status !== 'pending' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#09090B' }}>Assigned Delivery Rider</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '10px', marginBottom: '2rem' }}>
              <img 
                src={parcel.assignment?.riderDetails?.userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt="Rider" 
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#0369a1' }}>{parcel.assignment?.riderDetails?.userProfile?.name || 'Delivery Rider'}</div>
                <div style={{ fontSize: '0.85rem', color: '#0284c7' }}>
                  Bike: <strong>{parcel.assignment?.riderDetails?.bikeModel}</strong> ({parcel.assignment?.riderDetails?.bikeNumber})
                </div>
              </div>
              {(isSender || isAssignedRider) && parcel.assignment?.riderDetails?.userProfile?.phone && (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <a href={`https://wa.me/${cleanPhone(parcel.assignment.riderDetails.userProfile.phone)}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: '#fff', padding: '0.4rem 0.6rem' }}>
                    <MessageSquare size={16} />
                  </a>
                  <a href={`tel:${parcel.assignment.riderDetails.userProfile.phone}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
                    <Phone size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        {parcel.status === 'pending' && !isSender && (
          <button onClick={handleAssignToMe} className="btn btn-primary" style={{ backgroundColor: '#0066FF', width: '100%' }}>
            Accept Delivery & Assign to Me
          </button>
        )}

        {parcel.status === 'assigned' && isAssignedRider && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleUpdateStatus('in_transit')} className="btn btn-primary" style={{ backgroundColor: '#f59e0b', flex: 1 }}>
              Mark as Picked Up & In Transit
            </button>
            <button onClick={() => handleUpdateStatus('completed')} className="btn btn-primary" style={{ backgroundColor: '#16a34a', flex: 1 }}>
              Mark as Delivered
            </button>
          </div>
        )}

        {parcel.status === 'in_transit' && isAssignedRider && (
          <button onClick={() => handleUpdateStatus('completed')} className="btn btn-primary" style={{ backgroundColor: '#16a34a', width: '100%' }}>
            Mark Parcel as Delivered
          </button>
        )}

        {parcel.status === 'completed' && (
          <div style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '10px', textAlign: 'center', fontWeight: 700 }}>
            <CheckCircle size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Parcel delivered successfully!
          </div>
        )}

        {parcel.status === 'pending' && isSender && (
          <div style={{ padding: '1rem', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px', textAlign: 'center', color: '#71717a', fontSize: '0.9rem' }}>
            Waiting for a registered campus rider to accept your delivery request...
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelDetails;
