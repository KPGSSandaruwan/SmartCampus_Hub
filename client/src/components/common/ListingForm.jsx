import React, { useState } from 'react';
import { listingsAPI } from '../../services/api';
import Modal from './Modal';
import { Sparkles, Image, DollarSign, MapPin, Tag } from 'lucide-react';

const ListingForm = ({ isOpen, onClose, onCreated }) => {
  const [category, setCategory] = useState('rides');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imageUrl: '',
    // Category dynamic details
    departureTime: '',
    seatsAvailable: '2',
    weightKg: '',
    rentalDuration: 'daily',
    skillTags: '',
    productCondition: 'Like New'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let details = {};
      if (category === 'rides') {
        details = { departureTime: formData.departureTime, seatsAvailable: Number(formData.seatsAvailable) };
      } else if (category === 'parcels') {
        details = { weightKg: Number(formData.weightKg) };
      } else if (category === 'rentals') {
        details = { durationType: formData.rentalDuration };
      } else if (category === 'services') {
        details = { skillTags: formData.skillTags.split(',').map(s => s.trim()) };
      } else if (category === 'products') {
        details = { condition: formData.productCondition };
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category,
        price: Number(formData.price),
        location: formData.location,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        details
      };

      const res = await listingsAPI.create(payload);
      onCreated(res.data);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        imageUrl: '',
        departureTime: '',
        seatsAvailable: '2',
        weightKg: '',
        rentalDuration: 'daily',
        skillTags: '',
        productCondition: 'Like New'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Campus Listing">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-rose)',
            fontSize: '0.88rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Category Picker */}
        <div className="form-group">
          <label>Select Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'rides', label: 'Ride', icon: '🚗' },
              { id: 'parcels', label: 'Parcel', icon: '📦' },
              { id: 'rentals', label: 'Rental', icon: '🔑' },
              { id: 'services', label: 'Service', icon: '🛠️' },
              { id: 'products', label: 'Product', icon: '🛍️' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '0.6rem 0.3rem',
                  borderRadius: 'var(--radius-md)',
                  border: category === cat.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: category === cat.id ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-input)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., Carpool to Downtown / Selling Physics Textbook"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Price & Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Price (Rs.)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              placeholder="0"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Location / Pickup Point</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g., North Campus Gate"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Category Specific Fields */}
        {category === 'rides' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Departure Date & Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                className="form-control"
                value={formData.departureTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Available Seats</label>
              <input
                type="number"
                name="seatsAvailable"
                min="1"
                max="6"
                className="form-control"
                value={formData.seatsAvailable}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {category === 'parcels' && (
          <div className="form-group">
            <label>Max Package Weight (kg)</label>
            <input
              type="number"
              name="weightKg"
              placeholder="e.g., 5"
              className="form-control"
              value={formData.weightKg}
              onChange={handleChange}
            />
          </div>
        )}

        {category === 'rentals' && (
          <div className="form-group">
            <label>Rental Duration Type</label>
            <select
              name="rentalDuration"
              className="form-control"
              value={formData.rentalDuration}
              onChange={handleChange}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}

        {category === 'services' && (
          <div className="form-group">
            <label>Skills / Specialization (comma separated)</label>
            <input
              type="text"
              name="skillTags"
              placeholder="Math, Coding, Proofreading"
              className="form-control"
              value={formData.skillTags}
              onChange={handleChange}
            />
          </div>
        )}

        {category === 'products' && (
          <div className="form-group">
            <label>Item Condition</label>
            <select
              name="productCondition"
              className="form-control"
              value={formData.productCondition}
              onChange={handleChange}
            >
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
        )}

        {/* Description */}
        <div className="form-group">
          <label>Detailed Description</label>
          <textarea
            name="description"
            rows="3"
            required
            placeholder="Describe route, luggage space, item details, or service terms..."
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://images.unsplash.com/..."
            className="form-control"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary btn-full"
          style={{ marginTop: '1rem' }}
        >
          <Sparkles size={18} />
          <span>{loading ? 'Publishing...' : 'Publish Listing'}</span>
        </button>
      </form>
    </Modal>
  );
};

export default ListingForm;
