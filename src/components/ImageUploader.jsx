import { useRef, useState } from 'react'

/**
 * ImageUploader Component
 * 
 * Handles image file upload via drag & drop or file picker.
 * Validates file type and size before accepting.
 * 
 * Props:
 * - onImageSelect: Callback function when a valid image is selected
 * - imagePreview: URL string for showing image preview
 */

// Configuration constants
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

function ImageUploader({ onImageSelect, imagePreview }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  /**
   * Validates the selected file
   * Returns error message if invalid, null if valid
   */
  const validateFile = (file) => {
    if (!file) {
      return 'No file selected'
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload PNG, JPG, or JPEG images only.'
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    }

    return null
  }

  /**
   * Processes the selected file
   */
  const handleFile = (file) => {
    const validationError = validateFile(file)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onImageSelect(file)
  }

  /**
   * Handles file input change event
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFile(file)
    }
  }

  /**
   * Opens the file picker dialog
   */
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Handles drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  /**
   * Handles drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  /**
   * Handles file drop event
   */
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="file-input"
        />

        {imagePreview ? (
          <div className="image-preview">
            <img src={imagePreview} alt="Uploaded tile" />
            <p className="change-image-text">Click or drop to change image</p>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="upload-text">Drag & drop your tile image here</p>
            <p className="upload-subtext">or click to browse</p>
            <p className="upload-formats">Supports: PNG, JPG, JPEG (Max 10MB)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          <span className="error-icon">!</span>
          {error}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
