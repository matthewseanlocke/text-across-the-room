
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const SpeedSlider: React.FC<SpeedSliderProps> = ({ value, onChange }) => {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="speed-slider">Scroll Speed</Label>
        <div className="flex items-center space-x-4">
          <span>Slow</span>
          <Slider
            id="speed-slider"
            min={5}
            max={30}
            step={1}
            value={[value]}
            onValueChange={handleChange}
            className="flex-1"
          />
          <span>Fast</span>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Current: {value}
        </div>
      </div>
    </div>
  );
};

export default SpeedSlider;
