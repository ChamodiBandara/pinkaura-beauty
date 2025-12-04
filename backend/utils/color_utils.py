import cv2
import numpy as np

class ColorConverter:
    @staticmethod
    def blend_colors_rgb(frame, color_rgb, mask, opacity=0.7):
        color_layer = np.zeros_like(frame, dtype=np.uint8)
        color_layer[:] = color_rgb[::-1]  # convert RGB to BGR
        mask_3ch = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
        blended = cv2.addWeighted(frame, 1-opacity, cv2.bitwise_and(color_layer, mask_3ch), opacity, 0)
        return blended
