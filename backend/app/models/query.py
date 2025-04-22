from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import time

class QueryRequest(BaseModel):
    """
    Request model for submitting a query about data.
    """
    query: str = Field(..., description="The user's question about the data")
    dataset_id: Optional[str] = Field(None, description="ID of the dataset to analyze (if applicable)")
    llm_provider: str = Field("gemini", description="The LLM provider to use (gemini or deepseek)")
    enable_fallback: bool = Field(True, description="Whether to enable fallback to another LLM if primary fails")
    fallback_provider: str = Field("deepseek", description="The fallback LLM provider if primary fails")
    query_type: Optional[str] = Field(None, description="Type of query (e.g., 'correlation', 'data_quality', 'visualization')")
    session_id: str = Field(..., description="Unique identifier for the user session")
    
    class Config:
        schema_extra = {
            "example": {
                "query": "What correlations exist between price and sales volume?",
                "dataset_id": "550e8400-e29b-41d4-a716-446655440000",
                "llm_provider": "gemini",
                "enable_fallback": True,
                "fallback_provider": "deepseek",
                "query_type": "correlation",
                "session_id": "user-session-123"
            }
        }

class QueryResponse(BaseModel):
    """
    Response model for a processed query.
    """
    query_id: str = Field(..., description="Unique identifier for the query")
    query: str = Field(..., description="The original query")
    response: str = Field(..., description="The formatted response from the LLM")
    llm_provider: str = Field(..., description="The LLM provider that generated the response")
    dataset_id: Optional[str] = Field(None, description="ID of the dataset that was analyzed (if applicable)")
    processing_time: float = Field(..., description="Time taken to process the query in seconds")
    
    class Config:
        schema_extra = {
            "example": {
                "query_id": "123e4567-e89b-12d3-a456-426614174000",
                "query": "What correlations exist between price and sales volume?",
                "response": "## Summary\nThere is a moderate negative correlation (-0.65) between price and sales volume...",
                "llm_provider": "gemini",
                "dataset_id": "550e8400-e29b-41d4-a716-446655440000",
                "processing_time": 1.25
            }
        }

class QueryHistoryItem(BaseModel):
    """
    Model for a query history item.
    """
    query_id: str = Field(..., description="Unique identifier for the query")
    query: str = Field(..., description="The original query")
    response: str = Field(..., description="The formatted response from the LLM")
    llm_provider: str = Field(..., description="The LLM provider that generated the response")
    dataset_id: Optional[str] = Field(None, description="ID of the dataset that was analyzed (if applicable)")
    timestamp: float = Field(default_factory=time.time, description="Timestamp when the query was processed")
    
    class Config:
        schema_extra = {
            "example": {
                "query_id": "123e4567-e89b-12d3-a456-426614174000",
                "query": "What correlations exist between price and sales volume?",
                "response": "## Summary\nThere is a moderate negative correlation (-0.65) between price and sales volume...",
                "llm_provider": "gemini",
                "dataset_id": "550e8400-e29b-41d4-a716-446655440000",
                "timestamp": 1625097600.0
            }
        }
        