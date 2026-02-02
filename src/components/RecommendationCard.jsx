/**
 * RecommendationCard Component
 * 
 * Displays a single recommended tile with its similarity score.
 * Used in the recommendations page to show similar tile matches.
 * 
 * Props:
 * - image: URL/path to the tile image
 * - similarity: Similarity score (0-1) from ResNet matching
 * - rank: Position in the results (1 = Best Match, 2, 3, etc.)
 */
function RecommendationCard({ image, similarity, rank }) {
  // Convert similarity to percentage
  const similarityPercent = (similarity * 100).toFixed(1)
  
  // Determine similarity level for styling
  const getSimilarityClass = () => {
    if (similarity >= 0.9) return 'high'
    if (similarity >= 0.8) return 'medium'
    return 'low'
  }

  // Get rank label
  const getRankLabel = () => {
    if (rank === 1) return '#1 Best Match'
    return `#${rank}`
  }

  return (
    <div className="recommendation-card">
      <div className={`recommendation-rank ${rank === 1 ? 'best-match' : ''}`}>
        {getRankLabel()}
      </div>
      
      <div className="recommendation-image-container">
        <img 
          src={image} 
          alt={`Recommended tile ${rank}`}
          className="recommendation-image"
        />
      </div>
      
      <div className="recommendation-info">
        <div className={`similarity-badge ${getSimilarityClass()}`}>
          <span className="similarity-label">Similarity</span>
          <span className="similarity-value">{similarityPercent}%</span>
        </div>
      </div>
    </div>
  )
}

export default RecommendationCard
