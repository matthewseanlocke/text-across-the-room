
import React from 'react';
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
import { Fullscreen } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const {
    text, setText,
    textColor, setTextColor,
    backgroundColor, setBackgroundColor,
    font, setFont,
    scrollSpeed, setScrollSpeed,
    preset, applyPreset
  } = useTextDisplay();

  const handleDisplayClick = () => {
    navigate('/display');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Text Across the Room</h1>
          
          <div className="space-y-2">
            <Label htmlFor="text-input">Message</Label>
            <Input
              id="text-input"
              placeholder="Enter your message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Preview</h2>
            <TextPreview />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Appearance</h2>
            
            <ColorPicker 
              label="Text Color" 
              value={textColor} 
              onChange={setTextColor} 
            />
            
            <ColorPicker 
              label="Background Color" 
              value={backgroundColor} 
              onChange={setBackgroundColor} 
            />
            
            <div className="space-y-2">
              <Label htmlFor="font-select">Font</Label>
              <Select value={font} onValueChange={(value) => setFont(value as any)}>
                <SelectTrigger id="font-select">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="display">Display</SelectItem>
                  <SelectItem value="handwriting">Handwriting</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <SpeedSlider value={scrollSpeed} onChange={setScrollSpeed} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Presets</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={preset === 'day' ? "default" : "outline"} 
                onClick={() => applyPreset('day')}
                className="w-full"
              >
                Day
              </Button>
              <Button 
                variant={preset === 'night' ? "default" : "outline"} 
                onClick={() => applyPreset('night')}
                className="w-full"
              >
                Night
              </Button>
              <Button 
                variant={preset === 'emergency' ? "default" : "outline"} 
                onClick={() => applyPreset('emergency')}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Emergency
              </Button>
              <Button 
                variant={preset === 'party' ? "default" : "outline"} 
                onClick={() => applyPreset('party')}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                Party
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full text-lg py-6"
            onClick={handleDisplayClick}
          >
            <Fullscreen className="mr-2 h-5 w-5" />
            DISPLAY
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
