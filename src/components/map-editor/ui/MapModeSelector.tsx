import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe, Map, Swords } from 'lucide-react';
import { MapMode } from '../types';

interface MapModeSelectorProps {
  currentMode: MapMode;
  onModeChange: (mode: MapMode) => void;
}

const modes: { id: MapMode; icon: React.ReactNode; label: string; description: string }[] = [
  { 
    id: 'world', 
    icon: <Globe className="w-4 h-4" />, 
    label: 'Мировая', 
    description: 'Континенты, океаны, регионы' 
  },
  { 
    id: 'regional', 
    icon: <Map className="w-4 h-4" />, 
    label: 'Региональная', 
    description: 'Города, дороги, леса' 
  },
  { 
    id: 'battle', 
    icon: <Swords className="w-4 h-4" />, 
    label: 'Боевая', 
    description: 'Тактическая карта с сеткой' 
  },
];

export function MapModeSelector({ currentMode, onModeChange }: MapModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 px-2">
      {modes.map(mode => (
        <Tooltip key={mode.id}>
          <TooltipTrigger asChild>
            <Button
              variant={currentMode === mode.id ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => onModeChange(mode.id)}
            >
              {mode.icon}
              {mode.label}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{mode.label} карта</p>
            <p className="text-xs text-muted-foreground">{mode.description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
