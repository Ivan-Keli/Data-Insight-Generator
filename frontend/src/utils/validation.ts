/**
 * Validate a file against supported file types and size limits
 */
export function validateFile(
    file: File, 
    maxSizeMB: number = 10,
    supportedTypes: string[] = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json']
  ): { valid: boolean; error?: string } {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        valid: false,
        error: `File is too large. Maximum size is ${maxSizeMB} MB.` 
      };
    }
    
    // Check file type
    if (!supportedTypes.includes(file.type)) {
      return { 
        valid: false,
        error: 'Unsupported file type. Please upload a CSV, Excel, or JSON file.' 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate a query string
   */
  export function validateQuery(query: string): { valid: boolean; error?: string } {
    // Check if query is empty
    if (!query.trim()) {
      return {
        valid: false,
        error: 'Please enter a question'
      };
    }
    
    // Check query length
    if (query.length > 1000) {
      return {
        valid: false,
        error: 'Query is too long. Maximum length is 1000 characters.'
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Check if a value is a valid number
   */
  export function isValidNumber(value: any): boolean {
    if (value === null || value === undefined || value === '') return false;
    
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) && isFinite(parsedValue);
  }
  
  /**
   * Check if a string looks like a valid date
   */
  export function isValidDate(dateString: string): boolean {
    // Try to create a date object and check if it's valid
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  
  /**
   * Check if a string is a valid JSON
   */
  export function isValidJSON(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Validate session ID format
   */
  export function isValidSessionId(sessionId: string): boolean {
    // Simple validation - could be enhanced based on your session ID format
    return /^[a-zA-Z0-9_-]{8,}$/.test(sessionId);
  }
  
  /**
   * Generate a new session ID
   */
  export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
