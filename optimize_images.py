from PIL import Image
import os
import glob

def optimize_image(path, quality=80, max_width=1200):
    try:
        img = Image.open(path)
        
        # Resize if too large
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
        # Save with optimization
        img.save(path, optimize=True, quality=quality)
        print(f"Optimized: {path}")
    except Exception as e:
        print(f"Error optimizing {path}: {e}")

# Optimize specific MIS images
mis_images = [
    "/home/ubuntu/mis-club/client/public/MIS1#.png",
    "/home/ubuntu/mis-club/client/public/MIS2#.png",
    "/home/ubuntu/mis-club/client/public/MIS3#.png"
]

for img_path in mis_images:
    if os.path.exists(img_path):
        optimize_image(img_path)

# Optimize other images in public folder
public_images = glob.glob("/home/ubuntu/mis-club/client/public/*.{png,jpg,jpeg}")
for img_path in public_images:
    if img_path not in mis_images: # Avoid double processing
        optimize_image(img_path)
