import React from 'react';
import PixelWaveText from '@/components/PixelWaveText';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showAnimation?: boolean;
  className?: string;
  meta?: React.ReactNode;
}

const AppLogo: React.FC<AppLogoProps> = ({
  size = 'medium',
  showAnimation = true,
  className = '',
  meta,
}) => {
  return (
    <div className={`app-logo text-center ${className}`} role="img" aria-label="Text Across the Room">
      <div className={`app-logo-pixels app-logo-pixels-${size}`} aria-hidden="true">
        <PixelWaveText text="TEXT.ME" animated={showAnimation} variant="logo" className="app-logo-pixel-wave" />
      </div>

      {meta}
    </div>
  );
};

export default AppLogo;
