import cv2
import numpy as np
from modules.lip_detector import LipDetector
from utils.color_utils import ColorConverter
from config.config import (
    DEFAULT_OPACITY,
    DEFAULT_GLOSS
)

class LipstickApplicator:
    """
    Applies lipstick to video frames in real-time.
    Allows selecting different shades, opacity, and gloss.
    """
    
    def __init__(self):
        self.detector = LipDetector()
        self.current_shade = (220, 20, 60)  # Default crimson (BGR)
        self.opacity = DEFAULT_OPACITY
        self.gloss_level = DEFAULT_GLOSS

    def apply_lipstick(self, frame, color_rgb=None, opacity=None):
        if color_rgb is None:
            color_rgb = self.current_shade
        if opacity is None:
            opacity = self.opacity

        landmarks = self.detector.detect_landmarks(frame)
        if landmarks is None:
            return frame

        # Get upper and lower lip masks
        mask_upper, mask_lower = self.detector.create_lip_masks(landmarks, frame.shape)
        mask = cv2.bitwise_or(mask_upper, mask_lower)

        # Blend color exactly
        output = ColorConverter.blend_colors_rgb(frame, color_rgb, mask, opacity)

        # Optional: add gloss
        output = self.add_gloss(output, landmarks, mask_upper, mask_lower)

        return output

    def add_gloss(self, frame, landmarks, mask_upper, mask_lower):
        if self.gloss_level <= 0:
            return frame

        upper_points = landmarks['outer'][landmarks['outer'][:,1] <= np.median(landmarks['outer'][:,1])]
        if len(upper_points) == 0:
            return frame

        upper_center = np.mean(upper_points, axis=0).astype(int)

        highlight = np.zeros_like(frame, dtype=np.uint8)
        cv2.circle(highlight, tuple(upper_center), 5, (255, 255, 255), -1)
        highlight = cv2.GaussianBlur(highlight, (15, 15), 0)

        mask_total = cv2.bitwise_or(mask_upper, mask_lower)
        mask_total_3ch = cv2.cvtColor(mask_total, cv2.COLOR_GRAY2BGR)
        highlight = cv2.bitwise_and(highlight, mask_total_3ch)

        alpha = self.gloss_level * 0.6
        output = cv2.addWeighted(frame, 1.0, highlight, alpha, 0)
        return output

    def set_shade(self, color_rgb):
        self.current_shade = color_rgb

    def set_opacity(self, value):
        self.opacity = max(0.0, min(1.0, value))

    def set_gloss(self, value):
        self.gloss_level = max(0.0, min(1.0, value))
