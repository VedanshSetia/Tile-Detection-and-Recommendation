import { useState, useEffect, useRef } from 'react'
import RecommendationCard from '../components/RecommendationCard'
import Loader from '../components/Loader'
import { getTileRecommendations } from '../services/recommendService'

/**
 * RecommendationPage Component
 * 
 * Displays tile recommendations based on a reference tile.
 * Uses ResNet-based similarity matching (currently mocked).
 * 
 * Props:
 * - referenceTile: The detected tile to find similar matches for
 *   - { id: number, image: string, confidence: number }
 * - onBack: Callback to return to results page
 * - onReset: Callback to start a new upload (reset entire flow)
 */
function RecommendationPage({ referenceTile, onBack, onReset }) {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState(null)
  
  // Ref to prevent duplicate API calls
  const hasFetchedRef = useRef(false)

  /**
   * Fetches recommendations when component mounts
   * Only runs once to prevent duplicate calls
   */
  useEffect(() => {
    // Guard against missing reference tile
    if (!referenceTile) {
      setError('No reference tile provided. Please go back and select a tile.')
      return
    }

    // Prevent duplicate calls (React StrictMode, etc.)
    if (hasFetchedRef.current) {
      return
    }

    const fetchRecommendations = async () => {
      hasFetchedRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        // =====================================================
        // API INTEGRATION POINT
        // =====================================================
        // The getTileRecommendations function in recommendService.js
        // handles the actual API call. Currently returns mock data.
        // When FastAPI is ready, only recommendService.js needs
        // to be updated - no changes required here.
        // =====================================================
        const results = await getTileRecommendations(referenceTile)
        setRecommendations(results.recommendations || [])
      } catch (err) {
        setError('Unable to find similar tiles. Please try again.')
        console.error('Recommendation error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [referenceTile])

  // Handle missing reference tile gracefully
  if (!referenceTile) {
    return (
      <div className="page recommendation-page">
        <div className="page-content">
          <div className="recommendation-error-state">
            <div className="error-icon-large">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
            </div>
            <h3>No Tile Selected</h3>
            <p>Please go back and select a detected tile to find similar matches.</p>
            <button className="back-button" onClick={onBack}>
              Back to Results
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="page recommendation-page">
        <div className="processing-container">
          <Loader message="Finding similar tiles..." />
        </div>
      </div>
    )
  }

  const hasRecommendations = recommendations && recommendations.length > 0

  return (
    <div className="page recommendation-page">
      <div className="page-content">
        {/* Reference Tile Section */}
        <section className="reference-tile-section">
          <h2>Reference Tile</h2>
          <p className="section-description">
            Finding tiles similar to your selected detection
          </p>
          <div className="reference-tile-container">
            <img 
              src={referenceTile.image} 
              alt="Reference tile" 
              className="reference-tile-image"
            />
            <div className="reference-tile-info">
              <span className="reference-confidence">
                Detection Confidence: {(referenceTile.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="recommendations-section">
          <h2>Similar Tiles</h2>
          
          {error ? (
            <div className="recommendation-error">
              <p>{error}</p>
              <button className="retry-button" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : hasRecommendations ? (
            <>
              <p className="results-summary">
                Found {recommendations.length} similar tile{recommendations.length !== 1 ? 's' : ''}
              </p>
              
              <div className="recommendation-cards-grid">
                {recommendations.map((rec, index) => (
                  <RecommendationCard
                    key={rec.id}
                    image={rec.image}
                    similarity={rec.similarity}
                    rank={index + 1}
                  />
                ))}
              </div>
            </>
          ) : (
            /* No Recommendations State */
            <div className="no-recommendations">
              <div className="no-recommendations-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M8 11h6" />
                </svg>
              </div>
              <h3>No Similar Tiles Found</h3>
              <p className="no-recommendations-message">
                We couldn't find tiles similar to your reference in our database.
                This tile might have a unique pattern or style.
              </p>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <div className="recommendation-actions">
          <button className="back-button" onClick={onBack}>
            Back to Results
          </button>
          <button className="reset-button" onClick={onReset}>
            Upload New Image
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationPage
