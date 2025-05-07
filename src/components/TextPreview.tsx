
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

  // For portrait mode, split the text into individual characters
  const portraitText = displayText.split('');

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
        isLandscape ? "whitespace-nowrap text-2xl absolute animate-scroll-x" : "text-2xl absolute animate-scroll-y w-full text-center",
        isParty && "animate-flash",
        fontClasses[font]
      )}
      style={{ color: textColor }}
      >
        {isLandscape ? (
          // For landscape: display text that takes full width and doesn't repeat until fully scrolled
          <span className="inline-block">{displayText}</span>
        ) : (
          // For portrait: each character on its own line
          <div className="flex flex-col items-center">
            {portraitText.map((char, index) => (
              <div key={index} className="my-1">{char}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextPreview;
