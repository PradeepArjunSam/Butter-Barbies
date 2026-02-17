import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import ResourceCard from '../components/ResourceCard'
import { User, Loader, Award, Upload, Download, Bookmark, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user, isAuthenticated } = useAuth()
    const [profile, setProfile] = useState(null)
    const [myUploads, setMyUploads] = useState([])
    const [myDownloads, setMyDownloads] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('uploads')

    useEffect(() => {
        if (user?.id) fetchProfileData()
    }, [user])

    const fetchProfileData = async () => {
        setLoading(true)
        try {
            // 1. Fetch user profile + points
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            setProfile(profileData)

            // 2. Fetch uploads
            const { data: uploadsData } = await supabase
                .from('resources')
                .select('*, uploader:profiles!uploader_id(id, name, department)')
                .eq('uploader_id', user.id)
                .order('created_at', { ascending: false })
            setMyUploads(uploadsData || [])

            // 3. Fetch downloads
            const { data: downloadsData } = await supabase
                .from('downloads')
                .select('*, resource:resources(*, uploader:profiles!uploader_id(id, name, department))')
                .eq('user_id', user.id)
                .order('downloaded_at', { ascending: false })

            // Extract resources from downloads join
            const downloadedResources = downloadsData?.map(d => d.resource).filter(Boolean) || []
            // Deduplicate by ID
            const uniqueDownloads = Array.from(new Map(downloadedResources.map(r => [r.id, r])).values())
            setMyDownloads(uniqueDownloads)
        } catch (error) {
            console.error('Profile fetch error:', error)
            toast.error('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="profile-page loading-screen">
                <Loader size={32} className="spinner" />
            </div>
        )
    }

    if (!profile) return null

    return (
        <div className="profile-page">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-info">
                    <div className="profile-avatar">
                        <User size={40} />
                    </div>
                    <div className="profile-details">
                        <h1>{profile.name}</h1>
                        <p className="profile-meta">
                            {profile.department} · {profile.year ? `Year ${profile.year}` : 'Student'}
                        </p>
                        <p className="profile-joined">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-card points-card">
                        <div className="stat-icon">
                            <Award size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{profile.points || 0}</span>
                            <span className="stat-label">Points Earned</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Upload size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{myUploads.length}</span>
                            <span className="stat-label">Uploads</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Download size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{myDownloads.length}</span>
                            <span className="stat-label">Downloads</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
                    onClick={() => setActiveTab('uploads')}
                >
                    My Uploads
                </button>
                <button
                    className={`tab-btn ${activeTab === 'downloads' ? 'active' : ''}`}
                    onClick={() => setActiveTab('downloads')}
                >
                    Download History
                </button>
            </div>

            {/* Tab Content */}
            <div className="profile-content">
                {activeTab === 'uploads' && (
                    <div className="resources-grid">
                        {myUploads.length > 0 ? (
                            myUploads.map(resource => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <Upload size={48} className="empty-icon" />
                                <h3>No uploads yet</h3>
                                <p>Share your first resource to earn +10 points!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'downloads' && (
                    <div className="resources-grid">
                        {myDownloads.length > 0 ? (
                            myDownloads.map(resource => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))
                        ) : (
                            <div className="empty-state">
                                <Download size={48} className="empty-icon" />
                                <h3>No downloads yet</h3>
                                <p>Browse resources to find what you need.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        .profile-page {
          padding-top: 88px;
          max-width: 1000px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 80px;
        }
        .loading-screen {
          display: flex;
          justify-content: center;
          padding-top: 150px;
        }
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .profile-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--gradient-1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 4px 20px rgba(108, 92, 231, 0.4);
        }
        .profile-details h1 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .profile-meta {
          font-size: 16px;
          color: var(--text-primary);
          font-weight: 500;
        }
        .profile-joined {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .profile-stats {
          display: flex;
          gap: 16px;
        }
        .stat-card {
          background: rgba(26, 26, 37, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 140px;
        }
        .stat-card.points-card {
          border-color: rgba(253, 203, 110, 0.3);
          background: rgba(253, 203, 110, 0.05);
        }
        .stat-card.points-card .stat-icon {
          color: var(--warning);
          background: rgba(253, 203, 110, 0.1);
        }
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .profile-tabs {
          display: flex;
          gap: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 32px;
        }
        .tab-btn {
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 12px 4px;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }
        .tab-btn:hover {
          color: var(--text-primary);
        }
        .tab-btn.active {
          color: var(--accent);
          font-weight: 600;
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent);
          border-radius: 2px 2px 0 0;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          text-align: center;
          opacity: 0.6;
        }
        .empty-icon {
          margin-bottom: 16px;
          color: var(--text-muted);
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .profile-stats {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .stat-card {
            min-width: 120px;
            flex: 1;
          }
        }
      `}</style>
        </div>
    )
}
