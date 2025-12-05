"""
Enhanced Skin Tone Classifier with Foundation Recommendations
Combines LAB color space analysis with GitHub Models API validation
and personalized foundation shade recommendations
"""

import numpy as np
import cv2
from datetime import datetime
from typing import Dict
import sys
import os

# Add parent directory to path to import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.color_theory import rgb_to_lab, calculate_ita_angle, detect_undertone
from utils.sri_lankan_tones import get_categories, classify_by_L_value

# ✨ NEW: Import foundation recommendation service
try:
    from services.foundation_recommendation import FoundationRecommendationService
    FOUNDATION_SERVICE_AVAILABLE = True
except ImportError:
    FOUNDATION_SERVICE_AVAILABLE = False
    print("⚠️  Foundation recommendation service not available")


class EnhancedSkinToneClassifier:
    """
    Hybrid skin tone classifier using:
    1. LAB color space analysis (scientific)
    2. GitHub Models API for validation (AI-powered)
    3. 20 Sri Lankan categories
    4. ✨ NEW: Foundation shade recommendations
    """
    
    def __init__(self, github_token: str = None):
        """Initialize classifier"""
        print("✅ Enhanced Skin Tone Classifier initialized!")
        
        self.github_token = github_token or os.getenv('GITHUB_TOKEN')
        self.use_github_models = self.github_token is not None
        
        if self.use_github_models:
            print("   🤖 GitHub Models API enabled")
        else:
            print("   ⚠️  GitHub Models API disabled (no token)")
        
        self.categories = get_categories()
        
        # ✨ NEW: Initialize foundation recommendation service
        if FOUNDATION_SERVICE_AVAILABLE:
            try:
                self.foundation_service = FoundationRecommendationService()
                print("   💄 Foundation Recommendation Service enabled")
            except Exception as e:
                self.foundation_service = None
                print(f"   ⚠️  Foundation service initialization failed: {e}")
        else:
            self.foundation_service = None
    
    def validate_with_github_models(self, avg_rgb: np.ndarray, category: Dict) -> Dict:
        """Validate classification using GitHub Models API"""
        if not self.use_github_models:
            return {
                'validated': False,
                'confidence': 0.0,
                'note': 'GitHub Models API not configured'
            }
        
        try:
            import requests
            
            r, g, b = int(avg_rgb[0]), int(avg_rgb[1]), int(avg_rgb[2])
            hex_color = f"#{r:02x}{g:02x}{b:02x}"
            
            prompt = f"""Analyze this skin tone color and validate the classification:

RGB: ({r}, {g}, {b})
HEX: {hex_color}
Preliminary Classification: {category['category_name']} (Category #{category['category_number']})
Description: {category['description']}
Fitzpatrick Type: {category['fitzpatrick']}

Based on color theory and dermatological standards, is this classification accurate?
Respond with:
1. VALID or INVALID
2. Confidence score (0-100)
3. Brief reasoning (one sentence)

Format: VALID|95|The RGB values indicate a medium-tan complexion consistent with Fitzpatrick Type IV."""
            
            response = requests.post(
                "https://models.inference.ai.azure.com/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.github_token}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": "You are an expert dermatologist and colorimetry specialist."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 150
                },
                timeout=10
            )
            
            if response.status_code == 200:
                ai_response = response.json()['choices'][0]['message']['content'].strip()
                
                parts = ai_response.split('|')
                if len(parts) >= 3:
                    validation = parts[0].strip().upper()
                    confidence = float(parts[1].strip()) / 100.0
                    reasoning = parts[2].strip()
                    
                    return {
                        'validated': validation == 'VALID',
                        'confidence': round(confidence, 2),
                        'reasoning': reasoning,
                        'ai_response': ai_response
                    }
            
            return {
                'validated': True,
                'confidence': 0.5,
                'note': 'AI validation failed, using color theory only'
            }
            
        except Exception as e:
            print(f"⚠️  GitHub Models validation failed: {e}")
            return {
                'validated': True,
                'confidence': 0.5,
                'note': f'AI validation error: {str(e)}'
            }
    
    def get_foundation_recommendations(self, category: Dict, undertone: Dict, L: float, a: float, b: float) -> Dict:
        """
        ✨ NEW: Get foundation recommendations based on skin analysis
        
        Args:
            category: Category information from classify_by_L_value
            undertone: Undertone information from detect_undertone
            L: LAB L* value
            a: LAB a* value
            b: LAB b* value
            
        Returns:
            Foundation recommendations or None if service unavailable
        """
        if not self.foundation_service:
            return None
        
        try:
            recommendations = self.foundation_service.get_recommendations(
                category_number=category['category_number'],
                undertone=undertone['undertone'],
                category_name=category['category_name']
            )
            
            # Add skin analysis values for reference
            recommendations['skin_analysis'] = {
                'L_value': round(float(L), 2),
                'a_value': round(float(a), 2),
                'b_value': round(float(b), 2),
                'undertone_score': undertone.get('score', 0),
                'undertone_confidence': undertone.get('confidence', 0)
            }
            
            print(f"   💄 Foundation Recommendations: {len(recommendations.get('recommendations', []))} matches found")
            
            return recommendations
            
        except Exception as e:
            print(f"   ⚠️  Foundation recommendation failed: {e}")
            return {
                'error': str(e),
                'note': 'Foundation recommendations unavailable'
            }
    
    def create_user_profile(self, skin_pixels: np.ndarray, user_name: str = None) -> Dict:
        """Create complete user profile with hybrid classification and foundation recommendations"""
        print(f"\n🔬 Analyzing {len(skin_pixels)} skin pixels...")
        
        # Calculate average color
        avg_rgb = np.mean(skin_pixels, axis=0).astype(np.uint8)
        avg_lab = rgb_to_lab(avg_rgb.reshape(1, 3))[0]
        L, a, b = avg_lab[0], avg_lab[1], avg_lab[2]
        
        # Calculate ITA angle
        ita_angle = calculate_ita_angle(L, b)
        
        # Classify by L value
        category = classify_by_L_value(L)
        
        # Detect undertone
        undertone = detect_undertone(a, b)
        
        # Validate with GitHub Models
        validation = self.validate_with_github_models(avg_rgb, category)
        
        # ✨ NEW: Get foundation recommendations
        foundation_recommendations = self.get_foundation_recommendations(
            category=category,
            undertone=undertone,
            L=L,
            a=a,
            b=b
        )
        
        # Create hex color
        hex_color = "#{:02x}{:02x}{:02x}".format(
            int(avg_rgb[0]), int(avg_rgb[1]), int(avg_rgb[2])
        )
        
        # Build profile
        profile = {
            'user_name': user_name if user_name else "User",
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'category': {
                'number': category['category_number'],
                'name': category['category_name'],
                'description': category['description'],
                'L_range': category['L_range'],
                'fitzpatrick': category['fitzpatrick']
            },
            'general_classification': {
                'category': category['category_name'],
                'fitzpatrick': category['fitzpatrick'],
                'undertone': undertone['undertone'],
                'undertone_confidence': undertone['confidence']
            },
            'exact_skin_color': {
                'L': round(L, 3),
                'a': round(a, 3),
                'b': round(b, 3),
                'ita_angle': round(ita_angle, 3),
                'rgb': {
                    'R': int(avg_rgb[0]),
                    'G': int(avg_rgb[1]),
                    'B': int(avg_rgb[2])
                },
                'hex': hex_color
            },
            'lab': {
                'L': round(L, 2),
                'a': round(a, 2),
                'b': round(b, 2)
            },
            'undertone_info': undertone,
            'ai_validation': validation,
            'analysis_metadata': {
                'num_pixels_analyzed': len(skin_pixels),
                'method': 'Hybrid (Color Theory + GitHub Models + Foundation Recommendations)',
                'analyzer_version': '2.1',  # Updated version
                'foundation_service': 'enabled' if foundation_recommendations else 'disabled'
            }
        }
        
        # ✨ NEW: Add foundation recommendations to profile
        if foundation_recommendations:
            profile['foundation_recommendations'] = foundation_recommendations
        
        print("✅ Analysis complete!")
        print(f"   Category: #{category['category_number']} - {category['category_name']}")
        print(f"   Undertone: {undertone['undertone']}")
        if validation['validated']:
            print(f"   AI Validation: ✓ Confirmed ({validation['confidence']*100:.0f}% confidence)")
        if foundation_recommendations and 'recommendations' in foundation_recommendations:
            print(f"   Foundation Matches: {len(foundation_recommendations['recommendations'])} recommended")
        
        return profile


