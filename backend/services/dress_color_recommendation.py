"""
Pink Aura - Dress Color Recommendation Service
Enhanced with RANDOM 5 colors selection from 8
"""

import json
import random
from pathlib import Path
from typing import Dict, Optional

class ImprovedSeasonalColorAnalysis:
    """
    Enhanced Seasonal Color Analysis with better undertone differentiation
    NOW: Randomly selects 5 colors from 8 for variety!
    """
    
    # Enhanced category ranges with finer granularity
    CATEGORY_RANGES = {
        # Fair (1-4)
        'very_fair': [1, 2],
        'fair': [3, 4],
        # Light-Medium (5-8)
        'light_medium': [5, 6],
        'medium_light': [7, 8],
        # Medium (9-12)
        'medium': [9, 10],
        'medium_deep': [11, 12],
        # Deep (13-16)
        'deep_medium': [13, 14],
        'deep': [15, 16],
        # Very Deep (17-20)
        'very_deep': [17, 18],
        'deepest': [19, 20]
    }
    
    def __init__(self):
        self.palettes = self._load_seasonal_palettes()
    
    def _load_seasonal_palettes(self) -> Dict:
        """Load seasonal palettes from JSON file"""
        possible_paths = [
            Path(__file__).parent.parent / "data" / "color_palettes.json",
            Path(__file__).parent / "data" / "color_palettes.json",
            Path("data/color_palettes.json"),
            Path("../data/color_palettes.json"),
            Path("color_palettes.json"),
        ]
        
        for path in possible_paths:
            if path.exists():
                with open(path, 'r') as f:
                    return json.load(f)
        
        raise FileNotFoundError(
            "color_palettes_.json not found. Please ensure it's in the data/ directory"
        )
    
    def _normalize_undertone(self, undertone: str) -> str:
        """Normalize undertone string"""
        return undertone.lower().replace(' ', '_').replace('-', '_')
    
    def _get_depth_level(self, cat_number: int) -> str:
        """Get depth level from category number"""
        for level, cats in self.CATEGORY_RANGES.items():
            if cat_number in cats:
                return level
        # Fallback
        if cat_number <= 4:
            return 'fair'
        elif cat_number <= 8:
            return 'light_medium'
        elif cat_number <= 12:
            return 'medium'
        elif cat_number <= 16:
            return 'deep'
        else:
            return 'very_deep'
    
    def _determine_season_enhanced(self, cat_number: int, undertone: str) -> str:
        """Enhanced season determination with better undertone differentiation"""
        undertone = self._normalize_undertone(undertone)
        depth = self._get_depth_level(cat_number)
        
        mapping = {
            # VERY FAIR (1-2)
            ('very_fair', 'very_warm'): 'light_spring',
            ('very_fair', 'warm'): 'light_spring',
            ('very_fair', 'neutral_warm'): 'light_spring',
            ('very_fair', 'neutral'): 'light_summer',
            ('very_fair', 'neutral_cool'): 'light_summer',
            ('very_fair', 'cool'): 'light_summer',
            ('very_fair', 'very_cool'): 'light_summer',
            
            # FAIR (3-4)
            ('fair', 'very_warm'): 'light_spring',
            ('fair', 'warm'): 'light_spring',
            ('fair', 'neutral_warm'): 'light_spring',
            ('fair', 'neutral'): 'light_summer',
            ('fair', 'neutral_cool'): 'light_summer',
            ('fair', 'cool'): 'light_summer',
            ('fair', 'very_cool'): 'light_summer',
            
            # LIGHT-MEDIUM (5-6)
            ('light_medium', 'very_warm'): 'true_spring',
            ('light_medium', 'warm'): 'true_spring',
            ('light_medium', 'neutral_warm'): 'true_spring',
            ('light_medium', 'neutral'): 'soft_summer',
            ('light_medium', 'neutral_cool'): 'true_summer',
            ('light_medium', 'cool'): 'true_summer',
            ('light_medium', 'very_cool'): 'true_summer',
            
            # MEDIUM-LIGHT (7-8)
            ('medium_light', 'very_warm'): 'true_spring',
            ('medium_light', 'warm'): 'true_spring',
            ('medium_light', 'neutral_warm'): 'bright_spring',
            ('medium_light', 'neutral'): 'soft_summer',
            ('medium_light', 'neutral_cool'): 'bright_winter',
            ('medium_light', 'cool'): 'bright_winter',
            ('medium_light', 'very_cool'): 'bright_winter',
            
            # MEDIUM (9-10)
            ('medium', 'very_warm'): 'true_autumn',
            ('medium', 'warm'): 'true_autumn',
            ('medium', 'neutral_warm'): 'soft_autumn',
            ('medium', 'neutral'): 'soft_autumn',
            ('medium', 'neutral_cool'): 'soft_summer',
            ('medium', 'cool'): 'true_winter',
            ('medium', 'very_cool'): 'true_winter',
            
            # MEDIUM-DEEP (11-12)
            ('medium_deep', 'very_warm'): 'true_autumn',
            ('medium_deep', 'warm'): 'true_autumn',
            ('medium_deep', 'neutral_warm'): 'soft_autumn',
            ('medium_deep', 'neutral'): 'soft_autumn',
            ('medium_deep', 'neutral_cool'): 'true_winter',
            ('medium_deep', 'cool'): 'true_winter',
            ('medium_deep', 'very_cool'): 'true_winter',
            
            # DEEP-MEDIUM (13-14)
            ('deep_medium', 'very_warm'): 'deep_autumn',
            ('deep_medium', 'warm'): 'deep_autumn',
            ('deep_medium', 'neutral_warm'): 'soft_autumn',
            ('deep_medium', 'neutral'): 'soft_autumn',
            ('deep_medium', 'neutral_cool'): 'true_winter',
            ('deep_medium', 'cool'): 'deep_winter',
            ('deep_medium', 'very_cool'): 'deep_winter',
            
            # DEEP (15-16)
            ('deep', 'very_warm'): 'deep_autumn',
            ('deep', 'warm'): 'deep_autumn',
            ('deep', 'neutral_warm'): 'soft_autumn',
            ('deep', 'neutral'): 'true_winter',
            ('deep', 'neutral_cool'): 'deep_winter',
            ('deep', 'cool'): 'deep_winter',
            ('deep', 'very_cool'): 'deep_winter',
            
            # VERY DEEP (17-18)
            ('very_deep', 'very_warm'): 'deep_autumn',
            ('very_deep', 'warm'): 'deep_autumn',
            ('very_deep', 'neutral_warm'): 'soft_autumn',
            ('very_deep', 'neutral'): 'deep_winter',
            ('very_deep', 'neutral_cool'): 'deep_winter',
            ('very_deep', 'cool'): 'deep_winter',
            ('very_deep', 'very_cool'): 'deep_winter',
            
            # DEEPEST (19-20)
            ('deepest', 'very_warm'): 'deep_autumn',
            ('deepest', 'warm'): 'deep_autumn',
            ('deepest', 'neutral_warm'): 'deep_autumn',
            ('deepest', 'neutral'): 'deep_winter',
            ('deepest', 'neutral_cool'): 'deep_winter',
            ('deepest', 'cool'): 'deep_winter',
            ('deepest', 'very_cool'): 'deep_winter',
        }
        
        key = (depth, undertone)
        if key in mapping:
            return mapping[key]
        
        # Fallback
        if cat_number <= 4:
            return 'light_spring' if 'warm' in undertone else 'light_summer'
        elif cat_number <= 8:
            return 'true_spring' if 'warm' in undertone else 'true_summer'
        elif cat_number <= 12:
            return 'true_autumn' if 'warm' in undertone else 'true_winter'
        elif cat_number <= 16:
            return 'deep_autumn' if 'warm' in undertone else 'deep_winter'
        else:
            return 'deep_autumn' if 'warm' in undertone else 'deep_winter'
    
    def _select_random_colors(self, all_colors: list, count: int = 5) -> list:
        """
        Randomly select N colors from the full palette
        This gives variety - different people get different combinations!
        """
        if len(all_colors) <= count:
            return all_colors
        return random.sample(all_colors, count)
    
    def _generate_summary(self, palette: Dict, cat_name: str, undertone: str) -> str:
        """Generate personalized color summary"""
        season_name = palette['season']
        return (f"As a {season_name} with {cat_name} skin and {undertone} undertones, "
                f"you look stunning in {palette['characteristics']['description'].lower()}. "
                f"These colors enhance your natural beauty and create perfect harmony with your complexion.")
    
    def analyze(self, cat_number: int, cat_name: str, undertone: str, select_random: bool = True, color_count: int = 5) -> Dict:
        """
        Analyze and recommend colors
        
        Args:
            cat_number: Category number (1-20)
            cat_name: Category name
            undertone: Undertone classification
            select_random: If True, randomly select colors for variety
            color_count: Number of colors to select (default: 5 from 8)
        
        Returns:
            Dictionary with season, colors, and recommendations
        """
        try:
            season = self._determine_season_enhanced(cat_number, undertone)
            
            if season not in self.palettes:
                return {"success": False, "error": f"Season '{season}' not found in database"}
            
            palette = self.palettes[season]
            
            # Get all 8 colors
            all_colors = palette['best_colors']
            
            # Select 5 random colors for variety (or all if requested)
            if select_random and len(all_colors) > color_count:
                selected_colors = self._select_random_colors(all_colors, color_count)
            else:
                selected_colors = all_colors
            
            # Build response
            return {
                "success": True,
                "season": season,
                "season_name": palette['season'],
                "skin_info": {
                    "category_number": cat_number,
                    "category_name": cat_name,
                    "undertone": undertone,
                    "season_characteristics": palette['characteristics']
                },
                "best_colors": selected_colors,  # 5 random colors
                "all_colors": all_colors,  # All 8 colors (for reference)
                "jewelry": palette['jewelry'],
                "styling_tips": palette['styling_tips'],
                "color_summary": self._generate_summary(palette, cat_name, undertone)
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}


