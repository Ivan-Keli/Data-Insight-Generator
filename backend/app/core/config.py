from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from functools import lru_cache
import os
from pathlib import Path

class Settings(BaseSettings):
    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG_MODE: bool = False
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # LLM API Keys
    GEMINI_API_KEY: str
    DEEPSEEK_API_KEY: str
    
    # File Upload Settings
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10  # MB
    FILE_RETENTION_HOURS: int = 24
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings to avoid re-reading the environment each time.
    """
    return Settings()

def get_project_root() -> Path:
    """Get the project root directory."""
    return Path(__file__).parent.parent.parent
    