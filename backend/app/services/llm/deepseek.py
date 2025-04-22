import os
import logging
import httpx
import json
from typing import Dict, Any, List, Optional

from app.services.llm.base import LLMService
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

class DeepSeekService(LLMService):
    """
    Implementation of LLMService for DeepSeek's API.
    """
    
    def __init__(self):
        """
        Initialize the DeepSeek service with API key from settings.
        """
        self.api_key = settings.DEEPSEEK_API_KEY
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        self.model = "deepseek-chat"  # Use appropriate model name
        self.timeout = 60.0  # seconds - DeepSeek may take longer than Gemini
        
    async def generate_response(self, prompt: str) -> str:
        """
        Generate a response from DeepSeek based on the prompt.
        
        Args:
            prompt: The prompt to send to DeepSeek
            
        Returns:
            The generated response text
            
        Raises:
            Exception: If there's an error generating the response
        """
        logger.info("Generating response from DeepSeek")
        
        # Prepare messages
        messages = [
            {"role": "user", "content": prompt}
        ]
        
        # Prepare request data
        request_data = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.1,  # Lower temperature for more focused responses
            "max_tokens": 4096,
            "top_p": 0.95,
        }
        
        try:
            # Make the API request
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.api_url,
                    json=request_data,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    }
                )
                
                # Check for successful response
                if response.status_code != 200:
                    error_detail = self._parse_error_response(response)
                    raise Exception(f"DeepSeek API error: {error_detail}")
                
                # Parse the response
                response_data = response.json()
                
                # Extract the generated text
                try:
                    generated_text = response_data["choices"][0]["message"]["content"]
                    return generated_text
                except (KeyError, IndexError) as e:
                    logger.error(f"Error parsing DeepSeek response: {str(e)}", exc_info=True)
                    logger.debug(f"Response data: {response_data}")
                    raise Exception("Failed to parse DeepSeek response")
                
        except httpx.TimeoutException:
            logger.error("DeepSeek API request timed out")
            raise Exception("Request to DeepSeek API timed out")
        except httpx.RequestError as e:
            logger.error(f"DeepSeek API request error: {str(e)}", exc_info=True)
            raise Exception(f"Error making request to DeepSeek API: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error with DeepSeek API: {str(e)}", exc_info=True)
            raise
    
    def get_provider_name(self) -> str:
        """
        Get the name of the LLM provider.
        
        Returns:
            The provider name as a string
        """
        return "deepseek"
    
    def _parse_error_response(self, response: httpx.Response) -> str:
        """
        Parse error details from DeepSeek API response.
        
        Args:
            response: The API response containing an error
            
        Returns:
            A string with error details
        """
        try:
            error_data = response.json()
            if "error" in error_data:
                error_info = error_data["error"]
                return f"{error_info.get('message', 'Unknown error')} (type: {error_info.get('type', 'unknown')})"
            return f"HTTP {response.status_code}: {response.text}"
        except Exception:
            return f"HTTP {response.status_code}: {response.text[:100]}"
        