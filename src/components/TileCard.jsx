/**
 * TileCard Component
 * 
 * Displays a single detected tile with its confidence score.
 * Used in the results page to show detection matches.
 * 
 * Props:
 * - image: URL/path to the tile image
 * - confidence: Detection confidence score (0-1)
 * - rank: Position in the results (1, 2, 3, etc.)
 */
function TileCard({ image, confidence, rank }) {
  // Convert confidence to percentage
  const confidencePercent = (confidence * 100).toFixed(1)
  
  // Determine confidence level for styling
  const getConfidenceClass = () => {
    if (confidence >= 0.8) return 'high'
    if (confidence >= 0.5) return 'medium'
    return 'low'
  }

  return (
    <div className="tile-card">
      <div className="tile-rank">#{rank}</div>
      
      <div className="tile-image-container">
        <img 
          src={image} 
          alt={`Detected tile match ${rank}`}
          className="tile-image"
        />
      </div>
      
      <div className="tile-info">
        <div className={`confidence-badge ${getConfidenceClass()}`}>
          <span className="confidence-label">Confidence</span>
          <span className="confidence-value">{confidencePercent}%</span>
        </div>
      </div>
    </div>
  )
}

export default TileCard
