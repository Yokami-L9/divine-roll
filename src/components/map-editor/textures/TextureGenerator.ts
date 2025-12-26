import { PerlinNoise } from './PerlinNoise';

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface TextureConfig {
  baseColor: Color;
  secondaryColor?: Color;
  tertiaryColor?: Color;
  noiseScale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  contrast: number;
  brightness: number;
}

export type TerrainType = 
  | 'grass' 
  | 'forest' 
  | 'mountain' 
  | 'water' 
  | 'sand' 
  | 'snow' 
  | 'swamp' 
  | 'volcanic' 
  | 'dirt' 
  | 'stone'
  | 'deepWater'
  | 'shallowWater'
  | 'denseForest'
  | 'plains'
  | 'tundra'
  | 'desert'
  | 'jungle'
  | 'savanna'
  | 'farmland'
  | 'road';

export const TERRAIN_CONFIGS: Record<TerrainType, TextureConfig> = {
  grass: {
    baseColor: { r: 76, g: 135, b: 60 },
    secondaryColor: { r: 95, g: 160, b: 75 },
    tertiaryColor: { r: 55, g: 110, b: 45 },
    noiseScale: 0.05,
    octaves: 6,
    persistence: 0.6,
    lacunarity: 2.2,
    contrast: 1.2,
    brightness: 1.0
  },
  forest: {
    baseColor: { r: 34, g: 85, b: 45 },
    secondaryColor: { r: 25, g: 65, b: 35 },
    tertiaryColor: { r: 45, g: 100, b: 55 },
    noiseScale: 0.08,
    octaves: 7,
    persistence: 0.55,
    lacunarity: 2.0,
    contrast: 1.4,
    brightness: 0.85
  },
  denseForest: {
    baseColor: { r: 20, g: 55, b: 30 },
    secondaryColor: { r: 15, g: 40, b: 22 },
    tertiaryColor: { r: 30, g: 70, b: 40 },
    noiseScale: 0.1,
    octaves: 8,
    persistence: 0.5,
    lacunarity: 2.1,
    contrast: 1.5,
    brightness: 0.75
  },
  mountain: {
    baseColor: { r: 95, g: 85, b: 75 },
    secondaryColor: { r: 120, g: 110, b: 100 },
    tertiaryColor: { r: 70, g: 65, b: 58 },
    noiseScale: 0.04,
    octaves: 8,
    persistence: 0.65,
    lacunarity: 2.3,
    contrast: 1.6,
    brightness: 1.0
  },
  water: {
    baseColor: { r: 35, g: 100, b: 150 },
    secondaryColor: { r: 45, g: 120, b: 170 },
    tertiaryColor: { r: 25, g: 80, b: 130 },
    noiseScale: 0.03,
    octaves: 5,
    persistence: 0.4,
    lacunarity: 2.0,
    contrast: 1.1,
    brightness: 1.1
  },
  deepWater: {
    baseColor: { r: 15, g: 50, b: 100 },
    secondaryColor: { r: 20, g: 65, b: 120 },
    tertiaryColor: { r: 10, g: 35, b: 80 },
    noiseScale: 0.025,
    octaves: 4,
    persistence: 0.35,
    lacunarity: 2.0,
    contrast: 1.0,
    brightness: 0.9
  },
  shallowWater: {
    baseColor: { r: 65, g: 150, b: 180 },
    secondaryColor: { r: 80, g: 170, b: 200 },
    tertiaryColor: { r: 50, g: 130, b: 160 },
    noiseScale: 0.04,
    octaves: 5,
    persistence: 0.45,
    lacunarity: 2.0,
    contrast: 1.15,
    brightness: 1.2
  },
  sand: {
    baseColor: { r: 210, g: 185, b: 140 },
    secondaryColor: { r: 230, g: 205, b: 160 },
    tertiaryColor: { r: 190, g: 165, b: 120 },
    noiseScale: 0.06,
    octaves: 5,
    persistence: 0.5,
    lacunarity: 2.1,
    contrast: 1.15,
    brightness: 1.1
  },
  desert: {
    baseColor: { r: 220, g: 180, b: 120 },
    secondaryColor: { r: 240, g: 200, b: 140 },
    tertiaryColor: { r: 200, g: 160, b: 100 },
    noiseScale: 0.035,
    octaves: 6,
    persistence: 0.55,
    lacunarity: 2.2,
    contrast: 1.2,
    brightness: 1.15
  },
  snow: {
    baseColor: { r: 240, g: 245, b: 250 },
    secondaryColor: { r: 250, g: 252, b: 255 },
    tertiaryColor: { r: 220, g: 230, b: 240 },
    noiseScale: 0.04,
    octaves: 5,
    persistence: 0.4,
    lacunarity: 2.0,
    contrast: 1.05,
    brightness: 1.15
  },
  tundra: {
    baseColor: { r: 170, g: 180, b: 175 },
    secondaryColor: { r: 190, g: 200, b: 195 },
    tertiaryColor: { r: 150, g: 160, b: 155 },
    noiseScale: 0.05,
    octaves: 6,
    persistence: 0.5,
    lacunarity: 2.1,
    contrast: 1.1,
    brightness: 1.0
  },
  swamp: {
    baseColor: { r: 55, g: 75, b: 50 },
    secondaryColor: { r: 45, g: 65, b: 55 },
    tertiaryColor: { r: 65, g: 85, b: 60 },
    noiseScale: 0.07,
    octaves: 7,
    persistence: 0.6,
    lacunarity: 2.0,
    contrast: 1.3,
    brightness: 0.85
  },
  volcanic: {
    baseColor: { r: 45, g: 35, b: 30 },
    secondaryColor: { r: 60, g: 45, b: 35 },
    tertiaryColor: { r: 30, g: 25, b: 20 },
    noiseScale: 0.05,
    octaves: 6,
    persistence: 0.55,
    lacunarity: 2.2,
    contrast: 1.4,
    brightness: 0.8
  },
  dirt: {
    baseColor: { r: 120, g: 90, b: 60 },
    secondaryColor: { r: 140, g: 105, b: 70 },
    tertiaryColor: { r: 100, g: 75, b: 50 },
    noiseScale: 0.06,
    octaves: 6,
    persistence: 0.55,
    lacunarity: 2.1,
    contrast: 1.25,
    brightness: 0.95
  },
  stone: {
    baseColor: { r: 110, g: 105, b: 100 },
    secondaryColor: { r: 130, g: 125, b: 120 },
    tertiaryColor: { r: 90, g: 85, b: 80 },
    noiseScale: 0.045,
    octaves: 7,
    persistence: 0.6,
    lacunarity: 2.2,
    contrast: 1.35,
    brightness: 0.95
  },
  plains: {
    baseColor: { r: 140, g: 165, b: 90 },
    secondaryColor: { r: 160, g: 185, b: 105 },
    tertiaryColor: { r: 120, g: 145, b: 75 },
    noiseScale: 0.04,
    octaves: 5,
    persistence: 0.5,
    lacunarity: 2.0,
    contrast: 1.1,
    brightness: 1.05
  },
  jungle: {
    baseColor: { r: 30, g: 90, b: 35 },
    secondaryColor: { r: 25, g: 75, b: 30 },
    tertiaryColor: { r: 40, g: 105, b: 45 },
    noiseScale: 0.09,
    octaves: 8,
    persistence: 0.6,
    lacunarity: 2.1,
    contrast: 1.5,
    brightness: 0.8
  },
  savanna: {
    baseColor: { r: 180, g: 160, b: 90 },
    secondaryColor: { r: 200, g: 180, b: 105 },
    tertiaryColor: { r: 160, g: 140, b: 75 },
    noiseScale: 0.045,
    octaves: 5,
    persistence: 0.5,
    lacunarity: 2.0,
    contrast: 1.15,
    brightness: 1.1
  },
  farmland: {
    baseColor: { r: 130, g: 100, b: 60 },
    secondaryColor: { r: 110, g: 140, b: 70 },
    tertiaryColor: { r: 150, g: 115, b: 75 },
    noiseScale: 0.02,
    octaves: 4,
    persistence: 0.45,
    lacunarity: 2.0,
    contrast: 1.2,
    brightness: 1.0
  },
  road: {
    baseColor: { r: 95, g: 80, b: 65 },
    secondaryColor: { r: 110, g: 95, b: 80 },
    tertiaryColor: { r: 80, g: 65, b: 50 },
    noiseScale: 0.03,
    octaves: 4,
    persistence: 0.4,
    lacunarity: 2.0,
    contrast: 1.1,
    brightness: 0.95
  }
};

