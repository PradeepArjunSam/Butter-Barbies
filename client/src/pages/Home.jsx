import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, Upload, Download, ArrowRight, BookOpen, FileText, Users } from 'lucide-react'
import Prism from '../components/Prism'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-prism-bg">
          <Prism
            animationType="rotate"
            glow={0.8}
            noise={0.4}
            scale={3.2}
            hueShift={-0.3}
            colorFrequency={1.2}
            bloom={0.8}
            timeScale={0.3}
            transparent={true}
          />
        </div>
        <div className="hero-prism-overlay" />
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <span>Built for Yugastra -- Ramaiah University</span>
          </div>
          <h1>
            Your campus resources,
            <br />
            <span className="gradient-text">all in one place.</span>
          </h1>
          <p className="hero-desc">
            CampusShare is a community-driven platform where students upload, discover,
            and download academic resources -- notes, past papers, assignments, and more.
          </p>
          <div className="hero-actions">
            <Link to="/browse" className="btn-primary hero-btn">
              Browse Resources
              <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn-ghost hero-btn">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Upload size={24} />
            </div>
            <h3>Upload Resources</h3>
            <p>Share your notes, past papers, and assignments with the campus community.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-teal">
              <Search size={24} />
            </div>
            <h3>Search and Filter</h3>
            <p>Find exactly what you need by subject, semester, type, or keyword.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-amber">
              <Download size={24} />
            </div>
            <h3>Download Instantly</h3>
            <p>Access resources with a single click. No sign-ups, no paywalls for downloads.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-block">
            <FileText size={28} className="stat-icon" />
            <span className="stat-number">500+</span>
            <span className="stat-text">Resources Shared</span>
          </div>
          <div className="stat-block">
            <Users size={28} className="stat-icon" />
            <span className="stat-number">200+</span>
            <span className="stat-text">Active Students</span>
          </div>
          <div className="stat-block">
            <BookOpen size={28} className="stat-icon" />
            <span className="stat-number">50+</span>
            <span className="stat-text">Subjects Covered</span>
          </div>
          <div className="stat-block">
            <Download size={28} className="stat-icon" />
            <span className="stat-number">2,000+</span>
            <span className="stat-text">Downloads</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to contribute?</h2>
          <p>Join the community and start sharing your academic resources today.</p>
          <Link
            to={isAuthenticated ? '/upload' : '/register'}
            className="btn-primary hero-btn"
          >
            {isAuthenticated ? 'Upload a Resource' : 'Create Account'}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        .home-page {
          padding-top: 64px;
        }

        /* Hero */
        .hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(162,155,254,0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, rgba(108,92,231,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .hero-prism-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.35;
        }
        .hero-prism-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 75%);
          pointer-events: none;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(162,155,254,0.06) 0%, transparent 40%);
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 3;
          max-width: 720px;
          text-align: center;
        }
        .hero-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          background: var(--accent-light);
          color: var(--accent);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 28px;
          border: 1px solid rgba(108,92,231,0.2);
        }
        .hero h1 {
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .hero-desc {
          font-size: 17px;
          color: var(--text-secondary);
          max-width: 540px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-size: 15px;
          padding: 14px 28px;
        }

        /* Features */
        .features {
          padding: 80px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          border-color: rgba(108,92,231,0.3);
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }
        .feature-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 14px;
          margin-bottom: 20px;
        }
        .feature-icon.icon-teal {
          background: rgba(0,206,201,0.1);
          color: var(--success);
        }
        .feature-icon.icon-amber {
          background: rgba(253,203,110,0.1);
          color: var(--warning);
        }
        .feature-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .feature-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Stats */
        .stats-section {
          padding: 60px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .stat-block {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        .stat-block:hover {
          border-color: rgba(108,92,231,0.3);
        }
        .stat-icon {
          color: var(--accent);
          margin-bottom: 4px;
        }
        .stat-number {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .stat-text {
          font-size: 13px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* CTA */
        .cta-section {
          padding: 60px 24px 100px;
          max-width: 800px;
          margin: 0 auto;
        }
        .cta-card {
          background: var(--gradient-1);
          border-radius: var(--radius-xl);
          padding: 56px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-card::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 60%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
        }
        .cta-card h2 {
          font-size: 30px;
          font-weight: 800;
          color: white;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          position: relative;
        }
        .cta-card p {
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 28px;
          position: relative;
        }
        .cta-card .btn-primary {
          background: white;
          color: var(--accent);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          position: relative;
        }
        .cta-card .btn-primary:hover {
          box-shadow: 0 6px 30px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}
