// ============================================
// GRID RENDERER
// Square and hex grid with snap functionality
// ============================================

import { GridSettings } from '../types';

export class GridRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  renderGrid(settings: GridSettings, viewport: { zoom: number }): void {
    if (!settings.enabled) return;

    this.ctx.save();
    this.ctx.globalAlpha = settings.opacity;
    this.ctx.strokeStyle = settings.color;
    this.ctx.lineWidth = 1 / viewport.zoom;

    if (settings.type === 'square') {
      this.renderSquareGrid(settings.size);
    } else {
      this.renderHexGrid(settings.size);
    }

    this.ctx.restore();
  }

  private renderSquareGrid(size: number): void {
    const { width, height } = this.canvas;

    this.ctx.beginPath();

    // Vertical lines
    for (let x = 0; x <= width; x += size) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += size) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }

    this.ctx.stroke();
  }

  private renderHexGrid(size: number): void {
    const { width, height } = this.canvas;
    const hexWidth = size * 2;
    const hexHeight = size * Math.sqrt(3);
    const vertDist = hexHeight;
    const horizDist = hexWidth * 0.75;

    this.ctx.beginPath();

    for (let row = -1; row <= height / vertDist + 1; row++) {
      for (let col = -1; col <= width / horizDist + 1; col++) {
        const offset = col % 2 === 0 ? 0 : vertDist / 2;
        const cx = col * horizDist;
        const cy = row * vertDist + offset;

        this.drawHexagon(cx, cy, size);
      }
    }

    this.ctx.stroke();
  }

  private drawHexagon(cx: number, cy: number, size: number): void {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
  }

  snapToGrid(x: number, y: number, settings: GridSettings): { x: number; y: number } {
    if (!settings.snap) return { x, y };

    if (settings.type === 'square') {
      return {
        x: Math.round(x / settings.size) * settings.size,
        y: Math.round(y / settings.size) * settings.size
      };
    } else {
      return this.snapToHex(x, y, settings.size);
    }
  }

  private snapToHex(x: number, y: number, size: number): { x: number; y: number } {
    const hexWidth = size * 2;
    const hexHeight = size * Math.sqrt(3);
    const horizDist = hexWidth * 0.75;
    const vertDist = hexHeight;

    const col = Math.round(x / horizDist);
    const offset = col % 2 === 0 ? 0 : vertDist / 2;
    const row = Math.round((y - offset) / vertDist);

    return {
      x: col * horizDist,
      y: row * vertDist + offset
    };
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
