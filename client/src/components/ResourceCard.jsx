import { Link } from 'react-router-dom'
import { Download, Star, FileText, BookOpen, ClipboardList, File, FlaskConical } from 'lucide-react'

const typeIcons = {
    NOTES: FileText,
    PAST_PAPER: ClipboardList,
    REFERENCE_BOOK: BookOpen,
    PROJECT_REPORT: FlaskConical,
    ASSIGNMENT: File,
}

const typeLabels = {
    NOTES: 'Notes',
    PAST_PAPER: 'Past Paper',
    REFERENCE_BOOK: 'Reference Book',
    PROJECT_REPORT: 'Project Report',
    ASSIGNMENT: 'Assignment',
}

export default function ResourceCard({ resource }) {
    const TypeIcon = typeIcons[resource.type] || FileText

    return (
        <Link to={`/resource/${resource.id}`} className="resource-card" id={`resource-${resource.id}`}>
            <div className="rc-header">
                <div className="rc-type-badge">
                    <TypeIcon size={14} />
                    <span>{typeLabels[resource.type] || resource.type}</span>
                </div>
                {resource.avgRating > 0 && (
                    <div className="rc-rating">
                        <Star size={13} fill="var(--warning)" stroke="var(--warning)" />
                        <span>{resource.avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <h3 className="rc-title">{resource.title}</h3>

            {resource.description && (
                <p className="rc-desc">{resource.description.slice(0, 100)}{resource.description.length > 100 ? '…' : ''}</p>
            )}

            <div className="rc-meta">
                <span className="rc-subject">{resource.subject}</span>
                <span className="rc-dot">·</span>
                <span>Sem {resource.semester}</span>
            </div>

            <div className="rc-footer">
                <span className="rc-uploader">
                    {resource.uploader?.name || 'Anonymous'}
                </span>
                <span className="rc-downloads">
                    <Download size={13} />
                    {resource.downloadCount || 0}
                </span>
            </div>

            <style>{`
        .resource-card {
          display: flex;
          flex-direction: column;
          background: rgba(26, 26, 37, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-lg);
          padding: 24px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .resource-card:hover {
          border-color: rgba(108, 92, 231, 0.3);
          transform: translateY(-3px);
          box-shadow: var(--shadow-glow);
        }
        .rc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .rc-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          background: var(--accent-light);
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .rc-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: var(--warning);
        }
        .rc-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rc-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
          flex: 1;
        }
        .rc-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .rc-subject {
          color: var(--accent);
          font-weight: 500;
        }
        .rc-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .rc-uploader {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .rc-downloads {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
        </Link>
    )
}
