import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { Upload as UploadIcon, FileText, X, Loader, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const SUBJECTS = [
    'Data Structures', 'DBMS', 'Operating Systems', 'Computer Networks',
    'Mathematics', 'Digital Electronics', 'OOP', 'Software Engineering',
    'Machine Learning', 'Web Development', 'Other'
]

const RESOURCE_TYPES = [
    { value: 'NOTES', label: 'Notes' },
    { value: 'PAST_PAPER', label: 'Past Paper' },
    { value: 'REFERENCE_BOOK', label: 'Reference Book' },
    { value: 'PROJECT_REPORT', label: 'Project Report' },
    { value: 'ASSIGNMENT', label: 'Assignment' },
]

export default function UploadPage() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [file, setFile] = useState(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        subject: '',
        semester: '',
        year: '',
        type: 'NOTES',
        tags: '',
    })

    if (!isAuthenticated) {
        return (
            <div className="upload-page">
                <div className="upload-auth-wall">
                    <UploadIcon size={48} className="auth-wall-icon" />
                    <h2>Sign in to upload</h2>
                    <p>You need to be logged in to share resources with the community.</p>
                    <button className="btn-primary" onClick={() => navigate('/login')}>Sign In</button>
                </div>
                <style>{uploadStyles}</style>
            </div>
        )
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (selected) {
            if (selected.size > 25 * 1024 * 1024) {
                toast.error('File size must be under 25MB')
                return
            }
            setFile(selected)
        }
    }

    const removeFile = () => setFile(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return toast.error('Please select a file')
        if (!form.title.trim()) return toast.error('Title is required')
        if (!form.subject) return toast.error('Subject is required')
        if (!form.semester) return toast.error('Semester is required')

        setLoading(true)
        setUploadProgress(10)

        try {
            // 1. Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const filePath = `${user.id}/${Date.now()}-${file.name}`

            setUploadProgress(30)

            const { data: storageData, error: storageError } = await supabase.storage
                .from('resources')
                .upload(filePath, file, { cacheControl: '3600', upsert: false })

            if (storageError) throw storageError

            setUploadProgress(60)

            // 2. Get public URL
            const { data: urlData } = supabase.storage
                .from('resources')
                .getPublicUrl(filePath)

            const fileUrl = urlData.publicUrl

            setUploadProgress(80)

            // 3. Insert resource record
            const { error: insertError } = await supabase.from('resources').insert({
                title: form.title.trim(),
                description: form.description.trim() || null,
                type: form.type,
                subject: form.subject,
                semester: parseInt(form.semester),
                year: parseInt(form.year) || new Date().getFullYear(),
                file_url: fileUrl,
                file_name: file.name,
                file_size: file.size,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                uploader_id: user.id,
            })

            if (insertError) throw insertError

            setUploadProgress(100)
            toast.success('Resource uploaded! +10 points 🎉')

            setTimeout(() => navigate('/browse'), 1200)
        } catch (err) {
            console.error('Upload error:', err)
            toast.error(err.message || 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="upload-page">
            <div className="upload-container">
                <div className="upload-header">
                    <h1>Upload Resource</h1>
                    <p>Share your notes, past papers, or assignments with the campus community</p>
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="input-field"
                            placeholder="e.g. Data Structures Notes — Trees & Graphs"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="input-field upload-textarea"
                            placeholder="Brief description of what's in this resource..."
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    {/* Subject + Semester row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Subject *</label>
                            <select name="subject" className="input-field" value={form.subject} onChange={handleChange} required>
                                <option value="">Select subject</option>
                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Semester *</label>
                            <select name="semester" className="input-field" value={form.semester} onChange={handleChange} required>
                                <option value="">Select</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Type + Year row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Resource Type</label>
                            <select name="type" className="input-field" value={form.type} onChange={handleChange}>
                                {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Year</label>
                            <input
                                type="number"
                                name="year"
                                className="input-field"
                                placeholder={new Date().getFullYear()}
                                value={form.year}
                                onChange={handleChange}
                                min={2015}
                                max={2030}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="form-group">
                        <label className="form-label">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            className="input-field"
                            placeholder="e.g. trees, algorithms, sorting"
                            value={form.tags}
                            onChange={handleChange}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="form-group">
                        <label className="form-label">File * (max 25MB)</label>
                        {!file ? (
                            <label className="file-drop-zone" htmlFor="file-input">
                                <UploadIcon size={32} className="drop-icon" />
                                <span className="drop-text">Click to select a file</span>
                                <span className="drop-hint">PDF, DOCX, PPT, ZIP — up to 25MB</span>
                                <input
                                    id="file-input"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.txt,.md"
                                    hidden
                                />
                            </label>
                        ) : (
                            <div className="file-preview">
                                <FileText size={20} />
                                <div className="file-info">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">{formatFileSize(file.size)}</span>
                                </div>
                                <button type="button" className="file-remove" onClick={removeFile}>
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Progress bar */}
                    {loading && (
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    )}

                    {/* Submit */}
                    <button type="submit" className="btn-primary upload-submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader size={16} className="spinner" />
                                Uploading... {uploadProgress}%
                            </>
                        ) : (
                            <>
                                <UploadIcon size={16} />
                                Upload Resource (+10 pts)
                            </>
                        )}
                    </button>
                </form>
            </div>
            <style>{uploadStyles}</style>
        </div>
    )
}

const uploadStyles = `
  .upload-page {
    padding-top: 88px;
    max-width: 700px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 80px;
  }
  .upload-auth-wall {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 100px 24px;
  }
  .auth-wall-icon {
    color: var(--text-muted);
    margin-bottom: 20px;
    opacity: 0.5;
  }
  .upload-auth-wall h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .upload-auth-wall p {
    color: var(--text-secondary);
    margin-bottom: 24px;
    font-size: 15px;
  }
  .upload-header {
    margin-bottom: 32px;
  }
  .upload-header h1 {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  .upload-header p {
    color: var(--text-secondary);
    font-size: 15px;
  }
  .upload-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 600px) {
    .form-row { grid-template-columns: 1fr; }
  }
  .upload-textarea {
    resize: vertical;
    min-height: 80px;
  }
  .file-drop-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-lg);
    background: rgba(22, 22, 31, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .file-drop-zone:hover {
    border-color: var(--accent);
    background: var(--accent-light);
  }
  .drop-icon {
    color: var(--text-muted);
    margin-bottom: 12px;
  }
  .drop-text {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }
  .drop-hint {
    font-size: 12px;
    color: var(--text-muted);
  }
  .file-preview {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(22, 22, 31, 0.6);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--accent);
  }
  .file-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .file-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }
  .file-size {
    font-size: 12px;
    color: var(--text-muted);
  }
  .file-remove {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    transition: color 0.2s;
  }
  .file-remove:hover {
    color: var(--danger);
  }
  .progress-bar-container {
    width: 100%;
    height: 4px;
    background: var(--bg-card);
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-bar {
    height: 100%;
    background: var(--gradient-1);
    border-radius: 4px;
    transition: width 0.4s ease;
  }
  .upload-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    font-size: 15px;
    width: 100%;
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
