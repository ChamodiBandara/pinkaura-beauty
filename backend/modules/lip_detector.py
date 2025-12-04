import cv2
import mediapipe as mp
import numpy as np
from config.config import (
    MEDIAPIPE_MAX_FACES,
    MEDIAPIPE_MIN_DETECTION_CONFIDENCE,
    MEDIAPIPE_MIN_TRACKING_CONFIDENCE,
    MEDIAPIPE_REFINE_LANDMARKS
)

class LipDetector:
    """
    Detects and extracts lip landmarks from video frames using MediaPipe Face Mesh.
    Provides separate upper and lower lip masks for precise coloring, excluding teeth.
    """
    
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=MEDIAPIPE_MAX_FACES,
            refine_landmarks=MEDIAPIPE_REFINE_LANDMARKS,
            min_detection_confidence=MEDIAPIPE_MIN_DETECTION_CONFIDENCE,
            min_tracking_confidence=MEDIAPIPE_MIN_TRACKING_CONFIDENCE
        )

        # Outer and inner lip indices (468-point MediaPipe)
        self.OUTER_LIP = [
            61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
            375, 321, 405, 314, 17, 84, 181, 91, 146
        ]
        self.INNER_LIP = [
            78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
            324, 318, 402, 317, 14, 87, 178, 88, 95
        ]

        self.OUTER_LIP = list(dict.fromkeys(self.OUTER_LIP))
        self.INNER_LIP = list(dict.fromkeys(self.INNER_LIP))
        self.last_landmarks = None
    
    def detect_landmarks(self, frame):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)

        if not results.multi_face_landmarks:
            return self.last_landmarks

        face_landmarks = results.multi_face_landmarks[0]
        h, w = frame.shape[:2]

        outer_points = np.array([[int(face_landmarks.landmark[i].x * w),
                                  int(face_landmarks.landmark[i].y * h)] 
                                 for i in self.OUTER_LIP], np.int32)
        inner_points = np.array([[int(face_landmarks.landmark[i].x * w),
                                  int(face_landmarks.landmark[i].y * h)] 
                                 for i in self.INNER_LIP], np.int32)

        landmarks = {
            'outer': outer_points,
            'inner': inner_points
        }

        self.last_landmarks = landmarks
        return landmarks

    def create_lip_masks(self, landmarks, frame_shape):
        """
        Returns separate masks for upper and lower lips.
        Ensures teeth are not included.
        """
        mask_upper = np.zeros(frame_shape[:2], dtype=np.uint8)
        mask_lower = np.zeros(frame_shape[:2], dtype=np.uint8)

        if landmarks is None:
            return mask_upper, mask_lower

        outer = landmarks['outer']
        inner = landmarks['inner']

        # Split outer and inner points into upper/lower halves
        mid_outer = len(outer) // 2
        mid_inner = len(inner) // 2

        # Upper lip polygon: outer upper + inner upper reversed
        upper_lip_poly = np.concatenate((outer[:mid_outer], inner[:mid_inner][::-1]))
        # Lower lip polygon: outer lower + inner lower reversed
        lower_lip_poly = np.concatenate((outer[mid_outer:], inner[mid_inner:][::-1]))

        # Fill convex polygons to create masks
        cv2.fillConvexPoly(mask_upper, cv2.convexHull(upper_lip_poly), 255)
        cv2.fillConvexPoly(mask_lower, cv2.convexHull(lower_lip_poly), 255)

        return mask_upper, mask_lower
