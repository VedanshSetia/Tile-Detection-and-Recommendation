/**
 * Tile Detection Service
 * 
 * This service handles all tile detection API calls.
 * Currently uses mock data for demo purposes.
 * 
 * =====================================================
 * FASTAPI INTEGRATION GUIDE
 * =====================================================
 * 
 * When the backend API is ready, replace the mock logic
 * in the detectTile function with actual API calls.
 * 
 * Example FastAPI integration:
 * 
 * export async function detectTile(imageFile) {
 *   const formData = new FormData()
 *   formData.append('image', imageFile)
 *   
 *   const response = await fetch('http://api-url/detect', {
 *     method: 'POST',
 *     body: formData,
 *   })
 *   
 *   if (!response.ok) {
 *     throw new Error('Detection failed')
 *   }
 *   
 *   return await response.json()
 * }
 * 
 * The response format should match:
 * {
 *   detections: [
 *     { id: number, image: string, confidence: number }
 *   ]
 * }
 * 
 * =====================================================
 */

// Mock tile images (stored in public/mock/)
const MOCK_TILES = [
  { id: 1, image: '/mock/tile1.svg' },
  { id: 2, image: '/mock/tile2.svg' },
  { id: 3, image: '/mock/tile3.svg' },
]

// Simulated network delay range (in milliseconds)
const MIN_DELAY = 1500
const MAX_DELAY = 2000

// Probability of returning empty detections (20-30%)
const EMPTY_DETECTION_PROBABILITY = 0.25

/**
 * Generates a random delay within the specified range
 */
function getRandomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY
}

/**
 * Generates a random confidence score between 0.5 and 0.99
 * Higher scores are slightly less common for realism
 */
function generateConfidence() {
  // Generate a score weighted towards middle-high range
  const base = 0.5
  const range = 0.49
  const random = Math.random()
  // Slight bias towards middle values
  const weighted = Math.pow(random, 0.7)
  return Number((base + weighted * range).toFixed(3))
}

/**
 * Generates mock detection results
 */
function generateMockDetections() {
  // Randomly decide if we should return empty detections
  if (Math.random() < EMPTY_DETECTION_PROBABILITY) {
    return { detections: [] }
  }

  // Generate 3-5 mock detections
  const numDetections = Math.floor(Math.random() * 3) + 3
  
  const detections = MOCK_TILES.slice(0, numDetections).map((tile, index) => ({
    id: tile.id,
    image: tile.image,
    confidence: generateConfidence(),
  }))

  // Sort by confidence descending
  detections.sort((a, b) => b.confidence - a.confidence)

  return { detections }
}

/**
 * Detects tiles in the provided image
 * 
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} - Detection results
 * 
 * =====================================================
 * API INTEGRATION POINT
 * =====================================================
 * Replace the mock implementation below with actual
 * FastAPI calls when the backend is ready.
 * =====================================================
 */
export async function detectTile(imageFile) {
  // Log for debugging (remove in production)
  console.log('Processing image:', imageFile.name, imageFile.type, imageFile.size)

  // =====================================================
  // MOCK IMPLEMENTATION - Replace with FastAPI call
  // =====================================================
  
  return new Promise((resolve, reject) => {
    const delay = getRandomDelay()
    
    setTimeout(() => {
      try {
        const results = generateMockDetections()
        console.log('Mock detection results:', results)
        resolve(results)
      } catch (error) {
        reject(new Error('Detection processing failed'))
      }
    }, delay)
  })

  // =====================================================
  // FASTAPI IMPLEMENTATION (uncomment when ready)
  // =====================================================
  // 
  // const formData = new FormData()
  // formData.append('image', imageFile)
  // 
  // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  // 
  // const response = await fetch(`${API_BASE_URL}/api/detect`, {
  //   method: 'POST',
  //   body: formData,
  // })
  // 
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({}))
  //   throw new Error(errorData.message || 'Detection failed')
  // }
  // 
  // return await response.json()
  // 
  // =====================================================
}

/**
 * API Configuration
 * 
 * When integrating with FastAPI, set these environment variables:
 * - VITE_API_URL: Base URL for the API (e.g., http://localhost:8000)
 * 
 * Create a .env file in the project root:
 * VITE_API_URL=http://localhost:8000
 */
