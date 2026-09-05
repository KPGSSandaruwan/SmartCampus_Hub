import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UniConnectLogo from '../components/common/UniConnectLogo';
import { 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    universityId: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Sign Up Client-side Validations
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match. Please verify your password.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          universityId: formData.universityId,
          phone: formData.phone
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Account Helper
  const fillDemoAccount = (role) => {
    if (role === 'student') {
      setFormData({
        email: 'alex@uni.edu',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'Alex Rivera',
        universityId: 'UNI-2024-8841',
        phone: '+1 (555) 234-5678'
      });
    } else {
      setFormData({
        email: 'admin@uni.edu',
        password: 'adminpassword123',
        confirmPassword: 'adminpassword123',
        name: 'Campus Admin',
        universityId: 'ADMIN-0001',
        phone: '+1 (555) 000-1111'
      });
    }
    setIsLogin(true);
    setError('');
  };

  const isEduEmail = formData.email.toLowerCase().endsWith('.edu');

  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(9, 9, 11, 0.08)',
        padding: '2.5rem 2rem',
        position: 'relative'
      }} className="animate-fade-in">
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <UniConnectLogo size="large" color="#09090B" />
          </div>
          <h2 style={{ 
            fontFamily: "'Outfit', 'Inter', sans-serif", 
            fontWeight: 800, 
            fontSize: '1.5rem', 
            color: '#09090B',
            letterSpacing: '-0.5px'
          }}>
            {isLogin ? 'Sign in to your account' : 'Create your student account'}
          </h2>
          <p style={{ color: '#71717a', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            {isLogin ? 'Access rides, rentals, parcels & campus marketplace' : 'Connect with verified students across your campus'}
          </p>
        </div>

        {/* High-Contrast Segmented Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f4f4f5',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '1.75rem',
          border: '1px solid #e4e4e7'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              background: isLogin ? '#ffffff' : 'transparent',
              color: isLogin ? '#0066FF' : '#71717a',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: isLogin ? '0 2px 6px rgba(9, 9, 11, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              background: !isLogin ? '#ffffff' : 'transparent',
              color: !isLogin ? '#0066FF' : '#71717a',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: !isLogin ? '0 2px 6px rgba(9, 9, 11, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            padding: '0.85rem 1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#dc2626',
            fontSize: '0.88rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Sign Up Specific Fields */}
          {!isLogin && (
            <>
              <div className="form-group">
                <label style={{ color: '#09090B' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Alex Rivera"
                  className="form-control"
                  style={{ backgroundColor: '#f4f4f5', color: '#09090B' }}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label style={{ color: '#09090B' }}>University ID Number</label>
                <input
                  type="text"
                  name="universityId"
                  required
                  placeholder="e.g. UNI-2024-8841"
                  className="form-control"
                  style={{ backgroundColor: '#f4f4f5', color: '#09090B' }}
                  value={formData.universityId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label style={{ color: '#09090B' }}>Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 234-5678"
                  className="form-control"
                  style={{ backgroundColor: '#f4f4f5', color: '#09090B' }}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ color: '#09090B' }}>University Email (.edu)</label>
              {formData.email && isEduEmail && (
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <CheckCircle2 size={13} /> Verified .edu domain
                </span>
              )}
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="alex@uni.edu"
              className="form-control"
              style={{ backgroundColor: '#f4f4f5', color: '#09090B' }}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="form-group">
            <label style={{ color: '#09090B' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength="6"
                placeholder="••••••••"
                className="form-control"
                style={{ backgroundColor: '#f4f4f5', color: '#09090B', paddingRight: '2.5rem' }}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {!isLogin && (
            <div className="form-group">
              <label style={{ color: '#09090B' }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="form-control"
                style={{ backgroundColor: '#f4f4f5', color: '#09090B' }}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Sign In Options: Remember Me & Forgot Password */}
          {isLogin && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '0.85rem 0 1.25rem 0',
              fontSize: '0.85rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717a', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#0066FF', width: '16px', height: '16px', borderRadius: '4px' }}
                />
                <span>Remember me</span>
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); alert('Reset link sent to university email.'); }}
                style={{ color: '#0066FF', fontWeight: 600, textDecoration: 'none' }}
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-full"
            style={{
              backgroundColor: '#0066FF',
              color: '#ffffff',
              padding: '0.8rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0, 102, 255, 0.3)',
              marginTop: isLogin ? '0' : '1rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* One-Click Quick Demo Accounts */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #e4e4e7',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ Quick Demo Sign In
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => fillDemoAccount('student')}
              className="btn btn-secondary btn-sm"
              style={{
                backgroundColor: '#f4f4f5',
                color: '#09090B',
                border: '1px solid #e4e4e7',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="btn btn-secondary btn-sm"
              style={{
                backgroundColor: '#f4f4f5',
                color: '#09090B',
                border: '1px solid #e4e4e7',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
