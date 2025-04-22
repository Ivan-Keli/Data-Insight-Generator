import os
import logging
import time
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)

def clean_old_files(upload_dir: str, retention_hours: int) -> None:
    """
    Clean up old uploaded files based on retention policy.
    
    Args:
        upload_dir: Directory where files are stored
        retention_hours: Number of hours to keep files
    """
    try:
        # Ensure the directory exists
        if not os.path.exists(upload_dir):
            logger.warning(f"Upload directory does not exist: {upload_dir}")
            return
        
        # Calculate cutoff time
        cutoff_time = time.time() - (retention_hours * 3600)
        
        # List all files in the directory
        cleaned_count = 0
        for filename in os.listdir(upload_dir):
            file_path = os.path.join(upload_dir, filename)
            
            # Skip directories
            if os.path.isdir(file_path):
                continue
            
            # Check file age
            file_mod_time = os.path.getmtime(file_path)
            if file_mod_time < cutoff_time:
                try:
                    os.remove(file_path)
                    cleaned_count += 1
                    logger.info(f"Deleted old file: {filename}")
                except Exception as e:
                    logger.error(f"Failed to delete file {filename}: {str(e)}")
        
        if cleaned_count > 0:
            logger.info(f"Cleaned up {cleaned_count} old files from {upload_dir}")
            
    except Exception as e:
        logger.error(f"Error cleaning old files: {str(e)}", exc_info=True)
        