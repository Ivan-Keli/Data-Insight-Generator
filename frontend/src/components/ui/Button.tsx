import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border border-transparent",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500 border border-transparent",
    outline: "bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500 border border-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent"
  };
  
  // Disabled and loading states
  const stateClasses = (disabled || isLoading) 
    ? "opacity-70 cursor-not-allowed" 
    : "";
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${stateClasses}
    ${widthClasses}
    ${className}
  `;
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {icon && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
    </button>
  );
};

export default Button;
