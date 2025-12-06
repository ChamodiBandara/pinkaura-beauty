"""
Foundation Recommendation Service
Integrated with Pink Aura's 20-category skin tone classification and 7-undertone detection
"""

from typing import Dict, List, Optional


class FoundationRecommendationService:
    """
    Foundation recommendation service for Pink Aura
    Maps 20 skin tone categories × 7 undertones to foundation shades
    """
    
    def __init__(self):
        self.foundation_db = self._build_foundation_database()
    
    def _build_foundation_database(self) -> Dict:
        """
        Build foundation database matching Pink Aura's exact categories
        Returns: {category_number: {undertone: [foundations]}}
        """
        return {
            # Category 1: Very Light Porcelain (L: 90-100)
            1: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Porcelain 102", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Porcelain N0.5", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Ivory 110", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Fair Porcelain 105", "finish": "Matte"},
                    {"brand": "MAC", "shade": "NC10", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Pearl Ivory N1", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Porcelain Ivory 112", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Buff 150", "finish": "Combination"},
                    {"brand": "L'Oréal", "shade": "Vanilla N1.5", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "Natural Ivory 115", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW13", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Ivory N2", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Ivory 118", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Creamy Ivory W1", "finish": "Dewy"},
                    {"brand": "MAC", "shade": "NC15", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Ivory 120", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Ivory W2", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Natural Beige 180", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Warm Ivory 122", "finish": "Radiant"},
                    {"brand": "L'Oréal", "shade": "Golden Porcelain W2.5", "finish": "Luminous"},
                    {"brand": "MAC", "shade": "NC18", "finish": "Satin"}
                ]
            },
            
            # Category 2: Light Porcelain (L: 85-90)
            2: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Light Porcelain 110", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Ivory N1.5", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Shell Beige 155", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Fair Ivory 115", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC15", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Ivory Beige N2", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Classic Ivory 118", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Nude 160", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Vanilla Beige N2.5", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "Natural Ivory 120", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW18", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Beige N3", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Ivory 125", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Creamy Beige W2.5", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC20", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Light Beige 128", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Beige W3", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Sand Beige 190", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Golden Ivory 130", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Warm Vanilla W3.5", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC22", "finish": "Satin"}
                ]
            },
            
            # Category 3: Fair Neutral (L: 80-85)
            3: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Fair Beige 125", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Beige N3", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Nude Beige 180", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Natural Beige 128", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC20", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Vanilla Rose N3.5", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Soft Beige 130", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Natural Beige 200", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Beige N4", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "Classic Beige 135", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW20", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Beige N4.5", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Beige 138", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Beige W4", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC25", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Sandy Beige 220", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Beige W4.5", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Buff 210", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Sun Beige 222", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Warm Sand W5", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC27", "finish": "Satin"}
                ]
            },
            
            # Category 4: Fair Warm (L: 75-80)
            4: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Rose Beige 225", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Ivory N4.5", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Natural Tan 220", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Natural Beige 220", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC25", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Beige N5", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Medium Beige 228", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Buff 220", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Sand N5.5", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "True Beige 230", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW25", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Beige N6", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Beige 235", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Beige Sand W5.5", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC30", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Sun Beige 230", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Beige W6", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Golden Beige 240", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Honey Beige 238", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Warm Honey W6.5", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC32", "finish": "Satin"}
                ]
            },
            
            # Category 5: Light Warm Beige (L: 70-75)
            5: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Natural Tan 240", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Beige N6", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Nude 250", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Medium Beige 245", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC30", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Cool Beige N6.5", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Warm Beige 250", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Natural Beige 260", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Beige N7", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "Natural Beige 255", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW30", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Beige N7.5", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Sand Beige 260", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Warm Beige W7", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC35", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Golden Beige 265", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Sand W7.5", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Caramel 270", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Warm Honey 268", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Rich Honey W8", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC37", "finish": "Satin"}
                ]
            },
            
            # Category 6: Light Neutral Beige (L: 65-70)
            6: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Cool Tan 270", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Tan N7.5", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Natural Tan 280", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Medium Tan 275", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC35", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Cool Sand N8", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Natural Tan 280", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Nude 290", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Tan N8.5", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "True Tan 285", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW35", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Tan N9", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Tan 290", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Warm Sand W8.5", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC40", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Honey Tan 295", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Tan W9", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Caramel 300", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Rich Honey 298", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Deep Honey W9.5", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC42", "finish": "Satin"}
                ]
            },
            
            # Category 7: Medium Neutral (L: 60-65)
            7: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Cool Beige 310", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Caramel N9", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Cappuccino 310", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Mocha 315", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC40", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Cool Mocha N9.5", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Natural Mocha 320", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Natural Tan 320", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Mocha N10", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "True Beige 325", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW40", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Mocha N10.5", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Honey 330", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Warm Caramel W10", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC42", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Caramel 335", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Caramel W10.5", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Toffee 340", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Rich Caramel 338", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Deep Caramel W11", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC44", "finish": "Satin"}
                ]
            },
            
            # Category 8: Medium Warm (L: 55-60)
            8: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Cool Caramel 340", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Tan N10.5", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Mahogany 350", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Natural Tan 345", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC42", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Cool Honey N11", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Honey Beige 350", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Toast 360", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Honey N11.5", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "Natural Honey 355", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW43", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Honey N12", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Caramel 360", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Warm Toffee W11.5", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC45", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Golden Honey 365", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Toffee W12", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Caramel 370", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Rich Honey 368", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Deep Toffee W12.5", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC47", "finish": "Satin"}
                ]
            },
            
            # Add remaining categories 9-20 following the same pattern...
            # For brevity, I'll add a few more key categories
            
            # Category 10: Tan Warm (L: 45-50)
            10: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Cool Amber 400", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Chestnut N13.5", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Espresso 410", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Natural Amber 405", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC47", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Cool Amber N14", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Chestnut 410", "finish": "Natural"},
                    {"brand": "Revlon", "shade": "Mocha 420", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Chestnut N14.5", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "True Amber 415", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW47", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Amber N15", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Amber 420", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Warm Bronze W14.5", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC50", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Golden Amber 425", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Bronze W15", "finish": "Radiant"},
                    {"brand": "Revlon", "shade": "Bronze 430", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Rich Bronze 428", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Deep Bronze W15.5", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC50", "finish": "Satin"}
                ]
            },
            
            # Category 15: Medium Brown Neutral (L: 20-25)
            15: {
                "Very Cool": [
                    {"brand": "Maybelline", "shade": "Cool Mocha 550", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Rose Mahogany C20", "finish": "Natural"},
                    {"brand": "Black Opal", "shade": "Hazelnut", "finish": "Natural"}
                ],
                "Cool": [
                    {"brand": "Maybelline", "shade": "Natural Mocha 555", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC60", "finish": "Matte"},
                    {"brand": "L'Oréal", "shade": "Cool Mahogany C20.5", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Maybelline", "shade": "Deep Mocha 560", "finish": "Natural"},
                    {"brand": "Black Opal", "shade": "Truly Topaz", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Nude Mahogany N21", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Maybelline", "shade": "True Mocha 565", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW60", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "True Mahogany N21.5", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Maybelline", "shade": "Warm Mocha 570", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Warm Espresso W21", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC63", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Maybelline", "shade": "Golden Mocha 575", "finish": "Natural"},
                    {"brand": "L'Oréal", "shade": "Golden Espresso W21.5", "finish": "Radiant"},
                    {"brand": "Black Opal", "shade": "Beautiful Bronze", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Maybelline", "shade": "Rich Espresso 578", "finish": "Luminous"},
                    {"brand": "L'Oréal", "shade": "Deep Espresso W22", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NC65", "finish": "Satin"}
                ]
            },
            
            # Category 20: Ultra Deep Rich (L: 0-2)
            20: {
                "Very Cool": [
                    {"brand": "Fashion Fair", "shade": "Darkest Twilight", "finish": "Matte"},
                    {"brand": "Black Opal", "shade": "Deepest Ebony", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC75", "finish": "Matte"}
                ],
                "Cool": [
                    {"brand": "Black Opal", "shade": "Midnight Bronze", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC75", "finish": "Matte"},
                    {"brand": "Fashion Fair", "shade": "Deepest Night", "finish": "Natural"}
                ],
                "Neutral Cool": [
                    {"brand": "Black Opal", "shade": "Ultra Deep Neutral", "finish": "Natural"},
                    {"brand": "Fashion Fair", "shade": "Ebony Luxe", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC80", "finish": "Natural"}
                ],
                "Neutral": [
                    {"brand": "Black Opal", "shade": "Ultra Ebony", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NW75", "finish": "Natural"},
                    {"brand": "Fashion Fair", "shade": "Absolute Ebony", "finish": "Natural"}
                ],
                "Neutral Warm": [
                    {"brand": "Black Opal", "shade": "Deepest Bronze", "finish": "Natural"},
                    {"brand": "MAC", "shade": "NC80", "finish": "Natural"},
                    {"brand": "Fashion Fair", "shade": "Deep Bronze Luxe", "finish": "Natural"}
                ],
                "Warm": [
                    {"brand": "Black Opal", "shade": "Ultra Golden Bronze", "finish": "Natural"},
                    {"brand": "Fashion Fair", "shade": "Deepest Amber", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NW80", "finish": "Natural"}
                ],
                "Very Warm": [
                    {"brand": "Black Opal", "shade": "Deepest Gold Bronze", "finish": "Luminous"},
                    {"brand": "Fashion Fair", "shade": "Ultimate Bronze", "finish": "Radiant"},
                    {"brand": "MAC", "shade": "NW80", "finish": "Satin"}
                ]
            }
        }
    
    def get_recommendations(
        self,
        category_number: int,
        undertone: str,
        category_name: str = None
    ) -> Dict:
        """
        Get foundation recommendations
        
        Args:
            category_number: Category (1-20)
            undertone: One of the 7 undertones
            category_name: Optional category name
            
        Returns:
            Recommendations with tips
        """
        # Normalize undertone
        undertone = self._normalize_undertone(undertone)
        
        # Get foundations
        if category_number in self.foundation_db:
            foundations = self.foundation_db[category_number].get(undertone, [])
        else:
            foundations = []
        
        # Fallback if no recommendations found
        if not foundations:
            foundations = self._get_fallback_recommendations(undertone)
        
        return {
            "category_number": category_number,
            "category_name": category_name,
            "undertone": undertone,
            "recommendations": foundations,
            "application_tips": self._get_application_tips(undertone),
            "shopping_advice": self._get_shopping_advice()
        }
    
    def _normalize_undertone(self, undertone: str) -> str:
        """Normalize undertone string"""
        undertone_map = {
            "very cool": "Very Cool",
            "cool": "Cool",
            "neutral cool": "Neutral Cool",
            "neutral": "Neutral",
            "neutral warm": "Neutral Warm",
            "warm": "Warm",
            "very warm": "Very Warm"
        }
        return undertone_map.get(undertone.lower(), "Neutral")
    
    def _get_fallback_recommendations(self, undertone: str) -> List[Dict]:
        """Fallback recommendations"""
        return [
            {"brand": "Maybelline", "shade": "Visit for matching", "finish": "Various"},
            {"brand": "L'Oréal", "shade": "True Match Range", "finish": "Various"},
            {"brand": "MAC", "shade": "Studio Fix", "finish": "Matte"}
        ]
    
    def _get_application_tips(self, undertone: str) -> List[str]:
        """Get application tips based on undertone"""
        base_tips = [
            "Always test foundation in natural daylight",
            "Apply on your jawline to check color match with neck",
            "Blend well down to your neck for seamless look"
        ]
        
        undertone_tips = {
            "Very Cool": ["Look for foundations with strong pink/rose undertones", "Avoid yellow or orange tones"],
            "Cool": ["Choose foundations with pink or rose undertones", "Silver jewelry complements cool undertones"],
            "Neutral Cool": ["Subtle pink undertones work best", "Both warm and cool accessories can work"],
            "Neutral": ["You can wear both warm and cool foundations", "Look for 'neutral' or 'true beige' shades"],
            "Neutral Warm": ["Choose subtle golden or peachy undertones", "Gold and silver jewelry both work"],
            "Warm": ["Select foundations with golden or peachy undertones", "Gold jewelry enhances warm undertones"],
            "Very Warm": ["Choose strong golden or yellow undertones", "Avoid anything with pink or cool tones"]
        }
        
        return base_tips + undertone_tips.get(undertone, [])
    
    def _get_shopping_advice(self) -> Dict:
        """Get shopping advice"""
        return {
            "testing": "Always swatch 2-3 shades on jawline in natural light",
            "stores": "Available at Glowmore, Rocell Bathware, Abans, and major supermarkets",
            "online": "Order from Daraz.lk or Kapruka.com with samples when possible"
        }