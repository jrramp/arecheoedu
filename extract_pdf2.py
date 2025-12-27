import pdfplumber
from PIL import Image
import io

pdf_path = r"c:\workspaces\arecheoedu\Relics Reimagined - Geology - Google Slides.pdf"

# Try to extract images and text from PDF
with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}\n")
    
    for i, page in enumerate(pdf.pages):
        print(f"\n=== SLIDE {i+1} ===")
        
        # Try to extract text
        text = page.extract_text()
        if text:
            print("TEXT:")
            print(text)
        
        # Try to extract images
        images = page.images
        if images:
            print(f"Images found: {len(images)}")
        
        # Try tables
        tables = page.extract_tables()
        if tables:
            print(f"Tables found: {len(tables)}")
            for j, table in enumerate(tables):
                print(f"Table {j+1}:")
                for row in table:
                    print(row)
