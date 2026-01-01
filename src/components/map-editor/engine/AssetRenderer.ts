// Asset Rendering Engine - Handles asset loading, caching, and rendering

import { MapAsset } from '../types';

export interface AssetDefinition {
  id: string;
  name: string;
  emoji: string;
  category: string;
  size?: number;
}

// Built-in assets using emojis rendered to canvas
export const BUILTIN_ASSETS: AssetDefinition[] = [
  // Terrain
  { id: 'mountain-1', name: 'Гора', emoji: '🏔️', category: 'terrain', size: 64 },
  { id: 'mountain-2', name: 'Холмы', emoji: '⛰️', category: 'terrain', size: 56 },
  { id: 'volcano', name: 'Вулкан', emoji: '🌋', category: 'terrain', size: 64 },
  { id: 'rock-1', name: 'Скалы', emoji: '🪨', category: 'terrain', size: 40 },
  
  // Vegetation
  { id: 'tree-1', name: 'Дерево', emoji: '🌲', category: 'vegetation', size: 48 },
  { id: 'tree-2', name: 'Лиственное', emoji: '🌳', category: 'vegetation', size: 48 },
  { id: 'palm', name: 'Пальма', emoji: '🌴', category: 'vegetation', size: 48 },
  { id: 'cactus', name: 'Кактус', emoji: '🌵', category: 'vegetation', size: 40 },
  { id: 'flower', name: 'Цветы', emoji: '🌸', category: 'vegetation', size: 32 },
  
  // Settlements
  { id: 'city', name: 'Город', emoji: '🏙️', category: 'settlements', size: 80 },
  { id: 'village', name: 'Деревня', emoji: '🏘️', category: 'settlements', size: 64 },
  { id: 'house', name: 'Дом', emoji: '🏠', category: 'settlements', size: 48 },
  { id: 'tent', name: 'Лагерь', emoji: '⛺', category: 'settlements', size: 48 },
  
  // Structures
  { id: 'castle', name: 'Замок', emoji: '🏰', category: 'structures', size: 72 },
  { id: 'tower', name: 'Башня', emoji: '🗼', category: 'structures', size: 56 },
  { id: 'temple', name: 'Храм', emoji: '🛕', category: 'structures', size: 56 },
  { id: 'bridge', name: 'Мост', emoji: '🌉', category: 'structures', size: 64 },
  { id: 'ruins', name: 'Руины', emoji: '🏚️', category: 'structures', size: 56 },
  
  // Water
  { id: 'anchor', name: 'Порт', emoji: '⚓', category: 'water', size: 48 },
  { id: 'ship', name: 'Корабль', emoji: '⛵', category: 'water', size: 56 },
  { id: 'whale', name: 'Морское чудо', emoji: '🐋', category: 'water', size: 64 },
  
  // Decorative
  { id: 'compass', name: 'Компас', emoji: '🧭', category: 'decorative', size: 80 },
  { id: 'crown', name: 'Столица', emoji: '👑', category: 'decorative', size: 40 },
  { id: 'flag', name: 'Флаг', emoji: '🚩', category: 'decorative', size: 40 },
  { id: 'skull', name: 'Опасность', emoji: '💀', category: 'decorative', size: 40 },
  { id: 'treasure', name: 'Сокровище', emoji: '💎', category: 'decorative', size: 40 },
  { id: 'star', name: 'Точка интереса', emoji: '⭐', category: 'decorative', size: 48 },
];

export class AssetRenderer {
  private textureCache: Map<string, HTMLCanvasElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLCanvasElement>> = new Map();

  constructor() {
    // Pre-render built-in emoji assets
    BUILTIN_ASSETS.forEach(asset => {
      this.renderEmojiToCanvas(asset.id, asset.emoji, asset.size || 64);
    });
  }

