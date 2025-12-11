# # """
# # Color Theory Utilities
# # RGB to LAB conversion, ITA angle calculation, and undertone detection
# # """

# # import numpy as np
# # import cv2
# # from math import atan, degrees
# # from typing import Dict

# # def rgb_to_lab(rgb_values: np.ndarray) -> np.ndarray:
# #     """
# #     Convert RGB to LAB color space
    
# #     Args:
# #         rgb_values: RGB array (n, 3) with values 0-255
        
# #     Returns:
# #         LAB array (n, 3) with L* (0-100), a* (-128 to 127), b* (-128 to 127)
# #     """
# #     if len(rgb_values.shape) == 1:
# #         rgb_values = rgb_values.reshape(1, -1)
    
# #     rgb_normalized = rgb_values.astype(np.float32) / 255.0
# #     rgb_reshaped = rgb_normalized.reshape(1, -1, 3)
    
# #     lab = cv2.cvtColor(rgb_reshaped, cv2.COLOR_RGB2LAB)
# #     lab = lab.reshape(-1, 3)
    
# #     L = lab[:, 0] * (100.0 / 255.0)
# #     a = lab[:, 1] - 128
# #     b = lab[:, 2] - 128
    
# #     return np.column_stack([L, a, b])

# # def calculate_ita_angle(L: float, b: float) -> float:
# #     """
# #     Calculate Individual Typology Angle (ITA°)
# #     Formula: ITA° = arctan((L* - 50) / b*) × (180/π)
# #     """
# #     if abs(b) < 0.0001:
# #         b = 0.0001
    
# #     ita_radians = atan((L - 50) / b)
# #     ita_degrees = degrees(ita_radians)
    
# #     return ita_degrees

# # def detect_undertone(a: float, b: float) -> Dict:
# #     """
# #     Detect skin undertone using color theory
    
# #     Args:
# #         a: LAB a* value (red-green axis)
# #         b: LAB b* value (yellow-blue axis)
        
# #     Returns:
# #         Undertone classification with confidence
# #     """
# #     undertone_score = (b * 0.7) + (a * 0.3)
    
# #     if undertone_score > 20:
# #         undertone = "Very Warm"
# #         description = "Strong golden/yellow undertones"
# #         confidence = min(undertone_score / 30, 1.0)
# #     elif undertone_score > 12:
# #         undertone = "Warm"
# #         description = "Golden/yellow undertones"
# #         confidence = min(undertone_score / 20, 1.0)
# #     elif undertone_score > 5:
# #         undertone = "Neutral Warm"
# #         description = "Slightly warm undertones"
# #         confidence = 0.75
# #     elif undertone_score > -5:
# #         undertone = "Neutral"
# #         description = "Balanced undertones"
# #         confidence = 0.70
# #     elif undertone_score > -12:
# #         undertone = "Neutral Cool"
# #         description = "Slightly cool undertones"
# #         confidence = 0.75
# #     elif undertone_score > -20:
# #         undertone = "Cool"
# #         description = "Pink/red undertones"
# #         confidence = min(abs(undertone_score) / 20, 1.0)
# #     else:
# #         undertone = "Very Cool"
# #         description = "Strong pink/blue undertones"
# #         confidence = min(abs(undertone_score) / 30, 1.0)
    
# #     return {
# #         'undertone': undertone,
# #         'description': description,
# #         'confidence': round(confidence, 2),
# #         'score': round(undertone_score, 2),
# #         'a_value': round(a, 2),
# #         'b_value': round(b, 2)
# #     }
# """
# Color Theory Utilities
# RGB → LAB conversion, ITA angle calculation, and undertone detection
# """

# import numpy as np
# import cv2
# from math import atan, degrees
# from typing import Dict


# # ----------------------------------------------------------
# # 1. Convert RGB → LAB (high accuracy, OpenCV-based)
# # ----------------------------------------------------------

# def rgb_to_lab(rgb_values: np.ndarray) -> np.ndarray:
#     """
#     Convert RGB to LAB color space
    
#     Args:
#         rgb_values: Array shape (n, 3) or (3,) with RGB values in 0–255
        
#     Returns:
#         LAB array shape (n, 3) with:
#             L* (0–100), a* (-128 to +127), b* (-128 to +127)
#     """
#     # Ensure correct shape
#     if len(rgb_values.shape) == 1:
#         rgb_values = rgb_values.reshape(1, -1)

#     # Normalize + reshape for OpenCV
#     rgb_normalized = rgb_values.astype(np.float32) / 255.0
#     rgb_reshaped = rgb_normalized.reshape(1, -1, 3)

#     # Convert
#     lab = cv2.cvtColor(rgb_reshaped, cv2.COLOR_RGB2LAB)
#     lab = lab.reshape(-1, 3)

#     # Apply correct scaling (OpenCV uses L:0–255)
#     L = lab[:, 0] * (100.0 / 255.0)
#     a = lab[:, 1] - 128
#     b = lab[:, 2] - 128

#     return np.column_stack([L, a, b])


# # ----------------------------------------------------------
# # 2. Calculate ITA angle
# # ----------------------------------------------------------

# def calculate_ita_angle(L: float, b: float) -> float:
#     """
#     Calculate Individual Typology Angle (ITA°)
#     Formula:
#         ITA° = arctan((L* - 50) / b*) × (180 / π)
#     """
#     if abs(b) < 0.0001:
#         b = 0.0001  # Avoid division by zero

#     ita_radians = atan((L - 50) / b)
#     return degrees(ita_radians)


# # ----------------------------------------------------------
# # 3. Undertone Detection
# # ----------------------------------------------------------

