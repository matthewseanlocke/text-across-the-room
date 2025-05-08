import React from 'react';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 'medium', 
  showAnimation = true,
  className = ''
}) => {
  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-5xl'
  };
  
  const dotSizes = {
    small: 'w-2 h-2',
    medium: 'w-2.5 h-2.5',
    large: 'w-3 h-3'
  };
  
  return (
    <div className={`text-center ${className}`}>
      <div>
        <h1 className={`${textSizeClasses[size]} font-bold dark:text-white`}>
          text-across-the-room
        </h1>
      </div>
      
      {showAnimation && (
        <div className="flex justify-center mt-2">
          <div className="flex space-x-2">
            <div className={`${dotSizes[size]} bg-primary dark:bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${dotSizes[size]} bg-primary dark:bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${dotSizes[size]} bg-primary dark:bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(-25%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(0);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
          .animate-bounce {
            animation: bounce 1s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default AppLogo; 