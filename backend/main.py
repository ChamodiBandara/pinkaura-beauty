"""
Pink Aura Backend - Main Entry Point
FastAPI application for skin tone analysis + 3D lipstick try-on
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Pink Aura API",
    description="🌺 AI-powered skin tone analysis and beauty recommendations 🌺",
    version="1.1.0"
)

# Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",  # include your Vite dev port
        "http://localhost:3000"
# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React default
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your API routes after middleware
# Include API routes (skin analysis, lip/dress colors, 3D try-on)
app.include_router(router, prefix="/api", tags=["Analysis"])

@app.get("/")
async def root():
    return {
        "message": "🌺 Welcome to Pink Aura API 🌺",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "service": "Pink Aura API"}

if __name__ == "__main__":
    print("\n🌺 Starting Pink Aura Backend...")
    print("📍 API Docs: http://localhost:8000/docs")
    print("📍 Frontend: http://localhost:5173\n")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
