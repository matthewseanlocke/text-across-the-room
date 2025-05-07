
import React from 'react';
import { useTextDisplay } from '@/context/TextDisplayContext';
import { cn } from '@/lib/utils';

const TextPreview: React.FC = () => {
  const { 
    text, 
    textColor, 
    backgroundColor, 
    font, 
    scrollSpeed, 
    isLandscape,
    preset 
  } = useTextDisplay();

  const displayText = text || "Preview text";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  
  const fontClasses = {
    display: 'font-display',
    handwriting: 'font-handwriting',
    monospace: 'font-monospace',
    serif: 'font-serif',
  };

  return (
    <div 
      className={cn(
        "w-full h-28 overflow-hidden border rounded-md relative",
        isEmergency && "animate-flash"
      )}
      style={{ 
        backgroundColor,
        '--scroll-duration': `${30 - scrollSpeed}s`
      } as React.CSSProperties}
    >
      <div className={cn(
        "whitespace-nowrap text-2xl absolute",
        isLandscape ? "animate-scroll-x" : "animate-scroll-y w-full text-center",
        isParty && "animate-flash",
        fontClasses[font]
      )}
      style={{ color: textColor }}
      >
        {isLandscape ? (
          // For landscape: repeat text to ensure continuous scroll
          <>
            {displayText} &nbsp; &nbsp; {displayText} &nbsp; &nbsp; {displayText}
          </>
        ) : (
          // For portrait: stack text vertically
          <>
            {displayText}<br />{displayText}<br />{displayText}
          </>
        )}
      </div>
    </div>
  );
};

export default TextPreview;
