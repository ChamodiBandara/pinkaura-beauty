"""
Pink Aura API Routes
FastAPI endpoints for skin tone analysis and dress color recommendations
"""

from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import traceback
import cv2
import numpy as np
from typing import Optional, Dict
import sys
import os

# Add parent directory to path for services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.face_detection import FaceSkinExtractor
from services.skin_analysis import analyze_skin, _to_serializable

# Optional: Import dress color recommendation service
try:
    from services.dress_color_recommendation import recommend_dress_colors, DressColorRecommendation
    DRESS_COLORS_AVAILABLE = True
except ImportError:
    DRESS_COLORS_AVAILABLE = False
    print("⚠️ Warning: dress_color_recommendation not available")

router = APIRouter()
face_extractor = FaceSkinExtractor()


# -------------------------------
# Skin Tone Analysis
# -------------------------------
@router.post("/analyze")
async def analyze_skin_tone(
    image: UploadFile = File(...),
    name: Optional[str] = Form(None),
    include_dress_colors: Optional[bool] = Form(True)
):
    """
    Analyze skin tone from uploaded image and optionally include dress color recommendations.
    """
    try:
        # Read and decode image
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

        # Add dress color recommendations if requested and available
        if include_dress_colors and DRESS_COLORS_AVAILABLE:
            try:
                result['dress_color_recommendations'] = recommend_dress_colors(result)
            except Exception as e:
                print(f"⚠️ Dress color recommendation failed: {e}")
                result['dress_color_recommendations'] = {
                    "error": "Dress color recommendation unavailable",
                    "detail": str(e)
                }

        # Ensure JSON-serializable
        safe_result = _to_serializable(result)
        return JSONResponse(content=safe_result)

    except Exception as e:
        print("❌ Analysis failed:", e)
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": "Analysis failed", "detail": str(e)}
        )


# -------------------------------
# Standalone Dress Color Recommendation
# -------------------------------
@router.post("/recommend-colors")
async def get_dress_color_recommendation(skin_profile: Dict):
    """
    Get dress color recommendations from a skin profile.
    """
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dress color recommendation service not available")

    try:
        recommendations = recommend_dress_colors(skin_profile)
        return JSONResponse(content=_to_serializable(recommendations))
    except Exception as e:
        print(f"❌ Color recommendation failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Color recommendation failed: {str(e)}")


# -------------------------------
# Color Palettes
# -------------------------------
@router.get("/color-palettes")
async def get_all_color_palettes():
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dress color recommendation service not available")
    
    try:
        recommender = DressColorRecommendation()
        palettes = recommender.get_all_palettes()
        return JSONResponse(content=palettes)
    except Exception as e:
        print(f"❌ Failed to load palettes: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to load palettes: {str(e)}")


@router.get("/color-palette/{palette_key}")
async def get_color_palette(palette_key: str):
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dress color recommendation service not available")
    
    try:
        recommender = DressColorRecommendation()
        palette = recommender.get_palette_by_key(palette_key)
        if palette is None:
            raise HTTPException(status_code=404, detail=f"Palette '{palette_key}' not found")
        return JSONResponse(content=palette)
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Failed to get palette: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to get palette: {str(e)}")


# -------------------------------
# Sri Lankan Skin Tone Categories
# -------------------------------
@router.get("/categories")
async def get_categories():
    from utils.sri_lankan_tones import get_categories
    return JSONResponse(content=get_categories())


# -------------------------------
# Health Check
# -------------------------------
@router.get("/health")
async def health_check():
    health_status = {
        "status": "healthy",
        "service": "Pink Aura API",
        "features": {
            "skin_analysis": True,
            "dress_color_recommendations": DRESS_COLORS_AVAILABLE
        }
    }
    return JSONResponse(content=health_status)


# -------------------------------
# Recommended shades for Try-On
# -------------------------------
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
