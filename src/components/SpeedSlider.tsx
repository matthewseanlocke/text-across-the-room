import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

const SpeedSlider: React.FC<SpeedSliderProps> = ({ value, onChange, label = 'Scroll speed', disabled = false }) => {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className={`speed-control space-y-4 ${disabled ? 'is-disabled' : ''}`} aria-disabled={disabled}>
      <div className="space-y-2">
        <Label htmlFor="speed-slider" className="field-label dark:text-gray-300">{label}</Label>
        <div className="flex items-center space-x-4">
          <span className="speed-end dark:text-gray-300">Slow</span>
          <Slider
            id="speed-slider"
            min={1}
            max={15}
            step={1}
            value={[value]}
            onValueChange={handleChange}
            disabled={disabled}
            className="flex-1"
          />
          <span className="speed-end dark:text-gray-300">Fast</span>
        </div>
        <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
          Speed {value} of 15
        </div>
      </div>
    </div>
  );
};

export default SpeedSlider;
