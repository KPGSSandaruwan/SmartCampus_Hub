import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UniConnectLogo from './UniConnectLogo';
import { 
  Search, 
  User, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  LogIn, 
  PlusCircle,
  X,
  Mail,
  Phone,
  Info,
  Car,
  Package,
  Key,
  Wrench,
  ShoppingBag,
  Briefcase
} from 'lucide-react';

const Navbar = ({ onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Info Modals state
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/auth');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #e4e4e7',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 4px rgba(9, 9, 11, 0.04)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* 1. LEFT: Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <UniConnectLogo size="medium" color="#09090B" />
            </Link>
          </div>

          {/* 2. CENTER: 4 Aligned Components (Home, Categories, About Us, Contact Us) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            {/* Home */}
            <Link 
              to="/" 
              style={{
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/' ? 700 : 500,
                color: location.pathname === '/' ? '#0066FF' : '#09090B',
                transition: 'all 0.15s ease'
              }}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: '#09090B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  padding: '0.2rem 0'
                }}
              >
                <span>Categories</span>
                <ChevronDown size={16} style={{ transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>

              {categoriesOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '220px',
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(9, 9, 11, 0.12)',
                  padding: '0.5rem',
                  zIndex: 110
                }}>
                  {[
                    { label: 'PickRide', icon: <Car size={16} color="#0066FF" />, path: '/rides' },
                    { label: 'Package & Parcel Pickup', icon: <Package size={16} color="#d97706" />, path: '/parcels' },
                    { label: 'Equipment Rentals', icon: <Key size={16} color="#7c3aed" />, path: '/rentals' },
                    { label: 'Part-time Jobs', icon: <Briefcase size={16} color="#0066FF" />, path: '/?category=jobs' }
                  ].map((cat, idx) => (
                    <Link
                      key={idx}
                      to={cat.path}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setCategoriesOpen(false);
                        navigate(cat.path);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.88rem',
                        color: '#09090B',
                        fontWeight: 500,
                        borderRadius: '8px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About Us */}
            <Link 
              to="/about"
              style={{
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/about' ? 700 : 500,
                color: location.pathname === '/about' ? '#0066FF' : '#09090B',
                transition: 'all 0.15s ease'
              }}
            >
              About Us
            </Link>

            {/* Contact Us */}
            <Link 
              to="/contact"
              style={{
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/contact' ? 700 : 500,
                color: location.pathname === '/contact' ? '#0066FF' : '#09090B',
                transition: 'all 0.15s ease'
              }}
            >
              Contact Us
            </Link>
          </div>

          {/* 3. RIGHT CORNER: Search Icon & Profile Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Search Icon Trigger */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              title="Search"
              style={{
                background: '#f4f4f5',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#09090B',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
            >
              <Search size={19} color="#09090B" />
            </button>

            {/* Profile Icon / Dropdown Menu */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                title="Profile Account"
                style={{
                  background: '#f4f4f5',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#09090B',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
              >
                {user ? (
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={user.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={19} color="#09090B" />
                )}
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '230px',
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(9, 9, 11, 0.12)',
                  padding: '0.5rem',
                  zIndex: 110
                }}>
                  {user ? (
                    <>
                      <div style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #e4e4e7', marginBottom: '0.4rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#09090B' }}>{user.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#71717a' }}>{user.email}</div>
                      </div>

                      <Link 
                        to="/dashboard" 
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.88rem',
                          color: '#09090B',
                          fontWeight: 500,
                          borderRadius: '6px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <LayoutDashboard size={16} color="#0066FF" />
                        <span>My Dashboard</span>
                      </Link>

                      <button 
                        onClick={onOpenCreateModal}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.88rem',
                          color: '#0066FF',
                          fontWeight: 600,
                          borderRadius: '6px',
                          background: 'transparent',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <PlusCircle size={16} color="#0066FF" />
                        <span>Post New Listing</span>
                      </button>

                      <button 
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.88rem',
                          color: '#dc2626',
                          fontWeight: 500,
                          borderRadius: '6px',
                          background: 'transparent',
                          textAlign: 'left',
                          marginTop: '0.2rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #e4e4e7', marginBottom: '0.4rem', fontSize: '0.82rem', color: '#71717a' }}>
                        Welcome to UniConnect
                      </div>
                      <Link 
                        to="/auth" 
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.88rem',
                          color: '#ffffff',
                          fontWeight: 700,
                          borderRadius: '8px',
                          backgroundColor: '#0066FF',
                          justifyContent: 'center'
                        }}
                      >
                        <LogIn size={16} />
                        <span>Sign In / Register</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pop-down Quick Search Input Bar */}
      {searchOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #e4e4e7',
          padding: '0.75rem 1.5rem',
          boxShadow: '0 4px 12px rgba(9, 9, 11, 0.08)'
        }}>
          <form 
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#f4f4f5',
              borderRadius: '8px',
              padding: '0.4rem 0.85rem'
            }}
          >
            <Search size={18} color="#71717a" />
            <input 
              type="text" 
              placeholder="Search rides, parcels, camera rentals, tutors..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#09090B',
                fontSize: '0.95rem'
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#0066FF' }}>
              Search
            </button>
            <button 
              type="button" 
              onClick={() => setSearchOpen(false)}
              style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* About Us Modal */}
      {aboutOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 9, 11, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setAboutOpen(false)}>
          <div style={{
            background: '#ffffff',
            maxWidth: '520px',
            width: '100%',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(9, 9, 11, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <UniConnectLogo size="medium" color="#09090B" />
              <button onClick={() => setAboutOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#71717a" />
              </button>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090B', marginBottom: '0.75rem' }}>
              About UniConnect
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#71717a', lineHeight: 1.6, marginBottom: '1rem' }}>
              UniConnect is the premier unified student network designed to simplify campus living. Students can easily share carpool rides, deliver local packages, rent academic & media gear, hire peer tutors, and buy or sell used textbooks and dorm essentials safely.
            </p>
            <p style={{ fontSize: '0.88rem', color: '#09090B', fontWeight: 600 }}>
              ✓ 100% Verified University Email & ID Protection<br/>
              ✓ Peer Ratings & Safe Pickup Locations
            </p>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {contactOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 9, 11, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setContactOpen(false)}>
          <div style={{
            background: '#ffffff',
            maxWidth: '480px',
            width: '100%',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(9, 9, 11, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090B' }}>Contact Support</h3>
              <button onClick={() => setContactOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#71717a" />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#71717a', marginBottom: '1.5rem' }}>
              Have questions or need help with a listing or booking? Our team is available 24/7.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f4f4f5', padding: '0.85rem', borderRadius: '10px' }}>
                <Mail size={20} color="#0066FF" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Email Support</div>
                  <div style={{ fontWeight: 700, color: '#09090B', fontSize: '0.92rem' }}>support@uniconnect.edu</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f4f4f5', padding: '0.85rem', borderRadius: '10px' }}>
                <Phone size={20} color="#0066FF" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Campus Hotline</div>
                  <div style={{ fontWeight: 700, color: '#09090B', fontSize: '0.92rem' }}>+1 (800) 555-UNI-HELP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
