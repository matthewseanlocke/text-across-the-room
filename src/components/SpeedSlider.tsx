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
        <Label htmlFor="speed-slider" className="dark:text-gray-300">Scroll Speed</Label>
        <div className="flex items-center space-x-4">
          <span className="dark:text-gray-300">Slow</span>
          <Slider
            id="speed-slider"
            min={1}
            max={9}
            step={1}
            value={[value]}
            onValueChange={handleChange}
            className="flex-1"
          />
          <span className="dark:text-gray-300">Fast</span>
        </div>
        <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
          Current: {value}
        </div>
      </div>
    </div>
  );
};

export default SpeedSlider;
