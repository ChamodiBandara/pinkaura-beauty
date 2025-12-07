
# """
# Pink Aura API Routes
# FastAPI endpoints for:
# - Skin tone analysis
# - Dress color recommendations
# - Lipstick recommendations
# - Try-On shades
# FastAPI endpoints for skin tone analysis with lipstick, foundation, and dress color recommendations
# """

# from fastapi import APIRouter, File, UploadFile, Form, HTTPException
# from fastapi.responses import JSONResponse
# import traceback
# import cv2
# import numpy as np
# from typing import Optional, Dict
# import sys
# import os

# # Add parent directory to path for services
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# from services.face_detection import FaceSkinExtractor
# from services.skin_analysis import analyze_skin, _to_serializable
# from services.lipstick_recommendation import LipstickRecommender

# # Optional: Import dress color recommendation service
# try:
#     from services.dress_color_recommendation import recommend_dress_colors, DressColorRecommendation
#     DRESS_COLORS_AVAILABLE = True
# except ImportError:
#     DRESS_COLORS_AVAILABLE = False
#     print("⚠️ Warning: dress_color_recommendation not available")

# # Initialize services
# print("🔧 Initializing services...")
# face_extractor = FaceSkinExtractor()
# lipstick_recommender = LipstickRecommender()
# print("✅ All services initialized!")

# # Create router
# router = APIRouter()


# # -------------------------------
# # Skin Tone Analysis (Main Endpoint)
# # -------------------------------
# @router.post("/analyze")
# async def analyze_skin_tone(
#     image: UploadFile = File(...),
#     name: Optional[str] = Form(None),
#     include_dress_colors: Optional[bool] = Form(True)
# ):
#     """
#     Analyze skin tone from uploaded image with optional dress color recommendations and lipstick suggestions.
#     """
#     try:
#         print(f"\n📸 New analysis request - User: {name or 'Anonymous'}")

#     Analyze skin tone from uploaded image with lipstick and foundation recommendations
    
#     Args:
#         image: Image file (JPEG, PNG)
#         name: Optional user name
#         include_dress_colors: Whether to include dress color recommendations (default: True)
        
#     Returns:
#         Complete skin tone analysis profile with:
#         - Skin tone category (1-20)
#         - Undertone detection
#         - LAB color values
#         - 💄 Lipstick recommendations
#         - 👗 Dress color recommendations (optional)
#         - ✨ Foundation recommendations (NEW!)
#     """
#     try:
#         print(f"\n{'='*60}")
#         print(f"📸 New analysis request received")
#         print(f"   User: {name or 'Anonymous'}")
#         print(f"   Include dress colors: {include_dress_colors}")
#         print(f"{'='*60}")
        
#         # Read and decode image
#         contents = await image.read()
#         nparr = np.frombuffer(contents, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
#         if img is None:
#             raise HTTPException(status_code=400, detail="Invalid image file")

        
#         print(f"✅ Image loaded: {img.shape}")
        
#         # Extract skin pixels
#         skin_pixels = face_extractor.process_image(img)
        
#         if skin_pixels is None or len(skin_pixels) < 100:
#             raise HTTPException(
#                 status_code=400, 
#                 detail="No face detected in image. Please ensure your face is clearly visible."
#             )

#         # Skin tone analysis
#         result = analyze_skin(skin_pixels, name)
#         safe_result = _to_serializable(result)

#         # Add dress color recommendations if requested
        
#         print(f"✅ Extracted {len(skin_pixels)} skin pixels")
        
#         # Analyze skin tone (NOW INCLUDES FOUNDATION RECOMMENDATIONS!)
#         print("🎨 Analyzing skin tone...")
#         result = analyze_skin(skin_pixels, name)
        
#         print(f"✅ Skin tone analysis complete:")
#         print(f"   Category: #{result.get('category', {}).get('number')} - {result.get('category', {}).get('name')}")
#         print(f"   Undertone: {result.get('undertone_info', {}).get('undertone')}")
        
#         # Check if foundation recommendations were included
#         if 'foundation_recommendations' in result:
#             foundation_count = len(result['foundation_recommendations'].get('recommendations', []))
#             print(f"   ✨ Foundation Recommendations: {foundation_count} matches")
#         else:
#             print(f"   ⚠️ Foundation recommendations not available")
        
#         # Ensure everything is pure Python types
#         safe_result = _to_serializable(result)

