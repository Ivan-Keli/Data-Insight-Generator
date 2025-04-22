from abc import ABC, abstractmethod
import logging

logger = logging.getLogger(__name__)

class LLMService(ABC):
    """
    Abstract base class for LLM service implementations.
    This defines the interface that all LLM services must implement.
    """
    
    @abstractmethod
    async def generate_response(self, prompt: str) -> str:
        """
        Generate a response from the LLM based on the prompt.
        
        Args:
            prompt: The prompt to send to the LLM
            
        Returns:
            The generated response text
            
        Raises:
            Exception: If there's an error generating the response
        """
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """
        Get the name of the LLM provider.
        
        Returns:
            The provider name as a string
        """
        pass