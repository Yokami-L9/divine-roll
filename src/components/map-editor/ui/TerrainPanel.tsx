import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PaintBucket } from 'lucide-react';
import { TerrainType, TERRAIN_CONFIGS } from '../types';

interface TerrainPanelProps {
  selectedTerrain: TerrainType;
  onSelectTerrain: (terrain: TerrainType) => void;
  onFillTerrain: (terrain: TerrainType) => void;
  getTerrainTexture: (terrain: TerrainType) => HTMLCanvasElement | null;
}

function TerrainSwatch({ 
  terrain, 
  isSelected, 
  onClick,
  getTexture 
}: { 
  terrain: typeof TERRAIN_CONFIGS[0];
  isSelected: boolean;
  onClick: () => void;
  getTexture: (terrain: TerrainType) => HTMLCanvasElement | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const texture = getTexture(terrain.id);
    if (texture) {
      ctx.drawImage(texture, 0, 0, 48, 48);
    } else {
      ctx.fillStyle = terrain.baseColor;
      ctx.fillRect(0, 0, 48, 48);
    }
  }, [terrain, getTexture]);

  return (
    <button
      onClick={onClick}
      className={`relative rounded-md overflow-hidden transition-all ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#16213e] scale-105' 
          : 'hover:ring-1 hover:ring-white/30'
      }`}
    >
      <canvas ref={canvasRef} width={48} height={48} className="block" />
      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5">
        <span className="text-[9px] text-white truncate block">{terrain.name}</span>
      </div>
    </button>
  );
}

export function TerrainPanel({ 
  selectedTerrain, 
  onSelectTerrain, 
  onFillTerrain,
  getTerrainTexture 
}: TerrainPanelProps) {
  const waterTerrains = TERRAIN_CONFIGS.filter(t => t.category === 'water');
  const landTerrains = TERRAIN_CONFIGS.filter(t => t.category === 'land');
  const specialTerrains = TERRAIN_CONFIGS.filter(t => t.category === 'special');

  const renderCategory = (terrains: typeof TERRAIN_CONFIGS, title: string) => (
    <div className="mb-4">
      <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">{title}</h4>
      <div className="grid grid-cols-3 gap-2">
        {terrains.map(terrain => (
          <TerrainSwatch
            key={terrain.id}
            terrain={terrain}
            isSelected={selectedTerrain === terrain.id}
            onClick={() => onSelectTerrain(terrain.id)}
            getTexture={getTerrainTexture}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-56 bg-[#16213e] border-r border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Ландшафт</h3>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        {renderCategory(waterTerrains, 'Вода')}
        {renderCategory(landTerrains, 'Суша')}
        {renderCategory(specialTerrains, 'Особые')}
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          onClick={() => onFillTerrain(selectedTerrain)}
        >
          <PaintBucket className="w-4 h-4" />
          Залить всё
        </Button>
      </div>
    </div>
  );
}
