// Real texture-based system like Inkarnate
import dirtTexture from '@/assets/textures/dirt.jpg';
import grassTexture from '@/assets/textures/grass.jpg';
import sandTexture from '@/assets/textures/sand.jpg';
import stoneTexture from '@/assets/textures/stone.jpg';
import waterTexture from '@/assets/textures/water.jpg';
import forestTexture from '@/assets/textures/forest.jpg';
import snowTexture from '@/assets/textures/snow.jpg';
import swampTexture from '@/assets/textures/swamp.jpg';
import lavaTexture from '@/assets/textures/lava.jpg';
import cobblestoneTexture from '@/assets/textures/cobblestone.jpg';

export interface TextureInfo {
  id: string;
  name: string;
  category: 'terrain' | 'ground' | 'special' | 'paths';
  src: string;
  image?: HTMLImageElement;
  loaded: boolean;
}

export interface BrushSettings {
  size: number;
  opacity: number;
  softness: number;
  textureScale: number;
  rotation: number;
}

const TEXTURE_DEFINITIONS: Omit<TextureInfo, 'image' | 'loaded'>[] = [
  { id: 'dirt', name: 'Dirt', category: 'terrain', src: dirtTexture },
  { id: 'grass', name: 'Grass', category: 'terrain', src: grassTexture },
  { id: 'sand', name: 'Sand', category: 'terrain', src: sandTexture },
  { id: 'stone', name: 'Stone', category: 'terrain', src: stoneTexture },
  { id: 'water', name: 'Water', category: 'terrain', src: waterTexture },
  { id: 'forest', name: 'Forest', category: 'terrain', src: forestTexture },
  { id: 'snow', name: 'Snow', category: 'terrain', src: snowTexture },
  { id: 'swamp', name: 'Swamp', category: 'terrain', src: swampTexture },
  { id: 'lava', name: 'Lava', category: 'special', src: lavaTexture },
  { id: 'cobblestone', name: 'Cobblestone', category: 'paths', src: cobblestoneTexture },
];

class TextureManager {
  private textures: Map<string, TextureInfo> = new Map();
  private loadPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  constructor() {
    // Initialize texture entries
    for (const def of TEXTURE_DEFINITIONS) {
      this.textures.set(def.id, { ...def, loaded: false });
    }
  }

  async loadTexture(id: string): Promise<HTMLImageElement | null> {
    const texture = this.textures.get(id);
    if (!texture) return null;

    if (texture.loaded && texture.image) {
      return texture.image;
    }

    // Check if already loading
    if (this.loadPromises.has(id)) {
      return this.loadPromises.get(id)!;
    }

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        texture.image = img;
        texture.loaded = true;
        this.loadPromises.delete(id);
        resolve(img);
      };
      img.onerror = reject;
      img.src = texture.src;
    });

    this.loadPromises.set(id, loadPromise);
    return loadPromise;
  }

  async loadAllTextures(): Promise<void> {
    const promises = Array.from(this.textures.keys()).map(id => this.loadTexture(id));
    await Promise.all(promises);
  }

  getTexture(id: string): TextureInfo | undefined {
    return this.textures.get(id);
  }

  getAllTextures(): TextureInfo[] {
    return Array.from(this.textures.values());
  }

  getTexturesByCategory(category: string): TextureInfo[] {
    return Array.from(this.textures.values()).filter(t => t.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(Array.from(this.textures.values()).map(t => t.category));
    return Array.from(categories);
  }

  // Generate a brush stamp from a texture with given settings
  generateBrushStamp(
    textureId: string,
    settings: BrushSettings
  ): HTMLCanvasElement | null {
    const texture = this.textures.get(textureId);
    if (!texture?.image || !texture.loaded) return null;

    const { size, opacity, softness, textureScale, rotation } = settings;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Calculate scaled texture size
    const scaledSize = size * (textureScale / 100);
    const halfSize = size / 2;

    // Save context and apply rotation
    ctx.save();
    ctx.translate(halfSize, halfSize);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-halfSize, -halfSize);

    // Create tiled pattern at the scaled size
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = size;
    patternCanvas.height = size;
    const patternCtx = patternCanvas.getContext('2d')!;

    // Draw tiled texture
    const tileSize = Math.max(1, scaledSize);
    for (let x = -tileSize; x < size + tileSize; x += tileSize) {
      for (let y = -tileSize; y < size + tileSize; y += tileSize) {
        patternCtx.drawImage(texture.image, x, y, tileSize, tileSize);
      }
    }

    ctx.drawImage(patternCanvas, 0, 0);
    ctx.restore();

    // Apply circular soft mask
    ctx.globalCompositeOperation = 'destination-in';
    const gradient = ctx.createRadialGradient(halfSize, halfSize, 0, halfSize, halfSize, halfSize);
    
    // Softness affects the falloff
    const innerRadius = 1 - (softness / 100);
    gradient.addColorStop(0, `rgba(255,255,255,${opacity / 100})`);
    gradient.addColorStop(Math.max(0, innerRadius * 0.8), `rgba(255,255,255,${opacity / 100})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return canvas;
  }

  // Fill entire canvas with a texture
  fillWithTexture(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    textureId: string,
    textureScale: number = 100
  ): void {
    const texture = this.textures.get(textureId);
    if (!texture?.image || !texture.loaded) return;

    const tileSize = (512 * textureScale) / 100;
    
    for (let x = 0; x < width; x += tileSize) {
      for (let y = 0; y < height; y += tileSize) {
        ctx.drawImage(texture.image, x, y, tileSize, tileSize);
      }
    }
  }

  // Generate preview thumbnail
  getPreviewCanvas(textureId: string, size: number = 64): HTMLCanvasElement | null {
    const texture = this.textures.get(textureId);
    if (!texture?.image || !texture.loaded) return null;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(texture.image, 0, 0, size, size);
    return canvas;
  }
}

export const textureManager = new TextureManager();
export default textureManager;
