import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { textureManager, TextureInfo } from './textures/TextureManager';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TextureCatalogProps {
  onSelectTexture: (textureId: string) => void;
  selectedTexture: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  terrain: 'Terrain',
  ground: 'Ground',
  special: 'Special',
  paths: 'Paths',
};

const TextureThumbnail: React.FC<{
  texture: TextureInfo;
  isSelected: boolean;
  onClick: () => void;
}> = ({ texture, isSelected, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadAndDraw = async () => {
      await textureManager.loadTexture(texture.id);
      if (canvasRef.current) {
        const preview = textureManager.getPreviewCanvas(texture.id, 80);
        if (preview) {
          const ctx = canvasRef.current.getContext('2d')!;
          ctx.drawImage(preview, 0, 0);
          setLoaded(true);
        }
      }
    };
    loadAndDraw();
  }, [texture.id]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
        isSelected
          ? 'border-yellow-500 ring-2 ring-yellow-500/50'
          : 'border-transparent hover:border-muted-foreground/50'
      )}
    >
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        className={cn(
          'w-full h-full transition-opacity',
          loaded ? 'opacity-100' : 'opacity-50'
        )}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="w-5 h-5 border-2 border-t-transparent border-foreground rounded-full animate-spin" />
        </div>
      )}
      {/* Tooltip */}
      <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[10px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        {texture.name}
      </div>
    </button>
  );
};

export const TextureCatalog: React.FC<TextureCatalogProps> = ({
  onSelectTexture,
  selectedTexture,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [textures, setTextures] = useState<TextureInfo[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['terrain', 'ground', 'special', 'paths'])
  );

  useEffect(() => {
    const loadTextures = async () => {
      await textureManager.loadAllTextures();
      setTextures(textureManager.getAllTextures());
    };
    loadTextures();
  }, []);

  const filteredTextures = textures.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(filteredTextures.map((t) => t.category)));

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelect = (textureId: string) => {
    onSelectTexture(textureId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Texture Catalog
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-xl">Texture Catalog</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search textures..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Catalog Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryTextures = filteredTextures.filter(
                (t) => t.category === category
              );
              const isExpanded = expandedCategories.has(category);

              return (
                <div key={category}>
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                  >
                    <span
                      className={cn(
                        'transition-transform',
                        isExpanded ? 'rotate-90' : ''
                      )}
                    >
                      ▶
                    </span>
                    <span>{CATEGORY_LABELS[category] || category}</span>
                    <span className="text-muted-foreground text-xs">
                      ({categoryTextures.length} Assets)
                    </span>
                  </button>

                  {/* Textures Grid */}
                  {isExpanded && (
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
                      {categoryTextures.map((texture) => (
                        <TextureThumbnail
                          key={texture.id}
                          texture={texture}
                          isSelected={selectedTexture === texture.id}
                          onClick={() => handleSelect(texture.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredTextures.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No textures found matching "{search}"
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TextureCatalog;
