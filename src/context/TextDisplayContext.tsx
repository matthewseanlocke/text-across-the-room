import React, { createContext, useState, useContext, useEffect } from 'react';

type FontOption = 'display' | 'handwriting' | 'monospace' | 'serif' | 'condensed' | 'rounded' | 'arcade' | 'varsity';
type LetterSpacingOption = 'tight' | 'normal' | 'wide';
type TextCaseOption = 'typed' | 'uppercase';
type TextTreatmentOption = 'solid' | 'outline' | 'black-outline' | 'glow' | 'shadow' | 'chrome' | 'split' | 'hollow-glow' | 'double-outline' | 'retro-3d' | '3d-glasses' | 'pixel';

type PresetType = 'day' | 'night' | 'emergency' | 'party' | 'disco' | 'lightning' | 'siren' | 'heartbeat' | 'usa' | 'custom';

const STORAGE_KEY = 'text-across-the-room-settings';

interface PersistedSettings {
  text: string;
  textColor: string;
  backgroundColor: string;
  font: FontOption;
  letterSpacing: LetterSpacingOption;
  textCase: TextCaseOption;
  textTreatment: TextTreatmentOption;
  hasBlackOutline: boolean;
  hasShadow: boolean;
  hasGlow: boolean;
  scrollSpeed: number;
  isWordFlash: boolean;
  tapToAdvanceWords: boolean;
  preset: PresetType;
  isRainbowText: boolean;
  darkMode: boolean;
  dualTextMode: boolean;
  isRainbowBackground: boolean;
  isLightningMode: boolean;
  isSirenMode: boolean;
  isHeartbeatMode: boolean;
}

const readSavedSettings = (): Partial<PersistedSettings> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

