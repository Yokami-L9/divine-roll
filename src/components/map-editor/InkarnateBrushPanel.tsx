import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { X, RotateCw } from 'lucide-react';
import { textureManager, TextureInfo, BrushSettings } from './textures/TextureManager';
import { cn } from '@/lib/utils';

interface InkarnateBrushPanelProps {
  isOpen: boolean;
  onClose: () => void;
  brushSettings: BrushSettings;
  onBrushSettingsChange: (settings: BrushSettings) => void;
  selectedTexture: string | null;
  onSelectTexture: (textureId: string) => void;
  onFill: () => void;
}

// Single texture preview component
const TexturePreviewItem: React.FC<{
  texture: TextureInfo;
  isSelected: boolean;
  onClick: () => void;
}> = ({ texture, isSelected, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadAndDraw = async () => {
      await textureManager.loadTexture(texture.id);
      if (canvasRef.current) {
        const preview = textureManager.getPreviewCanvas(texture.id, 60);
        if (preview) {
          const ctx = canvasRef.current.getContext('2d')!;
          ctx.drawImage(preview, 0, 0);
          setLoaded(true);
        }
      }
    };
    loadAndDraw();
  }, [texture.id]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-[60px] h-[60px] rounded border-2 overflow-hidden transition-all',
        isSelected 
          ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
          : 'border-transparent hover:border-muted-foreground/50'
      )}
    >
      <canvas
        ref={canvasRef}
        width={60}
        height={60}
        className={cn(
          'w-full h-full transition-opacity',
          loaded ? 'opacity-100' : 'opacity-50'
        )}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="w-4 h-4 border-2 border-t-transparent border-foreground rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
};

// Large texture preview
const LargeTexturePreview: React.FC<{
  textureId: string | null;
  brushSettings: BrushSettings;
}> = ({ textureId, brushSettings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !textureId) return;

    const drawPreview = async () => {
      await textureManager.loadTexture(textureId);
      const stamp = textureManager.generateBrushStamp(textureId, {
        ...brushSettings,
        size: 120,
      });
      if (stamp && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')!;
        ctx.clearRect(0, 0, 120, 120);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 120, 120);
        ctx.drawImage(stamp, 0, 0);
      }
    };
    drawPreview();
  }, [textureId, brushSettings]);

  return (
    <div className="w-full h-[120px] bg-muted rounded-lg overflow-hidden border border-border">
      <canvas
        ref={canvasRef}
        width={120}
        height={120}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export const InkarnateBrushPanel: React.FC<InkarnateBrushPanelProps> = ({
  isOpen,
  onClose,
  brushSettings,
  onBrushSettingsChange,
  selectedTexture,
  onSelectTexture,
  onFill,
}) => {
  const [textures, setTextures] = useState<TextureInfo[]>([]);

  useEffect(() => {
    const loadTextures = async () => {
      await textureManager.loadAllTextures();
      setTextures(textureManager.getAllTextures());
    };
    loadTextures();
  }, []);

  const updateSetting = <K extends keyof BrushSettings>(
    key: K,
    value: BrushSettings[K]
  ) => {
    onBrushSettingsChange({ ...brushSettings, [key]: value });
  };

  if (!isOpen) return null;

  const terrainTextures = textures.filter(t => t.category === 'terrain');
  const specialTextures = textures.filter(t => t.category === 'special' || t.category === 'paths');

  return (
    <div className="absolute left-16 top-0 w-[260px] bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <span className="text-sm font-medium text-foreground">Brush Tool</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Brush Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Brush Size</Label>
            <span className="text-xs font-mono text-foreground">{brushSettings.size}</span>
          </div>
          <Slider
            value={[brushSettings.size]}
            onValueChange={([v]) => updateSetting('size', v)}
            min={10}
            max={300}
            step={5}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <span className="text-xs font-mono text-foreground">{brushSettings.opacity}%</span>
          </div>
          <Slider
            value={[brushSettings.opacity]}
            onValueChange={([v]) => updateSetting('opacity', v)}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Softness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Softness</Label>
            <span className="text-xs font-mono text-foreground">{brushSettings.softness}%</span>
          </div>
          <Slider
            value={[brushSettings.softness]}
            onValueChange={([v]) => updateSetting('softness', v)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Terrain Textures */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Terrain</Label>
          <div className="grid grid-cols-4 gap-2">
            {terrainTextures.map((texture) => (
              <TexturePreviewItem
                key={texture.id}
                texture={texture}
                isSelected={selectedTexture === texture.id}
                onClick={() => onSelectTexture(texture.id)}
              />
            ))}
          </div>
        </div>

        {/* Special/Paths Textures */}
        {specialTextures.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Special</Label>
            <div className="grid grid-cols-4 gap-2">
              {specialTextures.map((texture) => (
                <TexturePreviewItem
                  key={texture.id}
                  texture={texture}
                  isSelected={selectedTexture === texture.id}
                  onClick={() => onSelectTexture(texture.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Large Preview */}
        {selectedTexture && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Preview</Label>
            <LargeTexturePreview
              textureId={selectedTexture}
              brushSettings={brushSettings}
            />
          </div>
        )}

        {/* Texture Scale */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Texture Scale</Label>
            <span className="text-xs font-mono text-foreground">{brushSettings.textureScale}%</span>
          </div>
          <Slider
            value={[brushSettings.textureScale]}
            onValueChange={([v]) => updateSetting('textureScale', v)}
            min={25}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Rotation</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-foreground">{brushSettings.rotation}°</span>
              <button
                onClick={() => updateSetting('rotation', 0)}
                className="p-1 hover:bg-muted rounded"
                title="Reset rotation"
              >
                <RotateCw className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
          <Slider
            value={[brushSettings.rotation]}
            onValueChange={([v]) => updateSetting('rotation', v)}
            min={0}
            max={360}
            step={15}
            className="w-full"
          />
        </div>

        {/* Fill Button */}
        <button
          onClick={onFill}
          disabled={!selectedTexture}
          className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 disabled:bg-muted disabled:text-muted-foreground text-white font-medium rounded transition-colors"
        >
          Fill Canvas
        </button>
      </div>
    </div>
  );
};

export default InkarnateBrushPanel;
