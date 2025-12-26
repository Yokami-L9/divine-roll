import { PerlinNoise } from './PerlinNoise';

export type TerrainType = 
  | 'grass' | 'tallGrass' | 'meadow'
  | 'forest' | 'denseForest' | 'pineForest' | 'jungle'
  | 'water' | 'deepWater' | 'river' | 'swamp'
  | 'mountain' | 'hills' | 'cliffs' | 'volcanic'
  | 'sand' | 'desert' | 'dunes'
  | 'snow' | 'ice' | 'tundra'
  | 'dirt' | 'mud' | 'farmland'
  | 'stone' | 'cobblestone' | 'ruins'
  | 'road' | 'path';

interface TerrainStyle {
  baseColor: string;
  secondaryColor: string;
  highlightColor: string;
  shadowColor: string;
  patternDensity: number;
}

const TERRAIN_STYLES: Record<TerrainType, TerrainStyle> = {
  // Grass variants
  grass: {
    baseColor: '#4a7c3f',
    secondaryColor: '#5d9a4a',
    highlightColor: '#7bc06a',
    shadowColor: '#355c2d',
    patternDensity: 0.8
  },
  tallGrass: {
    baseColor: '#557a3e',
    secondaryColor: '#6b9b50',
    highlightColor: '#8bc070',
    shadowColor: '#3d5a2a',
    patternDensity: 1.0
  },
  meadow: {
    baseColor: '#6b9b50',
    secondaryColor: '#7db85e',
    highlightColor: '#a5d88a',
    shadowColor: '#4a7a3a',
    patternDensity: 0.6
  },
  
  // Forest variants
  forest: {
    baseColor: '#2d5a2d',
    secondaryColor: '#3a7a3a',
    highlightColor: '#4a9a4a',
    shadowColor: '#1a3a1a',
    patternDensity: 0.9
  },
  denseForest: {
    baseColor: '#1a4020',
    secondaryColor: '#2a5a30',
    highlightColor: '#3a7a40',
    shadowColor: '#0a2010',
    patternDensity: 1.0
  },
  pineForest: {
    baseColor: '#1f4a30',
    secondaryColor: '#2a6040',
    highlightColor: '#3a7a50',
    shadowColor: '#0f3020',
    patternDensity: 0.85
  },
  jungle: {
    baseColor: '#1a5528',
    secondaryColor: '#2a7038',
    highlightColor: '#3a9048',
    shadowColor: '#0a3518',
    patternDensity: 1.0
  },
  
  // Water variants
  water: {
    baseColor: '#2a6090',
    secondaryColor: '#3a80b0',
    highlightColor: '#5aa0d0',
    shadowColor: '#1a4070',
    patternDensity: 0.5
  },
  deepWater: {
    baseColor: '#1a4070',
    secondaryColor: '#2a5090',
    highlightColor: '#3a70b0',
    shadowColor: '#0a2050',
    patternDensity: 0.3
  },
  river: {
    baseColor: '#3580a8',
    secondaryColor: '#45a0c8',
    highlightColor: '#65c0e8',
    shadowColor: '#256088',
    patternDensity: 0.6
  },
  swamp: {
    baseColor: '#3a5040',
    secondaryColor: '#4a6550',
    highlightColor: '#5a7a60',
    shadowColor: '#2a3a30',
    patternDensity: 0.7
  },
  
  // Mountain variants
  mountain: {
    baseColor: '#6a6560',
    secondaryColor: '#8a8580',
    highlightColor: '#aaa5a0',
    shadowColor: '#4a4540',
    patternDensity: 0.7
  },
  hills: {
    baseColor: '#5a7550',
    secondaryColor: '#6a8a60',
    highlightColor: '#8aaa80',
    shadowColor: '#4a5a40',
    patternDensity: 0.5
  },
  cliffs: {
    baseColor: '#5a5550',
    secondaryColor: '#7a7570',
    highlightColor: '#9a9590',
    shadowColor: '#3a3530',
    patternDensity: 0.9
  },
  volcanic: {
    baseColor: '#2a2020',
    secondaryColor: '#4a3030',
    highlightColor: '#8a4040',
    shadowColor: '#1a1010',
    patternDensity: 0.8
  },
  
  // Sand variants
  sand: {
    baseColor: '#d4b896',
    secondaryColor: '#e4c8a6',
    highlightColor: '#f4d8b6',
    shadowColor: '#b49876',
    patternDensity: 0.4
  },
  desert: {
    baseColor: '#cca870',
    secondaryColor: '#dcb880',
    highlightColor: '#ecc890',
    shadowColor: '#ac8850',
    patternDensity: 0.5
  },
  dunes: {
    baseColor: '#d8b888',
    secondaryColor: '#e8c898',
    highlightColor: '#f8d8a8',
    shadowColor: '#b89868',
    patternDensity: 0.6
  },
  
  // Cold variants
  snow: {
    baseColor: '#e8f0f8',
    secondaryColor: '#f0f8ff',
    highlightColor: '#ffffff',
    shadowColor: '#c8d8e8',
    patternDensity: 0.3
  },
  ice: {
    baseColor: '#b8d8f0',
    secondaryColor: '#c8e8ff',
    highlightColor: '#e0f0ff',
    shadowColor: '#90b8d8',
    patternDensity: 0.4
  },
  tundra: {
    baseColor: '#8a9a88',
    secondaryColor: '#9aaa98',
    highlightColor: '#bacab8',
    shadowColor: '#6a7a68',
    patternDensity: 0.5
  },
  
  // Dirt variants
  dirt: {
    baseColor: '#7a6050',
    secondaryColor: '#9a7060',
    highlightColor: '#ba8070',
    shadowColor: '#5a4030',
    patternDensity: 0.6
  },
  mud: {
    baseColor: '#5a4a3a',
    secondaryColor: '#6a5a4a',
    highlightColor: '#8a7a6a',
    shadowColor: '#3a2a1a',
    patternDensity: 0.7
  },
  farmland: {
    baseColor: '#6a5a40',
    secondaryColor: '#8a7a50',
    highlightColor: '#7a9a50',
    shadowColor: '#4a3a20',
    patternDensity: 0.5
  },
  
  // Stone variants
  stone: {
    baseColor: '#6a6a6a',
    secondaryColor: '#8a8a8a',
    highlightColor: '#aaaaaa',
    shadowColor: '#4a4a4a',
    patternDensity: 0.7
  },
  cobblestone: {
    baseColor: '#5a5a5a',
    secondaryColor: '#7a7a7a',
    highlightColor: '#9a9a9a',
    shadowColor: '#3a3a3a',
    patternDensity: 0.9
  },
  ruins: {
    baseColor: '#7a7570',
    secondaryColor: '#9a9590',
    highlightColor: '#bab5b0',
    shadowColor: '#5a5550',
    patternDensity: 0.8
  },
  
  // Road variants
  road: {
    baseColor: '#6a6050',
    secondaryColor: '#8a7060',
    highlightColor: '#aa8070',
    shadowColor: '#4a4030',
    patternDensity: 0.4
  },
  path: {
    baseColor: '#8a7860',
    secondaryColor: '#aa9870',
    highlightColor: '#cab880',
    shadowColor: '#6a5840',
    patternDensity: 0.3
  }
};

