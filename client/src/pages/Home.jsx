import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listingsAPI } from '../services/api';
import Card from '../components/common/Card';
import { 
  Search, 
  Sparkles, 
  Car, 
  Package, 
  Key, 
  Wrench, 
  ShoppingBag, 
  PlusCircle,
  Layers,
  ExternalLink,
  Briefcase
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Items', icon: <Layers size={16} /> },
  { id: 'rides', label: 'PickRide', icon: <Car size={16} /> },
  { id: 'parcels', label: 'Parcels', icon: <Package size={16} /> },
  { id: 'rentals', label: 'Rentals', icon: <Key size={16} /> },
  { id: 'services', label: 'Services', icon: <Wrench size={16} /> },
  { id: 'jobs', label: 'Part-Time Jobs', icon: <Briefcase size={16} /> },
  { id: 'products', label: 'Buy & Sell', icon: <ShoppingBag size={16} /> }
];

const categoryModuleLinks = {
  rides: { label: 'Open PickRide Module', path: '/rides' },
  parcels: { label: 'Open Parcels Module', path: '/parcels' },
  rentals: { label: 'Open Rentals Module', path: '/rentals' },
  jobs: { label: 'Open Jobs Board', path: '/part-time-jobs' }
};

const categoryTitles = {
  all: 'All Active Listings',
  rides: 'PickRide Carpools & Trips',
  parcels: 'Parcel Deliveries',
  rentals: 'Equipment & Gear Rentals',
  services: 'Campus Services & Tutoring',
  jobs: 'Part-Time Jobs',
  products: 'Buy & Sell Products'
};

const Home = ({ onOpenCreateModal }) => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await listingsAPI.getAll({ 
        category: selectedCategory,
        search: searchQuery 
      });
      setListings(res.data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const currentModule = categoryModuleLinks[selectedCategory];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 1rem 2rem 1rem',
        maxWidth: '850px',
        margin: '0 auto'
      }}>
        <div className="badge badge-services" style={{ marginBottom: '1rem', padding: '0.4rem 1rem', backgroundColor: '#e0e7ff', color: '#0066FF', borderColor: '#c7d2fe' }}>
          <Sparkles size={14} />
          <span>Unified Campus Exchange Platform</span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', 'Inter', sans-serif",
          fontSize: '2.6rem',
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: '-1px',
          color: '#09090B',
          marginBottom: '1rem'
        }}>
          Share Rides, Deliver Packages & Exchange Gear Across Campus
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#71717a',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          Connect with verified students at your university. Save money on rides, rent campus equipment, find tutors, and list pre-loved items instantly.
        </p>

        {/* Search Bar Input */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="clean-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.5rem 0.5rem 1.25rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(9, 9, 11, 0.08)'
          }}
        >
          <Search size={20} color="#71717a" />
          <input 
            type="text" 
            placeholder="Search carpools, textbooks, camera rentals, math tutoring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#09090B',
              fontSize: '1rem'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
            Search
          </button>
        </form>
      </section>

      {/* Category Tabs Bar */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="btn"
              style={{
                background: selectedCategory === cat.id ? '#0066FF' : '#f4f4f5',
                color: selectedCategory === cat.id ? '#ffffff' : '#09090B',
                border: selectedCategory === cat.id ? 'none' : '1px solid #e4e4e7',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Marketplace Listings Section */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#09090B', margin: 0 }}>
              {categoryTitles[selectedCategory] || `${selectedCategory.toUpperCase()} Listings`}
            </h2>
            <span style={{ fontSize: '0.88rem', color: '#71717a' }}>
              Showing {listings.length} item(s)
            </span>
          </div>

          {currentModule && (
            <Link
              to={currentModule.path}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#eff6ff',
                color: '#0066FF',
                borderColor: '#bfdbfe',
                fontWeight: 600
              }}
            >
              <span>{currentModule.label}</span>
              <ExternalLink size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#71717a' }}>
            Loading campus marketplace...
          </div>
        ) : listings.length === 0 ? (
          <div className="clean-panel" style={{ padding: '3rem', textAlign: 'center', margin: '1rem 0' }}>
            <h3 style={{ color: '#09090B', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No listings found</h3>
            <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>Be the first student to post in this category!</p>
            <button onClick={onOpenCreateModal} className="btn btn-primary" style={{ backgroundColor: '#0066FF' }}>
              <PlusCircle size={18} />
              <span>Create Listing</span>
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {listings.map((listing) => (
              <Card key={listing.id || listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
