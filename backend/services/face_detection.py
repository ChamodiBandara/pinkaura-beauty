"""
Pink Aura - Face Detection & Skin Extraction Service
Extracts clean skin pixels from face images using MediaPipe Face Mesh
"""

import cv2
import mediapipe as mp
import numpy as np
from typing import Tuple, Optional

class FaceSkinExtractor:
    """
    Extracts clean skin pixels from face images using MediaPipe Face Mesh
    """
    
    def __init__(self):
        """Initialize MediaPipe Face Mesh"""
        print("✅ Initializing Face Skin Extractor...")
        
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        self._define_face_regions()
        print("✅ Face Skin Extractor initialized!")
    
    def _define_face_regions(self):
        """Define landmark indices for facial regions"""
        
        # Best skin regions
        self.forehead_center = [
            10, 151, 9, 8, 168, 6, 197, 195, 5, 4,
            109, 108, 107, 103, 67, 69, 104, 68, 71
        ]
        
        self.left_cheek_center = [
            205, 207, 187, 123, 116, 117, 118, 119,
            100, 126, 209, 49, 131, 134, 51, 102,
            203, 206, 216, 212, 202, 204
        ]
        
        self.right_cheek_center = [
            425, 427, 411, 352, 345, 346, 347, 348,
            329, 355, 429, 279, 360, 363, 281, 331,
            423, 426, 436, 432, 422, 424
        ]
        
        self.nose_bridge = [
            8, 9, 151, 337, 299, 333, 298, 301, 368,
            6, 197, 195, 5, 4, 1, 19, 94, 2
        ]
        
        self.skin_indices = list(set(
            self.forehead_center + 
            self.left_cheek_center + 
            self.right_cheek_center +
            self.nose_bridge
        ))
    
    def detect_face(self, image: np.ndarray) -> Tuple[bool, Optional[object]]:
        """
        Detect face in image using MediaPipe
        
        Args:
            image: BGR image from OpenCV
            
        Returns:
            (success, face_landmarks) tuple
        """
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(image_rgb)
        
        if results.multi_face_landmarks:
            print("✅ Face detected!")
            return True, results.multi_face_landmarks[0]
        else:
            print("❌ No face detected")
            return False, None
    
    def extract_skin_pixels(self, image: np.ndarray, face_landmarks: object) -> np.ndarray:
        """
        Extract clean skin pixels from face regions
        
        Args:
            image: BGR image from OpenCV
            face_landmarks: MediaPipe face landmarks
            
        Returns:
            Array of RGB skin pixels (n, 3)
        """
        height, width, _ = image.shape
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Get landmark coordinates
        landmarks_points = []
        for landmark in face_landmarks.landmark:
            x = int(landmark.x * width)
            y = int(landmark.y * height)
            x = max(0, min(x, width - 1))
            y = max(0, min(y, height - 1))
            landmarks_points.append((x, y))
        
        skin_pixels = []
        
        # Sample from forehead center (3x3)
        for idx in self.forehead_center:
            if idx < len(landmarks_points):
                x, y = landmarks_points[idx]
                for dy in range(-1, 2):
                    for dx in range(-1, 2):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < height and 0 <= nx < width:
                            pixel = image_rgb[ny, nx]
                            skin_pixels.append(pixel)
        
        # Sample from left cheek (5x5)
        for idx in self.left_cheek_center:
            if idx < len(landmarks_points):
                x, y = landmarks_points[idx]
                for dy in range(-2, 3):
                    for dx in range(-2, 3):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < height and 0 <= nx < width:
                            pixel = image_rgb[ny, nx]
                            skin_pixels.append(pixel)
        
        # Sample from right cheek (5x5)
        for idx in self.right_cheek_center:
            if idx < len(landmarks_points):
                x, y = landmarks_points[idx]
                for dy in range(-2, 3):
                    for dx in range(-2, 3):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < height and 0 <= nx < width:
                            pixel = image_rgb[ny, nx]
                            skin_pixels.append(pixel)
        
        # Sample from nose bridge (3x3)
        for idx in self.nose_bridge:
            if idx < len(landmarks_points):
                x, y = landmarks_points[idx]
                for dy in range(-1, 2):
                    for dx in range(-1, 2):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < height and 0 <= nx < width:
                            pixel = image_rgb[ny, nx]
                            skin_pixels.append(pixel)
        
        skin_pixels = np.array(skin_pixels)
        
        # Filter by brightness
        if len(skin_pixels) > 0:
            skin_pixels_hsv = np.array([
                cv2.cvtColor(pixel.reshape(1, 1, 3), cv2.COLOR_RGB2HSV)[0, 0] 
                for pixel in skin_pixels
            ])
            
            brightness = skin_pixels_hsv[:, 2]
            bright_enough = brightness > 40
            
            saturation = skin_pixels_hsv[:, 1]
            colorful_enough = saturation > 10
            
            good_pixels = bright_enough & colorful_enough
            skin_pixels = skin_pixels[good_pixels]
            
            if len(skin_pixels) > 100:
                brightness_filtered = brightness[good_pixels]
                lower_bound = np.percentile(brightness_filtered, 10)
                upper_bound = np.percentile(brightness_filtered, 90)
                
                final_filter = (brightness_filtered >= lower_bound) & (brightness_filtered <= upper_bound)
                skin_pixels = skin_pixels[final_filter]
        
        print(f"✅ Extracted {len(skin_pixels)} high-quality skin pixels")
        return skin_pixels
    
    def process_image(self, image: np.ndarray) -> Optional[np.ndarray]:
        """
        Complete pipeline: detect face and extract skin pixels
        
        Args:
            image: BGR image from OpenCV
            
        Returns:
            Skin pixels array (n, 3) or None if no face detected
        """
        face_detected, face_landmarks = self.detect_face(image)
        
        if not face_detected:
            return None
        
        skin_pixels = self.extract_skin_pixels(image, face_landmarks)
        return skin_pixels
    
    def __del__(self):
        """Cleanup"""
        if hasattr(self, 'face_mesh'):
            self.face_mesh.close()