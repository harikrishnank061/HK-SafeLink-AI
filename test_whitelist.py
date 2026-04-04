import requests

url = "https://www.flipkart.com"
try:
    response = requests.post("http://127.0.0.1:8000/scan", json={"url": url})
    print(f"URL: {url}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
