import { useState } from 'react'
import UploadPage from './pages/UploadPage'
import ResultPage from './pages/ResultPage'
import RecommendationPage from './pages/RecommendationPage'

/**
 * Main Application Component
 * 
 * Handles navigation between Upload and Result pages.
 * Manages the uploaded image and detection results state.
 */
function App() {
  // Current page state: 'upload', 'result', or 'recommendation'
  const [currentPage, setCurrentPage] = useState('upload')
  
  // Stores the uploaded image file
  const [uploadedImage, setUploadedImage] = useState(null)
  
  // Stores the preview URL for the uploaded image
  const [imagePreview, setImagePreview] = useState(null)
  
  // Stores detection results from the API
  const [detectionResults, setDetectionResults] = useState(null)
  
  // Stores the selected tile for recommendations
  const [selectedTileForRecommendation, setSelectedTileForRecommendation] = useState(null)

  /**
   * Handles successful image upload
   * Creates a preview URL and stores the file
   */
  const handleImageUpload = (file) => {
    setUploadedImage(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  /**
   * Handles navigation to results page with detection data
   */
  const handleDetectionComplete = (results) => {
    setDetectionResults(results)
    setCurrentPage('result')
  }

  /**
   * Resets the entire flow for a new upload
   */
  const handleReset = () => {
    // Clean up the preview URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setUploadedImage(null)
    setImagePreview(null)
    setDetectionResults(null)
    setSelectedTileForRecommendation(null)
    setCurrentPage('upload')
  }

  /**
   * Navigates to recommendations page with the selected tile
   * Defaults to highest confidence tile if none specified
   */
  const handleFindSimilar = (tile) => {
    setSelectedTileForRecommendation(tile)
    setCurrentPage('recommendation')
  }

  /**
   * Returns from recommendations to results page
   */
  const handleBackToResults = () => {
    setSelectedTileForRecommendation(null)
    setCurrentPage('result')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tile Detection & Recommendation</h1>
      </header>
      
      <main className="app-main">
        {currentPage === 'upload' && (
          <UploadPage
            uploadedImage={uploadedImage}
            imagePreview={imagePreview}
            onImageUpload={handleImageUpload}
            onDetectionComplete={handleDetectionComplete}
          />
        )}
        
        {currentPage === 'result' && (
          <ResultPage
            imagePreview={imagePreview}
            detectionResults={detectionResults}
            onReset={handleReset}
            onFindSimilar={handleFindSimilar}
          />
        )}
        
        {currentPage === 'recommendation' && (
          <RecommendationPage
            referenceTile={selectedTileForRecommendation}
            onBack={handleBackToResults}
            onReset={handleReset}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>Tile Detection System</p>
      </footer>
    </div>
  )
}

export default App
