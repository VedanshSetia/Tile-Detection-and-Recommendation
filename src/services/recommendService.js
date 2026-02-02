/**
 * Tile Recommendation Service
 * 
 * This service handles all tile recommendation API calls.
 * Uses ResNet-based similarity matching on the backend.
 * Currently uses mock data for demo purposes.
 * 
 * =====================================================
 * FASTAPI INTEGRATION GUIDE
 * =====================================================
 * 
 * When the backend API is ready, replace the mock logic
 * in the getTileRecommendations function with actual API calls.
 * 
 * Example FastAPI integration:
 * 
 * export async function getTileRecommendations(referenceTile) {
 *   const response = await fetch('http://api-url/recommend', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       tileId: referenceTile.id,
 *       tileImage: referenceTile.image,
 *     }),
 *   })
 *   
 *   if (!response.ok) {
 *     throw new Error('Recommendation failed')
 *   }
 *   
 *   return await response.json()
 * }
 * 
 * The response format should match:
 * {
 *   recommendations: [
 *     { id: number, image: string, similarity: number }
 *   ]
 * }
 * 
 * =====================================================
 */

// Mock tile images for recommendations (stored in public/mock/)
// In production, these would come from the ResNet model's database
const MOCK_RECOMMENDATION_TILES = [
  { id: 101, image: '/mock/tile1.svg' },
  { id: 102, image: '/mock/tile2.svg' },
  { id: 103, image: '/mock/tile3.svg' },
  { id: 104, image: '/mock/tile1.svg' },
  { id: 105, image: '/mock/tile2.svg' },
  { id: 106, image: '/mock/tile3.svg' },
  { id: 107, image: '/mock/tile1.svg' },
  { id: 108, image: '/mock/tile2.svg' },
]

// Simulated network delay range (in milliseconds)
const MIN_DELAY = 1500
const MAX_DELAY = 2000

// Probability of returning empty recommendations (~10% for demo)
const EMPTY_RECOMMENDATION_PROBABILITY = 0.1

/**
 * Generates a random delay within the specified range
 */
function getRandomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY
}

/**
 * Generates a realistic similarity score
 * ResNet-based similarity scores typically range from 0.72 to 0.95
 * for visually similar tiles
 */
function generateSimilarity() {
  // Generate a score in the realistic range (0.72 - 0.95)
  const minSimilarity = 0.72
  const maxSimilarity = 0.95
  const range = maxSimilarity - minSimilarity
  
  // Slight bias towards higher similarities for better demo experience
  const random = Math.random()
  const weighted = Math.pow(random, 0.6)
  
  return Number((minSimilarity + weighted * range).toFixed(3))
}

/**
 * Generates mock recommendation results
 * Simulates ResNet-based similarity matching
 */
function generateMockRecommendations(referenceTile) {
  // Randomly decide if we should return empty recommendations
  // This simulates cases where no similar tiles are found
  if (Math.random() < EMPTY_RECOMMENDATION_PROBABILITY) {
    return { recommendations: [] }
  }

  // Generate 5-8 recommendations randomly
  const numRecommendations = Math.floor(Math.random() * 4) + 5
  
  // Shuffle and select tiles (exclude reference tile by id)
  const availableTiles = MOCK_RECOMMENDATION_TILES.filter(
    tile => tile.id !== referenceTile?.id
  )
  
  const shuffled = [...availableTiles].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, numRecommendations)
  
  const recommendations = selected.map((tile) => ({
    id: tile.id,
    image: tile.image,
    similarity: generateSimilarity(),
  }))

  // Sort by similarity descending (best matches first)
  recommendations.sort((a, b) => b.similarity - a.similarity)

  return { recommendations }
}

/**
 * Gets tile recommendations based on a reference tile
 * Uses ResNet-based similarity matching
 * 
 * @param {Object} referenceTile - The tile to find similar matches for
 * @param {number} referenceTile.id - Tile ID
 * @param {string} referenceTile.image - Tile image URL
 * @returns {Promise<Object>} - Recommendation results
 * 
 * =====================================================
 * API INTEGRATION POINT
 * =====================================================
 * TODO: Replace this mock with FastAPI ResNet inference endpoint
 * 
 * The FastAPI endpoint should:
 * 1. Accept the reference tile image/ID
 * 2. Run ResNet feature extraction
 * 3. Compare against tile database using cosine similarity
 * 4. Return top N most similar tiles
 * =====================================================
 */
export async function getTileRecommendations(referenceTile) {
  // Log for debugging (remove in production)
  console.log('Getting recommendations for tile:', referenceTile)

  // Validate input
  if (!referenceTile || !referenceTile.id) {
    throw new Error('Invalid reference tile provided')
  }

  // =====================================================
  // MOCK IMPLEMENTATION - Replace with FastAPI call
  // =====================================================
  
  return new Promise((resolve, reject) => {
    const delay = getRandomDelay()
    
    setTimeout(() => {
      try {
        const results = generateMockRecommendations(referenceTile)
        console.log('Mock recommendation results:', results)
        resolve(results)
      } catch (error) {
        reject(new Error('Recommendation processing failed'))
      }
    }, delay)
  })

  // =====================================================
  // FASTAPI IMPLEMENTATION (uncomment when ready)
  // =====================================================
  // 
  // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  // 
  // const response = await fetch(`${API_BASE_URL}/api/recommend`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     tileId: referenceTile.id,
  //     tileImage: referenceTile.image,
  //   }),
  // })
  // 
  // if (!response.ok) {
  //   const errorData = await response.json().catch(() => ({}))
  //   throw new Error(errorData.message || 'Recommendation failed')
  // }
  // 
  // return await response.json()
  // 
  // =====================================================
}

/**
 * API Configuration Note
 * 
 * When integrating with FastAPI, set these environment variables:
 * - VITE_API_URL: Base URL for the API (e.g., http://localhost:8000)
 * 
 * The ResNet-based recommendation endpoint should support:
 * - POST /api/recommend
 * - Request body: { tileId: number, tileImage: string }
 * - Response: { recommendations: [{ id, image, similarity }] }
 */
