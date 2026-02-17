import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, onRate, readOnly = false, size = 20 }) {
    const [hoverRating, setHoverRating] = useState(0)

    // Determine the display rating (either hover state or persistent rating)
    const displayRating = hoverRating || rating

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    className={`star-btn ${!readOnly ? 'interactive' : ''}`}
                    onClick={() => !readOnly && onRate && onRate(star)}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                    disabled={readOnly}
                    type="button"
                >
                    <Star
                        size={size}
                        fill={star <= displayRating ? 'var(--warning)' : 'none'}
                        stroke={star <= displayRating ? 'var(--warning)' : 'var(--text-muted)'}
                        className="star-icon"
                    />
                </button>
            ))}
            <style>{`
        .star-rating {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .star-btn {
          background: none;
          border: none;
          padding: 2px;
          cursor: default;
          transition: transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .star-btn.interactive {
          cursor: pointer;
        }
        .star-btn.interactive:hover {
          transform: scale(1.15);
        }
        .star-icon {
          transition: fill 0.2s, stroke 0.2s;
        }
      `}</style>
        </div>
    )
}
