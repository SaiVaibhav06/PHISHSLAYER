import re

SCAM_KEYWORDS = [
    "urgent", "kindly", "winner", "lottery", "verify", "account",
    "password", "unauthorized", "click", "free", "money",
    "wire transfer", "gift card", "crypto", "temporarily suspended",
    "action required", "irs", "taxes", "refund", "login", "bank"
]

def analyze_text(content: str) -> dict:
    content_lower = content.lower()
    detected = []
    score = 0
    
    for kw in SCAM_KEYWORDS:
        # Case insensitive exact word/phrase boundary match
        if re.search(rf"\b{kw}\b", content_lower):
            detected.append(kw)
            score += 15
            
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
        explanation = "Suspicious identifiers found. Verification of the sender is highly recommended."
    else:
        level = "scam"
        explanation = "High correlation with known phishing/scam patterns. Do not click links or provide info."
        
    return {
        "risk_score": score,
        "risk_level": level,
        "explanation": explanation,
        "detected_keywords": detected
    }
