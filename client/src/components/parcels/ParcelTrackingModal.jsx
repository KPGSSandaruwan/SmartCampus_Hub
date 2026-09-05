import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Compass, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  User, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  Navigation
} from 'lucide-react';
import parcelsAPI from '../../services/parcelsApi';

const ParcelTrackingModal = ({ initialTrackingCode = '', onClose }) => {
  const [trackingCodeInput, setTrackingCodeInput] = useState(initialTrackingCode);
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTrackingCode) {
      handleSearch(initialTrackingCode);
    }
  }, [initialTrackingCode]);

  const handleSearch = async (codeToSearch) => {
    const query = codeToSearch || trackingCodeInput;
    if (!query || !query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await parcelsAPI.trackParcel(query.trim());
      setParcel(res.data);
    } catch (err) {
      setParcel(null);
      setError(err.response?.data?.message || 'Parcel tracking code not found. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
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

  // Timeline Step Calculations
  const getStepStatus = (stepName) => {
    if (!parcel) return 'upcoming';
    const status = parcel.status;

    if (status === 'completed') {
      return 'completed';
    }

    if (status === 'in_transit') {
      if (stepName === 'created' || stepName === 'assigned' || stepName === 'in_transit') return 'completed';
      return 'upcoming';
    }

    if (status === 'assigned') {
      if (stepName === 'created' || stepName === 'assigned') return 'completed';
      return 'upcoming';
    }

    if (status === 'pending') {
      if (stepName === 'created') return 'completed';
      return 'upcoming';
    }

    return 'upcoming';
  };

  const getActiveStepIndex = () => {
    if (!parcel) return 0;
    switch (parcel.status) {
      case 'pending': return 1;
      case 'assigned': return 2;
      case 'in_transit': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(9, 9, 11, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div className="clean-panel" style={{
        width: '100%',
        maxWidth: '640px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e4e4e7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#0066FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#09090B', margin: 0 }}>
                Parcel Live Tracker
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#71717a' }}>
                Real-time campus delivery monitoring
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#71717a',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Tracking Search Input Form */}
          <form onSubmit={handleFormSubmit} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              backgroundColor: '#f4f4f5',
              padding: '0.4rem 0.4rem 0.4rem 1rem',
              borderRadius: '10px',
              border: '1px solid #e4e4e7'
            }}>
              <Search size={18} color="#71717a" />
              <input
                type="text"
                placeholder="Enter Tracking Code (e.g. TRK-892347)..."
                value={trackingCodeInput}
                onChange={(e) => setTrackingCodeInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#09090B',
                  fontWeight: 600
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ backgroundColor: '#0066FF', padding: '0.5rem 1.25rem' }}
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {parcel && (
            <div>
              {/* Top Details Card */}
              <div style={{
                padding: '1.25rem',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>
                      Tracking Number
                    </span>
                    <button
                      onClick={handleCopyCode}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0066FF',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontWeight: 600
                      }}
                    >
                      {copied ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e3a8a', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.5px' }}>
                    {parcel.trackingCode || `TRK-000${parcel.id}`}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    backgroundColor: parcel.status === 'completed' ? '#dcfce7' : parcel.status === 'in_transit' ? '#fef3c7' : parcel.status === 'assigned' ? '#dbeafe' : '#f3f4f6',
                    color: parcel.status === 'completed' ? '#15803d' : parcel.status === 'in_transit' ? '#b45309' : parcel.status === 'assigned' ? '#1d4ed8' : '#4b5563',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                      boxShadow: '0 0 8px currentColor'
                    }}></span>
                    <span>
                      {parcel.status === 'pending' && 'Pending Rider'}
                      {parcel.status === 'assigned' && 'Rider Assigned'}
                      {parcel.status === 'in_transit' && 'In Transit'}
                      {parcel.status === 'completed' && 'Delivered'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>
                    Cash on Delivery: <strong>Rs. {parcel.price}</strong>
                  </div>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#09090B', marginBottom: '1rem' }}>
                  Delivery Progress Timeline
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                  {/* Step 1: Requested */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: getActiveStepIndex() >= 1 ? '#0066FF' : '#e4e4e7',
                      color: getActiveStepIndex() >= 1 ? '#ffffff' : '#a1a1aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem auto',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      {getActiveStepIndex() > 1 ? <CheckCircle2 size={20} /> : '1'}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: getActiveStepIndex() >= 1 ? '#09090B' : '#a1a1aa' }}>
                      Request Created
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Pending</div>
                  </div>

                  {/* Step 2: Rider Assigned */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: getActiveStepIndex() >= 2 ? '#0066FF' : '#e4e4e7',
                      color: getActiveStepIndex() >= 2 ? '#ffffff' : '#a1a1aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem auto',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      {getActiveStepIndex() > 2 ? <CheckCircle2 size={20} /> : '2'}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: getActiveStepIndex() >= 2 ? '#09090B' : '#a1a1aa' }}>
                      Rider Assigned
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Accepted</div>
                  </div>

                  {/* Step 3: In Transit */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: getActiveStepIndex() >= 3 ? '#f59e0b' : '#e4e4e7',
                      color: getActiveStepIndex() >= 3 ? '#ffffff' : '#a1a1aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem auto',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      {getActiveStepIndex() > 3 ? <CheckCircle2 size={20} /> : '3'}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: getActiveStepIndex() >= 3 ? '#09090B' : '#a1a1aa' }}>
                      In Transit
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#71717a' }}>On the way</div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: getActiveStepIndex() === 4 ? '#16a34a' : '#e4e4e7',
                      color: getActiveStepIndex() === 4 ? '#ffffff' : '#a1a1aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem auto',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: getActiveStepIndex() === 4 ? '#15803d' : '#a1a1aa' }}>
                      Delivered
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Completed</div>
                  </div>
                </div>
              </div>

              {/* Route & Locations */}
              <div style={{
                padding: '1.25rem',
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #e4e4e7',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MapPin size={18} color="#0066FF" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>Pickup Location</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#09090B' }}>{parcel.pickupLocation}</div>
                    </div>
                  </div>

                  <div style={{ borderLeft: '2px dashed #cbd5e1', height: '16px', marginLeft: '8px' }}></div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Compass size={18} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>Dropoff Location</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#09090B' }}>{parcel.dropLocation}</div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #e4e4e7',
                  fontSize: '0.82rem',
                  color: '#71717a'
                }}>
                  <span>Weight: <strong>{parcel.weightKg} kg</strong></span>
                  <span>Estimated Delivery: <strong>Same Day Campus Express</strong></span>
                </div>
              </div>

              {/* Delivery Rider Details */}
              {parcel.assignment?.riderDetails && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#09090B', marginBottom: '0.75rem' }}>
                    Delivery Rider Contact
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #bae6fd',
                    backgroundColor: '#f0f9ff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={parcel.assignment.riderDetails.userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt="Rider"
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.95rem' }}>
                          {parcel.assignment.riderDetails.userProfile?.name || 'Assigned Rider'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#0284c7' }}>
                          Bike: <strong>{parcel.assignment.riderDetails.bikeModel}</strong> ({parcel.assignment.riderDetails.bikeNumber})
                        </div>
                      </div>
                    </div>

                    {parcel.assignment.riderDetails.userProfile?.phone && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <a
                          href={`https://wa.me/${cleanPhone(parcel.assignment.riderDetails.userProfile.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn"
                          style={{ backgroundColor: '#25D366', color: '#ffffff', padding: '0.4rem 0.6rem' }}
                        >
                          <MessageSquare size={16} />
                        </a>
                        <a
                          href={`tel:${parcel.assignment.riderDetails.userProfile.phone}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.6rem' }}
                        >
                          <Phone size={16} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelTrackingModal;
