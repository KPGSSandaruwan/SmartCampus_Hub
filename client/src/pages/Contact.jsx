import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  ChevronDown, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = [
    'General Inquiry',
    'Ride Support & Safety',
    'Parcel Pickup & Delivery',
    'Equipment Rentals',
    'Account & Verification',
    'Technical Support / Bug Report',
    'Partnership & Feedback'
  ];

  const faqs = [
    {
      question: 'How does university verification work on UniConnect?',
      answer: 'Every student registers using their official university email address (@uni.edu or @fet.ruh.ac.lk). We send a verification token to ensure only authentic campus community members access ride listings, rental items, and delivery tasks.'
    },
    {
      question: 'Is carpooling safe for students?',
      answer: 'Yes! All drivers and passengers are verified university members with transparent profile ratings and past trip history. We also recommend designated campus pickup points and enable live route sharing with friends.'
    },
    {
      question: 'What happens if a rented item gets damaged or lost?',
      answer: 'Renters sign a lightweight digital agreement before accepting any equipment rental. In the rare event of damage, our dispute resolution team reviews condition receipts and facilitates fair compensation or repair reimbursement.'
    },
    {
      question: 'How are peer parcel deliveries handled?',
      answer: 'Senders specify exact item details and maximum reward fees. Delivery peers accept tasks heading in their travel direction and confirm pickup and handover with photo proof and digital sign-off.'
    },
    {
      question: 'Are there any hidden platform charges?',
      answer: 'UniConnect is 100% free for general student browsing and listings. Small, transparent peer service fees are clearly shown before booking approval.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);

    // Simulate real-time submission response
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
      });
    }, 800);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@uniconnect.edu');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }} className="animate-fade-in">
      
      {/* 1. HERO HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #09090B 0%, #0f172a 100%)',
        borderRadius: '24px',
        padding: '3.5rem 2rem',
        color: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(9, 9, 11, 0.15)',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0, 102, 255, 0.15)',
          border: '1px solid rgba(0, 102, 255, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#60a5fa',
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={16} />
          <span>24/7 Student Support Hub</span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '2.6rem',
          fontWeight: 800,
          marginBottom: '1rem',
          letterSpacing: '-0.5px'
        }}>
          We’re Here to Help You Succeed
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#94a3b8',
          maxWidth: '680px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.6
        }}>
          Have questions about a ride, parcel pickup, equipment rental, or account verification? Our team of student coordinators is ready to assist.
        </p>

        <div style={{
          display: 'inline-flex',
          gap: '2rem',
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '0.85rem 1.75rem',
          borderRadius: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
            <Clock size={16} color="#38bdf8" />
            <span>Average Response: <strong>&lt; 15 mins</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
            <ShieldCheck size={16} color="#4ade80" />
            <span>Dedicated Resolution Team</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID: CONTACT FORM & DIRECT INFO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        
        {/* LEFT COLUMN: INTERACTIVE CONTACT FORM */}
        <div className="clean-panel" style={{ padding: '2.25rem', backgroundColor: '#ffffff' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#09090B', marginBottom: '0.35rem' }}>
              Send Us a Message
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#71717a' }}>
              Fill out the form below and we will get back to you immediately.
            </p>
          </div>

          {submitted && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Message Received Successfully!</div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Thank you for reaching out. A coordinator has been assigned to your ticket and will respond via email shortly.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Supun Perera"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>University Email *</label>
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="name@fet.ruh.ac.lk"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Topic / Category</label>
              <select 
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Brief summary of your inquiry..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea 
                className="form-control"
                rows="5"
                placeholder="Describe your issue or feedback in detail..."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span>Sending inquiry...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: DIRECT CONTACT DETAILS & MAP CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Direct Support Cards */}
          <div className="clean-panel" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, color: '#09090B', marginBottom: '1.25rem' }}>
              Direct Channels
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Email */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ background: '#e0e7ff', padding: '0.65rem', borderRadius: '10px' }}>
                    <Mail size={20} color="#0066FF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Email Support</div>
                    <div style={{ fontWeight: 700, color: '#09090B', fontSize: '0.92rem' }}>support@uniconnect.edu</div>
                  </div>
                </div>
                <button 
                  onClick={handleCopyEmail}
                  title="Copy email"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#09090B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                >
                  {copiedEmail ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Phone Hotline */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ background: '#dcfce7', padding: '0.65rem', borderRadius: '10px' }}>
                  <Phone size={20} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Campus Emergency Hotline</div>
                  <div style={{ fontWeight: 700, color: '#09090B', fontSize: '0.92rem' }}>+94 74 160 7777</div>
                </div>
              </div>

              {/* Campus Location */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ background: '#f3e8ff', padding: '0.65rem', borderRadius: '10px', flexShrink: 0 }}>
                  <MapPin size={20} color="#7c3aed" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Campus HQ & Lab Desk</div>
                  <div style={{ fontWeight: 700, color: '#09090B', fontSize: '0.9rem', lineHeight: 1.4, marginTop: '0.2rem' }}>
                    Department of ICT, Faculty of Technology,<br/>
                    University of Ruhuna, Karagoda Uyangoda,<br/>
                    Kamburupitiya, Sri Lanka.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours & Safety Desk */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid #cbd5e1',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#09090B', fontSize: '0.95rem', marginBottom: '0.65rem' }}>
              <Clock size={18} color="#0066FF" />
              <span>Campus Office Desk Hours</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
              <strong>Monday - Friday:</strong> 8:30 AM – 5:00 PM<br/>
              <strong>Saturday:</strong> 9:00 AM – 1:00 PM<br/>
              <strong>Digital Platform Support:</strong> 24/7 Monitoring
            </div>
          </div>

        </div>

      </div>

      {/* 3. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <div className="clean-panel" style={{ padding: '3rem 2.25rem', backgroundColor: '#ffffff', marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#0066FF',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.5rem'
          }}>
            <HelpCircle size={16} />
            <span>Got Questions?</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#09090B' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                style={{
                  border: '1px solid #e4e4e7',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                  backgroundColor: isOpen ? '#f8fafc' : '#ffffff'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    color: '#09090B',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    color="#71717a"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem 1.5rem',
                    fontSize: '0.93rem',
                    color: '#52525b',
                    lineHeight: 1.6,
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Contact;
