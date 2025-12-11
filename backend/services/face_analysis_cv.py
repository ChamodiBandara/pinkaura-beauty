import cv2
import numpy as np
from PIL import Image
import io

def get_face_bounding_box(image_data):
    """
    Detect face and return bounding box coordinates.
    
    Args:
        image_data: Image bytes, PIL Image, or numpy array
        
    Returns:
        dict: Face detection results with bounding box or error
    """
    
    # Convert image data to numpy array if it's PIL Image
    if isinstance(image_data, Image.Image):
        img = np.array(image_data)
        img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    else:
        img_bgr = image_data
    
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    
    # Load Haar face detector
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    
    # Detect faces
    faces = face_cascade.detectMultiScale(img_rgb, 1.1, 5)
    
    if len(faces) == 0:
        return {
            "success": False,
            "face_detected": False,
            "error": "No face detected in image"
        }
    
    # Get the largest face
    (x, y, w, h) = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
    
    return {
        "success": True,
        "face_detected": True,
        "face_box": {
            "x": int(x),
            "y": int(y),
            "width": int(w),
            "height": int(h)
        },
        "skin_analysis_regions": {
            "forehead": {
                "x1": int(x + 0.25 * w),
                "y1": int(y + 0.10 * h),
                "x2": int(x + 0.75 * w),
                "y2": int(y + 0.30 * h),
                "label": "FOREHEAD"
            },
            "left_cheek": {
                "x1": int(x + 0.05 * w),
                "y1": int(y + 0.45 * h),
                "x2": int(x + 0.40 * w),
                "y2": int(y + 0.75 * h),
                "label": "LEFT CHEEK"
            },
            "right_cheek": {
                "x1": int(x + 0.60 * w),
                "y1": int(y + 0.45 * h),
                "x2": int(x + 0.90 * w),
                "y2": int(y + 0.75 * h),
                "label": "RIGHT CHEEK"
            }
        }
    }


def analyze_face_skin(image_data):
    """
    Analyze skin tone and characteristics from a face image using OpenCV and HSV color detection.
    
    Args:
        image_data: Image bytes or PIL Image
        
    Returns:
        dict: Analysis results with skin tone info, affected areas, etc.
    """
    
    # Convert image data to numpy array if it's PIL Image
    if isinstance(image_data, Image.Image):
        img = np.array(image_data)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    else:
        # Assume it's already BGR (OpenCV format)
        img_rgb = image_data
    
    # Convert to RGB for analysis
    img_rgb = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2RGB)
    
    # Load Haar face detector
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    
    # Detect faces
    faces = face_cascade.detectMultiScale(img_rgb, 1.1, 5)
    
    if len(faces) == 0:
        return {
            "success": False,
            "error": "No face detected in image",
            "skin_tone": None,
            "affected_areas": [],
            "recommendations": []
        }
    
    # Take the first detected face
    (x, y, w, h) = faces[0]
    face_region = img_rgb[y:y+h, x:x+w]
    
    # Convert face region to HSV for skin detection
    hsv = cv2.cvtColor(face_region, cv2.COLOR_RGB2HSV)
    
    # Define HSV skin color range
    # These ranges can be adjusted based on different skin tones
    lower_skin = np.array([0, 30, 60], dtype=np.uint8)
    upper_skin = np.array([20, 150, 255], dtype=np.uint8)
    
    # Create mask for skin region
    skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
    
    # Smooth and clean mask
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)
    skin_mask = cv2.GaussianBlur(skin_mask, (7, 7), 0)
    
    # Extract skin region (masked)
    skin_region = cv2.bitwise_and(face_region, face_region, mask=skin_mask)
    
    # Calculate average skin tone color
    skin_pixels = face_region[skin_mask > 0]
    
    if len(skin_pixels) == 0:
        return {
            "success": False,
            "error": "Could not extract skin region",
            "skin_tone": None,
            "affected_areas": [],
            "recommendations": []
        }
    
    # Calculate mean RGB values for detected skin
    mean_r = int(np.mean(skin_pixels[:, 0]))
    mean_g = int(np.mean(skin_pixels[:, 1]))
    mean_b = int(np.mean(skin_pixels[:, 2]))
    
    # Determine skin tone category
    skin_tone = categorize_skin_tone(mean_r, mean_g, mean_b)
    
    # Detect affected areas (acne, dark spots, etc.)
    affected_areas = detect_affected_areas(face_region, skin_mask)
    
    # Generate recommendations based on skin tone
    recommendations = get_recommendations(skin_tone)
    
    return {
        "success": True,
        "skin_tone": skin_tone,
        "skin_color_rgb": {
            "r": mean_r,
            "g": mean_g,
            "b": mean_b
        },
        "skin_coverage_percentage": (np.sum(skin_mask > 0) / skin_mask.size) * 100,
        "affected_areas": affected_areas,
        "recommendations": recommendations,
        "face_detected": True,
        "face_coordinates": {
            "x": int(x),
            "y": int(y),
            "width": int(w),
            "height": int(h)
        }
    }


