# 🌺 Pink Aura - AI Skin Tone Analysis

AI-powered beauty analysis application designed for Sri Lankan skin tones.

## Features
- 🎯 Face detection & skin extraction
- 🎨 20-category skin tone classification
- 🌈 Undertone detection (warm/cool/neutral)
- 🤖 AI validation using GitHub Models
- 📊 Fitzpatrick type classification

## Tech Stack

### Backend
- Python 3.9+
- FastAPI
- OpenCV
- MediaPipe
- NumPy

### Frontend
- React 18
- Vite
- Tailwind CSS

## Installation

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` file in backend folder:
```
GITHUB_TOKEN=your_github_token_here
```

## Usage

1. Start backend server (runs on port 8000)
2. Start frontend server (runs on port 5173)
3. Open browser and navigate to http://localhost:5173
4. Enter your name
5. Capture photo
6. Click "Analyze"

## API Endpoints

- `POST /api/analyze` - Analyze skin tone
- `GET /api/categories` - Get 20 skin tone categories
- `GET /api/health` - Health check

## Team
- Member 1: Face Detection
- Member 2: Skin Analysis
- Member 3: Recommendations
- Member 4: Virtual Try-On

## License
MIT