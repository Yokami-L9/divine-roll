// ============================================
// PATH RENDERER
// Bezier-based roads, rivers, and borders
// With control point visualization for editing
// ============================================

import { MapPath, PathPoint } from '../types';

interface PathRenderOptions {
  selectedPathId?: string | null;
  selectedPointIndex?: number | null;
  hoveredPointIndex?: number | null;
  showControlPoints?: boolean;
}

export class PathRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  renderPath(path: MapPath, isSelected: boolean = false): void {
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

    // Draw glow for selected path
    if (isSelected) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.lineWidth = path.width + 6;
      this.ctx.setLineDash([]);
      this.drawPathCurve(path.points);
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.ctx.beginPath();
    this.drawPathCurve(path.points);
    this.ctx.stroke();

    this.ctx.restore();
  }

  private drawPathCurve(points: PathPoint[]): void {
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cpx = (p0.x + p1.x) / 2;
      const cpy = (p0.y + p1.y) / 2;
      this.ctx.quadraticCurveTo(p0.x, p0.y, cpx, cpy);
    }

    const last = points[points.length - 1];
    this.ctx.lineTo(last.x, last.y);
  }

  renderControlPoints(
    path: MapPath, 
    selectedPointIndex: number | null = null,
    hoveredPointIndex: number | null = null
  ): void {
    const points = path.points;
    
    // Draw connecting lines between control points
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();
    this.ctx.restore();

    // Draw control points
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const isSelected = i === selectedPointIndex;
      const isHovered = i === hoveredPointIndex;
      const isEndpoint = i === 0 || i === points.length - 1;

      this.ctx.save();

      // Outer ring
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, isSelected ? 10 : 8, 0, Math.PI * 2);
      this.ctx.fillStyle = isSelected 
        ? '#3498db' 
        : isHovered 
          ? '#e74c3c' 
          : isEndpoint 
            ? '#27ae60' 
            : '#ffffff';
      this.ctx.fill();

      // Border
      this.ctx.strokeStyle = isSelected ? '#2980b9' : '#2c3e50';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Inner dot
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#2c3e50';
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  renderCurrentPath(points: PathPoint[], color: string, width: number): void {
    if (points.length < 1) return;

    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.setLineDash([10, 5]);
    this.ctx.globalAlpha = 0.7;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();

    // Draw points
    for (let i = 0; i < points.length; i++) {
      this.ctx.beginPath();
      this.ctx.arc(points[i].x, points[i].y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = i === 0 ? '#27ae60' : '#3498db';
      this.ctx.fill();
      this.ctx.strokeStyle = '#2c3e50';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  renderAllPaths(paths: MapPath[], options: PathRenderOptions = {}): void {
    const sorted = [...paths].sort((a, b) => {
      const order = { border: 0, road: 1, river: 2, custom: 3 };
      return order[a.type] - order[b.type];
    });

    for (const path of sorted) {
      const isSelected = path.id === options.selectedPathId;
      this.renderPath(path, isSelected);
    }

    // Render control points for selected path
    if (options.selectedPathId && options.showControlPoints) {
      const selectedPath = paths.find(p => p.id === options.selectedPathId);
      if (selectedPath) {
        this.renderControlPoints(
          selectedPath, 
          options.selectedPointIndex,
          options.hoveredPointIndex
        );
      }
    }
  }

  smoothPath(points: { x: number; y: number }[]): PathPoint[] {
    return points.map(p => ({ x: p.x, y: p.y }));
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