# def detect_undertone(a: float, b: float) -> Dict:
#     """
#     Detect skin undertone using LAB a* (red-green) and b* (yellow-blue).

#     Args:
#         a: LAB a* value
#         b: LAB b* value

#     Returns:
#         Dictionary with:
#             - undertone
#             - description
#             - confidence
#             - score
#             - a_value
#             - b_value
#     """

#     # ------------- Edge Case: Very weak color (over-exposed or too dark) -------------
#     if abs(a) < 2 and abs(b) < 2:
#         return {
#             "undertone": "Unknown",
#             "description": "Insufficient color information",
#             "confidence": 0.0,
#             "score": 0,
#             "a_value": round(a, 2),
#             "b_value": round(b, 2),
#         }

#     # Weighted undertone score (b* is dominant)
#     undertone_score = (0.7 * b) + (0.3 * a)

#     # ------------- Undertone Classification -------------
#     if undertone_score > 20:
#         undertone = "Very Warm"
#         description = "Strong golden/yellow undertones"
#         confidence = 1.0

#     elif undertone_score > 12:
#         undertone = "Warm"
#         description = "Golden/yellow undertones"
#         confidence = min(undertone_score / 20, 1.0)

#     elif undertone_score > 5:
#         undertone = "Neutral Warm"
#         description = "Slightly warm undertones"
#         confidence = 0.75

#     elif undertone_score > -5:
#         undertone = "Neutral"
#         description = "Balanced undertones"
#         confidence = 0.70

#     elif undertone_score > -12:
#         undertone = "Neutral Cool"
#         description = "Slightly cool undertones"
#         confidence = 0.75

#     elif undertone_score > -20:
#         undertone = "Cool"
#         description = "Pink/red undertones"
#         confidence = min(abs(undertone_score) / 20, 1.0)

#     else:
#         undertone = "Very Cool"
#         description = "Strong pink/blue undertones"
#         confidence = min(abs(undertone_score) / 30, 1.0)

#     # ------------- Return structured result -------------
#     return {
#         "undertone": undertone,
#         "description": description,
#         "confidence": round(confidence, 2),
#         "score": round(undertone_score, 2),
#         "a_value": round(a, 2),
#         "b_value": round(b, 2),
#     }
"""
Color Theory Utilities
RGB → LAB conversion, ITA angle calculation, and undertone detection
"""

import numpy as np
import cv2
from math import atan, degrees
from typing import Dict


# ----------------------------------------------------------
# 1. RGB → LAB Conversion
# ----------------------------------------------------------

def rgb_to_lab(rgb_values: np.ndarray) -> np.ndarray:
    """
    Convert RGB to LAB color space.

    Args:
        rgb_values: Array (n, 3) OR (3,) with RGB values 0–255.

    Returns:
        LAB array (n, 3): L* 0–100, a* -128 to +127, b* -128 to +127
    """

    if len(rgb_values.shape) == 1:
        rgb_values = rgb_values.reshape(1, -1)

    # Normalize to 0–1
    normalized = rgb_values.astype(np.float32) / 255.0
    reshaped = normalized.reshape(1, -1, 3)

    lab = cv2.cvtColor(reshaped, cv2.COLOR_RGB2LAB)
    lab = lab.reshape(-1, 3)

    # Fix OpenCV scaling
    L = lab[:, 0] * (100 / 255.0)
    a = lab[:, 1] - 128
    b = lab[:, 2] - 128

    return np.column_stack((L, a, b))


# ----------------------------------------------------------
# 2. ITA Angle Calculation
# ----------------------------------------------------------

def calculate_ita_angle(L: float, b: float) -> float:
    """
    Compute ITA angle using formula:
    ITA° = arctan((L* - 50) / b*) × (180/π)
    """

    if abs(b) < 1e-4:
        b = 1e-4  # avoid divide-by-zero

    angle = atan((L - 50) / b)
    return degrees(angle)


# ----------------------------------------------------------
# 3. Undertone Detection
# ----------------------------------------------------------

def detect_undertone(a: float, b: float) -> Dict:
    """
    Determine undertone using LAB a* and b* values.

    Returns:
        { undertone, description, confidence, score, a_value, b_value }
    """

    # Edge case: little color information (overexposed too bright, etc.)
    if abs(a) < 2 and abs(b) < 2:
        return {
            "undertone": "Unknown",
            "description": "Insufficient color information",
            "confidence": 0.0,
            "score": 0,
            "a_value": round(a, 2),
            "b_value": round(b, 2)
        }

    # Weighted undertone score
    score = 0.7 * b + 0.3 * a

    # Classification thresholds
    if score > 20:
        undertone = "Very Warm"
        description = "Strong golden/yellow undertones"
        confidence = 1.0

    elif score > 12:
        undertone = "Warm"
        description = "Golden/yellow undertones"
        confidence = min(score / 20, 1.0)

    elif score > 5:
        undertone = "Neutral Warm"
        description = "Slightly warm undertones"
        confidence = 0.75

    elif score > -5:
        undertone = "Neutral"
        description = "Balanced undertones"
        confidence = 0.70

    elif score > -12:
        undertone = "Neutral Cool"
        description = "Slightly cool undertones"
        confidence = 0.75

    elif score > -20:
        undertone = "Cool"
        description = "Pink/red undertones"
        confidence = min(abs(score) / 20, 1.0)

    else:
        undertone = "Very Cool"
        description = "Strong pink/blue undertones"
        confidence = min(abs(score) / 30, 1.0)

    return {
        "undertone": undertone,
        "description": description,
        "confidence": round(confidence, 2),
        "score": round(score, 2),
        "a_value": round(a, 2),
        "b_value": round(b, 2)
    }
