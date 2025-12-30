import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Mountain, TreePine, Building2, Castle, Droplets, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetLibraryProps {
  onSelectAsset: (assetId: string) => void;
  selectedAsset: string | null;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

interface AssetItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

// Placeholder assets using emojis
const PLACEHOLDER_ASSETS: AssetItem[] = [
  // Terrain
  { id: 'mountain-1', name: 'Гора', emoji: '🏔️', category: 'terrain' },
  { id: 'mountain-2', name: 'Холмы', emoji: '⛰️', category: 'terrain' },
  { id: 'volcano', name: 'Вулкан', emoji: '🌋', category: 'terrain' },
  { id: 'rock-1', name: 'Скалы', emoji: '🪨', category: 'terrain' },
  
  // Vegetation
  { id: 'tree-1', name: 'Дерево', emoji: '🌲', category: 'vegetation' },
  { id: 'tree-2', name: 'Лиственное', emoji: '🌳', category: 'vegetation' },
  { id: 'palm', name: 'Пальма', emoji: '🌴', category: 'vegetation' },
  { id: 'cactus', name: 'Кактус', emoji: '🌵', category: 'vegetation' },
  { id: 'flower', name: 'Цветы', emoji: '🌸', category: 'vegetation' },
  
  // Settlements
  { id: 'city', name: 'Город', emoji: '🏙️', category: 'settlements' },
  { id: 'village', name: 'Деревня', emoji: '🏘️', category: 'settlements' },
  { id: 'house', name: 'Дом', emoji: '🏠', category: 'settlements' },
  { id: 'tent', name: 'Лагерь', emoji: '⛺', category: 'settlements' },
  
  // Structures
  { id: 'castle', name: 'Замок', emoji: '🏰', category: 'structures' },
  { id: 'tower', name: 'Башня', emoji: '🗼', category: 'structures' },
  { id: 'temple', name: 'Храм', emoji: '🛕', category: 'structures' },
  { id: 'bridge', name: 'Мост', emoji: '🌉', category: 'structures' },
  { id: 'ruins', name: 'Руины', emoji: '🏚️', category: 'structures' },
  
  // Water
  { id: 'anchor', name: 'Порт', emoji: '⚓', category: 'water' },
  { id: 'ship', name: 'Корабль', emoji: '⛵', category: 'water' },
  { id: 'whale', name: 'Морское чудо', emoji: '🐋', category: 'water' },
  
  // Decorative
  { id: 'compass', name: 'Компас', emoji: '🧭', category: 'decorative' },
  { id: 'crown', name: 'Столица', emoji: '👑', category: 'decorative' },
  { id: 'flag', name: 'Флаг', emoji: '🚩', category: 'decorative' },
  { id: 'skull', name: 'Опасность', emoji: '💀', category: 'decorative' },
  { id: 'treasure', name: 'Сокровище', emoji: '💎', category: 'decorative' },
  { id: 'star', name: 'Точка интереса', emoji: '⭐', category: 'decorative' },
];

const CATEGORIES = [
  { id: 'all', name: 'Все', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'terrain', name: 'Рельеф', icon: <Mountain className="w-4 h-4" /> },
  { id: 'vegetation', name: 'Растения', icon: <TreePine className="w-4 h-4" /> },
  { id: 'settlements', name: 'Поселения', icon: <Building2 className="w-4 h-4" /> },
  { id: 'structures', name: 'Строения', icon: <Castle className="w-4 h-4" /> },
  { id: 'water', name: 'Вода', icon: <Droplets className="w-4 h-4" /> },
  { id: 'decorative', name: 'Декор', icon: <Sparkles className="w-4 h-4" /> },
];

export function AssetLibrary({ 
  onSelectAsset, 
  selectedAsset,
  isExpanded,
  onToggleExpanded 
}: AssetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAssets = PLACEHOLDER_ASSETS.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || asset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#16213e] border border-border"
        onClick={onToggleExpanded}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="w-72 bg-[#16213e] border-l border-border flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">Библиотека ассетов</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggleExpanded}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-background/50"
          />
        </div>
      </div>

      <div className="p-2 border-b border-border">
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="grid grid-cols-4 gap-2">
          {filteredAssets.map(asset => (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset.id)}
              className={cn(
                "aspect-square rounded-md flex items-center justify-center text-2xl",
                "bg-background/30 hover:bg-background/50 transition-colors",
                "border-2",
                selectedAsset === asset.id 
                  ? "border-primary ring-2 ring-primary/30" 
                  : "border-transparent"
              )}
              title={asset.name}
            >
              {asset.emoji}
            </button>
          ))}
        </div>
        
        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Ничего не найдено
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Нажмите на ассет и кликните на карту
        </p>
      </div>
    </div>
  );
}