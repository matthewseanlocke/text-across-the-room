import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTextDisplay } from '@/context/TextDisplayContext';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const DisplayText: React.FC = () => {
  const { 
    text, 
    textColor, 
    backgroundColor, 
    font, 
    letterSpacing,
    textCase,
    textTreatment,
    hasBlackOutline,
    hasShadow,
    hasGlow,
    scrollSpeed, 
    setScrollSpeed,
    isWordFlash,
    tapToAdvanceWords,
    isLandscape,
    preset,
    isRainbowText,
    dualTextMode,
    isRainbowBackground,
    isLightningMode,
    isSirenMode,
    isHeartbeatMode
  } = useTextDisplay();
  
  const navigate = useNavigate();
  const displayText = text || "";
  const styledDisplayText = textCase === 'uppercase' ? displayText.toUpperCase() : displayText;
  const spacingValue = letterSpacing === 'tight' ? '-0.04em' : letterSpacing === 'wide' ? '0.12em' : '0em';
  const isParty = preset === 'party';
  const isUsa = preset === 'usa';
  const isDisco = preset === 'disco' || isRainbowBackground;
  const isLightning = preset === 'lightning' || isLightningMode;
  const isSiren = preset === 'siren' || isSirenMode;
  const isHeartbeat = preset === 'heartbeat' || isHeartbeatMode;
  
  const [fontSize, setFontSize] = useState('78dvh');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContentReady, setIsContentReady] = useState(false);
  
  const [wordIndex, setWordIndex] = useState(0);
  const [fittedWordSize, setFittedWordSize] = useState<string | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  
  // A wider ten-level range: comfortably slow at 1, still quick at 10.
  const scrollDuration = scrollSpeed <= 10
    ? 12 - ((scrollSpeed - 1) * 1.1)
    : 2.1 - ((scrollSpeed - 10) * 0.28);

  const words = styledDisplayText.trim().split(/\s+/).filter(Boolean);
  const shownText = isWordFlash && words.length > 1 ? words[wordIndex % words.length] : styledDisplayText;
  useLayoutEffect(() => {
    if (!isWordFlash || !measureRef.current) {
      setFittedWordSize(null);
      return;
    }

    let cancelled = false;
    const measureWord = () => {
      if (cancelled) return;
      const span = measureRef.current;
      if (!span) return;
      const visibleHeight = window.visualViewport?.height ?? window.innerHeight;
      const baseSize = visibleHeight * (isLandscape ? 0.76 : 0.42);
      span.style.fontSize = `${baseSize}px`;
      span.style.letterSpacing = spacingValue;
      span.style.fontFamily = textTreatment === 'pixel' ? '"Press Start 2P", monospace' : '';
      span.style.fontWeight = textTreatment === 'pixel' ? '400' : '';
      const measuredWidth = span.getBoundingClientRect().width;
      const availableWidth = window.innerWidth * 0.84;
      const scale = measuredWidth > 0 ? Math.min(1, availableWidth / measuredWidth) : 1;
      setFittedWordSize(`${baseSize * scale}px`);
    };

    measureWord();
    if (textTreatment === 'pixel' && 'fonts' in document) {
      document.fonts.load('400 16px "Press Start 2P"').then(measureWord);
    }
    window.addEventListener('resize', measureWord);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measureWord);
    };
  }, [shownText, font, textTreatment, isWordFlash, isLandscape, spacingValue]);

  const fittedFullScreenFontSize = isWordFlash
    ? (fittedWordSize || fontSize)
    : fontSize;

  useEffect(() => {
    setWordIndex(0);
    if (!isWordFlash || tapToAdvanceWords || words.length < 2) return;
    const intervalMs = scrollSpeed <= 10
      ? 1600 - ((scrollSpeed - 1) * 120)
      : 520 - ((scrollSpeed - 10) * 60);
    const timer = window.setInterval(() => setWordIndex((index) => (index + 1) % words.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [isWordFlash, tapToAdvanceWords, scrollSpeed, styledDisplayText, words.length]);
  
  // Animation key to force reset on rotation
  const [animationKey, setAnimationKey] = useState(Date.now());
  
  // Swipe gesture tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const didSpeedSwipeRef = useRef(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);
  const [closeAttentionKey, setCloseAttentionKey] = useState(0);
  
  // Update font size based on window size and reset animation
  useEffect(() => {
    const updateFontSize = () => {
      const visibleHeight = window.visualViewport?.height ?? window.innerHeight;
      if (isLandscape) {
        // Fit complete glyphs inside the portion of the screen visible above mobile browser chrome.
        setFontSize(`${Math.floor(visibleHeight * 0.76)}px`);
      } else {
        // Keep portrait text readable without filling the screen height.
        setFontSize(`${Math.floor(visibleHeight * (dualTextMode ? 0.32 : 0.42))}px`);
      }
      
      // Reset animations to ensure sync
      setAnimationKey(Date.now());
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    window.visualViewport?.addEventListener('resize', updateFontSize);
    
    return () => {
      window.removeEventListener('resize', updateFontSize);
      window.visualViewport?.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape, dualTextMode]);
  
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
    didSpeedSwipeRef.current = false;
    if (isWordFlash && tapToAdvanceWords) {
      setTouchStartX(null);
      setTouchStartY(null);
      return;
    }
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isWordFlash && tapToAdvanceWords) return;
    if (touchStartX === null || touchStartY === null) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    const horizontalGesture = Math.abs(deltaX) >= Math.abs(deltaY);
    const gestureDistance = horizontalGesture ? Math.abs(deltaX) : Math.abs(deltaY);

    if (gestureDistance > 30) {
      // Right or up = faster. Left or down = slower.
      const direction = horizontalGesture
        ? (deltaX > 0 ? 1 : -1)
        : (deltaY < 0 ? 1 : -1);
      const newSpeed = Math.min(Math.max(scrollSpeed + direction, 1), 15);
      didSpeedSwipeRef.current = true;
      setTouchStartX(touchX);
      setTouchStartY(touchY);
      
      if (newSpeed !== scrollSpeed) {
        setScrollSpeed(newSpeed);
        
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
        
        // Reset animation to ensure sync when speed changes
        setAnimationKey(Date.now());
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
    condensed: 'font-condensed',
    rounded: 'font-rounded',
    arcade: 'font-arcade',
    varsity: 'font-varsity',
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

    @keyframes usaWordCycle {
      0%, 33.32% { color: #ef4444; }
      33.33%, 66.65% { color: #ffffff; }
      66.66%, 100% { color: #3b82f6; }
    }
    
    @keyframes rainbowBackground {
      0% { background-color: #ff0000; }
      16.6% { background-color: #ffff00; }
      33.3% { background-color: #00ff00; }
      50% { background-color: #00ffff; }
      66.6% { background-color: #0000ff; }
      83.3% { background-color: #ff00ff; }
      100% { background-color: #ff0000; }
    }
    
    @keyframes lightningFlash {
      0%, 91%, 94%, 98% { background-color: #000000; }
      90%, 93%, 97%, 100% { background-color: #ffffff; }
    }
    
    @keyframes sirenFlash {
      0%, 15% { background-color: #0000ff; }
      15.1%, 17% { background-color: #ffffff; }
      17.1%, 35% { background-color: #0000ff; }
      35.1%, 40% { background-color: #000000; }
      
      40.1%, 55% { background-color: #ff0000; }
      55.1%, 57% { background-color: #ffffff; }
      57.1%, 75% { background-color: #ff0000; }
      75.1%, 80% { background-color: #000000; }
      
      80.1%, 82% { background-color: #ffffff; }
      82.1%, 100% { background-color: #000000; }
    }
    
    @keyframes heartbeatPulse {
      0%, 100% { background-color: #800000; transform: scale(1); }
      15% { background-color: #ff0000; transform: scale(1.08); }
      30% { background-color: #800000; transform: scale(1); }
      45% { background-color: #ff0000; transform: scale(1.08); }
      60% { background-color: #800000; transform: scale(1); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  
  const isHollow = textTreatment === 'outline' || textTreatment === 'hollow-glow';
  const treatmentShadow = {
    'hollow-glow': '0 0 .12em currentColor, 0 0 .28em currentColor',
    'retro-3d': '.035em .035em 0 #ff3b81, .07em .07em 0 #5b5ce2, .105em .105em 0 #16c7d9',
    '3d-glasses': '-.055em 0 0 rgba(255,32,32,.9), .055em 0 0 rgba(0,220,255,.9)',
  }[textTreatment];
  const combinedShadow = [
    treatmentShadow,
    hasShadow ? '.07em .09em .02em rgba(0,0,0,.7)' : undefined,
    hasGlow ? '0 0 .14em currentColor, 0 0 .34em currentColor' : undefined,
  ].filter(Boolean).join(', ') || undefined;
  const treatmentGradient = textTreatment === 'chrome'
    ? 'linear-gradient(180deg,#fff 0%,#9ca3af 38%,#fff 50%,#4b5563 55%,#e5e7eb 100%)'
    : textTreatment === 'split'
      ? 'linear-gradient(180deg,currentColor 0 48%,#ff3b81 49% 100%)'
      : undefined;

  const baseAnimationStyle = {
    animation: isWordFlash
      ? (isRainbowText ? 'rainbowText 2s linear infinite' : undefined)
      : `displayScrollText ${scrollDuration}s linear infinite${isRainbowText ? ', rainbowText 2s linear infinite' : ''}`,
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    color: isLightning ? '#ffffff' : (isRainbowText ? undefined : textColor),
    mixBlendMode: isLightning ? 'difference' as const : undefined,
    fontSize: fittedFullScreenFontSize,
    fontFamily: textTreatment === 'pixel' ? '"Press Start 2P", monospace' : undefined,
    fontWeight: textTreatment === 'pixel' ? 400 : undefined,
    letterSpacing: spacingValue,
    WebkitTextStroke: hasBlackOutline ? '0.025em #000' : isHollow ? '0.045em currentColor' : undefined,
    WebkitTextFillColor: isHollow || treatmentGradient ? 'transparent' : undefined,
    textShadow: combinedShadow,
    backgroundImage: treatmentGradient,
    WebkitBackgroundClip: treatmentGradient ? 'text' : undefined,
    backgroundClip: treatmentGradient ? 'text' : undefined,
    lineHeight: isWordFlash ? "1.05" : "0.8",
    left: 0,
    width: isWordFlash ? '100%' : 'max-content',
    textAlign: isWordFlash ? 'center' as const : undefined,
    transform: isWordFlash ? 'translateY(-50%)' : undefined,
    overflow: isWordFlash ? 'visible' : undefined,
    opacity: isContentReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in'
  };

  // Top text style (positioned at 25% from top)
  const topTextStyle = {
    ...baseAnimationStyle,
    top: '25%',
  };

  // Bottom text style (positioned at 75% from top)
  const bottomTextStyle = {
    ...baseAnimationStyle,
    top: '75%',
  };

  // Determine container style based on effects
  const containerStyle = {
    backgroundColor: isRainbowBackground ? undefined : backgroundColor,
    animation: isRainbowBackground 
      ? 'rainbowBackground 2s linear infinite' 
      : isLightning 
        ? 'lightningFlash 3s steps(1, end) infinite'
        : isSiren
          ? 'sirenFlash 0.6s linear infinite'
          : isHeartbeat
            ? 'heartbeatPulse 1.5s ease-in-out infinite'
            : undefined
  };
  
  // Only render text content if there is text to display
  const renderTextContent = displayText.trim().length > 0;

  const renderInteractiveText = () => (
    <span
      style={{ display: 'inline-block', cursor: isWordFlash && tapToAdvanceWords ? 'pointer' : 'inherit' }}
      onClick={(event) => {
        if (!isWordFlash || !tapToAdvanceWords || words.length < 2) return;
        event.stopPropagation();
        setWordIndex((index) => (index + 1) % words.length);
      }}
    >
      {isUsa ? (() => {
        let wordPosition = 0;
        return shownText.split(/(\s+)/).map((part, index) => {
          if (/^\s+$/.test(part)) return part;
          const colorIndex = wordPosition++ + (isWordFlash ? wordIndex : 0);
          return <span key={`${part}-${index}`} style={{ animation: 'usaWordCycle 1.8s steps(1,end) infinite', animationDelay: `${colorIndex * -0.6}s` }}>{part}</span>;
        });
      })() : shownText}
    </span>
  );

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden animate-fade-in"
      style={{ ...containerStyle, touchAction: 'none' }}
      onClick={() => {
        if (didSpeedSwipeRef.current) {
          didSpeedSwipeRef.current = false;
          return;
        }
        setCloseAttentionKey((key) => key + 1);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        key={closeAttentionKey}
        type="button"
        className={cn('display-close-button', closeAttentionKey > 0 && 'display-close-button-attention')}
        aria-label="Close full-screen display"
        onClick={(event) => {
          event.stopPropagation();
          navigate('/options', { replace: true });
        }}
      >
        <X aria-hidden="true" />
      </button>
      <style dangerouslySetInnerHTML={{ __html: scrollTextKeyframes }} />
      {isWordFlash && (
        <span
          ref={measureRef}
          className={fontClasses[font]}
          aria-hidden="true"
          style={{ position: 'fixed', left: '-10000px', top: '-10000px', visibility: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none', border: 0, textDecoration: 'none', textShadow: 'none', WebkitTextStroke: 0 }}
        >
          {shownText}
        </span>
      )}
      <div className="relative w-full h-full overflow-hidden">
        {renderTextContent && isLandscape ? (
          // Landscape mode - show one text centered vertically
          <div 
            key={`landscape-${animationKey}`}
            className={cn(
              fontClasses[font],
              isParty && "animate-flash"
            )}
            style={{
              ...baseAnimationStyle,
              top: '50%'
            }}
          >
            {renderInteractiveText()}
          </div>
        ) : renderTextContent && !isLandscape ? (
          // Portrait mode - show one or two rows of text based on dualTextMode setting
          dualTextMode ? (
            // Dual text mode - show two rows of text with synchronized animations
            <div key={`portrait-dual-${animationKey}`}>
              <div 
                className={cn(
                  fontClasses[font],
                  isParty && "animate-flash"
                )}
                style={topTextStyle}
              >
                {renderInteractiveText()}
              </div>
              <div 
                className={cn(
                  fontClasses[font],
                  isParty && "animate-flash"
                )}
                style={bottomTextStyle}
              >
                {renderInteractiveText()}
              </div>
            </div>
          ) : (
            // Single text mode - show one text centered vertically
            <div 
              key={`portrait-single-${animationKey}`}
              className={cn(
                fontClasses[font],
                isParty && "animate-flash"
              )}
              style={{
                ...baseAnimationStyle,
                top: '50%'
              }}
            >
              {renderInteractiveText()}
            </div>
          )
        ) : null /* No text to display */}
      </div>
      
      {/* Speed change feedback */}
      {showFeedback && !(isWordFlash && tapToAdvanceWords) && (
        <div className="display-speed-feedback-wrap">
          <div className="display-speed-feedback">
            <div className="display-speed-label">Speed <strong>{scrollSpeed}</strong></div>
            <div className="display-speed-track">
              <div 
                className="display-speed-fill"
                style={{ width: `${(scrollSpeed - 1) / 14 * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayText;