def categorize_skin_tone(r, g, b):
    """
    Categorize skin tone based on RGB values.
    
    Returns one of: "Fair", "Light", "Medium", "Olive", "Deep", "Very Deep"
    """
    
    # Calculate lightness using HSV
    hsv_array = cv2.cvtColor(np.uint8([[[b, g, r]]]), cv2.COLOR_RGB2HSV)
    h, s, v = hsv_array[0][0]
    
    # Categorize based on brightness (V value) and saturation
    if v >= 200:
        return "Fair"
    elif v >= 170:
        return "Light"
    elif v >= 140:
        return "Medium"
    elif v >= 110:
        return "Olive"
    elif v >= 80:
        return "Deep"
    else:
        return "Very Deep"


def detect_affected_areas(face_region, skin_mask):
    """
    Detect areas with potential skin issues (acne, dark spots, etc.).
    
    Returns list of detected issues.
    """
    
    affected = []
    
    # Convert to grayscale for texture analysis
    gray = cv2.cvtColor(face_region, cv2.COLOR_RGB2GRAY)
    
    # Apply only to skin region
    gray_masked = cv2.bitwise_and(gray, gray, mask=skin_mask)
    
    # Detect darker areas that might be spots/acne
    # Use adaptive thresholding to find anomalies
    darker_regions = cv2.adaptiveThreshold(
        gray_masked, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    
    # Count dark regions
    dark_pixel_count = np.sum(darker_regions > 0)
    total_skin_pixels = np.sum(skin_mask > 0)
    
    if total_skin_pixels > 0:
        dark_percentage = (dark_pixel_count / total_skin_pixels) * 100
        
        if dark_percentage > 15:
            affected.append({
                "type": "acne_or_spots",
                "severity": "high" if dark_percentage > 25 else "medium",
                "percentage": round(dark_percentage, 2)
            })
    
    return affected


def get_recommendations(skin_tone):
    """
    Get makeup and skincare recommendations based on skin tone.
    """
    
    recommendations = {
        "Fair": {
            "best_lipstick_colors": ["deep reds", "berry", "plum", "nude pink"],
            "best_foundation_shade": "light and neutral",
            "skincare_focus": "Sun protection (SPF 50+), hydration",
            "color_palette": "warm and cool tones work well"
        },
        "Light": {
            "best_lipstick_colors": ["coral", "peach", "natural pink", "berry"],
            "best_foundation_shade": "light with warm undertone",
            "skincare_focus": "Gentle cleansing, moisture balance",
            "color_palette": "warm neutrals, peach, coral"
        },
        "Medium": {
            "best_lipstick_colors": ["terracotta", "orange-red", "warm pink", "mauve"],
            "best_foundation_shade": "medium with warm undertone",
            "skincare_focus": "Antioxidants, brightening serums",
            "color_palette": "warm earth tones, warm reds"
        },
        "Olive": {
            "best_lipstick_colors": ["brick red", "warm burgundy", "coral", "terracotta"],
            "best_foundation_shade": "medium to medium-dark with yellow undertone",
            "skincare_focus": "Balancing, oil control",
            "color_palette": "warm and earthy tones"
        },
        "Deep": {
            "best_lipstick_colors": ["deep reds", "burgundy", "wine", "coral"],
            "best_foundation_shade": "deep with warm undertone",
            "skincare_focus": "Rich moisturizing, glow-enhancing",
            "color_palette": "jewel tones, deep reds, burgundy"
        },
        "Very Deep": {
            "best_lipstick_colors": ["deep red", "plum", "wine", "burgundy"],
            "best_foundation_shade": "very deep with warm undertone",
            "skincare_focus": "Intensive moisture, radiance boosting",
            "color_palette": "jewel tones, rich reds, bold colors"
        }
    }
    
    return recommendations.get(skin_tone, recommendations["Medium"])


def analyze_skin_regions(image_data):
    """
    Analyze skin tone from specific regions (forehead, cheeks) with dynamic face detection.
    This matches the frontend's visual regions exactly.
    
    Args:
        image_data: Image bytes or PIL Image
        
    Returns:
        dict: Detailed skin analysis from specific regions
    """
    
    # Convert image data to numpy array if it's PIL Image
    if isinstance(image_data, Image.Image):
        img = np.array(image_data)
        img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    else:
        img_bgr = image_data
    
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    
    # Load Haar face detector
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    
    # Detect faces
    faces = face_cascade.detectMultiScale(img_rgb, 1.1, 5)
    
    if len(faces) == 0:
        return {
            "success": False,
            "face_detected": False,
            "error": "No face detected in image",
            "skin_analysis": {}
        }
    
    # Get the largest face
    (x, y, w, h) = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
    face_region = img_rgb[y:y+h, x:x+w]
    
    # Define the three analysis regions (matching frontend exactly)
    regions = {
        "forehead": {
            "x1": int(0.25 * w),
            "y1": int(0.10 * h),
            "x2": int(0.75 * w),
            "y2": int(0.30 * h)
        },
        "left_cheek": {
            "x1": int(0.05 * w),
            "y1": int(0.45 * h),
            "x2": int(0.40 * w),
            "y2": int(0.75 * h)
        },
        "right_cheek": {
            "x1": int(0.60 * w),
            "y1": int(0.45 * h),
            "x2": int(0.90 * w),
            "y2": int(0.75 * h)
        }
    }
    
    # Analyze each region
    region_analysis = {}
    all_skin_colors = []
    
    for region_name, coords in regions.items():
        x1, y1, x2, y2 = coords["x1"], coords["y1"], coords["x2"], coords["y2"]
        region_img = face_region[y1:y2, x1:x2]
        
        if region_img.size == 0:
            continue
        
        # Convert to HSV for skin detection
        hsv = cv2.cvtColor(region_img, cv2.COLOR_RGB2HSV)
        
        # Define HSV skin color range
        lower_skin = np.array([0, 30, 60], dtype=np.uint8)
        upper_skin = np.array([20, 150, 255], dtype=np.uint8)
        
        # Create skin mask
        skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        skin_mask = cv2.GaussianBlur(skin_mask, (7, 7), 0)
        
        # Extract skin pixels
        skin_pixels = region_img[skin_mask > 0]
        
        if len(skin_pixels) > 0:
            # Calculate mean RGB
            mean_r = int(np.mean(skin_pixels[:, 0]))
            mean_g = int(np.mean(skin_pixels[:, 1]))
            mean_b = int(np.mean(skin_pixels[:, 2]))
            
            # Calculate brightness
            hsv_mean = cv2.cvtColor(np.uint8([[[mean_b, mean_g, mean_r]]]), cv2.COLOR_RGB2HSV)
            brightness = int(hsv_mean[0][0][2])
            
            # Detect imperfections/spots
            darker_regions = cv2.adaptiveThreshold(
                cv2.cvtColor(region_img, cv2.COLOR_RGB2GRAY), 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            dark_percentage = (np.sum(darker_regions > 0) / darker_regions.size) * 100
            
            region_analysis[region_name] = {
                "skin_color_rgb": {
                    "r": mean_r,
                    "g": mean_g,
                    "b": mean_b
                },
                "brightness": brightness,
                "skin_coverage": (np.sum(skin_mask > 0) / skin_mask.size) * 100,
                "imperfection_percentage": round(dark_percentage, 2),
                "status": "clear" if dark_percentage < 15 else ("moderate" if dark_percentage < 25 else "concerns")
            }
            
            all_skin_colors.append([mean_r, mean_g, mean_b])
    
    # Calculate overall skin tone from all regions
    overall_tone = "Medium"
    if all_skin_colors:
        avg_r = int(np.mean([c[0] for c in all_skin_colors]))
        avg_g = int(np.mean([c[1] for c in all_skin_colors]))
        avg_b = int(np.mean([c[2] for c in all_skin_colors]))
        
        # Get brightness for categorization
        hsv_overall = cv2.cvtColor(np.uint8([[[avg_b, avg_g, avg_r]]]), cv2.COLOR_RGB2HSV)
        brightness = int(hsv_overall[0][0][2])
        
        overall_tone = categorize_skin_tone(avg_r, avg_g, avg_b)
    
    return {
        "success": True,
        "face_detected": True,
        "face_box": {
            "x": int(x),
            "y": int(y),
            "width": int(w),
            "height": int(h)
        },
        "overall_skin_tone": overall_tone,
        "region_analysis": region_analysis,
        "recommendations": get_recommendations(overall_tone),
        "analysis_confidence": "high" if len(region_analysis) == 3 else "medium"
    }

