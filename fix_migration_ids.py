import re

# Path to the file
file_path = r"c:\Users\zakio\Documents\Project\PB-Next\pb_migrations\1766600000_batch3_kits_seed.js.bak"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all "id": "value" occurrences to identify short IDs
# We look for IDs that are between 1 and 14 chars.
# We mostly care about the ones in the definitions (BATCH3_ITEMS, KIT_TEMPLATES, KIT_ITEMS)
# But strictly speaking, any ID assignment that is short is invalid for creation.

# Regex to find definition IDs. 
# Matches: "id": "short_id"
id_pattern = re.compile(r'"id":\s*"([a-zA-Z0-9_]{1,14})"')

matches = set(id_pattern.findall(content))

replacements = {}

print("Found short IDs:")
for short_id in matches:
    # Generate replacement: pad with 'x' to 15 chars
    # We use 'x' suffix to keep it readable
    needed = 15 - len(short_id)
    new_id = short_id + ('x' * needed)
    replacements[short_id] = new_id
    print(f"  {short_id} -> {new_id}")

# Replace in content
# We must be careful not to replace partial matches if an ID is a substring of another.
# But IDs here are quoted strings. So replacing "old_id" with "new_id" is safe.
# We also need to replace references like "template_id": "short_id" or "main_product_id": "short_id"

new_content = content

# Sort replacements by length descending to avoid substring collision issues (e.g. replacing 'id1' inside 'id10')
sorted_keys = sorted(replacements.keys(), key=len, reverse=True)

for old_id in sorted_keys:
    new_id = replacements[old_id]
    # Replace quoted occurrences
    # This covers "id": "old", "template_id": "old", "value": "old" etc.
    new_content = new_content.replace(f'"{old_id}"', f'"{new_id}"')

# Write back to original filename (remove .bak)
target_path = file_path.replace('.bak', '')
with open(target_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Fixed file written to {target_path}")
