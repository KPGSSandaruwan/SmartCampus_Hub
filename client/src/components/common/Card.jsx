import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Package, 
  Key, 
  Wrench, 
  ShoppingBag, 
  MapPin, 
  Star, 
  ArrowRight 
} from 'lucide-react';

const categoryIcons = {
  rides: <Car size={14} />,
  parcels: <Package size={14} />,
  rentals: <Key size={14} />,
  services: <Wrench size={14} />,
  products: <ShoppingBag size={14} />
};

const categoryDefaults = {
  rides: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600',
  parcels: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600',
  rentals: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
  services: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
  products: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'
};
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600';

const Card = ({ listing }) => {
  const {
    _id,
    title,
    description,
    category,
    price,
    location,
    images,
    owner
  } = listing;

  const defaultImg = images && images.length > 0 
    ? images[0] 
    : (categoryDefaults[category] || FALLBACK_IMAGE);

  return (
    <div 
      className="clean-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid #e4e4e7'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#0066FF';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(9, 9, 11, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#e4e4e7';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 9, 11, 0.08)';
      }}
    >
      {/* Listing Cover Image & Category Badge */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
        <img 
          src={defaultImg} 
          alt={title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = categoryDefaults[category] || FALLBACK_IMAGE;
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 2
        }}>
          <span className={`badge badge-${category}`}>
            {categoryIcons[category]}
            <span>{category}</span>
          </span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '0.35rem 0.75rem',
          borderRadius: '8px',
          fontWeight: 800,
          color: '#ffffff',
          fontSize: '1.05rem'
        }}>
          Rs. {price}
          {category === 'rentals' && <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/day</span>}
          {category === 'services' && <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/hr</span>}
        </div>
      </div>

      {/* Listing Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ 
          fontSize: '1.05rem', 
          fontWeight: 700, 
          color: '#09090B', 
          marginBottom: '0.4rem',
          lineHeight: 1.35
        }}>
          {title}
        </h3>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          color: '#71717a', 
          fontSize: '0.82rem',
          marginBottom: '0.75rem' 
        }}>
          <MapPin size={14} color="#0066FF" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{location}</span>
        </div>

        <p style={{ 
          fontSize: '0.86rem', 
          color: '#71717a', 
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}>
          {description}
        </p>

        {/* Owner Info & Action */}
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '0.85rem', 
          borderTop: '1px solid #e4e4e7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src={owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={owner?.name || 'Owner'} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
              }}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#09090B' }}>
                {owner?.name || 'Campus Student'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', color: '#d97706' }}>
                <Star size={11} fill="#d97706" />
                <span>{owner?.rating || 4.8}</span>
              </div>
            </div>
          </div>

          <Link 
            to={`/listings/${_id}`} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <span>View</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
