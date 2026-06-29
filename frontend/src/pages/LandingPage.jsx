import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserPlus, LogIn, Scissors, Star, Clock, Shield } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Scissors size={28} />, title: 'Expert Stylists', desc: 'Book appointments with top-rated salon professionals near you.' },
    { icon: <Clock size={28} />, title: 'Easy Scheduling', desc: 'Pick a date & time that works for you, confirmed in seconds.' },
    { icon: <Star size={28} />, title: 'Verified Reviews', desc: 'Read honest reviews and ratings from real customers.' },
    { icon: <Shield size={28} />, title: 'Secure Payments', desc: 'Your transactions are protected with end-to-end encryption.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>

      {/* Ambient background glow */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-250px', left: '-150px', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Nav Bar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 3rem', borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(11,11,15,0.7)',
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', cursor: 'pointer' }}>
          Aura<span style={{ color: 'var(--accent)' }}>Glow</span>
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem', border: 'none', padding: '0.5rem 1rem' }} onClick={() => navigate('/beautician-register')}>
            For Beauticians
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '0.9rem' }} onClick={() => navigate('/login')}>
            <LogIn size={16} /> Sign In
          </button>
          <button className="btn btn-primary" style={{ fontSize: '0.9rem' }} onClick={() => navigate('/register')}>
            <UserPlus size={16} /> Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          background: 'var(--accent-glow)', border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '1.5rem',
          animation: 'fadeIn 0.6s ease',
        }}>
          <Sparkles size={14} /> Sri Lanka's Premier Salon Booking Platform
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 900, lineHeight: 1.1, maxWidth: '700px', marginBottom: '1.25rem',
          animation: 'slideUp 0.6s ease',
        }}>
          Book Your Perfect <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, #c084fc 50%, #e879f9 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Salon Experience
          </span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '520px',
          lineHeight: 1.7, marginBottom: '2.5rem', animation: 'slideUp 0.7s ease',
        }}>
          Discover top-rated salons, browse services, and book appointments — all in one place. Your beauty journey starts here.
        </p>

        <div style={{ display: 'flex', gap: '1rem', animation: 'slideUp 0.8s ease' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => navigate('/register')}
          >
            <UserPlus size={18} /> Get Started
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => navigate('/login')}
          >
            I have an account
          </button>
        </div>

        <div style={{ marginTop: '2.5rem', animation: 'slideUp 0.9s ease', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Are you a salon professional?{' '}
          <span 
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }} 
            onClick={() => navigate('/beautician-register')}
          >
            Join as a Beautician
          </span>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '3rem 3rem 5rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem', maxWidth: '1000px', margin: '0 auto',
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card interactive" style={{
              padding: '2rem', textAlign: 'center',
              animation: `slideUp ${0.5 + i * 0.1}s ease`,
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
                background: 'var(--accent-glow)', border: '1px solid var(--border-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', color: 'var(--accent)',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)', fontSize: '0.8rem', position: 'relative', zIndex: 1,
      }}>
        © {new Date().getFullYear()} AuraGlow. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
