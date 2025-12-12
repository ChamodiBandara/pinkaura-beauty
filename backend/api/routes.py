"""
Pink Aura API Routes
FastAPI endpoints for:
- Skin tone analysis
- Dress color recommendations
- Lipstick recommendations
- Foundation recommendations (NEW)
- Try-On shades
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
from services.lipstick_recommendation import LipstickRecommender

# Optional: Import dress color recommendation service
try:
    from services.dress_color_recommendation import recommend_dress_colors, DressColorRecommendation
    DRESS_COLORS_AVAILABLE = True
    print("✅ Dress color recommendation service loaded")
except ImportError:
    DRESS_COLORS_AVAILABLE = False
    print("⚠️ Warning: dress_color_recommendation not available")

# Initialize services
print("🔧 Initializing services...")
face_extractor = FaceSkinExtractor()
lipstick_recommender = LipstickRecommender()
print("✅ All services initialized!")

router = APIRouter()


# ---------------------------------------------------------------------
# MAIN SKIN TONE ANALYSIS (updated with FOUNDATION + extended logging)
# ---------------------------------------------------------------------
@router.post("/analyze")
async def analyze_skin_tone(
    image: UploadFile = File(...),
    name: Optional[str] = Form(None),
    recommend: Optional[bool] = Form(True)
):
    """
    Analyze skin tone from uploaded image with face detection and skin region analysis:
    - Detects face dynamically
    - Analyzes skin from forehead, left cheek, right cheek
    - Returns skin tone, imperfections, and recommendations
    - Works exactly like the frontend camera overlay regions
    """
    try:
        print(f"\n{'='*60}")
        print("📸 New analysis request received")
        print(f"User: {name or 'Anonymous'}")
        print(f"{'='*60}")

        # Read and decode image
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        print(f"✅ Image loaded: {img.shape}")

        # Import face detection and enhanced skin analysis
        from services.face_detection import FaceSkinExtractor
        from services.skin_analysis import analyze_skin, _to_serializable
        
        # Detect face and extract skin pixels
        print("🔍 Detecting face and extracting skin pixels...")
        face_extractor = FaceSkinExtractor()
        
        # Step 1: Detect face and get landmarks
        face_detected, face_landmarks = face_extractor.detect_face(img)
        
        if not face_detected:
            raise HTTPException(
                status_code=400,
                detail='No face detected. Please ensure your face is clearly visible.'
            )
        
        print(f"✅ Face detected")
        
        # Step 2: Extract skin pixels from face landmarks
        skin_pixels = face_extractor.extract_skin_pixels(img, face_landmarks)
        
        # Convert to list if numpy array
        if isinstance(skin_pixels, np.ndarray):
            skin_pixels = skin_pixels.tolist()
        
        if skin_pixels is None or len(skin_pixels) < 100:
            raise HTTPException(
                status_code=400,
                detail='Could not extract enough skin pixels. Please ensure your face is clearly visible.'
            )
        
        print(f"✅ Extracted {len(skin_pixels)} skin pixels")
        
        # Step 3: Analyze skin tone using enhanced classifier
        print("🔬 Running enhanced skin tone analysis...")
        # Convert back to numpy array for analysis
        skin_pixels_array = np.array(skin_pixels)
        profile = analyze_skin(skin_pixels_array, user_name=name)
        
        # Make profile JSON-serializable
        profile = _to_serializable(profile)

        # Step 3b: Get lipstick recommendations when requested
        lipstick_rec = None
        if recommend:
            try:
                lipstick_rec = lipstick_recommender.recommend(profile)
                lipstick_rec = _to_serializable(lipstick_rec)
                print("💄 Lipstick recommendations attached")
            except Exception as rec_err:
                print(f"⚠️ Lipstick recommendation failed: {rec_err}")
                traceback.print_exc()
        
        # Step 3c: Get dress color recommendations when requested
        dress_colors = None
        if recommend and DRESS_COLORS_AVAILABLE:
            try:
                dress_colors = recommend_dress_colors(profile)
                dress_colors = _to_serializable(dress_colors)
                print("👗 Dress color recommendations attached")
            except Exception as dress_err:
                print(f"⚠️ Dress color recommendation failed: {dress_err}")
                traceback.print_exc()
        
        # Step 4: Get bounding box from landmarks (rough estimate)
        height, width = img.shape[:2]
        x_coords = [lm.x * width for lm in face_landmarks.landmark]
        y_coords = [lm.y * height for lm in face_landmarks.landmark]
        
        face_box = {
            "x": int(min(x_coords)),
            "y": int(min(y_coords)),
            "width": int(max(x_coords) - min(x_coords)),
            "height": int(max(y_coords) - min(y_coords))
        }
        
        # Build response with full profile data
        response = {
            "success": True,
            **profile,  # Include all profile fields: category, undertone_info, exact_skin_color, etc.
            "face_detection": {
                "detected": True,
                "face_box": face_box
            }
        }

        # Include lipstick recommendation when available
        if lipstick_rec:
            response["lipstick_recommendation"] = lipstick_rec
        
        # Include dress color recommendations when available
        if dress_colors:
            response["dress_color_recommendations"] = dress_colors
        
        print("✅ Full analysis complete!")
        print(f"   Category: #{profile.get('category', {}).get('number', '?')} - {profile.get('category', {}).get('name', '?')}")
        print(f"   Undertone: {profile.get('undertone_info', {}).get('undertone', '?')}")
        print(f"   Skin Color: {profile.get('exact_skin_color', {}).get('hex', '?')}")
        
        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error during analysis: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# -------------------------------------------------------------------------
# DRESS COLOR RECOMMENDATION
# -------------------------------------------------------------------------
@router.post("/recommend-colors")
async def get_dress_color_recommendation(skin_profile: Dict):
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dress color service not available")
    try:
        recommendations = recommend_dress_colors(skin_profile)
        return JSONResponse(content=_to_serializable(recommendations))
    except Exception as e:
        print(f"❌ Dress color recommendation failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------
# COLOR PALETTES
# ---------------------------------------------------------------------
@router.get("/color-palettes")
async def get_all_color_palettes():
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dress color service not available")
    try:
        recommender = DressColorRecommendation()
        return JSONResponse(content=recommender.get_all_palettes())
    except Exception as e:
        print(f"❌ Failed to load palettes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/color-palette/{palette_key}")
async def get_color_palette(palette_key: str):
    if not DRESS_COLORS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dress color service not available")
    try:
        recommender = DressColorRecommendation()
        palette = recommender.get_palette_by_key(palette_key)
        if palette is None:
            raise HTTPException(status_code=404, detail=f"Palette '{palette_key}' not found")
        return JSONResponse(content=palette)
    except Exception as e:
        print(f"❌ Failed to get palette: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------
# CATEGORIES
# ---------------------------------------------------------------------
@router.get("/categories")
async def get_categories():
    try:
        from utils.sri_lankan_tones import get_categories
        return JSONResponse(content=get_categories())
    except Exception as e:
        print(f"❌ Error getting categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------
# LIPSTICK RECOMMENDATION
# ---------------------------------------------------------------------
@router.post("/recommend")
async def get_lipstick_recommendation(skin_profile: dict):
    try:
        rec = lipstick_recommender.recommend(skin_profile)
        return JSONResponse(content=_to_serializable(rec))
    except Exception as e:
        print(f"❌ Lipstick recommendation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------
# TRY-ON SHADES
# ---------------------------------------------------------------------
@router.get("/shades")
async def get_shades():
    shades = [
        {"name": "Crimson", "hex": "#C9003A", "rgb": [201, 0, 58]},
        {"name": "Velvet Brown", "hex": "#7B3F00", "rgb": [123, 63, 0]},
        {"name": "Soft Pink", "hex": "#FFB6C1", "rgb": [255, 182, 193]},
        {"name": "Rose Red", "hex": "#FF4D6D", "rgb": [255, 77, 109]},
        {"name": "Peach", "hex": "#FFDAB9", "rgb": [255, 218, 185]},
    ]
    return JSONResponse(content={"shades": shades})


# ---------------------------------------------------------------------
# HEALTH CHECK (updated with foundation)
# ---------------------------------------------------------------------
@router.get("/health")
async def health_check():
    status = {
        "status": "healthy",
        "service": "Pink Aura API",
        "version": "2.1",
        "features": {
            "skin_analysis": True,
            "lipstick_recommendations": True,
            "foundation_recommendations": True,   # NEW
            "dress_color_recommendations": DRESS_COLORS_AVAILABLE
        }
    }
    return JSONResponse(content=status)
