from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Pink Aura API",
    description="AI-powered skin tone analysis for Sri Lankan beauty",
    version="1.0.0"
)

# Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",  # include your Vite dev port
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your API routes after middleware
app.include_router(router, prefix="/api", tags=["Analysis"])

@app.get("/")
async def root():
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
