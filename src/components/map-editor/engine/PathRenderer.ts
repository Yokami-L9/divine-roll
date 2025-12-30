// ============================================
// PATH RENDERER
// Bezier-based roads, rivers, and borders
// ============================================

import { MapPath, PathPoint } from '../types';

export class PathRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  renderPath(path: MapPath): void {
    if (path.points.length < 2) return;

    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = path.width;
    this.ctx.strokeStyle = path.color;

    // Set line style
    if (path.style === 'dashed') {
      this.ctx.setLineDash([path.width * 2, path.width]);
    } else if (path.style === 'dotted') {
      this.ctx.setLineDash([2, path.width]);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(path.points[0].x, path.points[0].y);

    for (let i = 1; i < path.points.length; i++) {
      const p0 = path.points[i - 1];
      const p1 = path.points[i];
      const cpx = (p0.x + p1.x) / 2;
      const cpy = (p0.y + p1.y) / 2;
      this.ctx.quadraticCurveTo(p0.x, p0.y, cpx, cpy);
    }

    const last = path.points[path.points.length - 1];
    this.ctx.lineTo(last.x, last.y);
    this.ctx.stroke();

    this.ctx.restore();
  }

  renderAllPaths(paths: MapPath[]): void {
    const sorted = [...paths].sort((a, b) => {
      const order = { border: 0, road: 1, river: 2, custom: 3 };
      return order[a.type] - order[b.type];
    });

    for (const path of sorted) {
      this.renderPath(path);
    }
  }

  smoothPath(points: { x: number; y: number }[]): PathPoint[] {
    return points.map(p => ({ x: p.x, y: p.y }));
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
