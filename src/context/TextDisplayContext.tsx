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
  setRainbowText: () => void;
  isRainbowText: boolean;
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
  scrollSpeed: 5,
  setScrollSpeed: () => {},
  isLandscape: false,
  preset: "day",
  setPreset: () => {},
  applyPreset: () => {},
  isCapitalized: true,
  setIsCapitalized: () => {},
  setRainbowText: () => {},
  isRainbowText: false,
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
  const [isRainbowText, setIsRainbowText] = useState<boolean>(defaultContext.isRainbowText);

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

  const setRainbowText = () => {
    setIsRainbowText(true);
    setPreset('custom'); // Set to custom preset when selecting rainbow
  };

  // When setting a regular color, turn off rainbow mode
  const handleSetTextColor = (color: string) => {
    setTextColor(color);
    setIsRainbowText(false);
  };

  const applyPreset = (newPreset: PresetType) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'day':
        setTextColor('#000000');
        setBackgroundColor('#ffffff');
        setIsRainbowText(false);
        // Keep current scroll speed
        break;
      case 'night':
        setTextColor('#ffffff');
        setBackgroundColor('#000000');
        setIsRainbowText(false);
        // Keep current scroll speed
        break;
      case 'emergency':
        setTextColor('#ffffff');
        setBackgroundColor('#ff0000');
        setIsRainbowText(false);
        // Keep current scroll speed
        break;
      case 'party':
        setIsRainbowText(true);
        setBackgroundColor('#000000');
        // Keep current scroll speed
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
        setTextColor: handleSetTextColor,
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
        setRainbowText,
        isRainbowText,
      }}
    >
      {children}
    </TextDisplayContext.Provider>
  );
};
