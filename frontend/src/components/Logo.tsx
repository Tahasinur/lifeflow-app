import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The "Life" Block (Vertical) */}
      <rect 
        x="4" 
        y="4" 
        width="6" 
        height="16" 
        rx="2" 
        className="fill-gray-800 dark:fill-white"
      />
      
      {/* The "Flow" Block (Horizontal) */}
      <rect 
        x="12" 
        y="14" 
        width="10" 
        height="6" 
        rx="2" 
        className="fill-gray-400 dark:fill-gray-400"
      />
      
      {/* Optional: A small connecting dot for "AI/Magic" */}
      <circle 
        cx="19" 
        cy="7" 
        r="2" 
        className="fill-blue-500"
      />
    </svg>
  );
}