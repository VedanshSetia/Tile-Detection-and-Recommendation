import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * CameraCapture Component
 * 
 * A reusable component for capturing images using the device camera.
 * Uses the browser's getUserMedia API for camera access.
 * 
 * Features:
 * - Live camera preview
 * - Photo capture functionality
 * - Converts captured image to File object (same shape as file upload)
 * - Graceful error handling for permissions and unsupported browsers
 * 
 * Props:
 * - onCapture: Callback function receiving the captured image as a File object
 * - onClose: Callback to close/hide the camera interface
 * 
 * The captured image is returned as a File object with:
 * - name: 'camera-capture-{timestamp}.jpg'
 * - type: 'image/jpeg'
 * This matches the same data shape used by file upload, allowing
 * seamless integration with the existing upload pipeline.
 */
function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCaptured, setIsCaptured] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  /**
   * Initializes the camera stream
   * Requests camera permission and starts video preview
   */
  const initCamera = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera is not supported in this browser. Please use a modern browser or upload a file instead.')
      setIsLoading(false)
      return
    }

    try {
      // Request camera access with preferred settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer rear camera for tile photos
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setIsLoading(false)
        }
      }
    } catch (err) {
      console.error('Camera access error:', err)
      
      // Handle specific error types
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow camera access in your browser settings and try again.')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found on this device. Please connect a camera or upload a file instead.')
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another application. Please close other apps using the camera and try again.')
      } else {
        setError('Unable to access camera. Please try again or upload a file instead.')
      }
      
      setIsLoading(false)
    }
  }, [])

  /**
   * Stops the camera stream and releases resources
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  /**
   * Captures the current video frame as an image
   * Converts to a File object matching the upload pipeline format
   */
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob, then to File
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a File object with the same shape as file upload
        const timestamp = Date.now()
        const file = new File([blob], `camera-capture-${timestamp}.jpg`, {
          type: 'image/jpeg',
          lastModified: timestamp
        })

        // Create preview URL
        const previewUrl = URL.createObjectURL(blob)
        setCapturedImage(previewUrl)
        setIsCaptured(true)

        // Store the file for later use
        canvasRef.current.capturedFile = file
      }
    }, 'image/jpeg', 0.9)
  }, [])

  /**
   * Confirms the captured photo and passes it to the parent
   */
  const confirmCapture = useCallback(() => {
    const file = canvasRef.current?.capturedFile
    if (file && onCapture) {
      stopCamera()
      onCapture(file)
    }
  }, [onCapture, stopCamera])

  /**
   * Retakes the photo - returns to live preview
   */
  const retakePhoto = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
    setCapturedImage(null)
    setIsCaptured(false)
  }, [capturedImage])

  /**
   * Handles closing the camera interface
   */
  const handleClose = useCallback(() => {
    stopCamera()
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
    if (onClose) {
      onClose()
    }
  }, [stopCamera, capturedImage, onClose])

  // Initialize camera on mount
  useEffect(() => {
    initCamera()
    
    // Cleanup on unmount
    return () => {
      stopCamera()
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage)
      }
    }
  }, [initCamera, stopCamera]) // capturedImage intentionally excluded to prevent re-init

  return (
    <div className="camera-capture">
      <div className="camera-container">
        {/* Header with close button */}
        <div className="camera-header">
          <h3>Camera Capture</h3>
          <button 
            className="camera-close-btn" 
            onClick={handleClose}
            aria-label="Close camera"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="camera-loading">
            <div className="camera-spinner"></div>
            <p>Initializing camera...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="camera-error">
            <div className="camera-error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
            </div>
            <p className="camera-error-message">{error}</p>
            <button className="camera-retry-btn" onClick={handleClose}>
              Go Back
            </button>
          </div>
        )}

        {/* Camera preview / Captured image */}
        {!error && (
          <div className="camera-preview-container">
            {/* Live video preview - hidden when captured */}
            <video
              ref={videoRef}
              className={`camera-video ${isCaptured ? 'hidden' : ''}`}
              autoPlay
              playsInline
              muted
            />
            
            {/* Captured image preview */}
            {isCaptured && capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="camera-captured-image"
              />
            )}
            
            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {/* Action buttons */}
        {!isLoading && !error && (
          <div className="camera-actions">
            {!isCaptured ? (
              <button className="camera-capture-btn" onClick={capturePhoto}>
                <span className="capture-icon"></span>
                Capture Photo
              </button>
            ) : (
              <div className="camera-confirm-actions">
                <button className="camera-retake-btn" onClick={retakePhoto}>
                  Retake
                </button>
                <button className="camera-use-btn" onClick={confirmCapture}>
                  Use Photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CameraCapture
