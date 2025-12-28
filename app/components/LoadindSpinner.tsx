import React from "react";
import { Loader } from "lucide-react";
import { cn } from "~/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

function LoadingSpinner({
  size = "md",
  className,
  color = "text-primary",
}: LoadingSpinnerProps) {
  return (
    <Loader
      className={cn("animate-spin", sizeClasses[size], color, className)}
    />
  );
}

export default LoadingSpinner;
