import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, UserIcon, Building, Hash, ArrowRight, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        year: '',
    })
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const update = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.name || !form.email || !form.password) {
            toast.error('Please fill in all required fields')
            return
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        const { error } = await signUp(form.email, form.password, {
            name: form.name,
            department: form.department || undefined,
            year: form.year ? parseInt(form.year) : undefined,
        })
        setLoading(false)

        if (error) {
            toast.error(error.message || 'Failed to create account')
        } else {
            toast.success('Account created! Please check your email to verify.')
            navigate('/login')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-left-content">
                        <div className="auth-brand">
                            <div className="auth-brand-icon">
                                <BookOpen size={28} />
                            </div>
                            <h2>CampusShare</h2>
                        </div>
                        <h1>Join the community.</h1>
                        <p>
                            Create your account and start sharing academic resources with
                            fellow students. Upload notes, find past papers, and help build
                            the campus knowledge base.
                        </p>
                        <div className="auth-features">
                            <div className="feature-item">
                                <span className="feature-dot" />
                                Upload and share your notes
                            </div>
                            <div className="feature-item">
                                <span className="feature-dot" />
                                Search by subject and semester
                            </div>
                            <div className="feature-item">
                                <span className="feature-dot" />
                                Download resources instantly
                            </div>
                            <div className="feature-item">
                                <span className="feature-dot" />
                                Build your contributor profile
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Fill in your details to get started</p>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="reg-name">Full Name *</label>
                                <div className="input-wrapper">
                                    <UserIcon size={18} className="input-icon" />
                                    <input
                                        id="reg-name"
                                        type="text"
                                        className="input-field input-with-icon"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={update('name')}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="reg-email">Email *</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="reg-email"
                                        type="email"
                                        className="input-field input-with-icon"
                                        placeholder="you@university.edu"
                                        value={form.email}
                                        onChange={update('email')}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="reg-dept">Department</label>
                                    <div className="input-wrapper">
                                        <Building size={18} className="input-icon" />
                                        <input
                                            id="reg-dept"
                                            type="text"
                                            className="input-field input-with-icon"
                                            placeholder="e.g. CSE"
                                            value={form.department}
                                            onChange={update('department')}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="reg-year">Year</label>
                                    <div className="input-wrapper">
                                        <Hash size={18} className="input-icon" />
                                        <select
                                            id="reg-year"
                                            className="input-field input-with-icon"
                                            value={form.year}
                                            onChange={update('year')}
                                        >
                                            <option value="">Select</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="reg-password">Password *</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="reg-password"
                                        type="password"
                                        className="input-field input-with-icon"
                                        placeholder="Min 6 characters"
                                        value={form.password}
                                        onChange={update('password')}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="reg-confirm"
                                        type="password"
                                        className="input-field input-with-icon"
                                        placeholder="Re-enter your password"
                                        value={form.confirmPassword}
                                        onChange={update('confirmPassword')}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary auth-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          padding-top: 80px;
        }
        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 960px;
          width: 100%;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
        }
        .auth-left {
          background: var(--gradient-1);
          padding: 48px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        }
        .auth-left-content {
          position: relative;
          z-index: 1;
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .auth-brand-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          color: white;
        }
        .auth-brand h2 {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }
        .auth-left h1 {
          font-size: 36px;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -0.03em;
        }
        .auth-left p {
          font-size: 15px;
          color: rgba(255,255,255,0.8);
          line-height: 1.6;
          margin-bottom: 28px;
        }
        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.85);
          font-size: 14px;
        }
        .feature-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .auth-right {
          background: var(--bg-secondary);
          padding: 40px 48px;
          display: flex;
          align-items: center;
        }
        .auth-form-wrapper {
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
        }
        .auth-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .auth-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 28px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .input-with-icon {
          padding-left: 44px;
        }
        select.input-field {
          appearance: none;
          cursor: pointer;
        }
        .auth-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          font-size: 15px;
          margin-top: 4px;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .auth-switch {
          text-align: center;
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 20px;
        }
        .auth-switch a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
        }
        .auth-switch a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
          }
          .auth-left { padding: 32px; }
          .auth-left h1 { font-size: 28px; }
          .auth-right { padding: 24px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}
