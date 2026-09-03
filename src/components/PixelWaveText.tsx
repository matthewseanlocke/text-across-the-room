import React, { useEffect, useState } from 'react';
import { PixelPulsar } from 'pixel-pulsar-react';
import 'pixel-pulsar-react/style.css';

interface PixelWaveTextProps {
  text: string;
  animated?: boolean;
  variant?: 'logo' | 'live';
  scrolling?: boolean;
  scrollDuration?: number;
  fit?: 'none' | 'width' | 'contain';
  scale?: number;
  className?: string;
}

const PixelWaveText: React.FC<PixelWaveTextProps> = ({
  text,
  animated = true,
  variant = 'live',
  scrolling = false,
  scrollDuration = 8,
  fit,
  scale = 0.5,
  className = '',
}) => {
  const resolvedFit = fit ?? (scrolling ? 'none' : 'width');
  const [fitReady, setFitReady] = useState(resolvedFit === 'none');

  useEffect(() => {
    if (resolvedFit === 'none') {
      setFitReady(true);
      return;
    }

    setFitReady(false);
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setFitReady(true));
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [text, resolvedFit]);

  return (
    <div
      className={`pixel-wave-stage ${scrolling ? 'pixel-wave-scrolling' : ''} ${fitReady ? 'pixel-wave-fit-ready' : 'pixel-wave-fit-pending'} ${className}`}
      style={{ '--pixel-wave-scroll-duration': `${scrollDuration}s` } as React.CSSProperties}
    >
      <PixelPulsar
      text={text}
      animated={animated}
      unsupportedCharacters="native"
      shape="circle"
      size={25}
      cellSize={12}
      fit={resolvedFit}
      minScale={0.1}
      align="center"
      pixelScaleX={1}
      pixelScaleY={1}
      pixelSkewX={0}
      pixelSkewY={0}
      pixelRotation={0}
      tracking={46}
      scale={scale}
      scaleX={1}
      scaleY={2}
      color="#a97aff"
      fill="gradient"
      secondaryColor="#00eeff"
      gradientAngle={90}
      glow={0}
      glowStyle="pixel"
      pixelOutline={variant === 'logo'}
      pixelOutlineSize={variant === 'logo' ? 3 : 1}
      pixelOutlineColor="#11120f"
      pixelOutlineAnimation="none"
      outline={true}
      outlineSize={4}
      outlineColor="#ff0000"
      letterOutlineAnimation="none"
      letterOutlineFlow="together"
      letterStroke={false}
      letterStrokeSize={7}
      letterStrokeColor="#00ccff"
      entrance="scatter"
      stagger={18}
      letterDelay={0}
      idleAnimation="wave"
      idleSpeed={2.53}
      motionIntensity={variant === 'logo' ? 2.01 : 1}
      motionDirection="forward"
      loopPause={0}
      spinAxis="x"
      randomness={0}
      />
    </div>
  );
};

export default PixelWaveText;
