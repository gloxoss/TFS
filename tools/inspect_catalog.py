
import json
import re

catalog_path = r"c:\Users\zakio\Documents\Project\PB-Next\final_catalog.json"

try:
    with open(catalog_path, 'r', encoding='utf-16') as f:
        lines = f.readlines()
        
    cleaned_lines = []
    json_start_found = False
    
    for line in lines:
        line_clean = re.sub(r'^\d{4}/\d{2}/\d{2} \d{2}:\d{2}:\d{2} ', '', line)
        if not json_start_found:
            if line_clean.strip().startswith('{'):
                json_start_found = True
                cleaned_lines.append(line_clean)
        else:
            cleaned_lines.append(line_clean)
            
    full_json = "".join(cleaned_lines)
    data = json.loads(full_json)
    
    power_key = next((k for k in data.keys() if k == 'Power'), None)
    
    if power_key:
        items = data[power_key].get('items', [])
        print("--- START JSON DUMP ---")
        print(json.dumps(items[:3], indent=2))
        print("--- END JSON DUMP ---")

except Exception as e:
    print(f"Error: {e}")
