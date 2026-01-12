import requests
import json
import os

def fetch_services():
    # Configuration
    PB_URL = "http://127.0.0.1:8090"
    ADMIN_EMAIL = "zakiossama28@gmail.com"
    ADMIN_PASSWORD = "GloXoss123."
    OUTPUT_FILE = "services.json"

    # 1. Authenticate as Admin
    print(f"🔐 Authenticating as {ADMIN_EMAIL}...")
    auth_url = f"{PB_URL}/api/collections/_admins/auth-with-password"
    auth_data = {
        "identity": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }

    try:
        response = requests.post(auth_url, json=auth_data)
        response.raise_for_status()
        token = response.json().get("token")
        print("✅ Authentication successful.")
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return

    # 2. Fetch Services
    print("📡 Fetching services from collection...")
    # PocketBase default limit is 30, we use a large number to get all services in one go
    # If there are thousands, we'd need pagination, but services are usually a small collection
    services_url = f"{PB_URL}/api/collections/services/records?perPage=500"
    headers = {
        "Authorization": token
    }

    try:
        response = requests.get(services_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])
        print(f"✅ Successfully fetched {len(items)} services.")
    except Exception as e:
        print(f"❌ Failed to fetch services: {e}")
        return

    # 3. Save to JSON
    print(f"💾 Saving to {OUTPUT_FILE}...")
    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        print("✨ Done!")
    except Exception as e:
        print(f"❌ Failed to save file: {e}")

if __name__ == "__main__":
    fetch_services()
