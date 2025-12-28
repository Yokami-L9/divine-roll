import { TerrainType } from './textures/PatternGenerator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { patternGenerator } from './textures/PatternGenerator';
import { useEffect, useRef, useState } from 'react';

interface TerrainPaletteProps {
  selectedTerrain: TerrainType;
  onSelectTerrain: (terrain: TerrainType) => void;
  brushSize: number;
  brushOpacity: number;
  onBrushSizeChange: (size: number) => void;
  onBrushOpacityChange: (opacity: number) => void;
  onFillTerrain: (terrain: TerrainType) => void;
}

interface TerrainCategory {
  name: string;
  terrains: { id: TerrainType; label: string }[];
}

const TERRAIN_CATEGORIES: TerrainCategory[] = [
  {
    name: 'Трава и луга',
    terrains: [
      { id: 'grass', label: 'Трава' },
      { id: 'tallGrass', label: 'Высокая трава' },
      { id: 'meadow', label: 'Луг с цветами' },
    ]
  },
  {
    name: 'Леса',
    terrains: [
      { id: 'forest', label: 'Лес' },
      { id: 'denseForest', label: 'Густой лес' },
      { id: 'pineForest', label: 'Сосновый лес' },
      { id: 'jungle', label: 'Джунгли' },
    ]
  },
  {
    name: 'Вода',
    terrains: [
      { id: 'water', label: 'Вода' },
      { id: 'deepWater', label: 'Глубокая вода' },
      { id: 'river', label: 'Река' },
      { id: 'swamp', label: 'Болото' },
    ]
  },
  {
    name: 'Горы и холмы',
    terrains: [
      { id: 'mountain', label: 'Горы' },
      { id: 'hills', label: 'Холмы' },
      { id: 'cliffs', label: 'Скалы' },
      { id: 'volcanic', label: 'Вулканическая' },
    ]
  },
  {
    name: 'Пустыня и песок',
    terrains: [
      { id: 'sand', label: 'Песок' },
      { id: 'desert', label: 'Пустыня' },
      { id: 'dunes', label: 'Дюны' },
    ]
  },
  {
    name: 'Снег и лёд',
    terrains: [
      { id: 'snow', label: 'Снег' },
      { id: 'ice', label: 'Лёд' },
      { id: 'tundra', label: 'Тундра' },
    ]
  },
  {
    name: 'Земля и грязь',
    terrains: [
      { id: 'dirt', label: 'Земля' },
      { id: 'mud', label: 'Грязь' },
      { id: 'farmland', label: 'Поля' },
    ]
  },
  {
    name: 'Камень и руины',
    terrains: [
      { id: 'stone', label: 'Камень' },
      { id: 'cobblestone', label: 'Булыжник' },
      { id: 'ruins', label: 'Руины' },
    ]
  },
  {
    name: 'Дороги',
    terrains: [
      { id: 'road', label: 'Дорога' },
      { id: 'path', label: 'Тропа' },
    ]
  },
];

function TerrainPreview({ terrain, size = 48 }: { terrain: TerrainType; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d')!;
    // Render a higher-resolution pattern and scale it down so previews match real brush detail.
    const srcSize = Math.max(128, Math.round((size * 3) / 32) * 32);
    const pattern = patternGenerator.generatePattern(terrain, srcSize);

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(pattern, 0, 0, size, size);
    setLoaded(true);
  }, [terrain, size]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className={cn(
        "rounded border border-border transition-opacity",
        loaded ? "opacity-100" : "opacity-0"
      )}
    />
  );
}

export function TerrainPalette({ 
  selectedTerrain, 
  onSelectTerrain,
  brushSize,
  brushOpacity,
  onBrushSizeChange,
  onBrushOpacityChange,
  onFillTerrain
}: TerrainPaletteProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 w-64">
      <h3 className="text-sm font-semibold text-foreground mb-3 font-cinzel">Ландшафты</h3>
      
      {/* Brush Settings */}
      <div className="space-y-3 mb-4 pb-4 border-b border-border">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Размер кисти</span>
            <span>{brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            min={20}
            max={200}
            step={5}
            onValueChange={([v]) => onBrushSizeChange(v)}
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Непрозрачность</span>
            <span>{Math.round(brushOpacity * 100)}%</span>
          </div>
          <Slider
            value={[brushOpacity * 100]}
            min={10}
            max={100}
            step={5}
            onValueChange={([v]) => onBrushOpacityChange(v / 100)}
          />
        </div>
      </div>
      
      {/* Selected terrain preview */}
      <div className="flex items-center gap-3 mb-4 p-2 bg-muted/50 rounded-lg">
        <TerrainPreview terrain={selectedTerrain} size={56} />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground capitalize">
            {TERRAIN_CATEGORIES.flatMap(c => c.terrains).find(t => t.id === selectedTerrain)?.label || selectedTerrain}
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-1 h-6 text-xs"
            onClick={() => onFillTerrain(selectedTerrain)}
          >
            Залить всё
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[400px] pr-2">
        <div className="space-y-4">
          {TERRAIN_CATEGORIES.map((category) => (
            <div key={category.name}>
              <p className="text-xs text-muted-foreground mb-2 font-medium">{category.name}</p>
              <div className="grid grid-cols-2 gap-1">
                {category.terrains.map((terrain) => (
                  <button
                    key={terrain.id}
                    className={cn(
                      "flex items-center gap-2 p-1.5 rounded-md transition-all text-left",
                      "hover:bg-accent/50",
                      selectedTerrain === terrain.id 
                        ? "bg-primary/20 ring-1 ring-primary" 
                        : "bg-muted/30"
                    )}
                    onClick={() => onSelectTerrain(terrain.id)}
                  >
                    <TerrainPreview terrain={terrain.id} size={32} />
                    <span className="text-[10px] leading-tight text-foreground/80">{terrain.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
