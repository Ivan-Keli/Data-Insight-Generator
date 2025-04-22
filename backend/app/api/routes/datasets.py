from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging
import uuid
import os
import shutil
import time
from pathlib import Path

from app.core.config import get_settings
from app.models.dataset import DatasetResponse, DatasetPreview
from app.services.data.processor import DatasetProcessor
from app.services.data.storage import clean_old_files

settings = get_settings()
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter()

# In-memory storage for dataset metadata (in a production app, this would be a database)
datasets = {}

def get_dataset_processor():
    """Get the dataset processor service."""
    return DatasetProcessor()

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    dataset_name: Optional[str] = Form(None),
    dataset_processor: DatasetProcessor = Depends(get_dataset_processor)
):
    """
    Upload a dataset file (CSV, Excel, JSON) for analysis.
    """
    try:
        # Validate file size
        if file.size > settings.MAX_UPLOAD_SIZE * 1024 * 1024:  # Convert MB to bytes
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE} MB"
            )
        
        # Validate file type
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in ['.csv', '.xlsx', '.xls', '.json']:
            raise HTTPException(
                status_code=415,
                detail="Unsupported file type. Supported types: CSV, Excel, JSON"
            )
        
        # Generate a unique ID for the dataset
        dataset_id = str(uuid.uuid4())
        
        # Create a filename with the unique ID to avoid collisions
        filename = f"{dataset_id}{file_extension}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the dataset to get preview and metadata
        preview_data = dataset_processor.process_dataset(file_path)
        
        # Create dataset metadata
        dataset_metadata = {
            "id": dataset_id,
            "name": dataset_name or file.filename,
            "original_filename": file.filename,
            "file_path": file_path,
            "file_size": file.size,
            "file_type": file_extension.lstrip('.'),
            "upload_time": time.time(),
            "columns": preview_data.columns,
            "row_count": preview_data.total_rows,
            "preview": preview_data.preview_rows,
            "stats": preview_data.column_stats
        }
        
        # Store dataset metadata
        datasets[dataset_id] = dataset_metadata
        
        # Schedule cleanup of old files
        background_tasks.add_task(clean_old_files, settings.UPLOAD_DIR, settings.FILE_RETENTION_HOURS)
        
        # Return response
        return DatasetResponse(
            dataset_id=dataset_id,
            name=dataset_metadata["name"],
            file_type=dataset_metadata["file_type"],
            columns=dataset_metadata["columns"],
            row_count=dataset_metadata["row_count"],
            preview=preview_data
        )
    
    except Exception as e:
        logger.error(f"Error uploading dataset: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload dataset: {str(e)}"
        )

@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: str,
    dataset_processor: DatasetProcessor = Depends(get_dataset_processor)
):
    """
    Get dataset information and preview.
    """
    if dataset_id not in datasets:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )
    
    dataset = datasets[dataset_id]
    
    # Check if file still exists
    if not os.path.exists(dataset["file_path"]):
        raise HTTPException(
            status_code=404,
            detail="Dataset file no longer available"
        )
    
    return DatasetResponse(
        dataset_id=dataset_id,
        name=dataset["name"],
        file_type=dataset["file_type"],
        columns=dataset["columns"],
        row_count=dataset["row_count"],
        preview=DatasetPreview(
            columns=dataset["columns"],
            preview_rows=dataset["preview"],
            column_stats=dataset["stats"],
            total_rows=dataset["row_count"]
        )
    )

@router.delete("/{dataset_id}")
async def delete_dataset(dataset_id: str):
    """
    Delete a dataset.
    """
    if dataset_id not in datasets:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )
    
    # Delete the file
    file_path = datasets[dataset_id]["file_path"]
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Remove from metadata storage
    del datasets[dataset_id]
    
    return {"status": "success", "message": "Dataset deleted"}
