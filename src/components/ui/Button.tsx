import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary";
}

export function Button({
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  const baseStyles = "py-2 px-4 rounded";
  const variantStyles = {
    default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
