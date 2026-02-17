import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { Download, Star, FileText, User, Calendar, HardDrive, Tag, ArrowLeft, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResourceDetail() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)

  useEffect(() => {
    fetchResource()
  }, [id])

  const fetchResource = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*, uploader:profiles!uploader_id(id, name, department, points)')
        .eq('id', id)
        .single()

      if (error) throw error
      setResource(data)

      // Fetch user's existing rating
      if (user) {
        const { data: ratingData } = await supabase
          .from('ratings')
          .select('score')
          .eq('resource_id', id)
          .eq('user_id', user.id)
          .single()

        if (ratingData) setUserRating(ratingData.score)
      }
    } catch (err) {
      console.error(err)
      toast.error('Resource not found')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!resource?.file_url) return
    setDownloading(true)
    try {
      // Track download
      if (isAuthenticated) {
        await supabase.from('downloads').insert({
          user_id: user.id,
          resource_id: resource.id,
        })

        // Increment download count (Try via RPC, else fallback to update which might fail if not uploader)
        const { error: rpcError } = await supabase.rpc('increment_downloads', { row_id: resource.id })

        if (rpcError) {
          await supabase
            .from('resources')
            .update({ download_count: (resource.download_count || 0) + 1 })
            .eq('id', resource.id)
        }
      }

      // Open file URL
      window.open(resource.file_url, '_blank')
      toast.success('Download started!')
      setResource(prev => ({ ...prev, download_count: (prev.download_count || 0) + 1 }))
    } catch (err) {
      console.error(err)
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const handleRate = async (score) => {
    if (!isAuthenticated) return toast.error('Sign in to rate')
    if (user.id === resource.uploader_id) return toast.error("You can't rate your own resource")
    setRatingLoading(true)
    try {
      const { error } = await supabase.from('ratings').upsert({
        user_id: user.id,
        resource_id: resource.id,
        score,
      }, { onConflict: 'user_id,resource_id' })

      if (error) throw error

      setUserRating(score)
      toast.success(`Rated ${score} stars!`)

      // Recalculate avg
      const { data: ratings } = await supabase
        .from('ratings')
        .select('score')
        .eq('resource_id', resource.id)

      if (ratings?.length) {
        const avg = ratings.reduce((a, b) => a + b.score, 0) / ratings.length
        await supabase.from('resources').update({ avg_rating: avg }).eq('id', resource.id)
        setResource(prev => ({ ...prev, avg_rating: avg }))
      }
    } catch (err) {
      console.error(err)
      toast.error('Rating failed')
    } finally {
      setRatingLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const typeLabels = {
    NOTES: 'Notes', PAST_PAPER: 'Past Paper', REFERENCE_BOOK: 'Reference Book',
    PROJECT_REPORT: 'Project Report', ASSIGNMENT: 'Assignment',
  }

  if (loading) {
    return (
      <div className="rd-page">
        <div className="rd-loading"><Loader size={32} className="spinner" /></div>
        <style>{rdStyles}</style>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="rd-page">
        <div className="rd-not-found">
          <h2>Resource not found</h2>
          <Link to="/browse" className="btn-primary">Back to Browse</Link>
        </div>
        <style>{rdStyles}</style>
      </div>
    )
  }

  const isPDF = resource.file_name?.toLowerCase().endsWith('.pdf')

  return (
    <div className="rd-page">
      <Link to="/browse" className="rd-back">
        <ArrowLeft size={16} /> Back to Browse
      </Link>

      <div className="rd-layout">
        {/* Main content */}
        <div className="rd-main">
          <div className="rd-type-badge">
            <FileText size={14} />
            {typeLabels[resource.type] || resource.type}
          </div>

          <h1 className="rd-title">{resource.title}</h1>

          {resource.description && (
            <p className="rd-desc">{resource.description}</p>
          )}

          {/* Star Rating */}
          <div className="rd-rating-section">
            <span className="rd-rating-label">Rate this resource:</span>
            <div className="rd-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`rd-star ${star <= (hoverRating || userRating) ? 'active' : ''}`}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={ratingLoading}
                >
                  <Star
                    size={22}
                    fill={star <= (hoverRating || userRating) ? 'var(--warning)' : 'none'}
                    stroke={star <= (hoverRating || userRating) ? 'var(--warning)' : 'var(--text-muted)'}
                  />
                </button>
              ))}
              {resource.avg_rating > 0 && (
                <span className="rd-avg-rating">{resource.avg_rating.toFixed(1)} avg</span>
              )}
            </div>
          </div>

          {/* PDF Preview */}
          {isPDF && resource.file_url && (
            <div className="rd-preview">
              <iframe src={resource.file_url} title="PDF Preview" className="rd-pdf-frame" />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="rd-sidebar">
          {/* Download card */}
          <div className="rd-sidebar-card">
            <button
              className="btn-primary rd-download-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? <Loader size={16} className="spinner" /> : <Download size={16} />}
              {downloading ? 'Downloading...' : 'Download'}
            </button>

            <div className="rd-stats">
              <div className="rd-stat-row">
                <Download size={14} />
                <span>{resource.download_count || 0} downloads</span>
              </div>
              <div className="rd-stat-row">
                <Star size={14} />
                <span>{resource.avg_rating > 0 ? `${resource.avg_rating.toFixed(1)} rating` : 'No ratings yet'}</span>
              </div>
              <div className="rd-stat-row">
                <HardDrive size={14} />
                <span>{formatFileSize(resource.file_size)}</span>
              </div>
              <div className="rd-stat-row">
                <Calendar size={14} />
                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div className="rd-sidebar-card">
            <h4>Details</h4>
            <div className="rd-meta-list">
              <div className="rd-meta-item">
                <span className="rd-meta-label">Subject</span>
                <span className="rd-meta-value">{resource.subject}</span>
              </div>
              <div className="rd-meta-item">
                <span className="rd-meta-label">Semester</span>
                <span className="rd-meta-value">{resource.semester}</span>
              </div>
              <div className="rd-meta-item">
                <span className="rd-meta-label">Year</span>
                <span className="rd-meta-value">{resource.year}</span>
              </div>
              <div className="rd-meta-item">
                <span className="rd-meta-label">File</span>
                <span className="rd-meta-value">{resource.file_name}</span>
              </div>
            </div>
            {resource.tags?.length > 0 && (
              <div className="rd-tags">
                {resource.tags.map(tag => (
                  <span key={tag} className="rd-tag"><Tag size={10} /> {tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Uploader card */}
          {resource.uploader && (
            <div className="rd-sidebar-card rd-uploader-card">
              <div className="rd-uploader-avatar">
                <User size={20} />
              </div>
              <div className="rd-uploader-info">
                <span className="rd-uploader-name">{resource.uploader.name}</span>
                <span className="rd-uploader-dept">{resource.uploader.department || 'Student'}</span>
              </div>
              <div className="rd-uploader-points">
                <span className="rd-points-value">{resource.uploader.points || 0}</span>
                <span className="rd-points-label">pts</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{rdStyles}</style>
    </div>
  )
}

const rdStyles = `
  .rd-page {
    padding-top: 88px;
    max-width: 1100px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 80px;
  }
  .rd-loading, .rd-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 24px;
    gap: 16px;
  }
  .rd-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 24px;
    transition: color 0.2s;
  }
  .rd-back:hover { color: var(--accent); }
  .rd-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .rd-layout { grid-template-columns: 1fr; }
  }
  .rd-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
    background: var(--accent-light);
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 16px;
  }
  .rd-title {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 12px;
  }
  .rd-desc {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 24px;
  }
  .rd-rating-section {
    margin-bottom: 24px;
  }
  .rd-rating-label {
    font-size: 13px;
    color: var(--text-muted);
    display: block;
    margin-bottom: 8px;
  }
  .rd-stars {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .rd-star {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    transition: transform 0.15s;
  }
  .rd-star:hover { transform: scale(1.2); }
  .rd-avg-rating {
    font-size: 13px;
    color: var(--text-muted);
    margin-left: 12px;
  }
  .rd-preview {
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin-bottom: 24px;
    border: 1px solid var(--border-color);
  }
  .rd-pdf-frame {
    width: 100%;
    height: 600px;
    border: none;
    background: #1a1a25;
  }
  .rd-sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .rd-sidebar-card {
    background: rgba(26, 26, 37, 0.5);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: var(--radius-lg);
    padding: 20px;
  }
  .rd-sidebar-card h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .rd-download-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px;
    font-size: 15px;
    margin-bottom: 16px;
  }
  .rd-stats {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rd-stat-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-secondary);
  }
  .rd-stat-row svg { color: var(--text-muted); }
  .rd-meta-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rd-meta-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }
  .rd-meta-label { color: var(--text-muted); }
  .rd-meta-value { color: var(--text-primary); font-weight: 500; }
  .rd-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
  }
  .rd-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 3px 8px;
    background: rgba(108, 92, 231, 0.08);
    color: var(--text-muted);
    border-radius: 12px;
  }
  .rd-uploader-card {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .rd-uploader-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent-light);
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rd-uploader-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .rd-uploader-name {
    font-size: 14px;
    font-weight: 600;
  }
  .rd-uploader-dept {
    font-size: 12px;
    color: var(--text-muted);
  }
  .rd-uploader-points {
    text-align: center;
  }
  .rd-points-value {
    display: block;
    font-size: 18px;
    font-weight: 800;
    color: var(--accent);
  }
  .rd-points-label {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
