import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPicker from '@/components/ColorPicker';
import SpeedSlider from '@/components/SpeedSlider';
import TextPreview from '@/components/TextPreview';
import { useTextDisplay } from '@/context/TextDisplayContext';
import { Fullscreen, Moon, Sun } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import AppLogo from '@/components/AppLogo';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const {
    text, setText,
    textColor, setTextColor,
    backgroundColor, setBackgroundColor,
    font, setFont,
    scrollSpeed, setScrollSpeed,
    preset, applyPreset,
    isCapitalized, setIsCapitalized,
    setRainbowText, isRainbowText,
    darkMode, toggleDarkMode,
    scrollPosition, setScrollPosition,
    dualTextMode, toggleDualTextMode,
    isRainbowBackground, setRainbowBackground
  } = useTextDisplay();

  // Apply dark mode class to document body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add fade-in effect when component mounts
  useEffect(() => {
    // Short delay to ensure the fade effect starts after navigation completes
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30); // Reduced delay for faster response
    return () => clearTimeout(timer);
  }, []);

  // Force a re-render after the component mounts to ensure preset styling is applied
  useEffect(() => {
    // Force component update once mounted to ensure styles apply correctly
    const updateTimer = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 100);
    return () => clearTimeout(updateTimer);
  }, []);

  // Save scroll position when navigating away
  useEffect(() => {
    // Handle saving scroll position before navigating away
    const handleBeforeUnload = () => {
      if (contentRef.current) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setScrollPosition(scrollTop);
        console.log('Saved scroll position:', scrollTop);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also save scroll on navigation
    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setScrollPosition]);

  // Restore scroll position when component mounts
  useEffect(() => {
    if (scrollPosition > 0) {
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        console.log('Restored scroll position:', scrollPosition);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollPosition, isVisible]);

  const handleDisplayClick = () => {
    // Save scroll position before navigating
    if (contentRef.current) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrollPosition(scrollTop);
      console.log('Saved scroll position before display:', scrollTop);
    }
    navigate('/display');
  };

  return (
    <div 
      ref={contentRef}
      className={`min-h-screen bg-background pb-48 dark:bg-gray-900 dark:text-white transition-colors duration-200 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Main content with padding */}
      <div className="px-4 pt-4">
        <Card className="max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text-input" className="dark:text-gray-300">Message</Label>
              <Input
                id="text-input"
                placeholder="Enter your message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="capitalize" 
                  checked={isCapitalized}
                  onCheckedChange={(checked) => setIsCapitalized(checked === true)}
                  className="dark:border-gray-500"
                />
                <Label htmlFor="capitalize" className="text-sm cursor-pointer dark:text-gray-300">
                  CAPITALIZE TEXT
                </Label>
              </div>
              
              <div className="pt-2">
                <Label className="text-sm mb-2 block dark:text-gray-300">Quick Messages</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'HELLO',
                    'KISS ME 💋',
                    'CALL ME 📞', 
                    '♡ ♡ ♡ ♡ ♡ ♡', 
                    'I LOVE YOU',
                    'BACK OFF!', 
                    'H E L P !', 
                    'HOTTY ALERT!',
                    '911', 
                    'LETS GO!',
                    'DISCO!',
                    'L F G',
                    'FEED ME!',
                    'MISS IT!',
                    'USA! USA! USA!',
                    'L M A O', 
                    '🤣 🤣 🤣',
                    'I 👀 YOU',
                    'I 💘 YOU',                  
                    
                  ].map((preset) => (
                    <Button 
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => setText(preset)}
                      className={`transition-all dark:border-gray-600 dark:hover:bg-gray-700 ${
                        text === preset 
                          ? 'bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground' 
                          : 'dark:text-gray-300'
                      }`}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold dark:text-white">Appearance</h2>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleDarkMode} 
                  className="w-8 h-8 rounded-full"
                  title="Toggle Dark Mode"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
              
              <ColorPicker 
                label="Text Color" 
                value={isRainbowText ? 'rainbow' : textColor} 
                onChange={setTextColor} 
                onSelectRainbow={setRainbowText}
              />
              
              <ColorPicker 
                label="Background Color" 
                value={isRainbowBackground ? 'rainbow-bg' : backgroundColor} 
                onChange={setBackgroundColor} 
                onSelectRainbowBackground={() => setRainbowBackground(true)}
              />
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="dual-text-mode" 
                  checked={dualTextMode}
                  onCheckedChange={toggleDualTextMode}
                />
                <Label 
                  htmlFor="dual-text-mode" 
                  className="text-sm font-medium leading-none cursor-pointer dark:text-white"
                >
                  Dual Text Mode in Portrait
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-select" className="dark:text-gray-300">Font</Label>
                <Select value={font} onValueChange={(value) => setFont(value as any)}>
                  <SelectTrigger id="font-select" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="display" className="dark:text-white dark:focus:bg-gray-700">Display</SelectItem>
                    <SelectItem value="handwriting" className="dark:text-white dark:focus:bg-gray-700">Handwriting</SelectItem>
                    <SelectItem value="monospace" className="dark:text-white dark:focus:bg-gray-700">Monospace</SelectItem>
                    <SelectItem value="serif" className="dark:text-white dark:focus:bg-gray-700">Serif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <SpeedSlider value={scrollSpeed} onChange={setScrollSpeed} />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold dark:text-white">Presets</h2>
              <div className="grid grid-cols-3 gap-2" key={`presets-${forceUpdate}`}>
                <Button 
                  variant={preset === 'day' ? "default" : "outline"}
                  onClick={() => applyPreset('day')}
                  className={`w-full transition-all overflow-hidden ${
                    preset === 'day' 
                      ? 'p-0 border-0 ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-900' 
                      : 'hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {preset === 'day' ? (
                    <>
                      <style>
                        {`
                          .day-button-wrapper {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.5rem;
                            background: linear-gradient(135deg, #87ceeb, #f0f8ff);
                            color: #1e40af;
                          }
                        `}
                      </style>
                      <div className="day-button-wrapper w-full">
                        <span className="font-semibold">Day</span>
                      </div>
                    </>
                  ) : 'Day'}
                </Button>
                <Button 
                  variant={preset === 'night' ? "default" : "outline"}
                  onClick={() => applyPreset('night')}
                  className={`w-full transition-all overflow-hidden ${
                    preset === 'night' 
                      ? 'p-0 border-0 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-gray-900' 
                      : 'hover:bg-indigo-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {preset === 'night' ? (
                    <>
                      <style>
                        {`
                          .night-button-wrapper {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.5rem;
                            background: linear-gradient(135deg, #0a1120, #131e30);
                            color: white;
                          }
                        `}
                      </style>
                      <div className="night-button-wrapper w-full relative">
                        <span className="font-semibold z-10">Night</span>
                      </div>
                    </>
                  ) : 'Night'}
                </Button>
                <Button 
                  variant={preset === 'emergency' ? "default" : "outline"}
                  onClick={() => applyPreset('emergency')}
                  className={`w-full transition-all overflow-hidden ${
                    preset === 'emergency' 
                      ? 'p-0 border-0 ring-2 ring-red-300 ring-offset-2 dark:ring-offset-gray-900' 
                      : 'text-red-600 hover:bg-red-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-red-400'
                  }`}
                >
                  {preset === 'emergency' ? (
                    <>
                      <style>
                        {`
                          @keyframes emergencyPulse {
                            0%, 100% { background-color: #ff0000; }
                            50% { background-color: #ff4444; }
                          }
                          .emergency-button-wrapper {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.5rem;
                            color: white;
                            animation: emergencyPulse 1s ease-in-out infinite;
                          }
                        `}
                      </style>
                      <div className="emergency-button-wrapper w-full">
                        <span className="font-semibold">Emergency</span>
                      </div>
                    </>
                  ) : 'Emergency'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => applyPreset('party')}
                  className={`w-full transition-all ${
                    preset === 'party' 
                      ? 'bg-gray-900 text-white ring-2 ring-cyan-400 ring-offset-2 dark:bg-black dark:text-white dark:ring-offset-gray-900' 
                      : 'hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {preset === 'party' ? (
                    <>
                      <style>
                        {`
                          @keyframes rainbowButtonText {
                            0% { color: #ff0000; }
                            16.6% { color: #ffff00; }
                            33.3% { color: #00ff00; }
                            50% { color: #00ffff; }
                            66.6% { color: #0000ff; }
                            83.3% { color: #ff00ff; }
                            100% { color: #ff0000; }
                          }
                          .rainbow-text {
                            animation: rainbowButtonText 2s linear infinite;
                          }
                        `}
                      </style>
                      <span className="rainbow-text">Party</span>
                    </>
                  ) : 'Party'}
                </Button>
                <Button 
                  variant={preset === 'disco' ? "default" : "outline"}
                  onClick={() => applyPreset('disco')}
                  className={`w-full transition-all overflow-hidden ${
                    preset === 'disco' 
                      ? 'p-0 border-0 ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-gray-900' 
                      : 'hover:bg-purple-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {preset === 'disco' ? (
                    <>
                      <style>
                        {`
                          @keyframes rainbowButtonBg {
                            0% { background-color: #ff0000; }
                            16.6% { background-color: #ffff00; }
                            33.3% { background-color: #00ff00; }
                            50% { background-color: #00ffff; }
                            66.6% { background-color: #0000ff; }
                            83.3% { background-color: #ff00ff; }
                            100% { background-color: #ff0000; }
                          }
                          .disco-button-wrapper {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.5rem;
                            animation: rainbowButtonBg 2s linear infinite;
                          }
                        `}
                      </style>
                      <div className="disco-button-wrapper w-full">
                        <span className="text-white font-semibold">Disco</span>
                      </div>
                    </>
                  ) : 'Disco'}
                </Button>
                <Button 
                  variant={preset === 'lightning' ? "default" : "outline"}
                  onClick={() => applyPreset('lightning')}
                  className={`w-full transition-all overflow-hidden ${
                    preset === 'lightning' 
                      ? 'p-0 border-0 ring-2 ring-cyan-300 ring-offset-2 dark:ring-offset-gray-900' 
                      : 'hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {preset === 'lightning' ? (
                    <>
                      <style>
                        {`
                          @keyframes lightningButtonBg {
                            0%, 91%, 94%, 98% { background-color: #000033; }
                            90%, 93%, 97%, 100% { background-color: #ffffff; }
                          }
                          .lightning-button-wrapper {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.5rem;
                            animation: lightningButtonBg 3s linear infinite;
                          }
                        `}
                      </style>
                      <div className="lightning-button-wrapper w-full">
                        <span className="text-gray-900 font-semibold mix-blend-difference">Lightning</span>
                      </div>
                    </>
                  ) : 'Lightning'}
                </Button>
                <Button 
                  variant={preset === 'siren' ? "default" : "outline"}
                  onClick={() => applyPreset('siren')}
                  className={`w-full transition-all overflow-hidden ${
                    preset === 'siren' 
                      ? 'p-0 border-0 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-gray-900' 
                      : 'hover:bg-red-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {preset === 'siren' ? (
                    <>
                      <style>
                        {`
                          @keyframes sirenButtonBg {
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
                          .siren-button-wrapper {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0.5rem;
                            animation: sirenButtonBg 0.6s linear infinite;
                          }
                        `}
                      </style>
                      <div className="siren-button-wrapper w-full">
                        <span className="text-white font-semibold">Police</span>
                      </div>
                    </>
                  ) : 'Police'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 bg-background p-4 border-t dark:bg-gray-900 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <TextPreview />
            </div>
            
            <Button 
              className="w-full py-8 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
              onClick={handleDisplayClick}
            >
              <div className="flex flex-col items-center justify-center">
                <AppLogo size="small" showAnimation={true} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
