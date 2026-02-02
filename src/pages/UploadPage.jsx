import { useState } from 'react'
import ImageUploader from '../components/ImageUploader'
import CameraCapture from '../components/CameraCapture'
import Loader from '../components/Loader'
import { detectTile } from '../services/detectService'

/**
 * UploadPage Component
 * 
 * Main entry point for tile image upload and detection.
 * Handles the upload flow and initiates detection process.
 * 
 * Props:
 * - uploadedImage: The currently selected image file
 * - imagePreview: Preview URL for the uploaded image
 * - onImageUpload: Callback when image is selected
 * - onDetectionComplete: Callback when detection finishes
 */
function UploadPage({ uploadedImage, imagePreview, onImageUpload, onDetectionComplete }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  /**
   * Handles image captured from camera
   * The captured image is already a File object, so it can be
   * passed directly to the existing upload pipeline
   */
  const handleCameraCapture = (file) => {
    setShowCamera(false)
    onImageUpload(file)
  }

  /**
   * Closes the camera interface
   */
  const handleCameraClose = () => {
    setShowCamera(false)
  }

  /**
   * Handles the detect button click
   * Validates image selection and initiates detection
   */
  const handleDetect = async () => {
    // Validate that an image has been selected
    if (!uploadedImage) {
      setError('Please select an image before detecting tiles.')
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      // =====================================================
      // API INTEGRATION POINT
      // =====================================================
      // The detectTile function in detectService.js handles
      // the actual API call. Currently returns mock data.
      // When FastAPI is ready, only detectService.js needs
      // to be updated - no changes required here.
      // =====================================================
      const results = await detectTile(uploadedImage)
      onDetectionComplete(results)
    } catch (err) {
      setError('An error occurred while processing the image. Please try again.')
      console.error('Detection error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading state during processing
  if (isProcessing) {
    return (
      <div className="page upload-page">
        <div className="processing-container">
          <Loader message="Analyzing tile image..." />
        </div>
      </div>
    )
  }

  // Show camera interface when camera mode is active
  if (showCamera) {
    return (
      <div className="page upload-page">
        <div className="page-content">
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={handleCameraClose}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="page upload-page">
      <div className="page-content">
        <div className="upload-section">
          <h2>Upload Tile Image</h2>
          <p className="section-description">
            Upload an image of the tile you want to identify and find matching tiles.
          </p>

          <ImageUploader
            onImageSelect={onImageUpload}
            imagePreview={imagePreview}
          />

          {/* Camera option - alternative to file upload */}
          <div className="upload-alternative">
            <span className="alternative-divider">or</span>
            <button 
              className="camera-button"
              onClick={() => setShowCamera(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Use Camera
            </button>
          </div>

          {error && (
            <div className="page-error">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <button
            className={`detect-button ${!uploadedImage ? 'disabled' : ''}`}
            onClick={handleDetect}
            disabled={!uploadedImage}
          >
            Detect Tile
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
