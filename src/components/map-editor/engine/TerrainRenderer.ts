// Terrain Rendering Engine - GPU-accelerated terrain painting

import { 
  TerrainType, 
  TerrainStroke, 
  BrushSettings, 
  TERRAIN_CONFIGS,
  PathPoint 
} from '../types';

interface TextureCache {
  [key: string]: HTMLCanvasElement;
}

export class TerrainRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private textureCache: TextureCache = {};
  private noiseCanvas: HTMLCanvasElement;
  private noiseCtx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Main terrain canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    
    // Noise canvas for procedural details
    this.noiseCanvas = document.createElement('canvas');
    this.noiseCanvas.width = 512;
    this.noiseCanvas.height = 512;
    this.noiseCtx = this.noiseCanvas.getContext('2d')!;
    
    this.generateNoiseTexture();
    this.initializeTerrainTextures();
  }

  private generateNoiseTexture(): void {
    const imageData = this.noiseCtx.createImageData(512, 512);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }
    
    this.noiseCtx.putImageData(imageData, 0, 0);
  }

  private initializeTerrainTextures(): void {
    TERRAIN_CONFIGS.forEach(config => {
      this.textureCache[config.id] = this.generateTerrainTexture(config.id, config.baseColor);
    });
  }

  private generateTerrainTexture(type: TerrainType, baseColor: string): HTMLCanvasElement {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Parse base color
    const rgb = this.hexToRgb(baseColor);
    
    // Create rich procedural texture
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        
        // Multi-octave noise for natural look
        const noise1 = this.fbm(x / 32, y / 32, 4, 0.5, 2);
        const noise2 = this.fbm(x / 8 + 100, y / 8 + 100, 3, 0.6, 2);
        const noise3 = this.fbm(x / 64, y / 64, 2, 0.4, 2);
        
        // Combine noises based on terrain type
        let variation = 0;
        let colorShift = { r: 0, g: 0, b: 0 };
        
        switch (type) {
          case 'deepWater':
            variation = noise1 * 0.15 + noise3 * 0.1;
            colorShift = { r: 0, g: noise2 * 10, b: noise2 * 20 };
            break;
          case 'shallowWater':
            variation = noise1 * 0.2 + noise2 * 0.1;
            colorShift = { r: noise2 * 5, g: noise2 * 15, b: noise1 * 25 };
            break;
          case 'grass':
            variation = noise1 * 0.25 + noise2 * 0.15;
            colorShift = { r: -noise2 * 10, g: noise1 * 30 - 15, b: -noise1 * 15 };
            break;
          case 'forestFloor':
            variation = noise1 * 0.3 + noise2 * 0.2;
            colorShift = { r: noise2 * 15 - 5, g: noise1 * 25 - 10, b: -noise1 * 10 };
            break;
          case 'desert':
            variation = noise1 * 0.2 + noise3 * 0.15;
            colorShift = { r: noise1 * 20, g: noise2 * 15 - 5, b: -noise1 * 10 };
            break;
          case 'rock':
            variation = noise1 * 0.35 + noise2 * 0.25;
            colorShift = { r: noise2 * 20 - 10, g: noise2 * 20 - 10, b: noise2 * 25 - 12 };
            break;
          case 'snow':
            variation = noise1 * 0.08 + noise2 * 0.05;
            colorShift = { r: -noise1 * 5, g: -noise1 * 5, b: noise2 * 10 };
            break;
          case 'swamp':
            variation = noise1 * 0.25 + noise2 * 0.2;
            colorShift = { r: -noise2 * 10, g: noise1 * 20 - 5, b: -noise1 * 15 };
            break;
          case 'volcanic':
            variation = noise1 * 0.3 + noise2 * 0.25;
            colorShift = { r: noise1 * 40, g: noise2 * 15, b: 0 };
            break;
          default:
            variation = noise1 * 0.2;
        }
        
        // Apply variation and color shift
        const brightness = 1 + (variation - 0.15);
        data[i] = Math.max(0, Math.min(255, rgb.r * brightness + colorShift.r));
        data[i + 1] = Math.max(0, Math.min(255, rgb.g * brightness + colorShift.g));
        data[i + 2] = Math.max(0, Math.min(255, rgb.b * brightness + colorShift.b));
        data[i + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  // Fractional Brownian Motion for natural-looking noise
  private fbm(x: number, y: number, octaves: number, persistence: number, lacunarity: number): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += this.perlin(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    
    return (value / maxValue + 1) / 2; // Normalize to 0-1
  }

  // Simple Perlin-like noise
  private perlin(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    
    const u = this.fade(xf);
    const v = this.fade(yf);
    
    const aa = this.hash(xi, yi);
    const ab = this.hash(xi, yi + 1);
    const ba = this.hash(xi + 1, yi);
    const bb = this.hash(xi + 1, yi + 1);
    
    const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);
    
    return this.lerp(x1, x2, v);
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private hash(x: number, y: number): number {
    return ((x * 374761393 + y * 668265263) ^ (x * 1274126177)) & 255;
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  public clear(backgroundColor: string): void {
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public renderStroke(stroke: TerrainStroke): void {
    const texture = this.textureCache[stroke.terrain];
    if (!texture || stroke.points.length === 0) return;

    const { size, opacity, hardness, spacing, jitter, randomRotation } = stroke.brushSettings;
    
    // Create brush stamp with soft falloff
    const brushCanvas = this.createBrushStamp(size, hardness, texture);
    
    // Interpolate points for smooth strokes
    const interpolatedPoints = this.interpolatePoints(stroke.points, size * spacing);
    
    this.ctx.globalAlpha = opacity;
    this.ctx.globalCompositeOperation = 'source-over';
    
    interpolatedPoints.forEach((point, index) => {
      const jitterX = (Math.random() - 0.5) * size * jitter;
      const jitterY = (Math.random() - 0.5) * size * jitter;
      const x = point.x + jitterX - size / 2;
      const y = point.y + jitterY - size / 2;
      
      if (randomRotation && index % 3 === 0) {
        this.ctx.save();
        this.ctx.translate(point.x, point.y);
        this.ctx.rotate(Math.random() * Math.PI * 2);
        this.ctx.drawImage(brushCanvas, -size / 2, -size / 2);
        this.ctx.restore();
      } else {
        this.ctx.drawImage(brushCanvas, x, y);
      }
    });
    
    this.ctx.globalAlpha = 1;
  }

  public eraseStroke(stroke: TerrainStroke, backgroundColor: string): void {
    const { size, opacity, hardness, spacing, jitter } = stroke.brushSettings;
    
    const interpolatedPoints = this.interpolatePoints(stroke.points, size * spacing);
    
    this.ctx.globalAlpha = opacity;
    this.ctx.globalCompositeOperation = 'destination-out';
    
    interpolatedPoints.forEach(point => {
      const jitterX = (Math.random() - 0.5) * size * jitter;
      const jitterY = (Math.random() - 0.5) * size * jitter;
      
      // Radial gradient for soft eraser
      const gradient = this.ctx.createRadialGradient(
        point.x + jitterX, point.y + jitterY, 0,
        point.x + jitterX, point.y + jitterY, size / 2
      );
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(hardness, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(point.x + jitterX, point.y + jitterY, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = 'source-over';
  }

  private createBrushStamp(size: number, hardness: number, texture: HTMLCanvasElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Draw texture pattern
    const pattern = ctx.createPattern(texture, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, size, size);
    }
    
    // Apply circular mask with falloff
    ctx.globalCompositeOperation = 'destination-in';
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(hardness * 0.8, 'rgba(0,0,0,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    return canvas;
  }

  private interpolatePoints(points: PathPoint[], minDistance: number): PathPoint[] {
    if (points.length < 2) return points;
    
    const result: PathPoint[] = [points[0]];
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > minDistance) {
        const steps = Math.ceil(distance / minDistance);
        for (let j = 1; j <= steps; j++) {
          result.push({
            x: prev.x + (dx * j) / steps,
            y: prev.y + (dy * j) / steps
          });
        }
      } else {
        result.push(curr);
      }
    }
    
    return result;
  }

  public fillTerrain(terrain: TerrainType): void {
    const texture = this.textureCache[terrain];
    if (!texture) return;
    
    const pattern = this.ctx.createPattern(texture, 'repeat');
    if (pattern) {
      this.ctx.fillStyle = pattern;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getImageData(): ImageData {
    return this.ctx.getImageData(0, 0, this.width, this.height);
  }

  public resize(width: number, height: number): void {
    // Save current content
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Restore content
    this.ctx.putImageData(imageData, 0, 0);
  }

  public getTerrainTexture(terrain: TerrainType): HTMLCanvasElement | null {
    return this.textureCache[terrain] || null;
  }
}
