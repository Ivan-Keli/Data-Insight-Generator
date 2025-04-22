/**
 * Format a number with appropriate precision
 */
export function formatNumber(value: number | undefined | null, precision: number = 2): string {
    if (value === undefined || value === null) return 'N/A';
    
    // Format integers without decimal places
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    
    // Format decimals with specified precision
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    });
  }
  
  /**
   * Format a timestamp to a readable date/time
   */
  export function formatTimestamp(timestamp: number, format: 'short' | 'full' = 'full'): string {
    const date = new Date(timestamp);
    
    if (format === 'short') {
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleString();
  }
  
  /**
   * Format a file size in bytes to a human-readable string
   */
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
  
  /**
   * Truncate a string to a specified length with ellipsis
   */
  export function truncateString(str: string, maxLength: number = 100): string {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    
    return str.substring(0, maxLength) + '...';
  }
  
  /**
   * Format a data type string to be more readable
   */
  export function formatDataType(dataType: string): string {
    // Map of technical data types to human-readable names
    const typeMap: Record<string, string> = {
      'int64': 'Integer',
      'float64': 'Decimal',
      'object': 'Text',
      'bool': 'Boolean',
      'datetime64[ns]': 'Date/Time',
      'category': 'Category'
    };
    
    return typeMap[dataType] || dataType;
  }
  
  /**
   * Format a query response by fixing code blocks for proper display
   */
  export function formatQueryResponse(response: string): string {
    if (!response) return '';
    
    // Ensure code blocks have the correct language tag
    return response.replace(/```(\w*)\n/g, (match, language) => {
      const lang = language || 'python';
      return `\`\`\`${lang}\n`;
    });
  }
  
  /**
   * Get a color for a given data type (for visual indicators)
   */
  export function getDataTypeColor(dataType: string): string {
    if (dataType.includes('int') || dataType.includes('float')) {
      return 'blue';
    } else if (dataType.includes('date') || dataType.includes('time')) {
      return 'purple';
    } else if (dataType.includes('bool')) {
      return 'green';
    } else if (dataType.includes('object') || dataType.includes('string')) {
      return 'orange';
    }
    return 'gray';
  }
