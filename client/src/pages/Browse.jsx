import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ResourceCard from '../components/ResourceCard'
import { Search, Filter, Loader } from 'lucide-react'

export default function Browse() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    subject: '',
    semester: '',
    type: '',
    sort: 'newest',
  })

  useEffect(() => {
    fetchResources()
  }, [filters])

  const fetchResources = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('resources')
        .select('*, uploader:profiles!uploader_id(id, name, department, points)')

      if (filters.subject) query = query.eq('subject', filters.subject)
      if (filters.semester) query = query.eq('semester', parseInt(filters.semester))
      if (filters.type) query = query.eq('type', filters.type)

      if (filters.sort === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (filters.sort === 'downloads') {
        query = query.order('download_count', { ascending: false })
      }

      query = query.limit(50)

      const { data, error } = await query
      if (error) throw error
      setResources(data || [])
    } catch (err) {
      console.error('Browse fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      fetchResources()
      return
    }
    searchResources()
  }

  const searchResources = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*, uploader:profiles!uploader_id(id, name, department, points)')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setResources(data || [])
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = resources

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Browse Resources</h1>
        <p>Find notes, past papers, and assignments by subject or semester</p>
      </div>

      <div className="browse-toolbar">
        <form className="search-box" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search by title, subject, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="filter-group">
          <select name="subject" className="input-field filter-select" value={filters.subject} onChange={handleFilterChange}>
            <option value="">All Subjects</option>
            <option value="Data Structures">Data Structures</option>
            <option value="DBMS">DBMS</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Digital Electronics">Digital Electronics</option>
            <option value="OOP">OOP</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Web Development">Web Development</option>
          </select>
          <select name="semester" className="input-field filter-select" value={filters.semester} onChange={handleFilterChange}>
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Semester {n}</option>)}
          </select>
          <select name="type" className="input-field filter-select" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="NOTES">Notes</option>
            <option value="PAST_PAPER">Past Paper</option>
            <option value="REFERENCE_BOOK">Reference Book</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="PROJECT_REPORT">Project Report</option>
          </select>
          <select name="sort" className="input-field filter-select" value={filters.sort} onChange={handleFilterChange}>
            <option value="newest">Newest First</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="browse-loading">
          <Loader size={32} className="spinner" />
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="browse-grid">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="browse-empty">
          <Filter size={48} className="empty-icon" />
          <h3>No resources found</h3>
          <p>Try adjusting your filters or search terms, or be the first to upload!</p>
        </div>
      )}

      <style>{`
        .browse-page {
          padding-top: 88px;
          max-width: 1100px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 80px;
        }
        .browse-header {
          margin-bottom: 32px;
        }
        .browse-header h1 {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .browse-header p {
          color: var(--text-secondary);
          font-size: 15px;
        }
        .browse-toolbar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }
        .search-box {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          padding-left: 46px;
          padding: 14px 16px 14px 46px;
          font-size: 15px;
        }
        .filter-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-select {
          flex: 1;
          min-width: 150px;
          appearance: none;
          cursor: pointer;
          padding: 10px 16px;
          font-size: 13px;
        }
        .browse-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .browse-loading {
          display: flex;
          justify-content: center;
          padding: 80px;
        }
        .browse-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
        }
        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 16px;
          opacity: 0.5;
        }
        .browse-empty h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }
        .browse-empty p {
          font-size: 14px;
          color: var(--text-muted);
          max-width: 400px;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
