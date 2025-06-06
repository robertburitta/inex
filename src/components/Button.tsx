import React from "react";

const variantStyles = {
  blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  gray: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
  red: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizeStyles = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = "blue", size = "md", children, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-1 rounded-md font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
