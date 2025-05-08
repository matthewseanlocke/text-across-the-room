import React, { createContext, useState, useContext, useEffect } from 'react';

type FontOption = 'display' | 'handwriting' | 'monospace' | 'serif';

type PresetType = 'day' | 'night' | 'emergency' | 'party' | 'disco' | 'lightning' | 'siren' | 'heartbeat' | 'custom';

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
  darkMode: boolean;
  toggleDarkMode: () => void;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  dualTextMode: boolean;
  toggleDualTextMode: () => void;
  isRainbowBackground: boolean;
  setRainbowBackground: (enabled: boolean) => void;
  isLightningMode: boolean;
  setLightningMode: (enabled: boolean) => void;
  isSirenMode: boolean;
  setSirenMode: (enabled: boolean) => void;
  isHeartbeatMode: boolean;
  setHeartbeatMode: (enabled: boolean) => void;
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
  darkMode: false,
  toggleDarkMode: () => {},
  scrollPosition: 0,
  setScrollPosition: () => {},
  dualTextMode: true,
  toggleDualTextMode: () => {},
  isRainbowBackground: false,
  setRainbowBackground: () => {},
  isLightningMode: false,
  setLightningMode: () => {},
  isSirenMode: false,
  setSirenMode: () => {},
  isHeartbeatMode: false,
  setHeartbeatMode: () => {},
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
  const [isRainbowBackground, setIsRainbowBackground] = useState<boolean>(defaultContext.isRainbowBackground);
  const [isLightningMode, setIsLightningMode] = useState<boolean>(defaultContext.isLightningMode);
  const [isSirenMode, setIsSirenMode] = useState<boolean>(defaultContext.isSirenMode);
  const [isHeartbeatMode, setIsHeartbeatMode] = useState<boolean>(defaultContext.isHeartbeatMode);
  const [darkMode, setDarkMode] = useState<boolean>(defaultContext.darkMode);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [dualTextMode, setDualTextMode] = useState<boolean>(defaultContext.dualTextMode);

  // Check for system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

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
    setIsRainbowBackground(false);
    setIsLightningMode(false);
    setIsSirenMode(false);
    setIsHeartbeatMode(false);
    setPreset('custom'); // Set to custom preset when selecting rainbow
  };
  
  const setRainbowBackground = (enabled: boolean) => {
    setIsRainbowBackground(enabled);
    if (enabled) {
      setIsRainbowText(false);
      setIsLightningMode(false);
      setIsSirenMode(false);
      setIsHeartbeatMode(false);
    }
    setPreset('custom'); // Set to custom preset when selecting rainbow background
  };

  const setLightningMode = (enabled: boolean) => {
    setIsLightningMode(enabled);
    if (enabled) {
      setIsRainbowText(false);
      setIsRainbowBackground(false);
      setIsSirenMode(false);
      setIsHeartbeatMode(false);
    }
    setPreset('custom');
  };

  const setSirenMode = (enabled: boolean) => {
    setIsSirenMode(enabled);
    if (enabled) {
      setIsRainbowText(false);
      setIsRainbowBackground(false);
      setIsLightningMode(false);
      setIsHeartbeatMode(false);
    }
    setPreset('custom');
  };

  const setHeartbeatMode = (enabled: boolean) => {
    setIsHeartbeatMode(enabled);
    if (enabled) {
      setIsRainbowText(false);
      setIsRainbowBackground(false);
      setIsLightningMode(false);
      setIsSirenMode(false);
    }
    setPreset('custom');
  };

  // When setting a regular color, turn off rainbow mode
  const handleSetTextColor = (color: string) => {
    setTextColor(color);
    setIsRainbowText(false);
  };
  
  // When setting a regular background color, turn off rainbow background
  const handleSetBackgroundColor = (color: string) => {
    setBackgroundColor(color);
    setIsRainbowBackground(false);
    setIsLightningMode(false);
    setIsSirenMode(false);
    setIsHeartbeatMode(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  const toggleDualTextMode = () => {
    setDualTextMode(prevMode => !prevMode);
  };

  const applyPreset = (newPreset: PresetType) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'day':
        setTextColor('#000000');
        setBackgroundColor('#ffffff');
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed
        break;
      case 'night':
        setTextColor('#ffffff');
        setBackgroundColor('#000000');
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed
        break;
      case 'emergency':
        setTextColor('#ffffff');
        setBackgroundColor('#ff0000');
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed
        break;
      case 'party':
        setIsRainbowText(true);
        setBackgroundColor('#000000');
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed
        break;
      case 'disco':
        setTextColor('#ffffff');
        setBackgroundColor('#000000'); 
        setIsRainbowText(false);
        setIsRainbowBackground(true);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed
        break;
      case 'lightning':
        setTextColor('#ffffff');
        setBackgroundColor('#000000'); 
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(true);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed
        break;
      case 'siren':
        setTextColor('#ffffff');
        setBackgroundColor('#000000'); 
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(true);
        setIsHeartbeatMode(false);
        // Keep current scroll speed
        break;
      case 'heartbeat':
        setTextColor('#ffffff');
        setBackgroundColor('#8B0000'); // Dark red
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(true);
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
        setBackgroundColor: handleSetBackgroundColor,
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
        darkMode,
        toggleDarkMode,
        scrollPosition,
        setScrollPosition,
        dualTextMode,
        toggleDualTextMode,
        isRainbowBackground,
        setRainbowBackground,
        isLightningMode,
        setLightningMode,
        isSirenMode,
        setSirenMode,
        isHeartbeatMode,
        setHeartbeatMode
      }}
    >
      {children}
    </TextDisplayContext.Provider>
  );
};