  private renderEmojiToCanvas(id: string, emoji: string, size: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    ctx.font = `${size * 0.8}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);
    
    this.textureCache.set(id, canvas);
    return canvas;
  }

  public getAssetTexture(assetId: string): HTMLCanvasElement | null {
    return this.textureCache.get(assetId) || null;
  }

  public getAssetDefinition(assetId: string): AssetDefinition | undefined {
    return BUILTIN_ASSETS.find(a => a.id === assetId);
  }

  public renderAssets(
    ctx: CanvasRenderingContext2D, 
    assets: MapAsset[],
    selectedAssetId: string | null = null,
    hoverAssetId: string | null = null
  ): void {
    // Sort by zIndex
    const sortedAssets = [...assets].sort((a, b) => a.zIndex - b.zIndex);
    
    sortedAssets.forEach(asset => {
      const texture = this.textureCache.get(asset.assetId);
      if (!texture) return;
      
      const definition = this.getAssetDefinition(asset.assetId);
      const baseSize = definition?.size || 64;
      const width = baseSize * asset.scale;
      const height = baseSize * asset.scale;
      
      ctx.save();
      ctx.translate(asset.x, asset.y);
      ctx.rotate((asset.rotation * Math.PI) / 180);
      if (asset.flipX) ctx.scale(-1, 1);
      
      ctx.drawImage(
        texture,
        -width / 2,
        -height / 2,
        width,
        height
      );
      
      // Selection indicator
      if (selectedAssetId === asset.id) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        
        // Draw rotation handle
        ctx.beginPath();
        ctx.arc(0, -height / 2 - 20, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        
        // Draw scale handles at corners
        const handleSize = 8;
        ctx.fillStyle = '#22c55e';
        [
          [-width / 2, -height / 2],
          [width / 2, -height / 2],
          [-width / 2, height / 2],
          [width / 2, height / 2],
        ].forEach(([hx, hy]) => {
          ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
        });
      } else if (hoverAssetId === asset.id) {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-width / 2 - 3, -height / 2 - 3, width + 6, height + 6);
      }
      
      ctx.restore();
    });
  }

  public hitTest(x: number, y: number, assets: MapAsset[]): MapAsset | null {
    // Test in reverse order (topmost first)
    const sortedAssets = [...assets].sort((a, b) => b.zIndex - a.zIndex);
    
    for (const asset of sortedAssets) {
      const definition = this.getAssetDefinition(asset.assetId);
      const baseSize = definition?.size || 64;
      const halfWidth = (baseSize * asset.scale) / 2;
      const halfHeight = (baseSize * asset.scale) / 2;
      
      // Transform point to asset's local coordinates
      const dx = x - asset.x;
      const dy = y - asset.y;
      const angle = (-asset.rotation * Math.PI) / 180;
      const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
      const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
      
      if (
        localX >= -halfWidth &&
        localX <= halfWidth &&
        localY >= -halfHeight &&
        localY <= halfHeight
      ) {
        return asset;
      }
    }
    
    return null;
  }

  public getHandleAtPoint(
    x: number, 
    y: number, 
    asset: MapAsset
  ): 'rotate' | 'scale-tl' | 'scale-tr' | 'scale-bl' | 'scale-br' | null {
    const definition = this.getAssetDefinition(asset.assetId);
    const baseSize = definition?.size || 64;
    const halfWidth = (baseSize * asset.scale) / 2;
    const halfHeight = (baseSize * asset.scale) / 2;
    
    // Transform point to asset's local coordinates
    const dx = x - asset.x;
    const dy = y - asset.y;
    const angle = (-asset.rotation * Math.PI) / 180;
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
    
    const handleRadius = 10;
    
    // Check rotation handle (top center)
    const rotateY = -halfHeight - 20;
    if (localX * localX + (localY - rotateY) * (localY - rotateY) < handleRadius * handleRadius) {
      return 'rotate';
    }
    
    // Check scale handles
    const corners = [
      { x: -halfWidth, y: -halfHeight, name: 'scale-tl' as const },
      { x: halfWidth, y: -halfHeight, name: 'scale-tr' as const },
      { x: -halfWidth, y: halfHeight, name: 'scale-bl' as const },
      { x: halfWidth, y: halfHeight, name: 'scale-br' as const },
    ];
    
    for (const corner of corners) {
      if (
        Math.abs(localX - corner.x) < handleRadius &&
        Math.abs(localY - corner.y) < handleRadius
      ) {
        return corner.name;
      }
    }
    
    return null;
  }
}
