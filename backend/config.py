"""
Pink Aura Configuration
Settings and environment variables
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Settings
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    
    # GitHub Models API
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", None)
    
    # Camera Settings
    CAMERA_INDEX = int(os.getenv("CAMERA_INDEX", 0))
    CAMERA_WIDTH = int(os.getenv("CAMERA_WIDTH", 640))
    CAMERA_HEIGHT = int(os.getenv("CAMERA_HEIGHT", 480))
    
    # File Paths
    RESULTS_DIR = os.getenv("RESULTS_DIR", "results")
    
    # CORS Origins
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    
    @classmethod
    def init_app(cls):
        """Initialize application directories"""
        os.makedirs(cls.RESULTS_DIR, exist_ok=True)

config = Config()