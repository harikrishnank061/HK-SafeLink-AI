import requests

try:
    response = requests.post("http://127.0.0.1:8000/scan", json={"url": "http://google.com"})
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
