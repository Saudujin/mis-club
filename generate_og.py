import os
from html2image import Html2Image

def generate_og_image():
    hti = Html2Image(output_path='/home/ubuntu/mis-club/client/public')
    
    # Define input and output
    input_file = '/home/ubuntu/mis-club/og-template.html'
    output_file = 'og-image.png'
    
    # Convert HTML to Image
    # Size is 1200x630 (Standard OG Image size)
    hti.screenshot(
        html_file=input_file,
        save_as=output_file,
        size=(1200, 630)
    )
    
    print(f"OG Image generated successfully at /home/ubuntu/mis-club/client/public/{output_file}")

if __name__ == "__main__":
    generate_og_image()
