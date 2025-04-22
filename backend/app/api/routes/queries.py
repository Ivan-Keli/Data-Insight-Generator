from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import logging
import uuid
import time
from pydantic import BaseModel, Field

from app.models.query import QueryRequest, QueryResponse, QueryHistoryItem
from app.services.llm.base import LLMService
from app.services.llm.gemini import GeminiService
from app.services.llm.deepseek import DeepSeekService
from app.services.data.processor import DatasetProcessor
from app.utils.prompt_builder import build_prompt

# Initialize router
router = APIRouter()

# In-memory storage for query history (in a production app, this would be a database)
query_history: Dict[str, List[QueryHistoryItem]] = {}

# Initialize logger
logger = logging.getLogger(__name__)

# Services factory (in production, use proper dependency injection)
def get_llm_service(provider: str = "gemini") -> LLMService:
    """Get the appropriate LLM service based on the provider."""
    if provider.lower() == "gemini":
        return GeminiService()
    elif provider.lower() == "deepseek":
        return DeepSeekService()
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported LLM provider: {provider}. Supported providers: gemini, deepseek"
        )

def get_dataset_processor():
    """Get the dataset processor service."""
    return DatasetProcessor()

@router.post("/", response_model=QueryResponse)
async def create_query(
    query_request: QueryRequest,
    background_tasks: BackgroundTasks,
    dataset_processor: DatasetProcessor = Depends(get_dataset_processor),
):
    """
    Process a query about a dataset using the specified LLM provider.
    """
    query_id = str(uuid.uuid4())
    start_time = time.time()
    
    try:
        # Get the primary LLM service
        primary_llm = get_llm_service(query_request.llm_provider)
        
        # Get dataset context if dataset_id is provided
        dataset_context = None
        if query_request.dataset_id:
            try:
                dataset_context = dataset_processor.get_dataset_context(query_request.dataset_id)
            except Exception as e:
                logger.warning(f"Failed to get dataset context: {str(e)}")
                # Continue without dataset context
        
        # Build the prompt
        prompt = build_prompt(
            query=query_request.query,
            dataset_context=dataset_context,
            query_type=query_request.query_type
        )
        
        # Get response from primary LLM
        try:
            response_content = await primary_llm.generate_response(prompt)
        except Exception as e:
            logger.warning(f"Primary LLM ({query_request.llm_provider}) failed: {str(e)}")
            
            # Try fallback if enabled and different from primary
            if query_request.enable_fallback and query_request.fallback_provider != query_request.llm_provider:
                logger.info(f"Attempting fallback to {query_request.fallback_provider}")
                fallback_llm = get_llm_service(query_request.fallback_provider)
                response_content = await fallback_llm.generate_response(prompt)
                # Note that we used the fallback
                response_content = f"(Used fallback: {query_request.fallback_provider})\n\n{response_content}"
            else:
                # No fallback available
                raise HTTPException(
                    status_code=500,
                    detail=f"LLM service error: {str(e)}"
                )
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Create response
        response = QueryResponse(
            query_id=query_id,
            query=query_request.query,
            response=response_content,
            llm_provider=query_request.llm_provider,
            dataset_id=query_request.dataset_id,
            processing_time=processing_time
        )
        
        # Store in history (background task to not block response)
        background_tasks.add_task(
            add_to_history,
            session_id=query_request.session_id,
            query_item=QueryHistoryItem(
                query_id=query_id,
                query=query_request.query,
                response=response_content,
                llm_provider=query_request.llm_provider,
                dataset_id=query_request.dataset_id,
                timestamp=time.time()
            )
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process query: {str(e)}"
        )

@router.get("/history/{session_id}", response_model=List[QueryHistoryItem])
async def get_query_history(session_id: str):
    """
    Get query history for a session.
    """
    return query_history.get(session_id, [])

@router.delete("/history/{session_id}")
async def clear_query_history(session_id: str):
    """
    Clear query history for a session.
    """
    if session_id in query_history:
        del query_history[session_id]
    return {"status": "success", "message": "Query history cleared"}

def add_to_history(session_id: str, query_item: QueryHistoryItem):
    """
    Add a query to the history (called as a background task).
    """
    if session_id not in query_history:
        query_history[session_id] = []
    
    # Add to history (limiting to last 50 queries)
    query_history[session_id].append(query_item)
    if len(query_history[session_id]) > 50:
        query_history[session_id] = query_history[session_id][-50:]
        