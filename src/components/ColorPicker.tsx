import React from 'react';
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  onSelectRainbow?: () => void;
  onSelectRainbowBackground?: () => void;
  onSelectLightningBackground?: () => void;
  onSelectSirenBackground?: () => void;
  onSelectHeartbeatBackground?: () => void;
  simple?: boolean;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange, 
  onSelectRainbow,
  onSelectRainbowBackground,
  onSelectLightningBackground,
  onSelectSirenBackground,
  onSelectHeartbeatBackground,
  simple = false,
  disabled = false
}) => {
  const colorOptions = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", 
    "#ffff00", "#ff00ff", "#00ffff", "#ff8000", "#8b5cf6"
  ];

  if (simple) {
    return (
      <div className="space-y-2">
        <Label htmlFor={label} className="dark:text-gray-300">{label}</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                color === value ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => !disabled && onChange(color)}
              aria-label={`${color} color`}
              disabled={disabled}
            />
          ))}
          <input
            id={label}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-8 h-8 dark:bg-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="dark:text-gray-300">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full border-2 ${
              color === value ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => !disabled && onChange(color)}
            aria-label={`${color} color`}
            disabled={disabled}
          />
        ))}
        {onSelectRainbow && (
          <button
            type="button"
            className={`w-8 h-8 rounded-full border-2 ${
              value === 'rainbow' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
            }`}
            style={{ 
              background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
            }}
            onClick={onSelectRainbow}
            aria-label="Rainbow color"
          />
        )}
        {onSelectRainbowBackground && label === "Background Color" && (
          <button
            type="button"
            className={`w-8 h-8 rounded-full border-2 ${
              value === 'rainbow-bg' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
            }`}
            style={{ 
              background: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)'
            }}
            onClick={onSelectRainbowBackground}
            aria-label="Rainbow background"
            title="Disco background"
          />
        )}
        {onSelectLightningBackground && label === "Background Color" && (
          <button
            type="button"
            className={`w-8 h-8 rounded-full border-2 overflow-hidden ${
              value === 'lightning-bg' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
            }`}
            onClick={onSelectLightningBackground}
            aria-label="Lightning background"
            title="Lightning effect"
          >
            <div className="w-full h-full bg-black relative">
              <div className="absolute inset-0 bg-white opacity-70" 
                style={{ clipPath: 'polygon(50% 0%, 55% 50%, 100% 55%, 55% 60%, 50% 100%, 45% 60%, 0% 55%, 45% 50%)' }} />
            </div>
          </button>
        )}
        {onSelectSirenBackground && label === "Background Color" && (
          <button
            type="button"
            className={`w-8 h-8 rounded-full border-2 overflow-hidden ${
              value === 'siren-bg' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
            }`}
            onClick={onSelectSirenBackground}
            aria-label="Police siren background"
            title="Police siren effect"
          >
            <div className="w-full h-full relative">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-600"></div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600"></div>
            </div>
          </button>
        )}
        {onSelectHeartbeatBackground && label === "Background Color" && (
          <button
            type="button"
            className={`w-8 h-8 rounded-full border-2 overflow-hidden ${
              value === 'heartbeat-bg' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
            }`}
            onClick={onSelectHeartbeatBackground}
            aria-label="Heartbeat background"
            title="Heartbeat effect"
          >
            <div className="w-full h-full bg-red-900 relative flex items-center justify-center">
              <div className="text-white text-xs">♥</div>
            </div>
          </button>
        )}
        <input
          id={label}
          type="color"
          value={value === 'rainbow' || value === 'rainbow-bg' || value === 'lightning-bg' || value === 'siren-bg' || value === 'heartbeat-bg' ? '#ff0000' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 dark:bg-gray-700"
          disabled={value === 'rainbow' || value === 'rainbow-bg' || value === 'lightning-bg' || value === 'siren-bg' || value === 'heartbeat-bg'}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
