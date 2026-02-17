import { Search, Filter } from 'lucide-react'

export default function Browse() {
    return (
        <div className="browse-page">
            <div className="browse-header">
                <h1>Browse Resources</h1>
                <p>Find notes, past papers, and assignments by subject or semester</p>
            </div>

            <div className="browse-toolbar">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="input-field search-input"
                        placeholder="Search by title, subject, or keyword..."
                    />
                </div>
                <div className="filter-group">
                    <select className="input-field filter-select">
                        <option value="">All Subjects</option>
                        <option value="data-structures">Data Structures</option>
                        <option value="dbms">DBMS</option>
                        <option value="os">Operating Systems</option>
                        <option value="cn">Computer Networks</option>
                        <option value="maths">Mathematics</option>
                    </select>
                    <select className="input-field filter-select">
                        <option value="">All Semesters</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                    </select>
                    <select className="input-field filter-select">
                        <option value="">All Types</option>
                        <option value="NOTES">Notes</option>
                        <option value="PAST_PAPER">Past Paper</option>
                        <option value="REFERENCE_BOOK">Reference Book</option>
                        <option value="ASSIGNMENT">Assignment</option>
                        <option value="PROJECT_REPORT">Project Report</option>
                    </select>
                    <select className="input-field filter-select">
                        <option value="newest">Newest First</option>
                        <option value="downloads">Most Downloaded</option>
                    </select>
                </div>
            </div>

            <div className="browse-empty">
                <Filter size={48} className="empty-icon" />
                <h3>No resources yet</h3>
                <p>Resources will appear here once the backend is connected and data is seeded.</p>
            </div>

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
      `}</style>
        </div>
    )
}
