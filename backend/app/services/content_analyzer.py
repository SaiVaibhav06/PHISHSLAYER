import re

SCAM_KEYWORDS = [
    "urgent", "kindly", "winner", "lottery", "verify", "account",
    "password", "unauthorized", "click", "free", "money",
    "wire transfer", "gift card", "crypto", "temporarily suspended",
    "action required", "irs", "taxes", "refund", "login", "bank"
]

SCAM_URL_PATTERNS = [
    r"http://", # Non-secure
    r"bit\.ly", r"tinyurl", r"t\.co", # Shortened
    r"\.xyz", r"\.tk", r"\.pw", r"\.cc" # Suspicious TLDs
]

FAKE_DOMAINS = ["gooogle.com", "paypaI.com", "appIe.com", "microsaft.com", "netfiix.com"]

def analyze_text(content: str, filename: str = None) -> dict:
    content_lower = content.lower()
    detected = []
    score = 0
    
    # Analyze Keywords
    for kw in SCAM_KEYWORDS:
        if re.search(rf"\b{kw}\b", content_lower):
            detected.append(kw)
            score += 15
            
    # Analyze URLs / Potential Fake Domains
    words = content_lower.split()
    for word in words:
        # Check URLs
        if word.startswith("http"):
            for pattern in SCAM_URL_PATTERNS:
                if re.search(pattern, word):
                    detected.append(f"suspicious_url:{pattern}")
                    score += 20
        # Check typonsquatting / fake domains
        for fd in FAKE_DOMAINS:
            if fd in word:
                detected.append(f"fake_domain:{fd}")
                score += 30

    # Mock File Ingestion penalty
    if filename:
        file_ext = filename.split('.')[-1].lower() if '.' in filename else ""
        if file_ext in ['pdf', 'doc', 'docx']:
            if "has_macro" in content_lower or "script" in content_lower:
                detected.append("malicious_macro_in_document")
                score += 50
        elif file_ext in ['png', 'jpg', 'jpeg']:
            if "qr code" in content_lower:
                detected.append("suspicious_qr_code_image")
                score += 20
            
    # Scale score but cap at 100
    score = min(score, 100)
    
    # 0-30 -> Safe
    # 31-60 -> Suspicious
    # 61-100 -> Scam
    
    if score <= 30:
        level = "safe"
        if score == 0:
            explanation = "No suspicious signatures matched. The content appears safe."
        else:
            explanation = "Low presence of monitored keywords. Likely safe, but remain vigilant."
    elif score <= 60:
        level = "suspicious"
        explanation = "Suspicious identifiers found. URLs or keywords indicate possible risk."
    else:
        level = "scam"
        explanation = "High correlation with phishing patterns (fake domains, bad URLs, financial urgency). Do not click links."
        
    return {
        "risk_score": score,
        "risk_level": level,
        "explanation": explanation,
        "detected_keywords": detected
    }
