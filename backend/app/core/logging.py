import logging
import sys
from typing import Dict, Any
import json
from datetime import datetime

from app.core.config import get_settings

settings = get_settings()

class JSONFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings after parsing the log record.
    """
    def __init__(self, *args, **kwargs):
        self.fmt_dict = kwargs.pop("fmt_dict", {})
        super().__init__(*args, **kwargs)
    
    def format(self, record: logging.LogRecord) -> str:
        """
        Format the log record as JSON.
        """
        log_record = {}
        
        # Add provided fields
        for key, value in self.fmt_dict.items():
            if key == "asctime":
                value = self.formatTime(record)
            elif key == "message":
                value = record.getMessage()
            elif hasattr(record, key):
                value = getattr(record, key)
            log_record[key] = value
        
        # Add exception info if present
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        
        # Return JSON string
        return json.dumps(log_record)

def setup_logging() -> None:
    """
    Set up logging configuration.
    """
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    # Clear existing handlers
    root_logger = logging.getLogger()
    for handler in root_logger.handlers:
        root_logger.removeHandler(handler)
    
    # Configure root logger
    root_logger.setLevel(log_level)
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    
    # Use standard formatter for console
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console_handler.setFormatter(formatter)
    
    # Add handlers to root logger
    root_logger.addHandler(console_handler)
    
    # Suppress noisy loggers
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    
    # Log setup completion
    logging.info(f"Logging configured with level: {settings.LOG_LEVEL}")
    