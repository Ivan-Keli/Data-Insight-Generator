import os
import logging
import httpx
import json
from typing import Dict, Any, Optional

from app.services.llm.base import LLMService
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

class GeminiService(LLMService):
    """
    Implementation of LLMService for Google's Gemini API.
    """
    
    def __init__(self):
        """
        Initialize the Gemini service with API key from settings.
        """
        self.api_key = settings.GEMINI_API_KEY
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        self.timeout = 30.0  # seconds
        
    async def generate_response(self, prompt: str) -> str:
        """
        Generate a response from Gemini based on the prompt.
        
        Args:
            prompt: The prompt to send to Gemini
            
        Returns:
            The generated response text
            
        Raises:
            Exception: If there's an error generating the response
        """
        logger.info("Generating response from Gemini")
        
        # Prepare request data
        request_data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 8192,
            }
        }
        
        # Prepare request URL with API key
        request_url = f"{self.api_url}?key={self.api_key}"
        
        try:
            # Make the API request
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    request_url,
                    json=request_data,
                    headers={"Content-Type": "application/json"}
                )
                
                # Check for successful response
                if response.status_code != 200:
                    error_detail = self._parse_error_response(response)
                    raise Exception(f"Gemini API error: {error_detail}")
                
                # Parse the response
                response_data = response.json()
                
                # Extract the generated text
                try:
                    generated_text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                    return generated_text
                except (KeyError, IndexError) as e:
                    logger.error(f"Error parsing Gemini response: {str(e)}", exc_info=True)
                    logger.debug(f"Response data: {response_data}")
                    raise Exception("Failed to parse Gemini response")
                
        except httpx.TimeoutException:
            logger.error("Gemini API request timed out")
            raise Exception("Request to Gemini API timed out")
        except httpx.RequestError as e:
            logger.error(f"Gemini API request error: {str(e)}", exc_info=True)
            raise Exception(f"Error making request to Gemini API: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error with Gemini API: {str(e)}", exc_info=True)
            raise
    
    def get_provider_name(self) -> str:
        """
        Get the name of the LLM provider.
        
        Returns:
            The provider name as a string
        """
        return "gemini"
    
    def _parse_error_response(self, response: httpx.Response) -> str:
        """
        Parse error details from Gemini API response.
        
        Args:
            response: The API response containing an error
            
        Returns:
            A string with error details
        """
        try:
            error_data = response.json()
            if "error" in error_data:
                error_info = error_data["error"]
                return f"{error_info.get('message', 'Unknown error')} (code: {error_info.get('code', 'unknown')})"
            return f"HTTP {response.status_code}: {response.text}"
        except Exception:
            return f"HTTP {response.status_code}: {response.text[:100]}"
            