#         # Add lipstick recommendations
#         print("💄 Generating lipstick recommendations...")
#         try:
#             lipstick_rec = lipstick_recommender.recommend(safe_result)
#             safe_result['lipstick_recommendation'] = _to_serializable(lipstick_rec)
            
#             # Count recommendations
#             nude_count = len(lipstick_rec.get('recommendations', {}).get('nude', []))
#             everyday_count = len(lipstick_rec.get('recommendations', {}).get('everyday', []))
#             bold_count = len(lipstick_rec.get('recommendations', {}).get('bold', []))
            
#             print(f"✅ Lipstick recommendations generated:")
#             print(f"   Nude: {nude_count} shades")
#             print(f"   Everyday: {everyday_count} shades")
#             print(f"   Bold: {bold_count} shades")
            
#         except Exception as e:
#             print(f"⚠️ Lipstick recommendation failed: {e}")
#             traceback.print_exc()
#             # Don't fail the whole request, just set to None
#             safe_result['lipstick_recommendation'] = None

#         # Add dress color recommendations if requested and available
#         if include_dress_colors and DRESS_COLORS_AVAILABLE:
#             print("👗 Generating dress color recommendations...")
#             try:
#                 safe_result['dress_color_recommendations'] = recommend_dress_colors(safe_result)
#                 dress_colors = recommend_dress_colors(safe_result)
#                 safe_result['dress_color_recommendations'] = _to_serializable(dress_colors)
#                 print(f"✅ Dress color recommendations generated")
#             except Exception as e:
#                 print(f"⚠️ Dress color recommendation failed: {e}")
#                 safe_result['dress_color_recommendations'] = {
#                     "error": "Dress color recommendation unavailable",
#                     "detail": str(e)
#                 }

#         # Lipstick recommendations
#         try:
#             lipstick_rec = lipstick_recommender.recommend(safe_result)
#             safe_result['lipstick_recommendation'] = _to_serializable(lipstick_rec)
#         except Exception as e:
#             print(f"⚠️ Lipstick recommendation failed: {e}")
#             safe_result['lipstick_recommendation'] = None

#         print(f"✅ Analysis complete for User: {name or 'Anonymous'}")
#         print(f"{'='*60}")
#         print(f"✅ Analysis complete! Sending response...")
#         print(f"   - Skin tone: ✓")
#         print(f"   - Lipstick: {'✓' if safe_result.get('lipstick_recommendation') else '✗'}")
#         print(f"   - Foundation: {'✓' if safe_result.get('foundation_recommendations') else '✗'}")
#         print(f"   - Dress colors: {'✓' if safe_result.get('dress_color_recommendations') else '✗'}")
#         print(f"{'='*60}\n")

#         # Return complete response
#         return JSONResponse(content=safe_result)

#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Critical error: {e}")
#         traceback.print_exc()
#         return JSONResponse(
#             status_code=500,
#             content={
#                 "error": "Analysis failed", 
#                 "detail": str(e),
#                 "message": "An unexpected error occurred. Please try again."
#             }
#         )


# # -------------------------------
# # Sri Lankan Skin Tone Categories
# # -------------------------------
# @router.get("/categories")
# async def get_categories():
#     """
#     Get all 20 Sri Lankan skin tone categories
    
#     Returns:
#         Dictionary of all skin tone categories with details
#     """
#     try:
#         from utils.sri_lankan_tones import get_categories
#         categories = get_categories()
#         print(f"📋 Categories requested - returning {len(categories)} categories")
#         return JSONResponse(content=categories)
#     except Exception as e:
#         print(f"❌ Error getting categories: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# # -------------------------------
# # Standalone Lipstick Recommendation
# # -------------------------------
# @router.post("/recommend")
# async def get_lipstick_recommendation(skin_profile: dict):
#     """
#     Get lipstick recommendations for a given skin profile
    
#     Args:
#         skin_profile: Complete skin analysis profile with category and undertone_info
        
#     Returns:
#         Lipstick recommendations with nude, everyday, and bold shades
#     """
#     try:
#         print(f"\n💄 Lipstick recommendation requested")
#         print(f"   Category: {skin_profile.get('category', {}).get('number')}")
#         print(f"   Undertone: {skin_profile.get('undertone_info', {}).get('undertone')}")
        
#         rec = lipstick_recommender.recommend(skin_profile)
#         safe_rec = _to_serializable(rec)
        
#         print(f"✅ Recommendations generated successfully\n")
        
#         return JSONResponse(content=safe_rec)
        
