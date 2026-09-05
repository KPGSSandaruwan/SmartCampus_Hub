import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import { 
  Car, 
  Package, 
  Key, 
  Wrench, 
  ShoppingBag, 
  MapPin, 
  Star, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Send,
  ArrowLeft
} from 'lucide-react';

const categoryIcons = {
  rides: <Car size={16} />,
  parcels: <Package size={16} />,
  rentals: <Key size={16} />,
  services: <Wrench size={16} />,
  products: <ShoppingBag size={16} />
};

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await listingsAPI.getById(id);
      setListing(res.data);
    } catch (err) {
      console.error('Failed to fetch listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    setSubmittingOrder(true);
    setError('');

    try {
      await ordersAPI.create({
        listingId: listing._id,
        notes,
        totalPrice: listing.price
      });
      setOrderSuccess(true);
      setTimeout(() => {
        setIsOrderModalOpen(false);
        setOrderSuccess(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading listing details...</div>;
  }

  if (!listing) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Listing Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Marketplace
        </button>
      </div>
    );
  }

  const { title, description, category, price, location, images, owner, details, createdAt } = listing;

  const isOwner = user && owner && (user._id === owner._id || user._id === owner);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/')} 
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {/* Main Banner Image */}
        <div style={{ width: '100%', height: '340px', position: 'relative' }}>
          <img 
            src={images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900'} 
            alt={title} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px'
          }}>
            <span className={`badge badge-${category}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              {categoryIcons[category]}
              <span>{category}</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: '#fff', lineHeight: 1.2 }}>
                {title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <span>{location}</span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Rate / Price</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                Rs. {price}
              </span>
            </div>
          </div>

          {/* Category Details Box */}
          {details && Object.keys(details).length > 0 && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              {details.departureTime && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Departure Time</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{details.departureTime}</span>
                </div>
              )}
              {details.seatsAvailable !== undefined && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Available Seats</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{details.seatsAvailable} seat(s)</span>
                </div>
              )}
              {details.weightKg && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Max Weight</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{details.weightKg} kg</span>
                </div>
              )}
              {details.durationType && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Rental Terms</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{details.durationType}</span>
                </div>
              )}
              {details.condition && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Condition</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{details.condition}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {description}
            </p>
          </div>

          {/* Owner Info & Action */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img 
                src={owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt={owner?.name} 
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>{owner?.name || 'Campus Student'}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>{owner?.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-amber)' }}>
                    <Star size={12} fill="var(--accent-amber)" />
                    {owner?.rating || 4.8} rating
                  </span>
                </div>
              </div>
            </div>

            {!isOwner ? (
              <button 
                onClick={() => setIsOrderModalOpen(true)}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem' }}
              >
                <Send size={18} />
                <span>Request / Book Now</span>
              </button>
            ) : (
              <div className="badge badge-services">You own this listing</div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Order Request Modal */}
      <Modal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        title={`Request "${title}"`}
      >
        {orderSuccess ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--accent-emerald)' }}>
            <h3>Request Submitted Successfully!</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleCreateOrder}>
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-rose)',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <div style={{
              background: 'var(--bg-input)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>Rs. {price}</div>
              </div>
              <span className={`badge badge-${category}`}>{category}</span>
            </div>

            <div className="form-group">
              <label>Message / Note to Provider</label>
              <textarea
                rows="3"
                placeholder="e.g. Hi! I'd like to book this. Where should we meet?"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={submittingOrder}
              className="btn btn-primary btn-full"
            >
              <Send size={18} />
              <span>{submittingOrder ? 'Submitting Request...' : 'Send Request'}</span>
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ListingDetail;
