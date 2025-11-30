"""
Pink Aura API Routes
FastAPI endpoints for skin tone analysis
"""

from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response
import traceback
import json
import cv2
import numpy as np
from typing import Optional
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.face_detection import FaceSkinExtractor
from services.skin_analysis import analyze_skin, _to_serializable

router = APIRouter()

# Initialize services
face_extractor = FaceSkinExtractor()

@router.post("/analyze")
async def analyze_skin_tone(
    image: UploadFile = File(...),
    name: Optional[str] = Form(None)
):
    """
    Analyze skin tone from uploaded image
    
    Args:
        image: Image file (JPEG, PNG)
        name: Optional user name
        
    Returns:
        Complete skin tone analysis profile
    """
    try:
        # Read image file
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Extract skin pixels
        skin_pixels = face_extractor.process_image(img)
        
        if skin_pixels is None or len(skin_pixels) < 100:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Analyze skin tone
        result = analyze_skin(skin_pixels, name)

        # Ensure everything is pure Python types (convert numpy / custom objects)
        safe_result = _to_serializable(result)

        # Return JSONResponse with already-serializable content
        return JSONResponse(content=safe_result)

    except Exception as e:
        print("❌ Analysis failed:", e)
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": "Analysis failed", "detail": str(e)}
        )

@router.get("/categories")
async def get_categories():
    """Get all 20 Sri Lankan skin tone categories"""
    from utils.sri_lankan_tones import get_categories
    return JSONResponse(content=get_categories())

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Pink Aura API"}