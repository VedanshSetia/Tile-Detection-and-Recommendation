/**
 * Loader Component
 * 
 * Displays a loading spinner with optional message.
 * Used during API calls and processing states.
 * 
 * Props:
 * - message: Optional string to display below the spinner
 */
function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  )
}

export default Loader
