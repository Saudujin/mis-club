import base64

with open("/home/ubuntu/mis-club/client/public/certificate-bg.png", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    print(f"data:image/png;base64,{encoded_string}")
