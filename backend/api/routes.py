"""
Pink Aura API Routes
FastAPI endpoints for skin tone analysis with lipstick recommendations
"""

from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import traceback
import cv2
import numpy as np
from typing import Optional
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.face_detection import FaceSkinExtractor
from services.skin_analysis import analyze_skin, _to_serializable
from services.lipstick_recommendation import LipstickRecommender

router = APIRouter()

# Initialize services
print("🔧 Initializing services...")
face_extractor = FaceSkinExtractor()
lipstick_recommender = LipstickRecommender()
print("✅ All services initialized!")

@router.post("/analyze")
async def analyze_skin_tone(
    image: UploadFile = File(...),
    name: Optional[str] = Form(None)
):
    """
    Analyze skin tone from uploaded image with lipstick recommendations
    
    Args:
        image: Image file (JPEG, PNG)
        name: Optional user name
        
    Returns:
        Complete skin tone analysis profile with lipstick recommendations
    """
    try:
        print(f"\n{'='*60}")
        print(f"📸 New analysis request received")
        print(f"   User: {name or 'Anonymous'}")
        print(f"{'='*60}")
        
        # Read image file
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            print("❌ Invalid image file")
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        print(f"✅ Image loaded: {img.shape}")
        
        # Extract skin pixels
        print("🔍 Extracting skin pixels...")
        skin_pixels = face_extractor.process_image(img)
        
        if skin_pixels is None or len(skin_pixels) < 100:
            print("❌ No face detected or insufficient skin pixels")
            raise HTTPException(
                status_code=400, 
                detail="No face detected in image. Please ensure your face is clearly visible."
            )
        
        print(f"✅ Extracted {len(skin_pixels)} skin pixels")
        
        # Analyze skin tone
        print("🎨 Analyzing skin tone...")
        result = analyze_skin(skin_pixels, name)
        
        print(f"✅ Skin tone analysis complete:")
        print(f"   Category: #{result.get('category', {}).get('number')} - {result.get('category', {}).get('name')}")
        print(f"   Undertone: {result.get('undertone_info', {}).get('undertone')}")
        
        # Ensure everything is pure Python types
        safe_result = _to_serializable(result)

        # ✨ ALWAYS INCLUDE LIPSTICK RECOMMENDATIONS ✨
        print("💄 Generating lipstick recommendations...")
        try:
            lipstick_rec = lipstick_recommender.recommend(safe_result)
            safe_result['lipstick_recommendation'] = _to_serializable(lipstick_rec)
            
            # Count recommendations
            nude_count = len(lipstick_rec.get('recommendations', {}).get('nude', []))
            everyday_count = len(lipstick_rec.get('recommendations', {}).get('everyday', []))
            bold_count = len(lipstick_rec.get('recommendations', {}).get('bold', []))
            
            print(f"✅ Lipstick recommendations generated:")
            print(f"   Nude: {nude_count} shades")
            print(f"   Everyday: {everyday_count} shades")
            print(f"   Bold: {bold_count} shades")
            
        except Exception as e:
            print(f"⚠️ Lipstick recommendation failed: {e}")
            traceback.print_exc()
            # Don't fail the whole request, just set to None
            safe_result['lipstick_recommendation'] = None

        print(f"{'='*60}")
        print(f"✅ Analysis complete! Sending response...")
        print(f"{'='*60}\n")

        # Return JSONResponse
        return JSONResponse(content=safe_result)

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
        
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ CRITICAL ERROR during analysis:")
        print(f"{'='*60}")
        print(f"Error: {str(e)}")
        traceback.print_exc()
        print(f"{'='*60}\n")
        
        return JSONResponse(
            status_code=500,
            content={
                "error": "Analysis failed", 
                "detail": str(e),
                "message": "An unexpected error occurred. Please try again."
            }
        )


@router.get("/categories")
async def get_categories():
    """
    Get all 20 Sri Lankan skin tone categories
    
    Returns:
        Dictionary of all skin tone categories with details
    """
    try:
        from utils.sri_lankan_tones import get_categories
        categories = get_categories()
        print(f"📋 Categories requested - returning {len(categories)} categories")
        return JSONResponse(content=categories)
    except Exception as e:
        print(f"❌ Error getting categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns:
        Service status and information
    """
    return {
        "status": "healthy", 
        "service": "Pink Aura API",
        "version": "1.0.0",
        "features": [
            "Skin tone analysis",
            "Undertone detection", 
            "Lipstick recommendations"
        ]
    }


@router.post("/recommend")
async def get_lipstick_recommendation(skin_profile: dict):
    """
    Get lipstick recommendations for a given skin profile
    
    Args:
        skin_profile: Complete skin analysis profile with category and undertone_info
        
    Returns:
        Lipstick recommendations with nude, everyday, and bold shades
    """
    try:
        print(f"\n💄 Lipstick recommendation requested")
        print(f"   Category: {skin_profile.get('category', {}).get('number')}")
        print(f"   Undertone: {skin_profile.get('undertone_info', {}).get('undertone')}")
        
        rec = lipstick_recommender.recommend(skin_profile)
        safe_rec = _to_serializable(rec)
        
        print(f"✅ Recommendations generated successfully\n")
        
        return JSONResponse(content=safe_rec)
        
    except Exception as e:
        print(f"❌ Recommendation generation failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500, 
            content={
                "error": "Recommendation failed", 
                "detail": str(e)
            }
        )


# Optional: Endpoint to test lipstick recommender directly
@router.get("/test-lipstick/{category}/{undertone}")
async def test_lipstick_recommendation(category: int, undertone: str):
    """
    Test endpoint for lipstick recommendations
    
    Args:
        category: Skin tone category (1-20)
        undertone: Undertone type (Very Warm, Warm, Neutral Warm, Neutral, Neutral Cool, Cool, Very Cool)
        
    Returns:
        Sample lipstick recommendations
    """
    try:
        # Create test skin profile
        test_profile = {
            'category': {
                'number': category,
                'name': f'Test Category {category}',
                'fitzpatrick': 'III'
            },
            'undertone_info': {
                'undertone': undertone,
                'description': f'Test {undertone} undertone'
            },
            'exact_skin_color': {
                'L': 50,
                'hex': '#C9A589'
            }
        }
        
        rec = lipstick_recommender.recommend(test_profile)
        safe_rec = _to_serializable(rec)
        
        return JSONResponse(content={
            'test_profile': test_profile,
            'recommendations': safe_rec
        })
        
    except Exception as e:
        print(f"❌ Test recommendation failed: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": "Test failed", "detail": str(e)}
        )