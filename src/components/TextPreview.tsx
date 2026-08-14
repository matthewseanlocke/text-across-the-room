import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useTextDisplay } from '@/context/TextDisplayContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const TextPreview: React.FC = () => {
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
    isWordFlash,
    tapToAdvanceWords,
    isLandscape,
    preset,
    isRainbowText,
    isRainbowBackground,
    isLightningMode,
    isSirenMode,
    isHeartbeatMode
  } = useTextDisplay();

  const [fontSize, setFontSize] = useState('');
  const [previewWidth, setPreviewWidth] = useState(0);
  const [fittedWordSize, setFittedWordSize] = useState<string | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [wordIndex, setWordIndex] = useState(0);
  
  // A wider ten-level range: comfortably slow at 1, still quick at 10.
  const scrollDuration = scrollSpeed <= 10
    ? 12 - ((scrollSpeed - 1) * 1.1)
    : 2.1 - ((scrollSpeed - 10) * 0.28);
  
  // Update font size based on container size
  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        setPreviewWidth(containerRef.current.clientWidth);
        // Keep a single, readable row inside the compact studio preview.
        setFontSize(`${containerHeight * 0.72}px`);
      }
    };
    
    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape]);

  const displayText = text || "";
  const styledDisplayText = textCase === 'uppercase' ? displayText.toUpperCase() : displayText;
  const spacingValue = letterSpacing === 'tight' ? '-0.04em' : letterSpacing === 'wide' ? '0.12em' : '0em';
  const words = styledDisplayText.trim().split(/\s+/).filter(Boolean);
  const shownText = isWordFlash && words.length > 1 ? words[wordIndex % words.length] : styledDisplayText;
  const isEmojiOnly = shownText.trim().length > 0 && /^(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\uFE0F|\u200D)+$/u.test(shownText.trim());
  useLayoutEffect(() => {
    const span = measureRef.current;
    const container = containerRef.current;
    if (!isWordFlash || !span || !container) {
      setFittedWordSize(null);
      return;
    }
    let cancelled = false;
    const measureWord = () => {
      if (cancelled) return;
      const baseSize = container.clientHeight * 0.72;
      span.style.fontSize = `${baseSize}px`;
      span.style.letterSpacing = spacingValue;
      span.style.fontFamily = textTreatment === 'pixel' ? '"Press Start 2P", monospace' : '';
      span.style.fontWeight = textTreatment === 'pixel' ? '400' : '';
      const measuredWidth = span.getBoundingClientRect().width;
      const scale = measuredWidth > 0 ? Math.min(1, (container.clientWidth * 0.84) / measuredWidth) : 1;
      setFittedWordSize(`${baseSize * scale}px`);
    };

    measureWord();
    if (textTreatment === 'pixel' && 'fonts' in document) {
      document.fonts.load('400 16px "Press Start 2P"').then(measureWord);
    }
    return () => { cancelled = true; };
  }, [shownText, font, textTreatment, isWordFlash, previewWidth, spacingValue]);

  const fittedFontSize = isWordFlash ? (fittedWordSize || fontSize) : fontSize;
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
      ? `linear-gradient(180deg,currentColor 0 48%,#ff3b81 49% 100%)`
      : undefined;

  useEffect(() => {
    setWordIndex(0);
    if (!isWordFlash || tapToAdvanceWords || words.length < 2) return;
    const intervalMs = scrollSpeed <= 10
      ? 1600 - ((scrollSpeed - 1) * 120)
      : 520 - ((scrollSpeed - 10) * 60);
    const timer = window.setInterval(() => setWordIndex((index) => (index + 1) % words.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [isWordFlash, tapToAdvanceWords, scrollSpeed, styledDisplayText, words.length]);
  const isParty = preset === 'party';
  const isUsa = preset === 'usa';
  const isDisco = preset === 'disco' || isRainbowBackground;
  const isLightning = preset === 'lightning' || isLightningMode;
  const isSiren = preset === 'siren' || isSirenMode;
  const isHeartbeat = preset === 'heartbeat' || isHeartbeatMode;
  
  // Check if there's any text to display
  const hasText = displayText.trim().length > 0;
  
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
    @keyframes previewScrollText {
      from { transform: translateX(var(--preview-start)) translateY(var(--preview-y)); }
      to { transform: translateX(-100%) translateY(var(--preview-y)); }
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
  `;
  
  const animationStyle: React.CSSProperties & { '--preview-start': string; '--preview-y': string } = {
    animation: isWordFlash
      ? (isRainbowText ? 'rainbowText 2s linear infinite' : undefined)
      : `previewScrollText ${scrollDuration}s linear infinite${isRainbowText ? ', rainbowText 2s linear infinite' : ''}`,
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    color: isLightning ? '#ffffff' : (isRainbowText ? undefined : textColor),
    mixBlendMode: isLightning ? 'difference' as const : undefined,
    fontSize: fittedFontSize,
    fontFamily: textTreatment === 'pixel' ? '"Press Start 2P", monospace' : undefined,
    fontWeight: textTreatment === 'pixel' ? 400 : undefined,
    letterSpacing: spacingValue,
    WebkitTextStroke: hasBlackOutline ? '0.025em #000' : isHollow ? '0.045em currentColor' : undefined,
    WebkitTextFillColor: isHollow || treatmentGradient ? 'transparent' : undefined,
    textShadow: combinedShadow,
    backgroundImage: treatmentGradient,
    WebkitBackgroundClip: treatmentGradient ? 'text' : undefined,
    backgroundClip: treatmentGradient ? 'text' : undefined,
    lineHeight: isWordFlash ? '1.05' : '0.8',
    left: 0,
    top: '50%',
    width: isWordFlash ? '100%' : 'max-content',
    textAlign: isWordFlash ? 'center' as const : undefined,
    transform: isWordFlash ? `translateY(${isEmojiOnly ? '-59%' : '-50%'})` : undefined,
    overflow: isWordFlash ? 'visible' : undefined,
    zIndex: 10,
    '--preview-start': `${previewWidth}px`,
    '--preview-y': isEmojiOnly ? '-62%' : '-50%'
  };

  // Get contrasting text color for the watermark based on background
  const getContrastColor = (bgColor: string) => {
    // Simple version - for black/dark backgrounds use very light gray, for all others use very dark gray
    const darkColors = ['#000000', '#0000ff', '#000080', '#800000'];
    return darkColors.includes(bgColor) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  };

  const watermarkColor = getContrastColor(backgroundColor);

  const renderEmojiAdjustedText = (value: string) => {
    if (isEmojiOnly) return value;
    return value.split(/(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu).map((part, index) =>
      /\p{Extended_Pictographic}/u.test(part)
        ? <span key={`${part}-${index}`} style={{ position: 'relative', top: '-0.12em' }}>{part}</span>
        : part
    );
  };

  const renderShownText = () => {
    if (!isUsa) return renderEmojiAdjustedText(shownText);
    const usaColors = ['#c8102e', '#ffffff', '#003da5'];
    let wordPosition = 0;
    return shownText.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) return part;
      const colorIndex = wordPosition++ + (isWordFlash ? wordIndex : 0);
      return <span key={`${part}-${index}`} style={{ color: usaColors[colorIndex % usaColors.length] }}>{renderEmojiAdjustedText(part)}</span>;
    });
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

  return (
    <div className="text-preview w-full rounded-lg overflow-hidden border relative" ref={containerRef}>
      <style dangerouslySetInnerHTML={{ __html: scrollTextKeyframes }} />
      {isWordFlash && (
        <span ref={measureRef} className={fontClasses[font]} aria-hidden="true" style={{ position: 'fixed', left: '-10000px', top: '-10000px', visibility: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none', border: 0, textDecoration: 'none', textShadow: 'none', WebkitTextStroke: 0 }}>
          {shownText}
        </span>
      )}
      
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={containerStyle}
      >
        {/* Watermark "Preview" text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span 
            className="preview-watermark text-3xl font-bold tracking-wider uppercase"
            style={{ color: watermarkColor }}
          >
            Preview
          </span>
        </div>
        
        {/* Only render text if there is any */}
        {hasText && (
          <div
            className={cn(
              fontClasses[font],
              isParty && "animate-flash"
            )}
            style={animationStyle}
          >
            {renderShownText()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextPreview;