#     except Exception as e:
#         print(f"❌ Recommendation generation failed: {e}")
#         traceback.print_exc()
#         return JSONResponse(
#             status_code=500, 
#             content={
#                 "error": "Recommendation failed", 
#                 "detail": str(e)
#             }
#         )


# # -------------------------------
# # Dress Color Recommendations
# # -------------------------------
# @router.post("/recommend-colors")
# async def get_dress_color_recommendation(skin_profile: Dict):
#     """
#     Get dress color recommendations from a skin profile.
    
#     Args:
#         skin_profile: Complete skin analysis profile
        
#     Returns:
#         Dress color recommendations with palettes
#     """
#     if not DRESS_COLORS_AVAILABLE:
#         raise HTTPException(status_code=503, detail="Dress color recommendation service not available")
#     try:
#         print(f"👗 Dress color recommendation requested")
#         recommendations = recommend_dress_colors(skin_profile)
#         safe_recommendations = _to_serializable(recommendations)
#         print(f"✅ Dress color recommendations generated")
#         return JSONResponse(content=safe_recommendations)
#     except Exception as e:
#         print(f"❌ Dress color recommendation failed: {e}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))


# # -------------------------------
# # Color Palettes
# # -------------------------------
# @router.get("/color-palettes")
# async def get_all_color_palettes():
#     """
#     Get all available color palettes
    
#     Returns:
#         Dictionary of all color palettes
#     """
#     if not DRESS_COLORS_AVAILABLE:
#         raise HTTPException(status_code=503, detail="Dress color recommendation service not available")
#     try:
#         recommender = DressColorRecommendation()
#         palettes = recommender.get_all_palettes()
#         return JSONResponse(content=palettes)
#     except Exception as e:
#         print(f"❌ Failed to load palettes: {e}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/color-palette/{palette_key}")
# async def get_color_palette(palette_key: str):
#     """
#     Get a specific color palette by key
    
#     Args:
#         palette_key: Palette identifier
        
#     Returns:
#         Color palette details
#     """
#     if not DRESS_COLORS_AVAILABLE:
#         raise HTTPException(status_code=503, detail="Dress color recommendation service not available")
#     try:
#         recommender = DressColorRecommendation()
#         palette = recommender.get_palette_by_key(palette_key)
#         if palette is None:
#             raise HTTPException(status_code=404, detail=f"Palette '{palette_key}' not found")
#         return JSONResponse(content=palette)
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Failed to get palette: {e}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))


# # -------------------------------
# # Sri Lankan Skin Tone Categories
# # -------------------------------
# @router.get("/categories")
# async def get_categories():
#     try:
#         from utils.sri_lankan_tones import get_categories
#         categories = get_categories()
#         return JSONResponse(content=categories)
#     except Exception as e:
#         print(f"❌ Error getting categories: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# # -------------------------------
# # Lipstick Recommendations
# # -------------------------------
# @router.post("/recommend")
# async def get_lipstick_recommendation(skin_profile: dict):
#     try:
#         rec = lipstick_recommender.recommend(skin_profile)
#         return JSONResponse(content=_to_serializable(rec))
#     except Exception as e:
#         print(f"❌ Lipstick recommendation failed: {e}")
#         traceback.print_exc()
#         return JSONResponse(status_code=500, content={"error": str(e)})


# # Test Endpoints
# # -------------------------------
# @router.get("/test-lipstick/{category}/{undertone}")
# async def test_lipstick_recommendation(category: int, undertone: str):
#     try:
#         test_profile = {
#             'category': {'number': category, 'name': f'Test Category {category}', 'fitzpatrick': 'III'},
#             'undertone_info': {'undertone': undertone, 'description': f'Test {undertone} undertone'},
#             'exact_skin_color': {'L': 50, 'hex': '#C9A589'}
#         }
#         rec = lipstick_recommender.recommend(test_profile)
#         return JSONResponse(content={'test_profile': test_profile, 'recommendations': _to_serializable(rec)})
#     except Exception as e:
#         print(f"❌ Test lipstick recommendation failed: {e}")
#         traceback.print_exc()
#         return JSONResponse(status_code=500, content={"error": str(e)})
#         return JSONResponse(
#             status_code=500,
#             content={"error": "Test failed", "detail": str(e)}
#         )


# # -------------------------------
# # Recommended Shades for Try-On
# # -------------------------------
# @router.get("/shades")
# async def get_shades():
#     """
#     Get recommended lipstick shades for virtual try-on
    
