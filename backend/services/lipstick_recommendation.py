"""
Lipstick Color Recommendation Service
Recommends lipstick colors for all 20 Sri Lankan skin tones × 7 undertones = 140 combinations
Based on professional color theory principles
"""

import json
import os
from typing import Dict, List

class LipstickRecommender:
    """
    Comprehensive lipstick recommendation system
    140 combinations: 20 skin tones × 7 undertones
    """
    
    def __init__(self):
        """Initialize lipstick recommendation engine"""
        print("🔧 Initializing Lipstick Recommender...")
        
        # Try multiple possible paths for the JSON file
        # INCLUDING the root data folder
        possible_paths = [
            # Root data folder (your preferred location)
            os.path.join(os.path.dirname(__file__), '../../../data/lipstick_recommendations.json'),
            os.path.join(os.path.dirname(__file__), '../../data/lipstick_recommendations.json'),
            # Backend data folder
            os.path.join(os.path.dirname(__file__), '../data/lipstick_recommendations.json'),
            # Relative paths from backend directory
            'data/lipstick_recommendations.json',
            '../data/lipstick_recommendations.json',
            '../../data/lipstick_recommendations.json',
        ]
        
        self.database = None
        loaded_from = None
        
        for path in possible_paths:
            abs_path = os.path.abspath(path)
            print(f"   🔍 Trying: {abs_path}")
            if os.path.exists(abs_path):
                try:
                    with open(abs_path, 'r', encoding='utf-8') as f:
                        self.database = json.load(f)
                    loaded_from = abs_path
                    print(f"   ✅ Found and loaded!")
                    break
                except Exception as e:
                    print(f"   ⚠️  Failed to load: {e}")
                    continue
        
        if self.database is None:
            print("❌ ERROR: Could not load lipstick_recommendations.json")
            print("   Searched in:")
            for path in possible_paths:
                print(f"   - {os.path.abspath(path)}")
            raise FileNotFoundError("lipstick_recommendations.json not found!")
        
        # Verify database structure
        total_combinations = sum(len(self.database.get(str(cat), {})) for cat in range(1, 21))
        
        print(f"✅ Lipstick Recommender initialized!")
        print(f"   📂 Loaded from: {loaded_from}")
        print(f"   📊 Database contains: {len(self.database)} categories")
        print(f"   🎨 Total combinations: {total_combinations}")
    
    def recommend(self, skin_profile: Dict) -> Dict:
        """
        Get lipstick recommendations for given skin profile
        
        Args:
            skin_profile: Complete skin tone analysis
            
        Returns:
            Dictionary with categorized recommendations
        """
        try:
            # Extract category number and undertone
            category_number = str(skin_profile.get('category', {}).get('number', 1))
            undertone = skin_profile.get('undertone_info', {}).get('undertone', 'Neutral')
            category_name = skin_profile.get('category', {}).get('name', 'Unknown')
            
            print(f"💄 Looking up recommendations:")
            print(f"   Category: #{category_number} - {category_name}")
            print(f"   Undertone: {undertone}")
            
            # Get recommendations from database
            category_data = self.database.get(category_number, {})
            
            if not category_data:
                print(f"⚠️  Category {category_number} not found in database!")
                return self._get_fallback_recommendations(undertone)
            
            recommendations = category_data.get(undertone, {})
            
            if not recommendations:
                print(f"⚠️  Undertone '{undertone}' not found for category {category_number}!")
                # Try to find closest match
                available_undertones = list(category_data.keys())
                print(f"   Available undertones: {available_undertones}")
                
                if available_undertones:
                    fallback_undertone = available_undertones[0]
                    print(f"   Using fallback: {fallback_undertone}")
                    recommendations = category_data.get(fallback_undertone, {})
            
            # Build result
            result = {
                'category_number': category_number,
                'category_name': category_name,
                'undertone': undertone,
                'recommendations': recommendations,
                'explanation': self._get_explanation(skin_profile),
                'tips': self._get_tips(int(category_number), undertone),
                'avoid': self._get_avoid(undertone)
            }
            
            # Debug: Print what we're returning
            nude_count = len(recommendations.get('nude', []))
            everyday_count = len(recommendations.get('everyday', []))
            bold_count = len(recommendations.get('bold', []))
            
            print(f"✅ Returning recommendations:")
            print(f"   Nude: {nude_count} shades")
            print(f"   Everyday: {everyday_count} shades")
            print(f"   Bold: {bold_count} shades")
            
            if nude_count > 0:
                print(f"   First nude shade: {recommendations['nude'][0]['name']}")
            
            return result
            
        except Exception as e:
            print(f"❌ Error in recommend(): {e}")
            import traceback
            traceback.print_exc()
            return self._get_fallback_recommendations(undertone)
    
    def _get_fallback_recommendations(self, undertone: str) -> Dict:
        """Fallback recommendations if database lookup fails"""
        print(f"⚠️  Using fallback recommendations for {undertone}")
        
        fallback = {
            'category_number': '0',
            'category_name': 'Fallback',
            'undertone': undertone,
            'recommendations': {
                'nude': [
                    {'name': 'Classic Nude', 'hex': '#C9A589', 'description': 'Universal nude shade'}
                ],
                'everyday': [
                    {'name': 'Soft Rose', 'hex': '#C9A9A6', 'description': 'Everyday rose'}
                ],
                'bold': [
                    {'name': 'Classic Red', 'hex': '#DC143C', 'description': 'Universal red'}
                ]
            },
            'explanation': f"These are universal recommendations for {undertone} undertones.",
            'tips': [
                "💄 Use lip liner to define edges",
                "✨ Apply from center outward",
                "💋 Blot and reapply for longevity"
            ],
            'avoid': ['Extreme shades that clash with your undertone']
        }
        
        return fallback
    
    def _get_explanation(self, skin_profile: Dict) -> str:
        """Generate personalized explanation"""
        category_name = skin_profile.get('category', {}).get('name', 'your skin')
        undertone = skin_profile.get('undertone_info', {}).get('undertone', 'Neutral')
        
        explanations = {
            'Very Warm': f"Your {category_name} complexion with {undertone} undertones glows beautifully in peachy, coral, and warm orange-based lipsticks. These enhance your natural golden warmth.",
            'Warm': f"Your {category_name} skin with {undertone} undertones pairs perfectly with warm reds, terracotta, and bronze shades that complement your warmth.",
            'Neutral Warm': f"Your {category_name} complexion with {undertone} undertones allows flexibility! Warm pinks, rose tones, and balanced reds are your sweet spot.",
            'Neutral': f"Lucky you! Your {category_name} skin with {undertone} undertones means almost any shade works. Focus on what makes you feel confident!",
            'Neutral Cool': f"Your {category_name} complexion with {undertone} undertones shines in rose, mauve, and berry tones that enhance your subtle cool undertones.",
            'Cool': f"Your {category_name} skin with {undertone} undertones looks stunning in pink-based reds, berries, and plum shades. Blue-toned lipsticks are perfect for you!",
            'Very Cool': f"Your {category_name} complexion with {undertone} undertones looks incredible in blue-based reds, fuchsias, and deep berry shades that complement your pink undertones."
        }
        
        return explanations.get(undertone, f"Your {category_name} skin with {undertone} undertones is beautiful!")
    
    def _get_tips(self, category_number: int, undertone: str) -> List[str]:
        """Application tips"""
        tips = [
            "💄 Use lip liner to define and prevent bleeding",
            "✨ Apply from center outward for even coverage",
            "💋 Blot and reapply for long-lasting color",
            "🌟 Exfolate lips before application for smooth finish"
        ]
        
        # Category-specific tips
        if category_number <= 6:  # Lighter skin
            tips.append("💡 Light skin can rock both subtle nudes and bold colors!")
        elif category_number >= 13:  # Deeper skin
            tips.append("✨ Deep skin tones look stunning in bold, saturated colors - embrace them!")
        
        # Undertone-specific tips
        if 'Warm' in undertone:
            tips.append("🔥 Warm tones? Try pairing with warm-toned blush for harmony!")
        elif 'Cool' in undertone:
            tips.append("❄️ Cool tones? Pink-based blush complements your lipstick perfectly!")
        
        return tips
    
    def _get_avoid(self, undertone: str) -> List[str]:
        """Colors to avoid"""
        avoid_map = {
            'Very Warm': ['Blue-based reds', 'Very cool pinks', 'Purple lipsticks'],
            'Warm': ['Cool berry shades', 'Blue-toned reds', 'Very purple tones'],
            'Neutral Warm': ['Extremely cool purples', 'Very blue-based colors'],
            'Neutral': ['None - you have ultimate flexibility!'],
            'Neutral Cool': ['Very orange shades', 'Extremely warm browns'],
            'Cool': ['Orange lipsticks', 'Warm browns', 'Yellow-based nudes'],
            'Very Cool': ['Orange-red shades', 'Warm terracottas', 'Golden browns']
        }
        
        return avoid_map.get(undertone, [])


# Export
__all__ = ['LipstickRecommender']