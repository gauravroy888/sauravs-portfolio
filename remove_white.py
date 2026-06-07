import json
import base64
from io import BytesIO
try:
    from PIL import Image
except ImportError:
    print("Pillow not installed. Please run with `uv run --with pillow python remove_white.py`")
    exit(1)

def remove_white_bg(img_data_b64):
    header, encoded = img_data_b64.split(',', 1)
    img_data = base64.b64decode(encoded)
    img = Image.open(BytesIO(img_data)).convert("RGBA")
    
    datas = img.getdata()
    newData = []
    for item in datas:
        # Change all white (also shades of whites) to transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    new_encoded = base64.b64encode(buffered.getvalue()).decode('utf-8')
    return header + ',' + new_encoded

print("Loading JSON...")
with open('hero-animation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Processing assets...")
assets = data.get('assets', [])
for i, asset in enumerate(assets):
    if 'p' in asset and asset['p'].startswith('data:image'):
        asset['p'] = remove_white_bg(asset['p'])
        if i % 10 == 0:
            print(f"Processed {i}/{len(assets)} images...")

with open('hero-animation.json', 'w', encoding='utf-8') as f:
    json.dump(data, f)
print("Done! Background removed.")
