import React, { useRef, useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const SpeedSlider: React.FC<SpeedSliderProps> = ({ value, onChange }) => {
  const isMobile = useIsMobile();
  const swipeAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(0);
  
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  // Clamp value between min and max
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
  
  // Touch/mouse event handlers for swipe gestures
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartValue(value);
  };
  
  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX;
    // Convert pixel movement to speed value change (sensitivity adjustment)
    // 100px movement = 1 speed unit change
    const speedChange = Math.floor(deltaX / 60);
    const newValue = clamp(startValue + speedChange, 1, 9);
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };
  
  const handleEnd = () => {
    setIsDragging(false);
  };
  
  // Set up event listeners
  useEffect(() => {
    const swipeArea = swipeAreaRef.current;
    if (!swipeArea || !isMobile) return;
    
    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      handleStart(e.touches[0].clientX);
    };
    
    const onTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };
    
    const onTouchEnd = () => {
      handleEnd();
    };
    
    // Mouse events (for testing on desktop)
    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX);
    };
    
    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };
    
    const onMouseUp = () => {
      handleEnd();
    };
    
    swipeArea.addEventListener('touchstart', onTouchStart);
    swipeArea.addEventListener('touchmove', onTouchMove);
    swipeArea.addEventListener('touchend', onTouchEnd);
    
    swipeArea.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    
    return () => {
      swipeArea.removeEventListener('touchstart', onTouchStart);
      swipeArea.removeEventListener('touchmove', onTouchMove);
      swipeArea.removeEventListener('touchend', onTouchEnd);
      
      swipeArea.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, startX, startValue, value, onChange, isMobile]);

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
        
        {isMobile && (
          <div 
            ref={swipeAreaRef}
            className="mt-4 p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600 text-center relative cursor-grab active:cursor-grabbing"
          >
            <div className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
              Drag here to adjust speed
            </div>
            <div className="font-bold text-xl mb-1">
              {value}
            </div>
            <div 
              className="flex items-center justify-between px-4 text-lg text-primary"
            >
              <div>←</div>
              <div className="h-1 flex-grow mx-4 bg-primary/20 rounded-full relative">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-primary rounded-full"
                  style={{ width: `${(value - 1) / 8 * 100}%` }}
                ></div>
                <div 
                  className="absolute -top-2 -mt-0.5 w-5 h-5 rounded-full bg-primary border-2 border-white dark:border-gray-800"
                  style={{ left: `calc(${(value - 1) / 8 * 100}% - 0.5rem)` }}
                ></div>
              </div>
              <div>→</div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground dark:text-gray-500">
              Slow ⟷ Fast
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
          Current: {value}
        </div>
      </div>
    </div>
  );
};

export default SpeedSlider;
