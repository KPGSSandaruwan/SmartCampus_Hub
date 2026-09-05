import React from 'react';
import { Link } from 'react-router-dom';
import UniConnectLogo from './UniConnectLogo';
import { Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#09090B',
      color: '#a1a1aa',
      padding: '3.5rem 1.5rem 1.5rem 1.5rem',
      marginTop: 'auto',
      borderTop: '1px solid #18181b'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Column 1: White Logo & Short Description */}
        <div>
          <div style={{ marginBottom: '1.2rem' }}>
            <UniConnectLogo size="medium" color="#FFFFFF" />
          </div>
          <p style={{ 
            lineHeight: 1.6, 
            fontSize: '0.88rem', 
            color: '#a1a1aa',
            marginBottom: '1.2rem' 
          }}>
            UniConnect is the premier unified student marketplace. Empowering campus communities to easily share rides, deliver local packages, rent equipment, and exchange gear safely.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            color: '#38bdf8',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <ShieldCheck size={14} color="#38bdf8" />
            <span>Verified Student Community</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ 
            color: '#ffffff', 
            fontFamily: "'Outfit', 'Inter', sans-serif",
            fontWeight: 700, 
            fontSize: '1.05rem', 
            marginBottom: '1.1rem',
            letterSpacing: '-0.3px'
          }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
            <li><Link to="/" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>Home</Link></li>
            <li><Link to="/about" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>About Us</Link></li>
            <li><Link to="/contact" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>Contact Support</Link></li>
            <li><Link to="/rides" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>PickRide (Rides)</Link></li>
            <li><Link to="/rentals" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>Equipment Rentals</Link></li>
            <li><Link to="/parcels" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>Parcel Pickups</Link></li>
            <li><Link to="/part-time-jobs" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>Part-Time Jobs</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div>
          <h4 style={{ 
            color: '#ffffff', 
            fontFamily: "'Outfit', 'Inter', sans-serif",
            fontWeight: 700, 
            fontSize: '1.05rem', 
            marginBottom: '1.1rem',
            letterSpacing: '-0.3px'
          }}>
            Contact & Support
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Mail size={17} color="#0066FF" />
              <span style={{ color: '#e4e4e7' }}>support@uniconnect.edu</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Phone size={17} color="#0066FF" />
              <span style={{ color: '#e4e4e7' }}>+94 74 160 7777</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <MapPin size={17} color="#0066FF" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ color: '#e4e4e7', lineHeight: 1.4 }}>
                Department of ICT, Faculty of Technology,<br/>University of Ruhuna
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid #27272a',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.82rem',
        color: '#71717a'
      }}>
        <div>© 2026 UniConnect Marketplace Inc. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Crafted with</span>
          <Heart size={14} color="#dc2626" fill="#dc2626" />
          <span>for FOT Students</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
