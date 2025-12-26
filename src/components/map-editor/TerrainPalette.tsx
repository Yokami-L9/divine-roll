import { TERRAIN_CONFIGS, TerrainType } from './types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TerrainPaletteProps {
  selectedTerrain: TerrainType;
  onSelectTerrain: (terrain: TerrainType) => void;
}

export function TerrainPalette({ selectedTerrain, onSelectTerrain }: TerrainPaletteProps) {
  const categories = {
    land: TERRAIN_CONFIGS.filter(t => t.category === 'land'),
    water: TERRAIN_CONFIGS.filter(t => t.category === 'water'),
    special: TERRAIN_CONFIGS.filter(t => t.category === 'special'),
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <h3 className="text-sm font-semibold text-foreground mb-3">Ландшафты</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Земля</p>
            <div className="grid grid-cols-3 gap-1">
              {categories.land.map((terrain) => (
                <Button
                  key={terrain.id}
                  variant={selectedTerrain === terrain.id ? "default" : "ghost"}
                  size="sm"
                  className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                  onClick={() => onSelectTerrain(terrain.id)}
                >
                  <div 
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: terrain.color }}
                  />
                  <span className="text-[10px] leading-tight text-center">{terrain.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">Вода</p>
            <div className="grid grid-cols-3 gap-1">
              {categories.water.map((terrain) => (
                <Button
                  key={terrain.id}
                  variant={selectedTerrain === terrain.id ? "default" : "ghost"}
                  size="sm"
                  className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                  onClick={() => onSelectTerrain(terrain.id)}
                >
                  <div 
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: terrain.color }}
                  />
                  <span className="text-[10px] leading-tight text-center">{terrain.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">Особые</p>
            <div className="grid grid-cols-3 gap-1">
              {categories.special.map((terrain) => (
                <Button
                  key={terrain.id}
                  variant={selectedTerrain === terrain.id ? "default" : "ghost"}
                  size="sm"
                  className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                  onClick={() => onSelectTerrain(terrain.id)}
                >
                  <div 
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: terrain.color }}
                  />
                  <span className="text-[10px] leading-tight text-center">{terrain.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
