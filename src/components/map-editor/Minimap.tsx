import { useRef, useEffect, useCallback } from "react";
import { Maximize2 } from "lucide-react";

interface MinimapProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
  viewportWidth: number;
  viewportHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  viewportOffset: { x: number; y: number };
  onNavigate: (x: number, y: number) => void;
}

export const Minimap = ({
  canvasRef,
  zoom,
  viewportWidth,
  viewportHeight,
  canvasWidth,
  canvasHeight,
  viewportOffset,
  onNavigate,
}: MinimapProps) => {
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MINIMAP_SIZE = 160;
  const scale = MINIMAP_SIZE / Math.max(canvasWidth, canvasHeight);

  // Draw minimap
  const drawMinimap = useCallback(() => {
    const minimap = minimapRef.current;
    const sourceCanvas = canvasRef.current;
    if (!minimap || !sourceCanvas) return;

    const ctx = minimap.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Draw scaled canvas content
    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;
    const offsetX = (MINIMAP_SIZE - scaledWidth) / 2;
    const offsetY = (MINIMAP_SIZE - scaledHeight) / 2;

    try {
      ctx.drawImage(
        sourceCanvas,
        0, 0, canvasWidth * zoom, canvasHeight * zoom,
        offsetX, offsetY, scaledWidth, scaledHeight
      );
    } catch (e) {
      // Canvas might not be ready yet
    }

    // Draw viewport rectangle
    const vpWidth = (viewportWidth / zoom) * scale;
    const vpHeight = (viewportHeight / zoom) * scale;
    const vpX = offsetX + (-viewportOffset.x / zoom) * scale;
    const vpY = offsetY + (-viewportOffset.y / zoom) * scale;

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(vpX, vpY, vpWidth, vpHeight);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX, offsetY, scaledWidth, scaledHeight);
  }, [canvasRef, zoom, viewportWidth, viewportHeight, canvasWidth, canvasHeight, viewportOffset, scale]);

  useEffect(() => {
    drawMinimap();
    
    // Redraw periodically to catch canvas changes
    const interval = setInterval(drawMinimap, 500);
    return () => clearInterval(interval);
  }, [drawMinimap]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;
    const offsetX = (MINIMAP_SIZE - scaledWidth) / 2;
    const offsetY = (MINIMAP_SIZE - scaledHeight) / 2;

    // Convert minimap coords to canvas coords
    const canvasX = ((x - offsetX) / scale) * zoom - viewportWidth / 2;
    const canvasY = ((y - offsetY) / scale) * zoom - viewportHeight / 2;

    onNavigate(-canvasX, -canvasY);
  };

  return (
    <div
      ref={containerRef}
      className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg border border-border overflow-hidden shadow-lg"
    >
      <div className="flex items-center justify-between px-2 py-1 border-b border-border bg-background/50">
        <span className="text-xs text-muted-foreground">Миникарта</span>
        <Maximize2 className="w-3 h-3 text-muted-foreground" />
      </div>
      <canvas
        ref={minimapRef}
        width={MINIMAP_SIZE}
        height={MINIMAP_SIZE}
        onClick={handleClick}
        className="cursor-crosshair"
      />
    </div>
  );
};
