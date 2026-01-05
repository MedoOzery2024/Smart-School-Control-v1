import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield Background */}
      <path 
        d="M50 95C50 95 90 85 90 50V20L50 5L10 20V50C10 85 50 95 50 95Z" 
        fill="#171717" 
        stroke="#EAB308" 
        strokeWidth="3"
      />
      
      {/* Abstract Book/Graduation Cap Shape */}
      <path 
        d="M30 45L50 35L70 45L50 55L30 45Z" 
        fill="#EAB308" 
      />
      <path 
        d="M30 45V60C30 60 40 65 50 65C60 65 70 60 70 60V45" 
        stroke="#EAB308" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* "S" Shape for Smart */}
      <path 
        d="M40 70C35 70 35 75 40 75H60C65 75 65 80 60 80H40" 
        stroke="#CA8A04" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;