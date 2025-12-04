# """
# Pink Aura API Routes
# FastAPI endpoints for skin tone analysis
# """

# from fastapi import APIRouter, File, UploadFile, Form, HTTPException
# from fastapi.encoders import jsonable_encoder
# from fastapi.responses import JSONResponse, Response
# import traceback
# import json
# import cv2
# import numpy as np
# from typing import Optional
# import sys
# import os

# # Add parent directory to path
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# from services.face_detection import FaceSkinExtractor
# from services.skin_analysis import analyze_skin, _to_serializable

# router = APIRouter()

# # Initialize services
# face_extractor = FaceSkinExtractor()

# @router.post("/analyze")
# async def analyze_skin_tone(
#     image: UploadFile = File(...),
#     name: Optional[str] = Form(None)
# ):
#     """
#     Analyze skin tone from uploaded image
    
#     Args:
#         image: Image file (JPEG, PNG)
#         name: Optional user name
        
#     Returns:
#         Complete skin tone analysis profile
#     """
#     try:
#         # Read image file
#         contents = await image.read()
#         nparr = np.frombuffer(contents, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
#         if img is None:
#             raise HTTPException(status_code=400, detail="Invalid image file")
        
#         # Extract skin pixels
#         skin_pixels = face_extractor.process_image(img)
        
#         if skin_pixels is None or len(skin_pixels) < 100:
#             raise HTTPException(status_code=400, detail="No face detected in image")
        
#         # Analyze skin tone
#         result = analyze_skin(skin_pixels, name)

#         # Ensure everything is pure Python types (convert numpy / custom objects)
#         safe_result = _to_serializable(result)

#         # Return JSONResponse with already-serializable content
#         return JSONResponse(content=safe_result)

#     except Exception as e:
#         print("❌ Analysis failed:", e)
#         traceback.print_exc()
#         return JSONResponse(
#             status_code=500,
#             content={"error": "Analysis failed", "detail": str(e)}
#         )

# @router.get("/categories")
# async def get_categories():
#     """Get all 20 Sri Lankan skin tone categories"""
#     from utils.sri_lankan_tones import get_categories
#     return JSONResponse(content=get_categories())

# @router.get("/health")
# async def health_check():
#     """Health check endpoint"""
#     return {"status": "healthy", "service": "Pink Aura API"}

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
from typing import Optional, Dict
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.face_detection import FaceSkinExtractor
from services.skin_analysis import analyze_skin, _to_serializable

# Import dress color recommendation
try:
    from services.dress_color_recommendation import recommend_dress_colors
    DRESS_COLORS_AVAILABLE = True
except ImportError:
    DRESS_COLORS_AVAILABLE = False
    print("⚠️ Warning: dress_color_recommendation not available")

router = APIRouter()

# Initialize services
face_extractor = FaceSkinExtractor()

@router.post("/analyze")
async def analyze_skin_tone(
    image: UploadFile = File(...),
    name: Optional[str] = Form(None),
    include_dress_colors: Optional[bool] = Form(True)
):
    """
    Analyze skin tone from uploaded image
    
    Args:
        image: Image file (JPEG, PNG)
        name: Optional user name
        include_dress_colors: Whether to include dress color recommendations (default: True)
        
    Returns:
        Complete skin tone analysis profile with optional dress color recommendations
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

        # Add dress color recommendations if enabled and available
        if include_dress_colors and DRESS_COLORS_AVAILABLE:
            try:
                # Get dress color recommendations using the skin analysis result
                dress_colors = recommend_dress_colors(result)
                result['dress_color_recommendations'] = dress_colors
            except Exception as e:
                print(f"⚠️ Dress color recommendation failed: {e}")
                result['dress_color_recommendations'] = {
                    "error": "Dress color recommendation unavailable",
                    "detail": str(e)
                }

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

@router.post("/recommend-colors")
async def get_dress_color_recommendation(skin_profile: Dict):
    """
    Get dress color recommendations from skin profile
    
    Request body should contain complete skin analysis result:
    {
        "category": {"number": 11, "name": "Kithul Honey"},
        "general_classification": {"undertone": "Warm"},
        "lab": {"L": 58.5, "a": 14.2, "b": 18.7}
    }
    
    Returns:
        Dress color recommendations with best colors, avoid colors, and styling tips
    """
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Dress color recommendation service not available"
        )
    
    try:
        recommendations = recommend_dress_colors(skin_profile)
        safe_recommendations = _to_serializable(recommendations)
        return JSONResponse(content=safe_recommendations)
    except Exception as e:
        print(f"❌ Color recommendation failed: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Color recommendation failed: {str(e)}"
        )

@router.get("/color-palettes")
async def get_all_color_palettes():
    """
    Get all available color palettes (21 palettes)
    
    Returns all color palettes for fair/medium/deep skin with all undertone variations
    """
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Dress color recommendation service not available"
        )
    
    try:
        from services.dress_color_recommendation import DressColorRecommendation
        recommender = DressColorRecommendation()
        palettes = recommender.get_all_palettes()
        return JSONResponse(content=palettes)
    except Exception as e:
        print(f"❌ Failed to load palettes: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to load palettes: {str(e)}"
        )

@router.get("/color-palette/{palette_key}")
async def get_color_palette(palette_key: str):
    """
    Get specific color palette by key
    
    Args:
        palette_key: Palette identifier (e.g., "fair_warm", "medium_neutral", "deep_cool")
    
    Examples:
        - /color-palette/fair_warm
        - /color-palette/medium_neutral
        - /color-palette/deep_cool
    
    Returns:
        Color palette with best colors, avoid colors, and styling tips
    """
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Dress color recommendation service not available"
        )
    
    try:
        from services.dress_color_recommendation import DressColorRecommendation
        recommender = DressColorRecommendation()
        palette = recommender.get_palette_by_key(palette_key)
        
        if palette is None:
            raise HTTPException(
                status_code=404, 
                detail=f"Palette '{palette_key}' not found. Valid keys are like: fair_warm, medium_neutral, deep_cool"
            )
        
        return JSONResponse(content=palette)
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Failed to get palette: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to get palette: {str(e)}"
        )

@router.get("/categories")
async def get_categories():
    """Get all 20 Sri Lankan skin tone categories"""
    from utils.sri_lankan_tones import get_categories
    return JSONResponse(content=get_categories())

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    health_status = {
        "status": "healthy",
        "service": "Pink Aura API",
        "features": {
            "skin_analysis": True,
            "dress_color_recommendations": DRESS_COLORS_AVAILABLE
        }
    }
    return JSONResponse(content=health_status)