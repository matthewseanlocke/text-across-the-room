
import React, { createContext, useState, useContext, useEffect } from 'react';

type FontOption = 'display' | 'handwriting' | 'monospace' | 'serif';

type PresetType = 'day' | 'night' | 'emergency' | 'party' | 'custom';

interface TextDisplayContextType {
  text: string;
  setText: (text: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  font: FontOption;
  setFont: (font: FontOption) => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
  isLandscape: boolean;
  preset: PresetType;
  setPreset: (preset: PresetType) => void;
  applyPreset: (preset: PresetType) => void;
  isCapitalized: boolean;
  setIsCapitalized: (capitalized: boolean) => void;
}

const defaultContext: TextDisplayContextType = {
  text: "HELLO",
  setText: () => {},
  textColor: "#ffffff",
  setTextColor: () => {},
  backgroundColor: "#000000",
  setBackgroundColor: () => {},
  font: "display",
  setFont: () => {},
  scrollSpeed: 15,
  setScrollSpeed: () => {},
  isLandscape: false,
  preset: "day",
  setPreset: () => {},
  applyPreset: () => {},
  isCapitalized: true,
  setIsCapitalized: () => {},
};

const TextDisplayContext = createContext<TextDisplayContextType>(defaultContext);

export const useTextDisplay = () => useContext(TextDisplayContext);

export const TextDisplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [text, setText] = useState<string>(defaultContext.text);
  const [textColor, setTextColor] = useState<string>(defaultContext.textColor);
  const [backgroundColor, setBackgroundColor] = useState<string>(defaultContext.backgroundColor);
  const [font, setFont] = useState<FontOption>(defaultContext.font);
  const [scrollSpeed, setScrollSpeed] = useState<number>(defaultContext.scrollSpeed);
  const [isLandscape, setIsLandscape] = useState<boolean>(defaultContext.isLandscape);
  const [preset, setPreset] = useState<PresetType>(defaultContext.preset);
  const [isCapitalized, setIsCapitalized] = useState<boolean>(defaultContext.isCapitalized);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Initial check
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const applyPreset = (newPreset: PresetType) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'day':
        setTextColor('#000000');
        setBackgroundColor('#ffffff');
        setScrollSpeed(15);
        break;
      case 'night':
        setTextColor('#ffffff');
        setBackgroundColor('#000000');
        setScrollSpeed(15);
        break;
      case 'emergency':
        setTextColor('#ffffff');
        setBackgroundColor('#ff0000');
        setScrollSpeed(10);
        break;
      case 'party':
        setTextColor('#ffff00');
        setBackgroundColor('#8b5cf6');
        setScrollSpeed(12);
        break;
      case 'custom':
        // Keep current settings
        break;
    }
  };

  return (
    <TextDisplayContext.Provider
      value={{
        text,
        setText,
        textColor,
        setTextColor,
        backgroundColor,
        setBackgroundColor,
        font,
        setFont,
        scrollSpeed,
        setScrollSpeed,
        isLandscape,
        preset,
        setPreset,
        applyPreset,
        isCapitalized,
        setIsCapitalized,
      }}
    >
      {children}
    </TextDisplayContext.Provider>
  );
};
