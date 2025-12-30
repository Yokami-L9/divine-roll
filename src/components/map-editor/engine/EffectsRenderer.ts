// ============================================
// EFFECTS RENDERER
// Post-processing effects: fog, vignette, paper texture
// ============================================

import { EffectSettings } from '../types';

export class EffectsRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private noisePattern: CanvasPattern | null = null;
  private paperPattern: CanvasPattern | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.generatePatterns();
  }

  private generatePatterns(): void {
    // Generate paper pattern
    const paperCanvas = document.createElement('canvas');
    paperCanvas.width = 256;
    paperCanvas.height = 256;
    const paperCtx = paperCanvas.getContext('2d')!;
    
    paperCtx.fillStyle = '#f4e4c1';
    paperCtx.fillRect(0, 0, 256, 256);
    
    const paperData = paperCtx.getImageData(0, 0, 256, 256);
    for (let i = 0; i < paperData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      paperData.data[i] = Math.max(0, Math.min(255, paperData.data[i] + noise));
      paperData.data[i + 1] = Math.max(0, Math.min(255, paperData.data[i + 1] + noise));
      paperData.data[i + 2] = Math.max(0, Math.min(255, paperData.data[i + 2] + noise));
    }
    
    paperCtx.putImageData(paperData, 0, 0);
    this.paperPattern = this.ctx.createPattern(paperCanvas, 'repeat');
  }

  renderEffects(effects: EffectSettings): void {
    // Paper texture
    if (effects.paperTexture && this.paperPattern) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.15;
      this.ctx.globalCompositeOperation = 'overlay';
      this.ctx.fillStyle = this.paperPattern;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }

    // Vignette
    if (effects.vignette) {
      this.renderVignette(0.3);
    }

    // Color grading
    if (effects.colorGrading.enabled) {
      this.renderColorGrading(effects.colorGrading);
    }
  }

  private renderVignette(intensity: number): void {
    const { width, height } = this.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) * 0.7;

    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, radius * 0.3,
      centerX, centerY, radius
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);

    this.ctx.save();
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }

  private renderColorGrading(settings: { warmth: number; saturation: number; contrast: number }): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Contrast
      const factor = (259 * (settings.contrast * 255 + 255)) / (255 * (259 - settings.contrast * 255));
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;

      // Warmth
      r += settings.warmth * 30;
      b -= settings.warmth * 30;

      // Saturation
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + settings.saturation * (r - gray);
      g = gray + settings.saturation * (g - gray);
      b = gray + settings.saturation * (b - gray);

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  renderFogOfWar(mask: Uint8Array | null, color: string, opacity: number, width: number, height: number): void {
    if (!mask) return;
    // Fog rendering implementation
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
