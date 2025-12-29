// Viewport Management - Zoom, Pan, and coordinate transformations

import { ViewportState } from '../types';

export interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export class ViewportManager {
  private state: ViewportState;
  private containerWidth: number;
  private containerHeight: number;
  private canvasWidth: number;
  private canvasHeight: number;
  
  // Animation
  private targetState: ViewportState;
  private animating = false;
  private animationFrame: number | null = null;
  
  // Constraints
  private minZoom = 0.1;
  private maxZoom = 8;
  
  // Inertia
  private velocity = { x: 0, y: 0 };
  private friction = 0.92;
  private inertiaFrame: number | null = null;

  constructor(
    containerWidth: number,
    containerHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // Start centered
    this.state = {
      x: (containerWidth - canvasWidth) / 2,
      y: (containerHeight - canvasHeight) / 2,
      zoom: 1
    };
    this.targetState = { ...this.state };
  }

  public getState(): ViewportState {
    return { ...this.state };
  }

  public setContainerSize(width: number, height: number): void {
    this.containerWidth = width;
    this.containerHeight = height;
  }

  public setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  // Convert screen coordinates to canvas coordinates
  public screenToCanvas(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.state.x) / this.state.zoom,
      y: (screenY - this.state.y) / this.state.zoom
    };
  }

  // Convert canvas coordinates to screen coordinates
  public canvasToScreen(canvasX: number, canvasY: number): { x: number; y: number } {
    return {
      x: canvasX * this.state.zoom + this.state.x,
      y: canvasY * this.state.zoom + this.state.y
    };
  }

  // Get visible bounds in canvas coordinates
  public getVisibleBounds(): ViewportBounds {
    const topLeft = this.screenToCanvas(0, 0);
    const bottomRight = this.screenToCanvas(this.containerWidth, this.containerHeight);
    
    return {
      left: topLeft.x,
      top: topLeft.y,
      right: bottomRight.x,
      bottom: bottomRight.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y
    };
  }

  // Zoom centered on a point (e.g., mouse position)
  public zoomAt(screenX: number, screenY: number, delta: number, smooth = true): void {
    const zoomFactor = delta > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.state.zoom * zoomFactor));
    
    if (newZoom === this.state.zoom) return;
    
    // Calculate new position to keep the point under cursor
    const canvasPoint = this.screenToCanvas(screenX, screenY);
    const newX = screenX - canvasPoint.x * newZoom;
    const newY = screenY - canvasPoint.y * newZoom;
    
    if (smooth) {
      this.targetState = { x: newX, y: newY, zoom: newZoom };
      this.startAnimation();
    } else {
      this.state = { x: newX, y: newY, zoom: newZoom };
    }
  }

  public zoomIn(centerOnScreen = true): void {
    const cx = centerOnScreen ? this.containerWidth / 2 : 0;
    const cy = centerOnScreen ? this.containerHeight / 2 : 0;
    this.zoomAt(cx, cy, -1);
  }

  public zoomOut(centerOnScreen = true): void {
    const cx = centerOnScreen ? this.containerWidth / 2 : 0;
    const cy = centerOnScreen ? this.containerHeight / 2 : 0;
    this.zoomAt(cx, cy, 1);
  }

  public setZoom(zoom: number, smooth = true): void {
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    const cx = this.containerWidth / 2;
    const cy = this.containerHeight / 2;
    const canvasPoint = this.screenToCanvas(cx, cy);
    
    const newX = cx - canvasPoint.x * newZoom;
    const newY = cy - canvasPoint.y * newZoom;
    
    if (smooth) {
      this.targetState = { x: newX, y: newY, zoom: newZoom };
      this.startAnimation();
    } else {
      this.state = { x: newX, y: newY, zoom: newZoom };
    }
  }

  public resetZoom(): void {
    // Fit canvas to container
    const scaleX = this.containerWidth / this.canvasWidth;
    const scaleY = this.containerHeight / this.canvasHeight;
    const zoom = Math.min(scaleX, scaleY) * 0.9; // 90% to leave margin
    
    const x = (this.containerWidth - this.canvasWidth * zoom) / 2;
    const y = (this.containerHeight - this.canvasHeight * zoom) / 2;
    
    this.targetState = { x, y, zoom };
    this.startAnimation();
  }

  // Pan by delta (in screen coordinates)
  public pan(deltaX: number, deltaY: number): void {
    this.state.x += deltaX;
    this.state.y += deltaY;
    this.targetState = { ...this.state };
  }

  // Start inertia panning
  public startInertia(velocityX: number, velocityY: number): void {
    this.velocity = { x: velocityX, y: velocityY };
    this.stopInertia();
    this.runInertia();
  }

  private runInertia(): void {
    if (Math.abs(this.velocity.x) < 0.5 && Math.abs(this.velocity.y) < 0.5) {
      this.velocity = { x: 0, y: 0 };
      return;
    }
    
    this.state.x += this.velocity.x;
    this.state.y += this.velocity.y;
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    
    this.inertiaFrame = requestAnimationFrame(() => this.runInertia());
  }

  public stopInertia(): void {
    if (this.inertiaFrame !== null) {
      cancelAnimationFrame(this.inertiaFrame);
      this.inertiaFrame = null;
    }
    this.velocity = { x: 0, y: 0 };
  }

  // Center on a canvas point
  public centerOn(canvasX: number, canvasY: number, smooth = true): void {
    const screenCenterX = this.containerWidth / 2;
    const screenCenterY = this.containerHeight / 2;
    
    const newX = screenCenterX - canvasX * this.state.zoom;
    const newY = screenCenterY - canvasY * this.state.zoom;
    
    if (smooth) {
      this.targetState = { ...this.state, x: newX, y: newY };
      this.startAnimation();
    } else {
      this.state.x = newX;
      this.state.y = newY;
    }
  }

  // Smooth animation
  private startAnimation(): void {
    if (this.animating) return;
    this.animating = true;
    this.animate();
  }

  private animate(): void {
    const dx = this.targetState.x - this.state.x;
    const dy = this.targetState.y - this.state.y;
    const dz = this.targetState.zoom - this.state.zoom;
    
    const threshold = 0.01;
    
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold && Math.abs(dz) < 0.001) {
      this.state = { ...this.targetState };
      this.animating = false;
      return;
    }
    
    const ease = 0.15;
    this.state.x += dx * ease;
    this.state.y += dy * ease;
    this.state.zoom += dz * ease;
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  public stopAnimation(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.animating = false;
    this.state = { ...this.targetState };
  }

  // Get transform string for CSS
  public getTransformCSS(): string {
    return `translate(${this.state.x}px, ${this.state.y}px) scale(${this.state.zoom})`;
  }

  // Get transform matrix values
  public getTransformMatrix(): { a: number; b: number; c: number; d: number; e: number; f: number } {
    return {
      a: this.state.zoom,
      b: 0,
      c: 0,
      d: this.state.zoom,
      e: this.state.x,
      f: this.state.y
    };
  }

  public destroy(): void {
    this.stopAnimation();
    this.stopInertia();
  }
}
