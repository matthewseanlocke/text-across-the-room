import React, { useEffect } from 'react';
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

const Index = () => {
  const navigate = useNavigate();
  const {
    text, setText,
    textColor, setTextColor,
    backgroundColor, setBackgroundColor,
    font, setFont,
    scrollSpeed, setScrollSpeed,
    preset, applyPreset,
    isCapitalized, setIsCapitalized,
    setRainbowText, isRainbowText,
    darkMode, toggleDarkMode
  } = useTextDisplay();

  // Apply dark mode class to document body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDisplayClick = () => {
    navigate('/display');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-48 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <div className="max-w-md mx-auto flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleDarkMode} 
          className="w-8 h-8 rounded-full"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      
      <Card className="max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6 space-y-6">
          <h1 className="text-2xl font-bold text-center dark:text-white">Text Across the Room</h1>
          
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
                  'CALL ME', 
                  '♡ ♡ ♡ LOVE YOU ♡ ♡ ♡', 
                  'BACK OFF!', 
                  'H E L P !', 
                  '911', 
                  'LETS GO!',
                  'LMAO', 
                  '🤣',
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
            <h2 className="text-lg font-semibold dark:text-white">Appearance</h2>
            
            <ColorPicker 
              label="Text Color" 
              value={isRainbowText ? 'rainbow' : textColor} 
              onChange={setTextColor} 
              onSelectRainbow={setRainbowText}
            />
            
            <ColorPicker 
              label="Background Color" 
              value={backgroundColor} 
              onChange={setBackgroundColor} 
            />
            
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
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={() => applyPreset('day')}
                className={`w-full transition-all ${preset === 'day' ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400 ring-offset-2' : 'hover:bg-blue-50'} dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300 dark:ring-offset-gray-900`}
              >
                Day
              </Button>
              <Button 
                variant="outline"
                onClick={() => applyPreset('night')}
                className={`w-full transition-all ${preset === 'night' ? 'bg-indigo-900 text-white ring-2 ring-indigo-400 ring-offset-2' : 'hover:bg-indigo-50'} dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300 dark:ring-offset-gray-900`}
              >
                Night
              </Button>
              <Button 
                variant="outline"
                onClick={() => applyPreset('emergency')}
                className={`w-full transition-all ${preset === 'emergency' ? 'bg-red-600 text-white ring-2 ring-red-300 ring-offset-2' : 'text-red-600 hover:bg-red-50'} dark:border-gray-600 dark:hover:bg-gray-700 dark:text-red-400 dark:ring-offset-gray-900`}
              >
                Emergency
              </Button>
              <Button 
                variant="outline"
                onClick={() => applyPreset('party')}
                className={`w-full transition-all ${preset === 'party' ? 'bg-black text-white ring-2 ring-cyan-400 ring-offset-2' : 'hover:bg-gray-50'} dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300 dark:ring-offset-gray-900`}
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
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-background p-4 border-t dark:bg-gray-900 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold dark:text-white">Preview</h2>
            <TextPreview />
          </div>
          
          <Button 
            className="w-full text-lg py-6 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
            onClick={handleDisplayClick}
          >
            <Fullscreen className="mr-2 h-5 w-5" />
            DISPLAY
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
