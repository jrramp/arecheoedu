import pdfplumber

pdf_path = r"c:\workspaces\archaeologyedu\Relics Reimagined - Geology - Google Slides.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}\n")
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        print(f"=== SLIDE {i+1} ===")
        print(text)
        print("\n")
