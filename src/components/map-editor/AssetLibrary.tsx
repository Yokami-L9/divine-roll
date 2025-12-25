import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Library, Search, TreeDeciduous, Mountain, Building, Waves, Tent, Swords, Gem, Skull } from "lucide-react";

export interface Asset {
  id: string;
  name: string;
  category: 'nature' | 'buildings' | 'creatures' | 'items' | 'effects';
  emoji?: string;
  icon?: React.ElementType;
  color: string;
  size?: number;
}

export const ASSET_LIBRARY: Asset[] = [
  // Nature
  { id: 'tree_1', name: 'Дерево', category: 'nature', emoji: '🌲', color: '#22c55e', size: 30 },
  { id: 'tree_2', name: 'Дуб', category: 'nature', emoji: '🌳', color: '#16a34a', size: 35 },
  { id: 'palm', name: 'Пальма', category: 'nature', emoji: '🌴', color: '#84cc16', size: 32 },
  { id: 'bush', name: 'Куст', category: 'nature', emoji: '🌿', color: '#4ade80', size: 20 },
  { id: 'flower', name: 'Цветы', category: 'nature', emoji: '🌸', color: '#f472b6', size: 15 },
  { id: 'rock_1', name: 'Камень', category: 'nature', emoji: '🪨', color: '#78716c', size: 25 },
  { id: 'mountain', name: 'Гора', category: 'nature', emoji: '⛰️', color: '#a8a29e', size: 50 },
  { id: 'water', name: 'Вода', category: 'nature', emoji: '💧', color: '#3b82f6', size: 20 },
  { id: 'fire', name: 'Огонь', category: 'nature', emoji: '🔥', color: '#f97316', size: 20 },
  { id: 'cloud', name: 'Облако', category: 'nature', emoji: '☁️', color: '#e2e8f0', size: 40 },
  
  // Buildings
  { id: 'castle', name: 'Замок', category: 'buildings', emoji: '🏰', color: '#eab308', size: 45 },
  { id: 'house', name: 'Дом', category: 'buildings', emoji: '🏠', color: '#84cc16', size: 30 },
  { id: 'tower', name: 'Башня', category: 'buildings', emoji: '🗼', color: '#8b5cf6', size: 35 },
  { id: 'church', name: 'Храм', category: 'buildings', emoji: '⛪', color: '#f5f5f4', size: 35 },
  { id: 'tent', name: 'Палатка', category: 'buildings', emoji: '⛺', color: '#f97316', size: 25 },
  { id: 'ruins', name: 'Руины', category: 'buildings', emoji: '🏛️', color: '#78716c', size: 40 },
  { id: 'mill', name: 'Мельница', category: 'buildings', emoji: '🏗️', color: '#a3a3a3', size: 30 },
  { id: 'bridge', name: 'Мост', category: 'buildings', emoji: '🌉', color: '#78716c', size: 45 },
  { id: 'gate', name: 'Ворота', category: 'buildings', emoji: '🚪', color: '#92400e', size: 30 },
  { id: 'well', name: 'Колодец', category: 'buildings', emoji: '🪣', color: '#64748b', size: 20 },
  
  // Creatures
  { id: 'dragon', name: 'Дракон', category: 'creatures', emoji: '🐉', color: '#dc2626', size: 40 },
  { id: 'wolf', name: 'Волк', category: 'creatures', emoji: '🐺', color: '#71717a', size: 25 },
  { id: 'bear', name: 'Медведь', category: 'creatures', emoji: '🐻', color: '#78350f', size: 30 },
  { id: 'horse', name: 'Лошадь', category: 'creatures', emoji: '🐴', color: '#92400e', size: 28 },
  { id: 'skull', name: 'Череп', category: 'creatures', emoji: '💀', color: '#fafaf9', size: 20 },
  { id: 'ghost', name: 'Призрак', category: 'creatures', emoji: '👻', color: '#e2e8f0', size: 25 },
  { id: 'spider', name: 'Паук', category: 'creatures', emoji: '🕷️', color: '#1c1917', size: 20 },
  { id: 'bat', name: 'Летучая мышь', category: 'creatures', emoji: '🦇', color: '#3f3f46', size: 22 },
  
  // Items
  { id: 'sword', name: 'Меч', category: 'items', emoji: '⚔️', color: '#a3a3a3', size: 25 },
  { id: 'shield', name: 'Щит', category: 'items', emoji: '🛡️', color: '#eab308', size: 22 },
  { id: 'gem', name: 'Самоцвет', category: 'items', emoji: '💎', color: '#0ea5e9', size: 18 },
  { id: 'crown', name: 'Корона', category: 'items', emoji: '👑', color: '#eab308', size: 22 },
  { id: 'key', name: 'Ключ', category: 'items', emoji: '🗝️', color: '#eab308', size: 18 },
  { id: 'chest', name: 'Сундук', category: 'items', emoji: '📦', color: '#92400e', size: 25 },
  { id: 'scroll', name: 'Свиток', category: 'items', emoji: '📜', color: '#fef3c7', size: 18 },
  { id: 'potion', name: 'Зелье', category: 'items', emoji: '🧪', color: '#a855f7', size: 16 },
  { id: 'coin', name: 'Монета', category: 'items', emoji: '🪙', color: '#eab308', size: 15 },
  { id: 'book', name: 'Книга', category: 'items', emoji: '📕', color: '#dc2626', size: 18 },
  
  // Effects
  { id: 'star', name: 'Звезда', category: 'effects', emoji: '⭐', color: '#eab308', size: 18 },
  { id: 'sparkle', name: 'Искры', category: 'effects', emoji: '✨', color: '#fbbf24', size: 20 },
  { id: 'explosion', name: 'Взрыв', category: 'effects', emoji: '💥', color: '#f97316', size: 30 },
  { id: 'magic', name: 'Магия', category: 'effects', emoji: '🔮', color: '#a855f7', size: 22 },
  { id: 'lightning', name: 'Молния', category: 'effects', emoji: '⚡', color: '#eab308', size: 25 },
  { id: 'arrow_up', name: 'Стрелка вверх', category: 'effects', emoji: '⬆️', color: '#3b82f6', size: 20 },
  { id: 'arrow_right', name: 'Стрелка вправо', category: 'effects', emoji: '➡️', color: '#3b82f6', size: 20 },
  { id: 'x_mark', name: 'Крестик', category: 'effects', emoji: '❌', color: '#dc2626', size: 20 },
  { id: 'check', name: 'Галочка', category: 'effects', emoji: '✅', color: '#22c55e', size: 20 },
  { id: 'warning', name: 'Внимание', category: 'effects', emoji: '⚠️', color: '#eab308', size: 22 },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  nature: TreeDeciduous,
  buildings: Building,
  creatures: Skull,
  items: Gem,
  effects: Swords,
};

const CATEGORY_LABELS: Record<string, string> = {
  nature: 'Природа',
  buildings: 'Здания',
  creatures: 'Существа',
  items: 'Предметы',
  effects: 'Эффекты',
};

interface AssetLibraryProps {
  onSelectAsset: (asset: Asset) => void;
}

export const AssetLibrary = ({ onSelectAsset }: AssetLibraryProps) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredAssets = ASSET_LIBRARY.filter(asset =>
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  const getAssetsByCategory = (category: string) =>
    filteredAssets.filter(asset => asset.category === category);

  const handleSelectAsset = (asset: Asset) => {
    onSelectAsset(asset);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Library className="w-4 h-4" />
          Библиотека ассетов
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Библиотека ассетов</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="nature" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {Object.keys(CATEGORY_LABELS).map((category) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <TabsTrigger key={category} value={category} className="gap-1">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">{CATEGORY_LABELS[category]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(CATEGORY_LABELS).map((category) => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-5 gap-2 p-2">
                  {getAssetsByCategory(category).map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className="flex flex-col items-center gap-1 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-all"
                    >
                      <span className="text-2xl">{asset.emoji}</span>
                      <span className="text-xs text-muted-foreground text-center truncate w-full">
                        {asset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
