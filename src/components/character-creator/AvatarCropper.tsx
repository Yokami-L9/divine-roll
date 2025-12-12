import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Move, ZoomIn, Check, RotateCcw } from "lucide-react";

interface AvatarCropperProps {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => void;
}

export function AvatarCropper({ imageUrl, open, onClose, onSave }: AvatarCropperProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: -30 }); // Default slightly up to focus on face
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetPosition = () => {
    setScale(1);
    setPosition({ x: 0, y: -30 });
  };

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 256; // Output avatar size
      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Create circular clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Calculate image positioning
      const containerSize = 200; // The visible area size in the cropper
      const scaleFactor = size / containerSize;
      
      const imgWidth = img.width * scale * scaleFactor;
      const imgHeight = img.height * scale * scaleFactor;
      const imgX = (size - imgWidth) / 2 + position.x * scaleFactor;
      const imgY = (size - imgHeight) / 2 + position.y * scaleFactor;

      // Draw the image
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
      onClose();
    };
    img.src = imageUrl;
  }, [imageUrl, scale, position, onSave, onClose]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Настройка аватара
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cropper Area */}
          <div className="flex justify-center">
            <div
              ref={containerRef}
              className="relative w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-primary cursor-move bg-muted"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={imageUrl}
                alt="Cropper"
                className="absolute select-none pointer-events-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  left: "50%",
                  top: "50%",
                  marginLeft: "-50%",
                  marginTop: "-50%",
                  width: "100%",
                  height: "auto",
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Instructions */}
          <p className="text-xs text-center text-muted-foreground">
            Перетащите изображение, чтобы выбрать область для аватара
          </p>

          {/* Zoom Control */}
          <div className="flex items-center gap-3">
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[scale]}
              onValueChange={(values) => setScale(values[0])}
              min={0.5}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12 text-right">
              {Math.round(scale * 100)}%
            </span>
          </div>

          {/* Reset Button */}
          <Button variant="outline" className="w-full" onClick={resetPosition}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Сохранить
          </Button>
        </DialogFooter>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