#     Returns:
#         List of popular lipstick shades with colors
#     """
#     shades = [
#         {"name": "Crimson", "hex": "#C9003A", "rgb": [201, 0, 58]},
#         {"name": "Velvet Brown", "hex": "#7B3F00", "rgb": [123, 63, 0]},
#         {"name": "Soft Pink", "hex": "#FFB6C1", "rgb": [255, 182, 193]},
#         {"name": "Rose Red", "hex": "#FF4D6D", "rgb": [255, 77, 109]},
#         {"name": "Peach", "hex": "#FFDAB9", "rgb": [255, 218, 185]}
#     ]
#     return JSONResponse(content={"shades": shades})


# # -------------------------------
# # Health Check
# # -------------------------------
# @router.get("/health")
# async def health_check():
#     health_status = {
#         "status": "healthy",
#         "service": "Pink Aura API",
#         "features": {
#             "skin_analysis": True,
#             "dress_color_recommendations": DRESS_COLORS_AVAILABLE,
#             "lipstick_recommendations": True,
#         }
#     }
#     return JSONResponse(content=health_status)
#     """
#     Health check endpoint
    
#     Returns:
#         Service status and available features
#     """
#     health_status = {
#         "status": "healthy",
#         "service": "Pink Aura API",
#         "version": "2.1",  # Updated version
#         "features": {
#             "skin_analysis": True,
#             "lipstick_recommendations": True,
#             "foundation_recommendations": True,  # NEW!
#             "dress_color_recommendations": DRESS_COLORS_AVAILABLE,
#             "github_models_validation": True
#         }
#     }
#     return JSONResponse(content=health_status)


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
    include_dress_colors: Optional[bool] = Form(True)
):
    """
    Analyze skin tone from uploaded image including:
    - Skin tone + undertone
    - Lipstick recommendations
    - Foundation recommendations (NEW)
    - Dress color recommendations (optional)
    """
    try:
        print(f"\n{'='*60}")
        print("📸 New analysis request received")
        print(f"User: {name or 'Anonymous'}")
        print(f"Include dress colors: {include_dress_colors}")
        print(f"{'='*60}")

        # Read and decode image
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        print(f"✅ Image loaded: {img.shape}")

        # Extract skin pixels
        skin_pixels = face_extractor.process_image(img)
        if skin_pixels is None or len(skin_pixels) < 100:
            raise HTTPException(
                status_code=400,
                detail="No face detected. Please ensure your face is clearly visible."
            )

        print(f"✅ Extracted {len(skin_pixels)} skin pixels")
        print("🎨 Analyzing skin tone...")

        # Perform analysis (NOW includes foundation)
        result = analyze_skin(skin_pixels, name)
        safe_result = _to_serializable(result)

        print("✅ Skin tone analysis complete")
        print(f"Category: {result.get('category', {}).get('number')}")
        print(f"Undertone: {result.get('undertone_info', {}).get('undertone')}")

        # Foundation recommendation check
        if 'foundation_recommendations' in result:
            print(f"✨ Foundation recommendations found: {len(result['foundation_recommendations'].get('recommendations', []))}")
        else:
            print("⚠️ Foundation recommendations missing")

        # Lipstick recommendations
        print("💄 Generating lipstick recommendations...")
        try:
            lipstick_rec = lipstick_recommender.recommend(safe_result)
            safe_result['lipstick_recommendation'] = _to_serializable(lipstick_rec)
            print("✅ Lipstick recommendations added")
        except Exception as e:
            print(f"⚠️ Lipstick recommendation failed: {e}")
            safe_result['lipstick_recommendation'] = None

        # Dress colors
        if include_dress_colors and DRESS_COLORS_AVAILABLE:
            print("👗 Generating dress color recommendations...")
            try:
                dress = recommend_dress_colors(safe_result)
                safe_result['dress_color_recommendations'] = _to_serializable(dress)
                print("✅ Dress color recommendations added")
            except Exception as e:
                print(f"⚠️ Dress color recommendation failed: {e}")
                safe_result['dress_color_recommendations'] = {
                    "error": "Dress color recommendation unavailable",
                    "detail": str(e)
                }

        print("✅ All analysis complete. Sending response...")
        return JSONResponse(content=safe_result)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Critical error: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "error": "Analysis failed",
                "detail": str(e),
                "message": "Unexpected server error"
            }
        )


# ---------------------------------------------------------------------
# DRESS COLOR RECOMMENDATION (unchanged)
# ---------------------------------------------------------------------
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
