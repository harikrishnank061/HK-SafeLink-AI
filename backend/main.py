from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import re
from urllib.parse import urlparse
import os

app = FastAPI(title="HK SafeLink AI API")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "defacement_detection_model.pkl") 
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model from {MODEL_PATH}: {e}")
    model = None

# Feature Extraction Functions (Synced with app1.py)
def url_length(url): return len(str(url))
def hostname_length(url): return len(urlparse(url if url.startswith(('http://', 'https://')) else 'http://' + url).netloc)
def count_www(url): return url.count('www')
def count_https(url): return url.count('https')
def count_http(url): return url.count('http')
def count_dot(url): return url.count('.')
def count_per(url): return url.count('%')
def count_ques(url): return url.count('?')
def count_hyphen(url): return url.count('-')
def count_equal(url): return url.count('=')
def count_atrate(url): return url.count('@')
def no_of_dir(url): return urlparse(url).path.count('/')
def no_of_embed(url): return urlparse(url).path.count('//')
def shortening_service(url): return 1 if re.search(r'bit\.ly|goo\.gl|tinyurl|ow\.ly|t\.co', url) else 0
def fd_length(url): 
    try: return len(urlparse(url).path.split('/')[1])
    except: return 0
def suspicious_words(url): return 1 if re.search(r'PayPal|login|signin|bank|account|update|free|lucky|service|bonus|ebayisapi|webscr', url) else 0
def digit_count(url): return sum(1 for c in url if c.isdigit())
def letter_count(url): return sum(1 for c in url if c.isalpha())
def abnormal_url(url): return 1 if urlparse(url).hostname and re.search(urlparse(url).hostname, url) else 0
def having_ip_address(url): return 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', url) else 0

FEATURE_ORDER = [
    'use_of_ip_address', 'abnormal_url', 'count-www', 'count@', 'count_dir',
    'count_embed_domian', 'short_url', 'count-https', 'count-http', 'count%',
    'count?', 'count-', 'count=', 'url_length', 'hostname_length', 'sus_url',
    'fd_length', 'count-digits', 'count-letters'
]

class URLRequest(BaseModel):
    url: str

@app.post("/scan")
async def scan_url(request: URLRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server.")
    
    url = request.url
    domain = urlparse(url if url.startswith(('http://', 'https://')) else 'http://' + url).netloc.lower()
    
    # Industry-standard Whitelist (Safety Bypass for High-Reputation Domains)
    TRUSTED_DOMAINS = [
        'google.com', 'flipkart.com', 'amazon.in', 'amazon.com', 
        'microsoft.com', 'apple.com', 'linkedin.com', 'github.com',
        'facebook.com', 'twitter.com', 'instagram.com', 'netflix.com'
    ]
    
    # Check if the domain itself or any parent domain is trusted
    is_trusted = any(domain == trusted or domain.endswith('.' + trusted) for trusted in TRUSTED_DOMAINS)
    
    # Feature Extraction (exactly as in app1.py)
    features = {
        'url_length': url_length(url),
        'hostname_length': hostname_length(url),
        'count-www': count_www(url),
        'count-https': count_https(url),
        'count-http': count_http(url),
        'count.': count_dot(url),
        'count%': count_per(url),
        'count?': count_ques(url),
        'count-': count_hyphen(url),
        'count=': count_equal(url),
        'count@': count_atrate(url),
        'count_dir': no_of_dir(url),
        'count_embed_domian': no_of_embed(url),
        'short_url': shortening_service(url),
        'fd_length': fd_length(url),
        'sus_url': suspicious_words(url),
        'count-digits': digit_count(url),
        'count-letters': letter_count(url),
        'abnormal_url': abnormal_url(url),
        'use_of_ip_address': having_ip_address(url)
    }
    
    if is_trusted:
        return {
            "url": url,
            "prediction": "Benign",
            "features": features,
            "msg": "Verified via High-Reputation Domain Whitelist"
        }

    # Organize features in the exact order the model expects
    features_df = pd.DataFrame([features])[FEATURE_ORDER]
    prediction = model.predict(features_df)[0]
    
    result = "Malicious" if prediction == 1 else "Benign"
    
    return {
        "url": url,
        "prediction": result,
        "features": features
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