export class TextureGenerator {
  private perlin: PerlinNoise;
  private cache: Map<string, HTMLCanvasElement> = new Map();

  constructor(seed: number = Math.random()) {
    this.perlin = new PerlinNoise(seed);
  }

  private lerpColor(c1: Color, c2: Color, t: number): Color {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t),
      a: c1.a !== undefined && c2.a !== undefined ? c1.a + (c2.a - c1.a) * t : 1
    };
  }

  generateTerrainTexture(
    type: TerrainType,
    width: number,
    height: number,
    offsetX: number = 0,
    offsetY: number = 0
  ): HTMLCanvasElement {
    const cacheKey = `${type}_${width}_${height}_${offsetX}_${offsetY}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const config = TERRAIN_CONFIGS[type];
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = (x + offsetX) * config.noiseScale;
        const ny = (y + offsetY) * config.noiseScale;

        // Multi-layer noise
        let noise1 = this.perlin.fbm(nx, ny, config.octaves, config.lacunarity, config.persistence);
        let noise2 = this.perlin.fbm(nx * 2.1, ny * 2.1, 4, 2.0, 0.5);
        let noise3 = this.perlin.turbulence(nx * 0.5, ny * 0.5, 3);

        // Combine noise layers
        let combined = (noise1 * 0.6 + noise2 * 0.25 + noise3 * 0.15);
        
        // Apply contrast and brightness
        combined = (combined - 0.5) * config.contrast + 0.5;
        combined = combined * config.brightness;
        combined = Math.max(0, Math.min(1, combined));

        // Color mixing based on noise value
        let color: Color;
        if (config.tertiaryColor && config.secondaryColor) {
          if (combined < 0.4) {
            color = this.lerpColor(config.tertiaryColor, config.baseColor, combined / 0.4);
          } else if (combined < 0.7) {
            color = this.lerpColor(config.baseColor, config.secondaryColor, (combined - 0.4) / 0.3);
          } else {
            color = this.lerpColor(config.secondaryColor, config.tertiaryColor, (combined - 0.7) / 0.3);
          }
        } else if (config.secondaryColor) {
          color = this.lerpColor(config.baseColor, config.secondaryColor, combined);
        } else {
          color = config.baseColor;
        }

        // Add micro-detail variation
        const microNoise = this.perlin.noise2D(x * 0.5, y * 0.5) * 0.08;
        color.r = Math.max(0, Math.min(255, color.r + microNoise * 255));
        color.g = Math.max(0, Math.min(255, color.g + microNoise * 255));
        color.b = Math.max(0, Math.min(255, color.b + microNoise * 255));

        const idx = (y * width + x) * 4;
        data[idx] = color.r;
        data[idx + 1] = color.g;
        data[idx + 2] = color.b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    
    // Add detail overlays based on terrain type
    this.addTerrainDetails(ctx, type, width, height, offsetX, offsetY);
    
    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, canvas);
    
    return canvas;
  }

  private addTerrainDetails(
    ctx: CanvasRenderingContext2D,
    type: TerrainType,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number
  ): void {
    switch (type) {
      case 'grass':
      case 'plains':
        this.addGrassBlades(ctx, width, height, offsetX, offsetY);
        break;
      case 'forest':
      case 'denseForest':
      case 'jungle':
        this.addTreeShadows(ctx, width, height, offsetX, offsetY, type === 'denseForest' || type === 'jungle');
        break;
      case 'water':
      case 'shallowWater':
      case 'deepWater':
        this.addWaterRipples(ctx, width, height, offsetX, offsetY);
        break;
      case 'mountain':
      case 'stone':
        this.addRockCracks(ctx, width, height, offsetX, offsetY);
        break;
      case 'sand':
      case 'desert':
        this.addSandDunes(ctx, width, height, offsetX, offsetY);
        break;
      case 'snow':
      case 'tundra':
        this.addSnowSparkles(ctx, width, height, offsetX, offsetY);
        break;
      case 'swamp':
        this.addSwampDetails(ctx, width, height, offsetX, offsetY);
        break;
      case 'farmland':
        this.addFarmRows(ctx, width, height, offsetX, offsetY);
        break;
    }
  }

  private addGrassBlades(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number): void {
    ctx.save();
    ctx.globalAlpha = 0.3;
    
    for (let i = 0; i < w * h / 100; i++) {
      const noise = this.perlin.noise2D((ox + i) * 0.1, (oy + i) * 0.1);
      const x = ((noise + 1) / 2) * w;
      const y = ((this.perlin.noise2D((ox + i) * 0.15, (oy + i) * 0.15) + 1) / 2) * h;
      
      ctx.strokeStyle = `rgba(${40 + noise * 20}, ${80 + noise * 30}, ${30 + noise * 15}, 0.4)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + noise * 3, y - 4 - Math.abs(noise) * 3);
      ctx.stroke();
    }
    ctx.restore();
  }

  private addTreeShadows(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number, dense: boolean): void {
    ctx.save();
    const count = dense ? w * h / 200 : w * h / 400;
    
    for (let i = 0; i < count; i++) {
      const noise1 = this.perlin.noise2D((ox + i) * 0.05, (oy + i) * 0.05);
      const noise2 = this.perlin.noise2D((ox + i) * 0.07, (oy + i) * 0.07);
      const x = ((noise1 + 1) / 2) * w;
      const y = ((noise2 + 1) / 2) * h;
      const size = 3 + Math.abs(noise1) * 8;
      
      ctx.fillStyle = `rgba(0, ${20 + noise1 * 10}, 0, ${0.15 + Math.abs(noise2) * 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private addWaterRipples(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number): void {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < w * h / 500; i++) {
      const noise = this.perlin.noise2D((ox + i) * 0.03, (oy + i) * 0.03);
      const x = ((noise + 1) / 2) * w;
      const y = ((this.perlin.noise2D((ox + i) * 0.04, (oy + i) * 0.04) + 1) / 2) * h;
      
      ctx.beginPath();
      ctx.ellipse(x, y, 8 + noise * 5, 2 + Math.abs(noise), noise * Math.PI, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  private addRockCracks(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number): void {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = 'rgba(30, 25, 20, 0.4)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < w * h / 800; i++) {
      const startNoise = this.perlin.noise2D((ox + i) * 0.02, (oy + i) * 0.02);
      const x = ((startNoise + 1) / 2) * w;
      const y = ((this.perlin.noise2D((ox + i) * 0.025, (oy + i) * 0.025) + 1) / 2) * h;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      let px = x, py = y;
      for (let j = 0; j < 3 + Math.abs(startNoise) * 4; j++) {
        const angle = this.perlin.noise2D(px * 0.1, py * 0.1) * Math.PI;
        px += Math.cos(angle) * (3 + Math.random() * 3);
        py += Math.sin(angle) * (3 + Math.random() * 3);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  private addSandDunes(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number): void {
    ctx.save();
    ctx.globalAlpha = 0.12;
    
    for (let i = 0; i < w * h / 600; i++) {
      const noise = this.perlin.noise2D((ox + i) * 0.015, (oy + i) * 0.015);
      const x = ((noise + 1) / 2) * w;
      const y = ((this.perlin.noise2D((ox + i) * 0.02, (oy + i) * 0.02) + 1) / 2) * h;
      
      ctx.strokeStyle = noise > 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(150, 120, 80, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.quadraticCurveTo(x, y - 3 * noise, x + 10, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  private addSnowSparkles(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number): void {
    ctx.save();
    
    for (let i = 0; i < w * h / 200; i++) {
      const noise = this.perlin.noise2D((ox + i) * 0.08, (oy + i) * 0.08);
      if (noise > 0.3) {
        const x = ((noise + 1) / 2) * w;
        const y = ((this.perlin.noise2D((ox + i) * 0.09, (oy + i) * 0.09) + 1) / 2) * h;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + noise * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + noise, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private addSwampDetails(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number): void {
    ctx.save();
    
    // Water patches
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < w * h / 400; i++) {
      const noise = this.perlin.noise2D((ox + i) * 0.04, (oy + i) * 0.04);
      if (noise > 0.2) {
        const x = ((noise + 1) / 2) * w;
        const y = ((this.perlin.noise2D((ox + i) * 0.05, (oy + i) * 0.05) + 1) / 2) * h;
        
        ctx.fillStyle = 'rgba(30, 60, 50, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y, 5 + noise * 8, 3 + noise * 5, noise * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private addFarmRows(ctx: CanvasRenderingContext2D, w: number, h: number, ox: number, oy: number): void {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = 'rgba(80, 60, 40, 0.3)';
    ctx.lineWidth = 1;
    
    const rowSpacing = 8;
    for (let y = 0; y < h; y += rowSpacing) {
      const noise = this.perlin.noise2D(ox * 0.01, (oy + y) * 0.01);
      ctx.beginPath();
      ctx.moveTo(0, y + noise * 2);
      ctx.lineTo(w, y + noise * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  generateBrushPattern(type: TerrainType, size: number): HTMLCanvasElement {
    const texture = this.generateTerrainTexture(type, size, size);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Create circular mask with soft edges
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.6, 'white');
    gradient.addColorStop(0.85, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(texture, 0, 0);
    
    return canvas;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const textureGenerator = new TextureGenerator();
