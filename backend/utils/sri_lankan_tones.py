"""
Sri Lankan Skin Tone Categories
20 categories optimized for Sri Lankan diversity
"""

from typing import Dict

def get_categories() -> Dict:
    """Define 20 Sri Lankan skin tone categories"""
    return {
        # VERY FAIR (L: 85–100)
        1: {
            'name': 'Very Light Porcelain',
            'L_min': 90, 'L_max': 100,
            'description': 'Extremely light complexion with minimal melanin',
            'fitzpatrick': 'I'
        },
        2: {
            'name': 'Light Porcelain',
            'L_min': 85, 'L_max': 90,
            'description': 'Very light skin with subtle warm or pink undertones',
            'fitzpatrick': 'I–II'
        },
        # FAIR (L: 75–85)
        3: {
            'name': 'Fair Neutral',
            'L_min': 80, 'L_max': 85,
            'description': 'Fair skin with balanced undertone',
            'fitzpatrick': 'II'
        },
        4: {
            'name': 'Fair Warm',
            'L_min': 75, 'L_max': 80,
            'description': 'Fair skin with mild yellow or peach warmth',
            'fitzpatrick': 'II'
        },
        # LIGHT-MEDIUM (L: 65–75)
        5: {
            'name': 'Light Warm Beige',
            'L_min': 70, 'L_max': 75,
            'description': 'Light skin with warm beige undertones',
            'fitzpatrick': 'III'
        },
        6: {
            'name': 'Light Neutral Beige',
            'L_min': 65, 'L_max': 70,
            'description': 'Light-medium complexion with neutral undertone',
            'fitzpatrick': 'III'
        },
        # MEDIUM (L: 55–65)
        7: {
            'name': 'Medium Neutral',
            'L_min': 60, 'L_max': 65,
            'description': 'Standard medium skin tone with balanced undertone',
            'fitzpatrick': 'III–IV'
        },
        8: {
            'name': 'Medium Warm',
            'L_min': 55, 'L_max': 60,
            'description': 'Medium complexion with warm golden undertones',
            'fitzpatrick': 'IV'
        },
        # MEDIUM–TAN (L: 45–55)
        9: {
            'name': 'Tan Neutral',
            'L_min': 50, 'L_max': 55,
            'description': 'Tan skin tone with neutral undertone',
            'fitzpatrick': 'IV'
        },
        10: {
            'name': 'Tan Warm',
            'L_min': 45, 'L_max': 50,
            'description': 'Tan complexion with warm or golden undertones',
            'fitzpatrick': 'IV'
        },
        # TAN / BROWN (L: 35–45)
        11: {
            'name': 'Deep Tan Neutral',
            'L_min': 40, 'L_max': 45,
            'description': 'Deep tan complexion with balanced undertone',
            'fitzpatrick': 'IV–V'
        },
        12: {
            'name': 'Deep Tan Warm',
            'L_min': 35, 'L_max': 40,
            'description': 'Deep tan skin with pronounced warmth',
            'fitzpatrick': 'V'
        },
        # BROWN (L: 25–35)
        13: {
            'name': 'Light Brown Neutral',
            'L_min': 30, 'L_max': 35,
            'description': 'Light brown skin with neutral undertone',
            'fitzpatrick': 'V'
        },
        14: {
            'name': 'Light Brown Warm',
            'L_min': 25, 'L_max': 30,
            'description': 'Light brown skin with warm undertones',
            'fitzpatrick': 'V'
        },
        # DEEP BROWN (L: 15–25)
        15: {
            'name': 'Medium Brown Neutral',
            'L_min': 20, 'L_max': 25,
            'description': 'Medium brown complexion with neutral undertone',
            'fitzpatrick': 'V–VI'
        },
        16: {
            'name': 'Medium Brown Rich',
            'L_min': 15, 'L_max': 20,
            'description': 'Medium-deep brown skin with rich melanin density',
            'fitzpatrick': 'VI'
        },
        # DARK (L: 5–15)
        17: {
            'name': 'Deep Brown Neutral',
            'L_min': 10, 'L_max': 15,
            'description': 'Dark brown skin with neutral undertone',
            'fitzpatrick': 'VI'
        },
        18: {
            'name': 'Deep Brown Rich',
            'L_min': 5, 'L_max': 10,
            'description': 'Deep brown skin with strong melanin concentration',
            'fitzpatrick': 'VI'
        },
        # VERY DARK (L: 0–5)
        19: {
            'name': 'Ultra Deep Neutral',
            'L_min': 2, 'L_max': 5,
            'description': 'Very deep complexion with balanced undertone',
            'fitzpatrick': 'VI'
        },
        20: {
            'name': 'Ultra Deep Rich',
            'L_min': 0, 'L_max': 2,
            'description': 'Deepest complexion with highest melanin density',
            'fitzpatrick': 'VI'
        }
    }

def classify_by_L_value(L: float) -> Dict:
    """
    Classify into 20 categories based on L* value
    
    Args:
        L: LAB L* value (lightness)
        
    Returns:
        Category information
    """
    categories = get_categories()
    
    for cat_num, cat_data in categories.items():
        if cat_data['L_min'] <= L < cat_data['L_max']:
            return {
                'category_number': cat_num,
                'category_name': cat_data['name'],
                'description': cat_data['description'],
                'fitzpatrick': cat_data['fitzpatrick'],
                'L_range': f"{cat_data['L_min']}-{cat_data['L_max']}"
            }
    
    # Fallback for edge cases
    if L >= 90:
        return classify_by_L_value(95)
    else:
        return classify_by_L_value(1)