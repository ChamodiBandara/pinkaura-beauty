# import cv2
# import numpy as np

# class ColorConverter:
#     @staticmethod
#     def blend_colors_rgb(frame, color_rgb, mask, opacity=0.7):
#         color_layer = np.zeros_like(frame, dtype=np.uint8)
#         color_layer[:] = color_rgb[::-1]  # convert RGB to BGR
#         mask_3ch = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
#         blended = cv2.addWeighted(frame, 1-opacity, cv2.bitwise_and(color_layer, mask_3ch), opacity, 0)
#         return blended


import cv2
import numpy as np

class ColorConverter:
    """
    Utility class for applying color layers to masked regions.
    """

    @staticmethod
    def blend_colors_rgb(frame, color_rgb, mask, opacity=0.7):
        """
        Blend a color onto a masked area in an image.

        Args:
            frame: Original BGR image (OpenCV format)
            color_rgb: (R, G, B) tuple
            mask: 1-channel mask (0–255)
            opacity: Float 0–1

        Returns:
            Blended BGR image
        """

        # Create solid color layer (OpenCV uses BGR)
        color_layer = np.zeros_like(frame, dtype=np.uint8)
        color_layer[:] = color_rgb[::-1]

        # Expand mask → 3-channel
        mask_3ch = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

        # Keep only masked areas from color layer
        masked_color = cv2.bitwise_and(color_layer, mask_3ch)

        # Blend the masked color with original frame
        blended = cv2.addWeighted(
            frame, 1 - opacity,
            masked_color, opacity,
            0
        )

        return blended
