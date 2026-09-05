import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  Sparkles, 
  Target, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Car, 
  Package, 
  Key
} from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Active Students', value: '10,000+', icon: <Users size={24} color="#0066FF" />, desc: 'Connected across faculties' },
    { label: 'Student Savings', value: 'Rs. 50,000+', icon: <TrendingUp size={24} color="#16a34a" />, desc: 'Saved on rides & gear' },
    { label: 'Trust & Safety', value: '99.8%', icon: <ShieldCheck size={24} color="#7c3aed" />, desc: 'Verified edu emails' },
    { label: 'Campus Partners', value: '15+', icon: <Building2 size={24} color="#d97706" />, desc: 'Departments & clubs' },
  ];

  const coreValues = [
    {
      title: 'Verified & Secure',
      icon: <ShieldCheck size={28} color="#0066FF" />,
      desc: 'Strict university email verification ensures every user is a verified peer, creating a safe and trustworthy marketplace environment.'
    },
    {
      title: 'Sustainable Micro-Economy',
      icon: <Zap size={28} color="#16a34a" />,
      desc: 'We promote peer-to-peer sharing, reducing waste and allowing students to monetize unused gear while saving money.'
    },
    {
      title: 'Campus-Wide Community',
      icon: <Users size={28} color="#7c3aed" />,
      desc: 'Connecting students across different faculties for carpooling, peer tutoring, gear rentals, and hassle-free local parcel pickups.'
    },
    {
      title: 'Affordable & Transparent',
      icon: <Target size={28} color="#d97706" />,
      desc: 'Zero inflated third-party commission fees. Fair prices set directly by students for students with instant booking clarity.'
    }
  ];

  const teamMembers = [
    {
      name: 'Keshali Fernando',
      role: 'Co-Founder & Chief Product Officer',
      faculty: 'Faculty of Technology',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Passionate about digital transformation in campus communities and user experience design.'
    },
    {
      name: 'Supun Madushanka',
      role: 'Co-Founder & Lead Architect',
      faculty: 'Dept. of ICT, Faculty of Tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Full-stack system architect building scalable, real-time peer networks for university hubs.'
    },
    {
      name: 'Nipuna Perera',
      role: 'Head of Operations & Safety',
      faculty: 'Faculty of Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Focuses on campus safety standards, verified user onboarding, and student support.'
    },
    {
      name: 'Tharushi Silva',
      role: 'Community & Engagement Lead',
      faculty: 'Faculty of Management',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Drives student outreach, campus events, and university partner collaborations.'
    }
  ];

  const impactStories = [
    {
      quote: "UniConnect made daily travel from Matara to campus so affordable through carpooling. I've met awesome friends from other departments too!",
      name: "Kasun Jayasuriya",
      dept: "3rd Year ICT Student",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "I needed a DSLR camera and tripod for my project. Renting from a senior on UniConnect saved me over 80% compared to commercial rental shops.",
      name: "Dilini Wickramasinghe",
      dept: "Media & Tech Major",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }} className="animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #09090B 0%, #1e1b4b 100%)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        color: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(9, 9, 11, 0.15)',
        marginBottom: '3.5rem'
      }}>
        {/* Subtle decorative background circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#38bdf8',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} />
            <span>Empowering Campus Communities</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', 'Inter', sans-serif",
            fontSize: '2.8rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1.25rem',
            letterSpacing: '-1px'
          }}>
            Connecting Students. Simplifying Campus Life.
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            lineHeight: 1.6,
            marginBottom: '2rem',
            fontWeight: 400
          }}>
            UniConnect is the premier unified peer-to-peer ecosystem designed exclusively for university students. From shared rides and local parcel delivery to equipment rentals and academic exchange—we bring your campus together.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/rentals" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <span>Explore Marketplace</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. KEY METRICS & STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '4rem'
      }}>
        {stats.map((item, idx) => (
          <div key={idx} className="clean-panel" style={{
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(9, 9, 11, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}>
            <div style={{
              background: '#f4f4f5',
              padding: '0.85rem',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#09090B', fontFamily: "'Outfit', sans-serif" }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#27272a' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#71717a', marginTop: '0.2rem' }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. OUR STORY & MISSION SECTION */}
      <div className="clean-panel" style={{
        padding: '3rem 2.5rem',
        marginBottom: '4rem',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            color: '#0066FF',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem'
          }}>
            Our Purpose & Vision
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#09090B',
            marginBottom: '1rem'
          }}>
            Built by Students, for Students
          </h2>
          <p style={{ fontSize: '1.02rem', color: '#71717a', lineHeight: 1.7 }}>
            UniConnect was born out of a real challenge at the Faculty of Technology, University of Ruhuna. Students faced expensive daily transportation costs, high prices for short-term project equipment, and fragmented communication channels across university groups.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            background: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Car size={24} color="#0066FF" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#09090B', marginBottom: '0.75rem' }}>
              Seamless Carpooling & Travel
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#71717a', lineHeight: 1.6 }}>
              Match with peers traveling along your route. Share fuel costs, reduce campus traffic, and turn boring daily commutes into social opportunities.
            </p>
          </div>

          <div style={{
            background: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Package size={24} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#09090B', marginBottom: '0.75rem' }}>
              Peer Parcel Delivery
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#71717a', lineHeight: 1.6 }}>
              Need urgent notes, lab kits, or packages brought from nearby towns? Peer couriers heading your way will pick up and safely deliver your items.
            </p>
          </div>

          <div style={{
            background: '#fafafa',
            border: '1px solid #e4e4e7',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Key size={24} color="#7c3aed" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#09090B', marginBottom: '0.75rem' }}>
              Equipment & Gear Exchange
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#71717a', lineHeight: 1.6 }}>
              Rent cameras, laptops, lab gear, and textbooks for a fraction of store prices. Monetize your idle items when you aren't using them.
            </p>
          </div>
        </div>
      </div>

      {/* 4. CORE VALUES GRID */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '2rem',
            fontWeight: 800,
            color: '#09090B',
            marginBottom: '0.5rem'
          }}>
            Why UniConnect Stands Out
          </h2>
          <p style={{ fontSize: '1rem', color: '#71717a' }}>
            Built on trust, accessibility, and student empowerment.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {coreValues.map((val, idx) => (
            <div key={idx} className="clean-panel" style={{
              padding: '2rem',
              borderRadius: '16px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ marginBottom: '1.25rem' }}>{val.icon}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#09090B', marginBottom: '0.65rem' }}>
                {val.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#71717a', lineHeight: 1.6 }}>
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TEAM SHOWCASE */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            color: '#0066FF',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem'
          }}>
            Meet the Team
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '2rem',
            fontWeight: 800,
            color: '#09090B'
          }}>
            Driven by Passionate Student Innovators
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}>
          {teamMembers.map((member, idx) => (
            <div key={idx} className="clean-panel" style={{
              overflow: 'hidden',
              borderRadius: '18px',
              backgroundColor: '#ffffff',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
              <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(9, 9, 11, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px'
                }}>
                  {member.faculty}
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#09090B', marginBottom: '0.2rem' }}>
                  {member.name}
                </h4>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0066FF', marginBottom: '0.75rem' }}>
                  {member.role}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#71717a', lineHeight: 1.5 }}>
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. STUDENT TESTIMONIALS */}
      <div className="clean-panel" style={{
        padding: '3rem 2rem',
        borderRadius: '20px',
        background: '#f8fafc',
        marginBottom: '4rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#09090B' }}>
            Loved by Campus Students
          </h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {impactStories.map((story, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}>
              <p style={{ fontSize: '0.95rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                "{story.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img 
                  src={story.avatar} 
                  alt={story.name} 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#09090B' }}>{story.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{story.dept}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. HIGH-IMPACT CALL TO ACTION */}
      <div style={{
        background: 'linear-gradient(135deg, #0066FF 0%, #3b82f6 100%)',
        borderRadius: '20px',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        color: '#ffffff',
        boxShadow: '0 12px 30px rgba(0, 102, 255, 0.25)'
      }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to Experience Better Campus Living?
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#e0e7ff', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Join thousands of university students sharing rides, equipment, and services safely today.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/auth" className="btn" style={{ background: '#ffffff', color: '#0066FF', fontWeight: 700, padding: '0.85rem 1.85rem' }}>
            Get Started Now
          </Link>
          <Link to="/contact" className="btn" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.85rem 1.85rem' }}>
            Contact Support
          </Link>
        </div>
      </div>

    </div>
  );
};

export default About;