interface TextDisplayContextType {
  text: string;
  setText: (text: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  font: FontOption;
  setFont: (font: FontOption) => void;
  letterSpacing: LetterSpacingOption;
  setLetterSpacing: (spacing: LetterSpacingOption) => void;
  textCase: TextCaseOption;
  setTextCase: (textCase: TextCaseOption) => void;
  textTreatment: TextTreatmentOption;
  setTextTreatment: (treatment: TextTreatmentOption) => void;
  hasBlackOutline: boolean;
  setHasBlackOutline: (enabled: boolean) => void;
  hasShadow: boolean;
  setHasShadow: (enabled: boolean) => void;
  hasGlow: boolean;
  setHasGlow: (enabled: boolean) => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
  isWordFlash: boolean;
  setIsWordFlash: (enabled: boolean) => void;
  tapToAdvanceWords: boolean;
  setTapToAdvanceWords: (enabled: boolean) => void;
  isLandscape: boolean;
  preset: PresetType;
  setPreset: (preset: PresetType) => void;
  applyPreset: (preset: PresetType) => void;
  disableAnimatedLook: () => void;
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
  letterSpacing: "normal",
  setLetterSpacing: () => {},
  textCase: "typed",
  setTextCase: () => {},
  textTreatment: "solid",
  setTextTreatment: () => {},
  hasBlackOutline: false,
  setHasBlackOutline: () => {},
  hasShadow: false,
  setHasShadow: () => {},
  hasGlow: false,
  setHasGlow: () => {},
  scrollSpeed: 1,
  setScrollSpeed: () => {},
  isWordFlash: false,
  setIsWordFlash: () => {},
  tapToAdvanceWords: false,
  setTapToAdvanceWords: () => {},
  isLandscape: false,
  preset: "day",
  setPreset: () => {},
  applyPreset: () => {},
  disableAnimatedLook: () => {},
  isCapitalized: true,
  setIsCapitalized: () => {},
  setRainbowText: () => {},
  isRainbowText: false,
  darkMode: false,
  toggleDarkMode: () => {},
  scrollPosition: 0,
  setScrollPosition: () => {},
  dualTextMode: false,
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
  const [savedSettings] = useState(readSavedSettings);
  const [text, setText] = useState<string>(savedSettings.text ?? defaultContext.text);
  const [textColor, setTextColor] = useState<string>(savedSettings.textColor ?? defaultContext.textColor);
  const [backgroundColor, setBackgroundColor] = useState<string>(savedSettings.backgroundColor ?? defaultContext.backgroundColor);
  const [font, setFont] = useState<FontOption>(savedSettings.font ?? defaultContext.font);
  const [letterSpacing, setLetterSpacing] = useState<LetterSpacingOption>(savedSettings.letterSpacing ?? defaultContext.letterSpacing);
  const [textCase, setTextCase] = useState<TextCaseOption>(savedSettings.textCase ?? defaultContext.textCase);
  const [textTreatment, setTextTreatment] = useState<TextTreatmentOption>(() => {
    const saved = savedSettings.textTreatment;
    return saved === 'black-outline' || saved === 'shadow' || saved === 'glow' || saved === 'double-outline' ? 'solid' : (saved ?? defaultContext.textTreatment);
  });
  const [hasBlackOutline, setHasBlackOutline] = useState(savedSettings.hasBlackOutline ?? (savedSettings.textTreatment === 'black-outline' || savedSettings.textTreatment === 'double-outline'));
  const [hasShadow, setHasShadow] = useState(savedSettings.hasShadow ?? savedSettings.textTreatment === 'shadow');
  const [hasGlow, setHasGlow] = useState(savedSettings.hasGlow ?? savedSettings.textTreatment === 'glow');
  const [scrollSpeed, setScrollSpeed] = useState<number>(savedSettings.scrollSpeed ?? defaultContext.scrollSpeed);
  const [isWordFlash, setIsWordFlash] = useState<boolean>(savedSettings.isWordFlash ?? defaultContext.isWordFlash);
  const [tapToAdvanceWords, setTapToAdvanceWords] = useState<boolean>(savedSettings.tapToAdvanceWords ?? defaultContext.tapToAdvanceWords);
  const [isLandscape, setIsLandscape] = useState<boolean>(defaultContext.isLandscape);
  const [preset, setPreset] = useState<PresetType>(savedSettings.preset ?? defaultContext.preset);
  const [isCapitalized, setIsCapitalized] = useState<boolean>(defaultContext.isCapitalized);
  const [isRainbowText, setIsRainbowText] = useState<boolean>(savedSettings.isRainbowText ?? defaultContext.isRainbowText);
  const [isRainbowBackground, setIsRainbowBackground] = useState<boolean>(savedSettings.isRainbowBackground ?? defaultContext.isRainbowBackground);
  const [isLightningMode, setIsLightningMode] = useState<boolean>(savedSettings.isLightningMode ?? defaultContext.isLightningMode);
  const [isSirenMode, setIsSirenMode] = useState<boolean>(savedSettings.isSirenMode ?? defaultContext.isSirenMode);
  const [isHeartbeatMode, setIsHeartbeatMode] = useState<boolean>(savedSettings.isHeartbeatMode ?? defaultContext.isHeartbeatMode);
  const [darkMode, setDarkMode] = useState<boolean>(() => savedSettings.darkMode ?? window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [dualTextMode, setDualTextMode] = useState<boolean>(savedSettings.dualTextMode ?? defaultContext.dualTextMode);

  useEffect(() => {
    const settings: PersistedSettings = {
      text, textColor, backgroundColor, font, letterSpacing, textCase, textTreatment, hasBlackOutline, hasShadow, hasGlow, scrollSpeed,
      isWordFlash, tapToAdvanceWords, preset, isRainbowText, darkMode,
      dualTextMode, isRainbowBackground, isLightningMode, isSirenMode,
      isHeartbeatMode,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [text, textColor, backgroundColor, font, letterSpacing, textCase, textTreatment, hasBlackOutline, hasShadow, hasGlow, scrollSpeed,
    isWordFlash, tapToAdvanceWords, preset, isRainbowText, darkMode,
    dualTextMode, isRainbowBackground, isLightningMode, isSirenMode,
    isHeartbeatMode]);

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
  
  const setRainbowBackground = (enabled: boolean) => {
    setIsRainbowBackground(enabled);
    if (enabled) {
      setIsLightningMode(false);
      setIsSirenMode(false);
      setIsHeartbeatMode(false);
    }
    setPreset('custom'); // Set to custom preset when selecting rainbow background
  };

  const setLightningMode = (enabled: boolean) => {
    setIsLightningMode(enabled);
    if (enabled) {
      setIsRainbowBackground(false);
      setIsSirenMode(false);
      setIsHeartbeatMode(false);
    }
    setPreset('custom');
  };

  const setSirenMode = (enabled: boolean) => {
    setIsSirenMode(enabled);
    if (enabled) {
      setIsRainbowBackground(false);
      setIsLightningMode(false);
      setIsHeartbeatMode(false);
    }
    setPreset('custom');
  };

  const setHeartbeatMode = (enabled: boolean) => {
    setIsHeartbeatMode(enabled);
    if (enabled) {
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
        setTextColor('#ffffff'); // Set a default text color that will be overridden by rainbow
        setBackgroundColor('#000000');
        setIsRainbowText(true); // Enable rainbow text for party
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
        setIsRainbowBackground(true); // This one should be true for disco
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed and text effects
        break;
      case 'lightning':
        setTextColor('#ffffff');
        setBackgroundColor('#000000'); 
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(true); // This one should be true for lightning
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        // Keep current scroll speed and text effects
        break;
      case 'siren':
        setTextColor('#ffffff');
        setBackgroundColor('#000000'); 
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(true); // This one should be true for siren
        setIsHeartbeatMode(false);
        // Keep current scroll speed and text effects
        break;
      case 'heartbeat':
        setTextColor('#ffffff');
        setBackgroundColor('#8B0000'); // Dark red
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(true); // This one should be true for heartbeat
        // Keep current scroll speed and text effects
        break;
      case 'usa':
        setTextColor('#ffffff');
        setBackgroundColor('#000000');
        setIsRainbowText(false);
        setIsRainbowBackground(false);
        setIsLightningMode(false);
        setIsSirenMode(false);
        setIsHeartbeatMode(false);
        break;
      case 'custom':
        // Keep current settings - do not modify anything
        break;
    }
  };

  const disableAnimatedLook = () => {
    setPreset('custom');
    setIsRainbowText(false);
    setIsRainbowBackground(false);
    setIsLightningMode(false);
    setIsSirenMode(false);
    setIsHeartbeatMode(false);
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
        letterSpacing,
        setLetterSpacing,
        textCase,
        setTextCase,
        textTreatment,
        setTextTreatment,
        hasBlackOutline,
        setHasBlackOutline,
        hasShadow,
        setHasShadow,
        hasGlow,
        setHasGlow,
        scrollSpeed,
        setScrollSpeed,
        isWordFlash,
        setIsWordFlash,
        tapToAdvanceWords,
        setTapToAdvanceWords,
        isLandscape,
        preset,
        setPreset,
        applyPreset,
        disableAnimatedLook,
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
