from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import os

pdf_path = r"c:\workspaces\arecheoedu\Relics Reimagined - Geology - Google Slides.pdf"

try:
    # Convert PDF to images
    print("Converting PDF to images...")
    images = convert_from_path(pdf_path, dpi=150)
    
    print(f"Total pages converted: {len(images)}\n")
    
    for i, image in enumerate(images):
        print(f"\n=== SLIDE {i+1} ===")
        
        # Perform OCR on image
        try:
            text = pytesseract.image_to_string(image)
            if text.strip():
                print(text)
            else:
                print("[No text detected]")
        except Exception as e:
            print(f"OCR Error: {e}")
            
except Exception as e:
    print(f"Error: {e}")
    print("Make sure Tesseract OCR is installed on your system.")
