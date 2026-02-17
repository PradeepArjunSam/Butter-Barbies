import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Upload, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const { user, signOut, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
        setMobileOpen(false)
    }

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
                    <div className="brand-icon">
                        <BookOpen size={20} />
                    </div>
                    <span className="brand-text">
                        Campus<span className="gradient-text">Share</span>
                    </span>
                </Link>

                <button
                    className="mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    <Link
                        to="/browse"
                        className="nav-link"
                        onClick={() => setMobileOpen(false)}
                    >
                        Browse
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/upload"
                                className="nav-link upload-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                <Upload size={16} />
                                Upload
                            </Link>
                            <Link
                                to="/profile"
                                className="nav-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                <User size={16} />
                                Profile
                            </Link>
                            <button className="nav-signout" onClick={handleSignOut}>
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="nav-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="btn-primary nav-cta"
                                onClick={() => setMobileOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
        }
        .brand-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-1);
          border-radius: 10px;
          color: white;
        }
        .brand-text {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .upload-link {
          color: var(--accent);
        }
        .upload-link:hover {
          background: var(--accent-light);
          color: var(--accent-hover);
        }
        .nav-signout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          color: var(--text-muted);
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .nav-signout:hover {
          color: var(--danger);
          background: rgba(255, 107, 107, 0.08);
        }
        .nav-cta {
          text-decoration: none;
          padding: 8px 20px;
          font-size: 13px;
          margin-left: 4px;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
        }
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }
          .navbar-links {
            display: none;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 15, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 16px 24px;
            gap: 8px;
            border-bottom: 1px solid var(--border-color);
          }
          .navbar-links.open {
            display: flex;
          }
          .nav-link, .nav-signout {
            width: 100%;
            justify-content: flex-start;
            padding: 12px 16px;
          }
          .nav-cta {
            width: 100%;
            text-align: center;
            margin-left: 0;
          }
        }
      `}</style>
        </nav>
    )
}
