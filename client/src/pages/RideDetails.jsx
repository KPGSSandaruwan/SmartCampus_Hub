import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ridesAPI from '../services/ridesApi';
import { useAuth } from '../context/AuthContext';
import { Car, MapPin, Compass, ShieldAlert, CheckCircle, Star, Phone, MessageSquare, Clock } from 'lucide-react';

const RideDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    setLoading(true);
    try {
      const res = await ridesAPI.getRideById(id);
      setRide(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    try {
      await ridesAPI.requestRide(ride.id);
      fetchRideDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ride request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await ridesAPI.acceptRequest(requestId);
      fetchRideDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleCompleteRide = async () => {
    try {
      await ridesAPI.completeRide(ride.id);
      fetchRideDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete ride');
    }
  };

  const handleRateRide = async (e) => {
    e.preventDefault();
    setRatingSubmitting(true);
    try {
      await ridesAPI.rateRide({ rideId: ride.id, rating, comment });
      setRatingSuccess(true);
      fetchRideDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const cleanPhone = (phone) => {
    return phone ? phone.replace(/[^\d+]/g, '') : '';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>Loading ride details...</div>;
  }

  if (!ride) {
    return (
      <div className="clean-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <ShieldAlert size={48} style={{ color: '#dc2626', marginBottom: '1rem' }} />
        <h3>Ride Not Found</h3>
        <p style={{ color: '#71717a', margin: '0.5rem 0 1.5rem 0' }}>The ride you are looking for does not exist or has been removed.</p>
        <Link to="/rides" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>Back to Rides</Link>
      </div>
    );
  }

  const isRider = user && ride.riderDetails && user.id === ride.riderDetails.userId;
  const userRequest = user && ride.requests && ride.requests.find(r => r.userId === user.id);
  const acceptedRequest = ride.requests && ride.requests.find(r => r.status === 'accepted');
  const isAcceptedPassenger = userRequest && userRequest.status === 'accepted';

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto' }}>
      <div className="clean-panel" style={{ padding: '2rem', position: 'relative' }}>
        
        {/* Header Route Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge" style={{
                backgroundColor: ride.status === 'active' ? '#f0fdf4' : ride.status === 'accepted' ? '#eff6ff' : '#f4f4f5',
                color: ride.status === 'active' ? '#15803d' : ride.status === 'accepted' ? '#1d4ed8' : '#71717a',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                {ride.status === 'active' ? 'Active' : ride.status === 'accepted' ? 'Ongoing' : 'Completed'}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#71717a' }}>Posted by {ride.riderDetails?.userProfile?.name || 'Rider'}</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: '#09090B' }}>
              Ride Route Details
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#09090B' }}>Rs. {ride.price}</span>
            <div style={{ fontSize: '0.85rem', color: '#71717a' }}>Cash Only</div>
          </div>
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

        {/* Locations Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', padding: '1.25rem', backgroundColor: '#fafafa', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={18} color="#0066FF" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Pickup Location</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#09090B' }}>{ride.startLocation}</div>
            </div>
          </div>
          <div style={{ paddingLeft: '0.5rem', borderLeft: '2px dashed #d4d4d8', height: '20px', marginLeft: '8px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass size={18} color="#16a34a" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Destination Location</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#09090B' }}>{ride.endLocation}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#71717a', borderTop: '1px solid #e4e4e7', paddingTop: '0.5rem' }}>
            <Clock size={14} />
            <span>Estimated Distance: <strong>{ride.distanceKm} km</strong></span>
          </div>
        </div>

        {/* Rider / Bike Details Card */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#09090B' }}>Vehicle & Rider Information</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid #e4e4e7', borderRadius: '10px', marginBottom: '2rem' }}>
          <img 
            src={ride.riderDetails?.userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt="Rider" 
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#09090B' }}>{ride.riderDetails?.userProfile?.name || 'Registered Rider'}</div>
            <div style={{ fontSize: '0.85rem', color: '#71717a' }}>
              Bike Model: <strong>{ride.riderDetails?.bikeModel}</strong> | Plate: <strong>{ride.riderDetails?.bikeNumber}</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Booking Statuses & Actions */}
        {isRider ? (
          <div>
            {/* RIDER VIEW */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#09090B' }}>Passenger Requests</h3>
            
            {ride.status === 'active' && (!ride.requests || ride.requests.length === 0) && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#71717a', backgroundColor: '#f4f4f5', borderRadius: '8px' }}>
                Waiting for passengers to request your ride offer...
              </div>
            )}

            {ride.status === 'active' && ride.requests && ride.requests.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ride.requests.map(req => (
                  <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e4e4e7', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img src={req.userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{req.userProfile?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#71717a' }}>Passenger Request</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAcceptRequest(req.id)}
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', backgroundColor: '#0066FF' }}
                    >
                      Accept Passenger
                    </button>
                  </div>
                ))}
              </div>
            )}

            {ride.status === 'accepted' && (
              <div style={{ padding: '1.5rem', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '10px', textAlign: 'center' }}>
                <CheckCircle size={32} color="#0284c7" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontWeight: 700, color: '#0369a1' }}>Ride Accepted by Passenger</h4>
                <p style={{ fontSize: '0.88rem', color: '#0284c7', margin: '0.5rem 0 1.25rem 0' }}>
                  You have accepted <strong>{acceptedRequest?.userProfile?.name}</strong>. Get in touch with them via phone/WhatsApp to coordinate.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <a href={`https://wa.me/${cleanPhone(acceptedRequest?.userProfile?.phone)}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: '#fff', fontSize: '0.85rem' }}>
                    <MessageSquare size={16} /> WhatsApp Passenger
                  </a>
                  {acceptedRequest?.userProfile?.phone && (
                    <a href={`tel:${acceptedRequest.userProfile.phone}`} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                      <Phone size={16} /> Call Passenger
                    </a>
                  )}
                </div>
                <button onClick={handleCompleteRide} className="btn btn-primary" style={{ backgroundColor: '#0066FF', width: '100%' }}>
                  Mark Ride as Completed
                </button>
              </div>
            )}

            {ride.status === 'completed' && (
              <div style={{ padding: '1.5rem', backgroundColor: '#f4f4f5', borderRadius: '10px', textAlign: 'center', color: '#71717a' }}>
                <CheckCircle size={32} color="#16a34a" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontWeight: 700, color: '#09090B' }}>This ride has been completed successfully!</h4>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* PASSENGER VIEW */}
            {ride.status === 'active' && !userRequest && (
              <button onClick={handleRequestRide} className="btn btn-primary" style={{ backgroundColor: '#0066FF', width: '100%' }}>
                Request Ride Offer
              </button>
            )}

            {ride.status === 'active' && userRequest && (
              <div style={{ padding: '1.25rem', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', textAlign: 'center', color: '#71717a' }}>
                Your request is pending rider's confirmation.
              </div>
            )}

            {ride.status === 'accepted' && isAcceptedPassenger && (
              <div style={{ padding: '1.5rem', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '10px', textAlign: 'center' }}>
                <CheckCircle size={32} color="#0284c7" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontWeight: 700, color: '#0369a1' }}>Your Request Was Approved!</h4>
                <p style={{ fontSize: '0.88rem', color: '#0284c7', margin: '0.5rem 0 1.25rem 0' }}>
                  Contact rider <strong>{ride.riderDetails?.userProfile?.name}</strong> to finalize pickup timing and location details:
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <a href={`https://wa.me/${cleanPhone(ride.riderDetails?.userProfile?.phone)}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: '#fff', fontSize: '0.85rem' }}>
                    <MessageSquare size={16} /> WhatsApp Rider
                  </a>
                  {ride.riderDetails?.userProfile?.phone && (
                    <a href={`tel:${ride.riderDetails.userProfile.phone}`} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                      <Phone size={16} /> Call Rider
                    </a>
                  )}
                </div>
              </div>
            )}

            {ride.status === 'accepted' && !isAcceptedPassenger && (
              <div style={{ padding: '1.25rem', backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', textAlign: 'center', color: '#71717a' }}>
                This ride is ongoing with another passenger.
              </div>
            )}

            {ride.status === 'completed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#f4f4f5', borderRadius: '10px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>
                  Ride Completed
                </div>

                {isAcceptedPassenger && !ratingSuccess && (
                  <form onSubmit={handleRateRide} className="clean-panel" style={{ padding: '1.5rem', border: '1px solid #e4e4e7' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#09090B' }}>Rate your ride experience:</h4>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setRating(star)}
                          style={{ background: 'none', border: 'none', outline: 'none' }}
                        >
                          <Star size={24} fill={star <= rating ? '#eab308' : 'none'} color={star <= rating ? '#eab308' : '#a1a1aa'} />
                        </button>
                      ))}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <textarea 
                        placeholder="Write a comment about the driver or trip..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #e4e4e7',
                          minHeight: '80px',
                          outline: 'none',
                          backgroundColor: '#f4f4f5'
                        }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={ratingSubmitting} style={{ backgroundColor: '#0066FF', width: '100%' }}>
                      {ratingSubmitting ? 'Submitting Review...' : 'Submit Rating'}
                    </button>
                  </form>
                )}

                {ratingSuccess && (
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
                    Thank you for rating this ride!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
