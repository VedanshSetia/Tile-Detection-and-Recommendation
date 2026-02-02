# Tile Detection & Recommendation System

A web-based demo application for detecting and recommending tiles from uploaded images.

## Tech Stack

- React 18
- Vite
- JavaScript (ES6+)
- CSS3 (no external UI libraries)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ImageUploader.jsx   # Drag & drop image upload component
│   ├── Loader.jsx          # Loading spinner component
│   └── TileCard.jsx        # Tile result card component
│
├── pages/
│   ├── UploadPage.jsx      # Main upload interface
│   └── ResultPage.jsx      # Detection results display
│
├── services/
│   └── detectService.js    # API service layer (mock/real)
│
├── styles/
│   └── app.css             # Global styles
│
├── App.jsx                 # Main app component
└── main.jsx                # Entry point

public/
└── mock/                   # Mock tile images for demo
    ├── tile1.svg
    ├── tile2.svg
    └── tile3.svg
```

## API Integration

The app is designed to work with mock data during development and can be easily integrated with a FastAPI backend.

### Current Mock Implementation

The `detectService.js` file contains mock logic that:
- Simulates network delay (1.5-2 seconds)
- Returns random detection results
- Returns empty results ~25% of the time to simulate no detection

### FastAPI Integration

To integrate with a real backend:

1. Create a `.env` file:
```
VITE_API_URL=http://localhost:8000
```

2. Uncomment the FastAPI implementation in `src/services/detectService.js`

3. The API should accept:
- **Endpoint**: `POST /api/detect`
- **Body**: `FormData` with `image` field

4. Expected response format:
```json
{
  "detections": [
    {
      "id": 1,
      "image": "url-to-tile-image",
      "confidence": 0.95
    }
  ]
}
```

## Features

- Drag & drop image upload
- File type validation (PNG, JPG, JPEG)
- File size validation (max 10MB)
- Loading state with spinner
- Top 3 detection results sorted by confidence
- Confidence score display with color coding
- No detection handling with helpful tips
- Responsive design (desktop-first)

## Demo Notes

This is a demo application designed for presentations. The mock service simulates real API behavior including:
- Processing delays
- Random confidence scores
- Occasional empty results (no detection)