def recommend_dress_colors(skin_profile: Dict) -> Dict:
    """
    Main function called by routes.py
    NOW with random 5-color selection!
    """
    try:
        category = skin_profile.get('category', {})
        cat_number = category.get('number')
        cat_name = category.get('name', 'Unknown')
        
        general = skin_profile.get('general_classification', {})
        undertone = general.get('undertone', 'Neutral')
        
        if cat_number is None:
            return {
                "success": False,
                "error": "Missing category number in skin profile"
            }
        
        analyzer = ImprovedSeasonalColorAnalysis()
        
        # Select 5 random colors from 8 for variety!
        result = analyzer.analyze(cat_number, cat_name, undertone, select_random=True, color_count=5)
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Dress color recommendation failed: {str(e)}"
        }


# Compatibility aliases
SeasonalColorAnalysis = ImprovedSeasonalColorAnalysis
DressColorRecommendation = ImprovedSeasonalColorAnalysis
ColorAnalysis = ImprovedSeasonalColorAnalysis


class DressColorRecommendation:
    """Class-based API"""
    
    def __init__(self):
        self.analyzer = ImprovedSeasonalColorAnalysis()
    
    def recommend(self, skin_profile: Dict) -> Dict:
        return recommend_dress_colors(skin_profile)
    
    def get_all_palettes(self) -> Dict:
        return self.analyzer.palettes
    
    def get_palette_by_key(self, palette_key: str) -> Optional[Dict]:
        return self.analyzer.palettes.get(palette_key)


if __name__ == "__main__":
    print("🎨 Testing Random 5-Color Selection")
    print("="*80)
    
    test_profile = {
        "category": {"number": 17, "name": "Deep Brown Neutral"},
        "general_classification": {"undertone": "Very Cool"},
    }
    
    print("\n📊 Test: Category 17 + Very Cool (3 times to show randomness)")
    
    for i in range(3):
        print(f"\n🎲 Run {i+1}:")
        result = recommend_dress_colors(test_profile)
        if result.get('success'):
            print(f"   Season: {result['season_name']}")
            print(f"   Selected colors ({len(result['best_colors'])} of {len(result['all_colors'])}):")
            for color in result['best_colors']:
                print(f"     • {color['name']} ({color['hex']})")
        else:
            print(f"   Error: {result.get('error')}")
    
    print("\n" + "="*80)
    print("✅ Notice how you get different 5 colors each time!")
    print("💡 This gives variety - not everyone gets the exact same palette!")