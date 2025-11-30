"""
Pink Aura Backend - Main Entry Point
FastAPI application for skin tone analysis
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
import uvicorn

app = FastAPI(
    title="Pink Aura API",
    description="AI-powered skin tone analysis for Sri Lankan beauty",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api", tags=["Analysis"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🌺 Welcome to Pink Aura API 🌺",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    print("🌺 Starting Pink Aura Backend...")
    print("📍 API Docs: http://localhost:8000/docs")
    print("📍 Frontend: http://localhost:5173")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )