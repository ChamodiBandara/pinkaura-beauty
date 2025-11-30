"""
Color Theory Utilities
RGB to LAB conversion, ITA angle calculation, and undertone detection
"""

import numpy as np
import cv2
from math import atan, degrees
from typing import Dict

def rgb_to_lab(rgb_values: np.ndarray) -> np.ndarray:
    """
    Convert RGB to LAB color space
    
    Args:
        rgb_values: RGB array (n, 3) with values 0-255
        
    Returns:
        LAB array (n, 3) with L* (0-100), a* (-128 to 127), b* (-128 to 127)
    """
    if len(rgb_values.shape) == 1:
        rgb_values = rgb_values.reshape(1, -1)
    
    rgb_normalized = rgb_values.astype(np.float32) / 255.0
    rgb_reshaped = rgb_normalized.reshape(1, -1, 3)
    
    lab = cv2.cvtColor(rgb_reshaped, cv2.COLOR_RGB2LAB)
    lab = lab.reshape(-1, 3)
    
    L = lab[:, 0] * (100.0 / 255.0)
    a = lab[:, 1] - 128
    b = lab[:, 2] - 128
    
    return np.column_stack([L, a, b])

def calculate_ita_angle(L: float, b: float) -> float:
    """
    Calculate Individual Typology Angle (ITA°)
    Formula: ITA° = arctan((L* - 50) / b*) × (180/π)
    """
    if abs(b) < 0.0001:
        b = 0.0001
    
    ita_radians = atan((L - 50) / b)
    ita_degrees = degrees(ita_radians)
    
    return ita_degrees

def detect_undertone(a: float, b: float) -> Dict:
    """
    Detect skin undertone using color theory
    
    Args:
        a: LAB a* value (red-green axis)
        b: LAB b* value (yellow-blue axis)
        
    Returns:
        Undertone classification with confidence
    """
    undertone_score = (b * 0.7) + (a * 0.3)
    
    if undertone_score > 20:
        undertone = "Very Warm"
        description = "Strong golden/yellow undertones"
        confidence = min(undertone_score / 30, 1.0)
    elif undertone_score > 12:
        undertone = "Warm"
        description = "Golden/yellow undertones"
        confidence = min(undertone_score / 20, 1.0)
    elif undertone_score > 5:
        undertone = "Neutral Warm"
        description = "Slightly warm undertones"
        confidence = 0.75
    elif undertone_score > -5:
        undertone = "Neutral"
        description = "Balanced undertones"
        confidence = 0.70
    elif undertone_score > -12:
        undertone = "Neutral Cool"
        description = "Slightly cool undertones"
        confidence = 0.75
    elif undertone_score > -20:
        undertone = "Cool"
        description = "Pink/red undertones"
        confidence = min(abs(undertone_score) / 20, 1.0)
    else:
        undertone = "Very Cool"
        description = "Strong pink/blue undertones"
        confidence = min(abs(undertone_score) / 30, 1.0)
    
    return {
        'undertone': undertone,
        'description': description,
        'confidence': round(confidence, 2),
        'score': round(undertone_score, 2),
        'a_value': round(a, 2),
        'b_value': round(b, 2)
    }