def _to_serializable(obj):
    """Recursively convert numpy types/arrays and other common non-serializables to Python native types for JSON."""
    # Numpy scalar
    if isinstance(obj, (np.floating, np.float32, np.float64, np.float16)):
        return float(obj)
    if isinstance(obj, (np.integer, np.int32, np.int64)):
        return int(obj)
    if isinstance(obj, np.bool_):
        return bool(obj)

    # Numpy generic fallback
    if isinstance(obj, np.generic):
        try:
            return obj.item()
        except Exception:
            return float(obj)

    # Numpy arrays and objects that expose tolist()
    if hasattr(obj, "tolist") and not isinstance(obj, (str, bytes, bytearray)):
        try:
            return obj.tolist()
        except Exception:
            pass

    if isinstance(obj, dict):
        return {k: _to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple, set)):
        return [_to_serializable(v) for v in obj]

    # Safe fallbacks for common types (datetime already converted earlier in code to str)
    try:
        # primitive JSON friendly types: int, float, str, bool, None
        if isinstance(obj, (str, int, float, bool)) or obj is None:
            return obj
    except Exception:
        pass

    # Final fallback: convert to string so JSON can always be constructed
    try:
        return str(obj)
    except Exception:
        return None


def analyze_skin(skin_pixels: np.ndarray, user_name: str = None) -> Dict:
    """
    Analyze skin tone and return serializable results with foundation recommendations
    
    Args:
        skin_pixels: Array of skin pixel RGB values
        user_name: Optional user name for the profile
        
    Returns:
        Complete analysis including:
        - Skin tone category (1-20)
        - Undertone (Very Cool to Very Warm)
        - LAB color values
        - AI validation (if GitHub Models enabled)
        - ✨ Foundation recommendations (3 matched shades)
    """
    classifier = EnhancedSkinToneClassifier()
    result = classifier.create_user_profile(skin_pixels, user_name)
    # ensure `result` contains only JSON-serializable types
    serializable_result = _to_serializable(result)
    return serializable_result