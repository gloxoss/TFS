import urllib.request
import json

SPORT_SLUGS = ['football','baseball','basketball','motorsports','athletics',
               'combat-sports','tennis','rugby','cycling','extreme-sports','equestrian']

url = ('http://127.0.0.1:8090/api/collections/services/records'
       '?filter=is_active%3Dtrue'
       '&fields=slug,title,title_fr,sections,brief_description,brief_description_fr,full_description,full_description_fr'
       '&perPage=100')

r = urllib.request.urlopen(url)
d = json.loads(r.read())

print("\n=== SPORTS SUB-SERVICES AUDIT ===\n")

for rec in d.get('items', []):
    if rec['slug'] not in SPORT_SLUGS:
        continue

    sections = rec.get('sections') or []
    if isinstance(sections, str):
        try:
            sections = json.loads(sections)
        except Exception:
            sections = []

    brief_fr = rec.get('brief_description_fr') or ''
    full_fr = rec.get('full_description_fr') or ''

    print(f"=== {rec['slug']} ===")
    print(f"  title_fr: {rec.get('title_fr') or 'MISSING'}")
    print(f"  brief_description_fr: {'OK' if brief_fr else 'MISSING'}")
    print(f"  full_description_fr: {'OK' if full_fr else 'MISSING'}")
    print(f"  sections count: {len(sections)}")

    for i, s in enumerate(sections):
        t = s.get('title', '')
        tf = s.get('titleFr', '')
        c = s.get('content', '')
        cf = s.get('contentFr', '')
        missing = []
        if t and not tf:
            missing.append('titleFr')
        if c and not cf:
            missing.append('contentFr')
        if missing:
            print(f"  section[{i}] type={s.get('type')} MISSING: {', '.join(missing)}")
            if t:
                print(f"    title: {t[:60]}")
            if c:
                print(f"    content: {c[:80]}...")
        else:
            print(f"  section[{i}] type={s.get('type')} - OK")

    print()
