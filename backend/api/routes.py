from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import traceback
import cv2
import numpy as np
from typing import Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.face_detection import FaceSkinExtractor
from services.skin_analysis import analyze_skin, _to_serializable

router = APIRouter()
face_extractor = FaceSkinExtractor()

# Skin tone analysis
@router.post("/analyze")
async def analyze_skin_tone(image: UploadFile = File(...), name: Optional[str] = Form(None)):
    try:
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        skin_pixels = face_extractor.process_image(img)
        if skin_pixels is None or len(skin_pixels) < 100:
            raise HTTPException(status_code=400, detail="No face detected in image")
        result = analyze_skin(skin_pixels, name)
        safe_result = _to_serializable(result)
        return JSONResponse(content=safe_result)
    except Exception as e:
        print("❌ Analysis failed:", e)
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": "Analysis failed", "detail": str(e)})

# Skin categories
@router.get("/categories")
async def get_categories():
    from utils.sri_lankan_tones import get_categories
    return JSONResponse(content=get_categories())

# Health
@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Pink Aura API"}

# Recommended colors for Try-On
@router.get("/shades")
async def get_shades():
    shades = [
        {"name": "Crimson", "hex": "#C9003A", "rgb": [201, 0, 58]},
        {"name": "Velvet Brown", "hex": "#7B3F00", "rgb": [123, 63, 0]},
        {"name": "Soft Pink", "hex": "#FFB6C1", "rgb": [255, 182, 193]},
        {"name": "Rose Red", "hex": "#FF4D6D", "rgb": [255, 77, 109]},
        {"name": "Peach", "hex": "#FFDAB9", "rgb": [255, 218, 185]}
    ]
    return JSONResponse(content={"shades": shades})
