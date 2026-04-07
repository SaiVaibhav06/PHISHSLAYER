import os

class Settings:
    PROJECT_NAME: str = "PhishSlayer"
    API_V1_STR: str = "/api/v1"
    SIMULATE_TRAFFIC: bool = os.getenv("SIMULATE_TRAFFIC", "true").lower() == "true"
    CORS_ORIGINS: list = [
        "http://localhost",
        "http://localhost:5173", # Vite default
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]

settings = Settings()