export class PatternGenerator {
  private perlin: PerlinNoise;
  private cache: Map<string, HTMLCanvasElement> = new Map();

  constructor(seed: number = Math.random() * 10000) {
    this.perlin = new PerlinNoise(seed);
  }

  generatePattern(terrain: TerrainType, size: number): HTMLCanvasElement {
    const cacheKey = `${terrain}_${size}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Draw base layer
    const style = TERRAIN_STYLES[terrain];
    this.drawBaseLayer(ctx, size, style);

    // Draw terrain-specific patterns
    switch (terrain) {
      case 'grass':
      case 'tallGrass':
      case 'meadow':
        this.drawGrassPattern(ctx, size, terrain);
        break;
      case 'forest':
      case 'denseForest':
      case 'pineForest':
      case 'jungle':
        this.drawForestPattern(ctx, size, terrain);
        break;
      case 'water':
      case 'deepWater':
      case 'river':
        this.drawWaterPattern(ctx, size, terrain);
        break;
      case 'swamp':
        this.drawSwampPattern(ctx, size);
        break;
      case 'mountain':
      case 'hills':
      case 'cliffs':
        this.drawMountainPattern(ctx, size, terrain);
        break;
      case 'volcanic':
        this.drawVolcanicPattern(ctx, size);
        break;
      case 'sand':
      case 'desert':
      case 'dunes':
        this.drawSandPattern(ctx, size, terrain);
        break;
      case 'snow':
      case 'ice':
      case 'tundra':
        this.drawSnowPattern(ctx, size, terrain);
        break;
      case 'dirt':
      case 'mud':
        this.drawDirtPattern(ctx, size, terrain);
        break;
      case 'farmland':
        this.drawFarmlandPattern(ctx, size);
        break;
      case 'stone':
      case 'cobblestone':
      case 'ruins':
        this.drawStonePattern(ctx, size, terrain);
        break;
      case 'road':
      case 'path':
        this.drawRoadPattern(ctx, size, terrain);
        break;
    }

    // Limit cache
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, canvas);
    
    return canvas;
  }

  private drawBaseLayer(ctx: CanvasRenderingContext2D, size: number, style: TerrainStyle): void {
    // Create textured base with noise
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    const base = this.hexToRgb(style.baseColor);
    const secondary = this.hexToRgb(style.secondaryColor);
    const shadow = this.hexToRgb(style.shadowColor);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const noise1 = this.perlin.fbm(x * 0.02, y * 0.02, 4, 2.0, 0.5);
        const noise2 = this.perlin.noise2D(x * 0.1, y * 0.1) * 0.3;
        const combined = (noise1 + 1) / 2 + noise2;
        
        let color;
        if (combined < 0.4) {
          color = this.lerpColor(shadow, base, combined / 0.4);
        } else if (combined < 0.7) {
          color = this.lerpColor(base, secondary, (combined - 0.4) / 0.3);
        } else {
          color = this.lerpColor(secondary, base, (combined - 0.7) / 0.3);
        }

        const idx = (y * size + x) * 4;
        data[idx] = color.r;
        data[idx + 1] = color.g;
        data[idx + 2] = color.b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  private drawGrassPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'grass' | 'tallGrass' | 'meadow'): void {
    const style = TERRAIN_STYLES[variant];
    const bladeCount = Math.floor(size * size * style.patternDensity / 20);
    const maxHeight = variant === 'tallGrass' ? 12 : variant === 'meadow' ? 6 : 8;
    
    ctx.lineCap = 'round';

    // Draw grass blades in clusters
    for (let i = 0; i < bladeCount; i++) {
      const noise = this.perlin.noise2D(i * 0.1, i * 0.15);
      const x = (Math.abs(this.perlin.noise2D(i * 0.05, 0)) * size) % size;
      const y = (Math.abs(this.perlin.noise2D(0, i * 0.05)) * size) % size;
      
      const height = maxHeight * (0.5 + Math.abs(noise) * 0.5);
      const bend = noise * 4;
      const width = 1 + Math.random() * 0.5;
      
      // Blade color variation
      const colorShift = Math.random();
      if (colorShift < 0.3) {
        ctx.strokeStyle = style.shadowColor;
      } else if (colorShift < 0.7) {
        ctx.strokeStyle = style.secondaryColor;
      } else {
        ctx.strokeStyle = style.highlightColor;
      }
      
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + bend * 0.5, y - height * 0.6, x + bend, y - height);
      ctx.stroke();
    }

    // Add small flower dots for meadow
    if (variant === 'meadow') {
      const flowerColors = ['#ffeb3b', '#ff9800', '#e91e63', '#9c27b0', '#ffffff'];
      for (let i = 0; i < bladeCount / 10; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + Math.random(), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawForestPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'forest' | 'denseForest' | 'pineForest' | 'jungle'): void {
    const style = TERRAIN_STYLES[variant];
    const treeCount = Math.floor(size * style.patternDensity / 4);
    
    // Draw tree canopies from above
    for (let i = 0; i < treeCount; i++) {
      const noise = this.perlin.noise2D(i * 0.2, i * 0.3);
      const x = (Math.abs(this.perlin.noise2D(i * 0.08, 0.5)) * size * 1.5) % size;
      const y = (Math.abs(this.perlin.noise2D(0.5, i * 0.08)) * size * 1.5) % size;
      
      const treeSize = 8 + Math.abs(noise) * 12;
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x + 2, y + 2, treeSize * 0.9, treeSize * 0.7, noise * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Tree crown base
      ctx.fillStyle = style.shadowColor;
      ctx.beginPath();
      if (variant === 'pineForest') {
        // Pointed pine shape
        this.drawPineCanopy(ctx, x, y, treeSize);
      } else {
        ctx.ellipse(x, y, treeSize, treeSize * 0.8, noise * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Inner canopy layers
      const layers = variant === 'jungle' ? 4 : 3;
      for (let j = 0; j < layers; j++) {
        const layerSize = treeSize * (0.9 - j * 0.15);
        const offsetX = (Math.random() - 0.5) * 3;
        const offsetY = (Math.random() - 0.5) * 3;
        
        if (j === layers - 1) {
          ctx.fillStyle = style.highlightColor;
        } else if (j === 0) {
          ctx.fillStyle = style.baseColor;
        } else {
          ctx.fillStyle = style.secondaryColor;
        }
        
        ctx.beginPath();
        if (variant === 'pineForest') {
          this.drawPineCanopy(ctx, x + offsetX, y + offsetY, layerSize);
        } else {
          ctx.ellipse(x + offsetX, y + offsetY, layerSize, layerSize * 0.75, noise * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Add texture dots
      for (let k = 0; k < 5; k++) {
        const dotX = x + (Math.random() - 0.5) * treeSize * 1.5;
        const dotY = y + (Math.random() - 0.5) * treeSize * 1.2;
        ctx.fillStyle = Math.random() > 0.5 ? style.shadowColor : style.highlightColor;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  private drawPineCanopy(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.8, y + size * 0.5);
    ctx.lineTo(x - size * 0.8, y + size * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  private drawWaterPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'water' | 'deepWater' | 'river'): void {
    const style = TERRAIN_STYLES[variant];
    
    // Wave lines
    ctx.strokeStyle = style.highlightColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    
    const waveSpacing = variant === 'deepWater' ? 12 : 8;
    
    for (let y = 0; y < size; y += waveSpacing) {
      const noise = this.perlin.noise2D(0, y * 0.05);
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x < size; x += 4) {
        const waveY = y + Math.sin(x * 0.1 + noise * 10) * 2;
        ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    }
    
    // Sparkle highlights
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = style.highlightColor;
    
    const sparkleCount = Math.floor(size * style.patternDensity / 5);
    for (let i = 0; i < sparkleCount; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const sparkleSize = 1 + Math.random() * 2;
      
      ctx.beginPath();
      ctx.ellipse(x, y, sparkleSize * 2, sparkleSize * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }

  private drawSwampPattern(ctx: CanvasRenderingContext2D, size: number): void {
    const style = TERRAIN_STYLES.swamp;
    
    // Water patches
    ctx.fillStyle = 'rgba(40, 70, 60, 0.4)';
    for (let i = 0; i < size / 8; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const patchSize = 5 + Math.random() * 15;
      
      ctx.beginPath();
      ctx.ellipse(x, y, patchSize, patchSize * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Reeds and grass
    ctx.strokeStyle = style.secondaryColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i < size / 3; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const height = 4 + Math.random() * 8;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 3, y - height);
      ctx.stroke();
    }
    
    // Lily pads
    ctx.fillStyle = '#3a6a40';
    for (let i = 0; i < size / 20; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const padSize = 3 + Math.random() * 4;
      
      ctx.beginPath();
      ctx.arc(x, y, padSize, 0.2, Math.PI * 2 - 0.2);
      ctx.lineTo(x, y);
      ctx.fill();
    }
  }

  private drawMountainPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'mountain' | 'hills' | 'cliffs'): void {
    const style = TERRAIN_STYLES[variant];
    
    // Rocky texture with cracks
    ctx.strokeStyle = style.shadowColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    
    const crackCount = Math.floor(size * style.patternDensity / 6);
    for (let i = 0; i < crackCount; i++) {
      let x = Math.random() * size;
      let y = Math.random() * size;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      const segments = 2 + Math.floor(Math.random() * 4);
      for (let j = 0; j < segments; j++) {
        x += (Math.random() - 0.5) * 15;
        y += (Math.random() - 0.5) * 15;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    // Highlight edges
    ctx.strokeStyle = style.highlightColor;
    ctx.globalAlpha = 0.3;
    
    for (let i = 0; i < crackCount / 2; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const length = 3 + Math.random() * 8;
      const angle = Math.random() * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }
    
    // Add snow caps for mountains
    if (variant === 'mountain') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < size / 10; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const patchSize = 2 + Math.random() * 5;
        
        ctx.beginPath();
        ctx.arc(x, y, patchSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.globalAlpha = 1;
  }

  private drawVolcanicPattern(ctx: CanvasRenderingContext2D, size: number): void {
    // Lava cracks
    ctx.strokeStyle = '#ff4500';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 4;
    
    for (let i = 0; i < size / 15; i++) {
      let x = Math.random() * size;
      let y = Math.random() * size;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      const segments = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < segments; j++) {
        x += (Math.random() - 0.5) * 20;
        y += (Math.random() - 0.5) * 20;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    // Ash spots
    ctx.fillStyle = 'rgba(60, 50, 50, 0.5)';
    for (let i = 0; i < size / 5; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawSandPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'sand' | 'desert' | 'dunes'): void {
    const style = TERRAIN_STYLES[variant];
    
    // Sand ripples
    ctx.strokeStyle = style.shadowColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    
    const rippleSpacing = variant === 'dunes' ? 6 : 10;
    
    for (let y = 0; y < size; y += rippleSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x < size; x += 3) {
        const noise = this.perlin.noise2D(x * 0.05, y * 0.02);
        const rippleY = y + noise * 3;
        ctx.lineTo(x, rippleY);
      }
      ctx.stroke();
    }
    
    // Highlight ripples
    ctx.strokeStyle = style.highlightColor;
    ctx.globalAlpha = 0.2;
    
    for (let y = 2; y < size; y += rippleSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x < size; x += 3) {
        const noise = this.perlin.noise2D(x * 0.05, y * 0.02);
        const rippleY = y + noise * 3;
        ctx.lineTo(x, rippleY);
      }
      ctx.stroke();
    }
    
    // Small stones/pebbles
    ctx.fillStyle = style.shadowColor;
    ctx.globalAlpha = 0.4;
    
    for (let i = 0; i < size / 10; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.beginPath();
      ctx.ellipse(x, y, 1 + Math.random(), 0.5 + Math.random() * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }

  private drawSnowPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'snow' | 'ice' | 'tundra'): void {
    const style = TERRAIN_STYLES[variant];
    
    if (variant === 'ice') {
      // Ice cracks
      ctx.strokeStyle = 'rgba(150, 200, 220, 0.5)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < size / 10; i++) {
        let x = Math.random() * size;
        let y = Math.random() * size;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        for (let j = 0; j < 3; j++) {
          x += (Math.random() - 0.5) * 25;
          y += (Math.random() - 0.5) * 25;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    
    // Snow sparkles
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    
    for (let i = 0; i < size * style.patternDensity / 3; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const sparkleSize = 0.5 + Math.random() * 1.5;
      
      ctx.beginPath();
      ctx.arc(x, y, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Tundra patches
    if (variant === 'tundra') {
      ctx.fillStyle = '#6a7a60';
      ctx.globalAlpha = 0.3;
      
      for (let i = 0; i < size / 8; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const patchSize = 3 + Math.random() * 8;
        
        ctx.beginPath();
        ctx.ellipse(x, y, patchSize, patchSize * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.globalAlpha = 1;
  }

  private drawDirtPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'dirt' | 'mud'): void {
    const style = TERRAIN_STYLES[variant];
    
    // Small stones and pebbles
    for (let i = 0; i < size / 4; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const stoneSize = 1 + Math.random() * 3;
      
      ctx.fillStyle = Math.random() > 0.5 ? style.shadowColor : style.secondaryColor;
      ctx.beginPath();
      ctx.ellipse(x, y, stoneSize, stoneSize * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    if (variant === 'mud') {
      // Water puddles
      ctx.fillStyle = 'rgba(60, 50, 40, 0.4)';
      for (let i = 0; i < size / 15; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const puddleSize = 4 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.ellipse(x, y, puddleSize, puddleSize * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawFarmlandPattern(ctx: CanvasRenderingContext2D, size: number): void {
    const style = TERRAIN_STYLES.farmland;
    
    // Plowed rows
    ctx.strokeStyle = style.shadowColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    
    const rowSpacing = 8;
    for (let y = rowSpacing / 2; y < size; y += rowSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
    
    // Crop patches
    ctx.fillStyle = style.highlightColor;
    ctx.globalAlpha = 0.5;
    
    for (let y = 0; y < size; y += rowSpacing) {
      for (let x = 0; x < size; x += 6) {
        if (Math.random() > 0.3) {
          ctx.beginPath();
          ctx.arc(x + Math.random() * 4, y + rowSpacing / 2 + (Math.random() - 0.5) * 2, 2 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.globalAlpha = 1;
  }

  private drawStonePattern(ctx: CanvasRenderingContext2D, size: number, variant: 'stone' | 'cobblestone' | 'ruins'): void {
    const style = TERRAIN_STYLES[variant];
    
    if (variant === 'cobblestone') {
      // Draw cobblestones
      const stoneSize = 10;
      for (let y = 0; y < size; y += stoneSize) {
        const offset = (Math.floor(y / stoneSize) % 2) * (stoneSize / 2);
        for (let x = -stoneSize; x < size + stoneSize; x += stoneSize) {
          const sx = x + offset + (Math.random() - 0.5) * 3;
          const sy = y + (Math.random() - 0.5) * 3;
          const sw = stoneSize * 0.9 + (Math.random() - 0.5) * 3;
          const sh = stoneSize * 0.9 + (Math.random() - 0.5) * 3;
          
          // Stone fill
          ctx.fillStyle = Math.random() > 0.5 ? style.baseColor : style.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(sx + sw/2, sy + sh/2, sw/2, sh/2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Stone border
          ctx.strokeStyle = style.shadowColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    } else {
      // Cracks for stone/ruins
      ctx.strokeStyle = style.shadowColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      
      for (let i = 0; i < size / 5; i++) {
        let x = Math.random() * size;
        let y = Math.random() * size;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        for (let j = 0; j < 4; j++) {
          x += (Math.random() - 0.5) * 20;
          y += (Math.random() - 0.5) * 20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      if (variant === 'ruins') {
        // Broken stone blocks
        ctx.fillStyle = style.highlightColor;
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < size / 15; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const w = 5 + Math.random() * 15;
          const h = 5 + Math.random() * 10;
          
          ctx.fillRect(x, y, w, h);
        }
      }
      
      ctx.globalAlpha = 1;
    }
  }

  private drawRoadPattern(ctx: CanvasRenderingContext2D, size: number, variant: 'road' | 'path'): void {
    const style = TERRAIN_STYLES[variant];
    
    // Wheel tracks or footprints
    ctx.strokeStyle = style.shadowColor;
    ctx.lineWidth = variant === 'road' ? 3 : 1;
    ctx.globalAlpha = 0.3;
    
    const trackSpacing = size * 0.3;
    
    // Left track
    ctx.beginPath();
    ctx.moveTo(trackSpacing, 0);
    for (let y = 0; y < size; y += 5) {
      ctx.lineTo(trackSpacing + (Math.random() - 0.5) * 3, y);
    }
    ctx.stroke();
    
    // Right track
    ctx.beginPath();
    ctx.moveTo(size - trackSpacing, 0);
    for (let y = 0; y < size; y += 5) {
      ctx.lineTo(size - trackSpacing + (Math.random() - 0.5) * 3, y);
    }
    ctx.stroke();
    
    // Pebbles
    ctx.fillStyle = style.secondaryColor;
    ctx.globalAlpha = 0.4;
    
    for (let i = 0; i < size / 5; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.beginPath();
      ctx.ellipse(x, y, 1 + Math.random() * 2, 0.5 + Math.random(), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }

  // Utility functions
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private lerpColor(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, t: number): { r: number; g: number; b: number } {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t)
    };
  }

  generateBrush(terrain: TerrainType, size: number): HTMLCanvasElement {
    const pattern = this.generatePattern(terrain, size);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Create soft circular mask
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.5, 'white');
    gradient.addColorStop(0.8, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(pattern, 0, 0);
    
    return canvas;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const patternGenerator = new PatternGenerator();
