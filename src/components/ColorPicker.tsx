import React from 'react';
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  onSelectRainbow?: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, onSelectRainbow }) => {
  const colorOptions = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", 
    "#ffff00", "#ff00ff", "#00ffff", "#ff8000", "#8b5cf6"
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full border-2 ${
              color === value ? 'border-primary' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`${color} color`}
          />
        ))}
        {onSelectRainbow && (
          <button
            type="button"
            className={`w-8 h-8 rounded-full border-2 ${
              value === 'rainbow' ? 'border-primary' : 'border-gray-300'
            }`}
            style={{ 
              background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
            }}
            onClick={onSelectRainbow}
            aria-label="Rainbow color"
          />
        )}
        <input
          id={label}
          type="color"
          value={value === 'rainbow' ? '#ff0000' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8"
          disabled={value === 'rainbow'}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
