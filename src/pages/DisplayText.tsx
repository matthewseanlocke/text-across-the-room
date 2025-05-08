import React, { useEffect, useState, useRef } from 'react';
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
    setScrollSpeed,
    isLandscape,
    preset,
    isCapitalized,
    isRainbowText
  } = useTextDisplay();
  
  const navigate = useNavigate();
  const processedText = isCapitalized ? text.toUpperCase() : text;
  const displayText = processedText || "HELLO";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  
  const [fontSize, setFontSize] = useState('120vh');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContentReady, setIsContentReady] = useState(false);
  
  // Update when scrollSpeed changes
  const [currentScrollDuration, setCurrentScrollDuration] = useState(0);
  
  // Calculate scroll duration based on speed (1-9 range)
  // Speed 1 = slowest (16s), Speed 9 = fastest (2s)
  const scrollDuration = 18 - (scrollSpeed * 1.8);
  
  // Swipe gesture tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Update duration when speed changes
  useEffect(() => {
    setCurrentScrollDuration(scrollDuration);
    
    // Debug
    console.log('Display - Speed updated:', scrollSpeed, 'New Duration:', scrollDuration);
  }, [scrollSpeed, scrollDuration]);

  // Update font size based on window size
  useEffect(() => {
    const updateFontSize = () => {
      if (isLandscape) {
        setFontSize('120vh');
      } else {
        setFontSize('120vh'); // Increase from 80vh to 120vh for portrait mode
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape]);
  
  // Ensure animations and positioning are set up before showing content
  useEffect(() => {
    // Short delay to ensure proper positioning before revealing
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    // Only adjust speed if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      const direction = deltaX > 0 ? 1 : -1; // Right = increase speed, Left = decrease speed
      const newSpeed = Math.min(Math.max(scrollSpeed + direction, 1), 9);
      
      if (newSpeed !== scrollSpeed) {
        setScrollSpeed(newSpeed);
        setTouchStartX(touchX);
        setTouchStartY(touchY);
        
        // Show feedback
        setShowFeedback(true);
        
        // Clear previous timeout
        if (feedbackTimeout) {
          clearTimeout(feedbackTimeout);
        }
        
        // Hide feedback after 1.5 seconds
        const timeout = setTimeout(() => {
          setShowFeedback(false);
        }, 1500);
        
        setFeedbackTimeout(timeout);
      }
    }
  };
  
  const handleTouchEnd = () => {
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const fontClasses = {
    display: 'font-display',
    handwriting: 'font-handwriting',
    monospace: 'font-monospace',
    serif: 'font-serif',
  };
  
  // Create animation styles directly
  const scrollTextKeyframes = `
    @keyframes displayScrollText {
      from { transform: translateX(100vw) translateY(-50%); }
      to { transform: translateX(-100%) translateY(-50%); }
    }
    
    @keyframes rainbowText {
      0% { color: #ff0000; }
      16.6% { color: #ffff00; }
      33.3% { color: #00ff00; }
      50% { color: #00ffff; }
      66.6% { color: #0000ff; }
      83.3% { color: #ff00ff; }
      100% { color: #ff0000; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  
  const animationStyle = {
    animation: `displayScrollText ${currentScrollDuration}s linear infinite${isRainbowText ? ', rainbowText 2s linear infinite' : ''}`,
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    color: isRainbowText ? undefined : textColor,
    fontSize: fontSize,
    lineHeight: "0.8",
    left: 0,
    top: '50%',
    width: 'max-content',
    opacity: isContentReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in'
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden animate-fade-in",
        isEmergency && "animate-flash"
      )}
      style={{ backgroundColor }}
      onClick={() => {
        // Navigate back to options page without resetting scroll
        navigate('/options', { replace: true });
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style dangerouslySetInnerHTML={{ __html: scrollTextKeyframes }} />
      <div className="relative w-full h-full overflow-hidden">
        <div 
          className={cn(
            fontClasses[font],
            isParty && "animate-flash"
          )}
          style={animationStyle}
        >
          {displayText}
        </div>
      </div>
      
      {/* Speed change feedback */}
      {showFeedback && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/70 text-white px-6 py-3 rounded-full flex items-center space-x-4">
            <div className="text-sm">Speed: {scrollSpeed}</div>
            <div className="w-32 h-2 bg-white/30 rounded-full">
              <div 
                className="h-full bg-white rounded-full"
                style={{ width: `${(scrollSpeed - 1) / 8 * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayText;
