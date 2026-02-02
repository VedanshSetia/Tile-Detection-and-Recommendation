import TileCard from '../components/TileCard'

/**
 * ResultPage Component
 * 
 * Displays detection results including the original image
 * and top matching tiles with confidence scores.
 * 
 * Props:
 * - imagePreview: URL of the uploaded original image
 * - detectionResults: Object containing detection data
 * - onReset: Callback to start a new upload
 * - onFindSimilar: Callback to navigate to recommendations with selected tile
 */
function ResultPage({ imagePreview, detectionResults, onReset, onFindSimilar }) {
  // Check if we have valid detections
  const hasDetections = detectionResults?.detections?.length > 0

  // Get top 3 detections sorted by confidence (highest first)
  const topDetections = hasDetections
    ? [...detectionResults.detections]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
    : []

  /**
   * Handles "Find Similar Tiles" button click
   * Uses the highest confidence tile as the reference
   */
  const handleFindSimilar = () => {
    if (topDetections.length > 0 && onFindSimilar) {
      // Default to the highest confidence tile (first in sorted array)
      onFindSimilar(topDetections[0])
    }
  }

  return (
    <div className="page result-page">
      <div className="page-content">
        {/* Original Image Section */}
        <section className="original-image-section">
          <h2>Uploaded Image</h2>
          <div className="original-image-container">
            <img 
              src={imagePreview} 
              alt="Original uploaded tile" 
              className="original-image"
            />
          </div>
        </section>

        {/* Detection Results Section */}
        <section className="detection-results-section">
          <h2>Detection Results</h2>
          
          {hasDetections ? (
            <>
              <p className="results-summary">
                Found {topDetections.length} matching tile{topDetections.length !== 1 ? 's' : ''}
              </p>
              
              <div className="tile-cards-grid">
                {topDetections.map((detection, index) => (
                  <TileCard
                    key={detection.id}
                    image={detection.image}
                    confidence={detection.confidence}
                    rank={index + 1}
                  />
                ))}
              </div>
            </>
          ) : (
            /* No Detections - Failure State */
            <div className="no-detections">
              <div className="no-detections-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <circle cx="12" cy="16" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <h3>No Tile Detected</h3>
              <p className="no-detections-message">
                We couldn't identify any tiles in the uploaded image. 
                This may happen if the image is unclear, the tile is not visible, 
                or the tile type is not in our database.
              </p>
              <div className="guidance-box">
                <h4>Tips for better results:</h4>
                <ul>
                  <li>Ensure the tile is clearly visible in the image</li>
                  <li>Use good lighting and avoid shadows</li>
                  <li>Capture the tile from a straight angle</li>
                  <li>Make sure the image is not blurry</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <div className="result-actions">
          {hasDetections && (
            <button className="find-similar-button" onClick={handleFindSimilar}>
              Find Similar Tiles
            </button>
          )}
          <button className="reset-button" onClick={onReset}>
            Upload Another Image
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
