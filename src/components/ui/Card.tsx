import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`} {...props} />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={`p-6 ${className}`} {...props} />;
}
