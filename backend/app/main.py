from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
import os
from pathlib import Path

from app.core.config import get_settings
from app.api.routes import queries, datasets
from app.core.logging import setup_logging

settings = get_settings()

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Create upload directory if it doesn't exist
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="Data Insight Generator API",
    description="API for analyzing datasets and answering data-related questions using LLMs",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include routers
app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])
app.include_router(queries.router, prefix="/api/queries", tags=["queries"])

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/api/info")
async def api_info():
    """API information endpoint"""
    return {
        "name": "Data Insight Generator API",
        "version": "1.0.0",
        "llm_providers": ["gemini", "deepseek"],
        "supported_file_types": ["csv", "xlsx", "json"],
        "max_file_size_mb": settings.MAX_UPLOAD_SIZE,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG_MODE,
    )
