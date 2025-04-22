import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  className = '',
  fullWidth = true,
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const uniqueId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const baseClasses = "px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  
  // Error classes
  const errorClasses = error 
    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" 
    : "border-gray-300";
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Disabled classes
  const disabledClasses = props.disabled ? "bg-gray-100 cursor-not-allowed" : "";
  
  // Combine all classes
  const textareaClasses = `
    ${baseClasses}
    ${errorClasses}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `;
  
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label 
          htmlFor={uniqueId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <textarea 
        id={uniqueId}
        ref={ref}
        className={textareaClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${uniqueId}-error` : helperText ? `${uniqueId}-helper` : undefined}
        {...props}
      />
      
      {error && (
        <p 
          id={`${uniqueId}-error`} 
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={`${uniqueId}-helper`} 
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
