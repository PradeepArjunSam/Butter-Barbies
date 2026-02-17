import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Award, User, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, name, department, points, created_at')
                .order('points', { ascending: false })
                .limit(20)

            if (error) throw error
            setLeaders(data || [])
        } catch (err) {
            console.error('Leaderboard fetch error:', err)
            toast.error('Failed to load leaderboard')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="leaderboard-page loading-screen">
                <Loader size={32} className="spinner" />
            </div>
        )
    }

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-header">
                <h1>Top Contributors</h1>
                <p>Recognizing the students who share the most knowledge</p>
            </div>

            <div className="leaderboard-card">
                <div className="leaderboard-table-header">
                    <div className="lb-rank">Rank</div>
                    <div className="lb-user">Student</div>
                    <div className="lb-dept">Department</div>
                    <div className="lb-points">Points</div>
                </div>

                {leaders.map((user, index) => {
                    const rank = index + 1
                    let rankClass = ''
                    if (rank === 1) rankClass = 'rank-gold'
                    if (rank === 2) rankClass = 'rank-silver'
                    if (rank === 3) rankClass = 'rank-bronze'

                    return (
                        <div key={user.id} className={`leaderboard-row ${rankClass}`}>
                            <div className="lb-rank">
                                {rank <= 3 ? <Award size={20} className="rank-icon" /> : `#${rank}`}
                            </div>
                            <div className="lb-user">
                                <div className="lb-avatar">
                                    <User size={16} />
                                </div>
                                <span className="lb-name">{user.name}</span>
                            </div>
                            <div className="lb-dept">{user.department || '—'}</div>
                            <div className="lb-points">
                                <span className="points-value">{user.points || 0}</span>
                                <span className="points-label">pts</span>
                            </div>
                        </div>
                    )
                })}

                {leaders.length === 0 && (
                    <div className="lb-empty">
                        <p>No contributors yet. Be the first!</p>
                    </div>
                )}
            </div>

            <style>{`
        .leaderboard-page {
          padding-top: 88px;
          max-width: 800px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 80px;
        }
        .loading-screen {
          display: flex;
          justify-content: center;
          padding-top: 100px;
        }
        .leaderboard-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .leaderboard-header h1 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .leaderboard-header p {
          color: var(--text-secondary);
          font-size: 16px;
        }

        .leaderboard-card {
          background: rgba(26, 26, 37, 0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .leaderboard-table-header {
          display: grid;
          grid-template-columns: 80px 1fr 150px 100px;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .leaderboard-row {
          display: grid;
          grid-template-columns: 80px 1fr 150px 100px;
          padding: 16px 24px;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: background 0.2s;
        }
        .leaderboard-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .leaderboard-row:last-child {
          border-bottom: none;
        }

        .lb-rank {
          font-weight: 700;
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }
        .lb-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lb-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .lb-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .lb-dept {
          font-size: 14px;
          color: var(--text-secondary);
        }
        .lb-points {
          text-align: right;
          font-feature-settings: "tnum";
        }
        .points-value {
          font-weight: 700;
          color: var(--text-primary);
          margin-right: 4px;
        }
        .points-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Top 3 Ranks */
        .rank-gold .lb-rank .rank-icon { color: #ffd700; }
        .rank-gold .lb-name { color: #ffd700; }
        .rank-gold .points-value { color: #ffd700; }
        .rank-gold {
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%);
        }

        .rank-silver .lb-rank .rank-icon { color: #c0c0c0; }
        .rank-silver .lb-name { color: #e0e0e0; }
        .rank-silver {
          background: linear-gradient(90deg, rgba(192, 192, 192, 0.05) 0%, transparent 100%);
        }

        .rank-bronze .lb-rank .rank-icon { color: #cd7f32; }
        .rank-bronze .lb-name { color: #cd7f32; }
        .rank-bronze {
          background: linear-gradient(90deg, rgba(205, 127, 50, 0.05) 0%, transparent 100%);
        }

        .lb-empty {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .leaderboard-table-header, .leaderboard-row {
            grid-template-columns: 50px 1fr 80px;
          }
          .lb-dept, .leaderboard-table-header .lb-dept {
            display: none;
          }
        }
      `}</style>
        </div>
    )
}
