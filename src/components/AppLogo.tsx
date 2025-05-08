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
    small: 'w-2.5 h-2.5',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };
  
  const spacingClasses = {
    small: 'mt-2',
    medium: 'mt-3',
    large: 'mt-6'
  };
  
  const dotColors = [
    'bg-blue-500 dark:bg-blue-400',
    'bg-blue-600 dark:bg-blue-300',
    'bg-blue-500 dark:bg-blue-400'
  ];
  
  return (
    <div className={`text-center ${className}`}>
      <div>
        <h1 className={`${textSizeClasses[size]} font-bold dark:text-white`}>
          text-across-the-room
        </h1>
      </div>
      
      {showAnimation && (
        <div className={`flex justify-center ${spacingClasses[size]}`}>
          <div className="flex space-x-3">
            <div 
              className={`${dotSizes[size]} ${dotColors[0]} rounded-full animate-bounce-enhanced shadow-sm`} 
              style={{ animationDelay: '0ms' }}
            />
            <div 
              className={`${dotSizes[size]} ${dotColors[1]} rounded-full animate-bounce-enhanced shadow-sm`} 
              style={{ animationDelay: '150ms' }}
            />
            <div 
              className={`${dotSizes[size]} ${dotColors[2]} rounded-full animate-bounce-enhanced shadow-sm`} 
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes bounce-enhanced {
            0%, 100% {
              transform: translateY(-100%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(20%);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
          .animate-bounce-enhanced {
            animation: bounce-enhanced 1.2s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default AppLogo; 