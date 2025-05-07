
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTextDisplay } from '@/context/TextDisplayContext';
import { cn } from '@/lib/utils';

const DisplayText: React.FC = () => {
  const { 
    text, 
    textColor, 
    backgroundColor, 
    font, 
    scrollSpeed, 
    isLandscape,
    preset 
  } = useTextDisplay();
  
  const navigate = useNavigate();
  const displayText = text || "Hello from across the room!";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';

  const fontClasses = {
    display: 'font-display',
    handwriting: 'font-handwriting',
    monospace: 'font-monospace',
    serif: 'font-serif',
  };

  // Lock orientation to stay active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Prevent screen from dimming/sleeping
        try {
          // @ts-ignore - TypeScript doesn't know about this API yet
          if (navigator.wakeLock) {
            // @ts-ignore
            navigator.wakeLock.request('screen').catch(err => {
              console.log('Wake Lock error:', err);
            });
          }
        } catch (err) {
          console.log('Wake Lock API not supported', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden",
        isEmergency && "animate-flash"
      )}
      style={{ 
        backgroundColor,
        '--scroll-duration': `${30 - scrollSpeed}s`
      } as React.CSSProperties}
      onClick={() => navigate('/')}
    >
      <div className={cn(
        "absolute text-8xl font-bold flex items-center",
        isLandscape ? "animate-scroll-x whitespace-nowrap" : "animate-scroll-y flex-col text-center",
        isParty && "animate-flash",
        fontClasses[font]
      )}
      style={{ color: textColor }}
      >
        {isLandscape ? (
          // For landscape: repeat text to ensure continuous scroll
          <>
            {displayText} &nbsp;&nbsp;&nbsp; {displayText} &nbsp;&nbsp;&nbsp; {displayText}
          </>
        ) : (
          // For portrait: stack text vertically with spacing
          <>
            {displayText}<br /><br />{displayText}<br /><br />{displayText}
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayText;
