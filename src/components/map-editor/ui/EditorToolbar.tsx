import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer2, Hand, Brush, Eraser, PaintBucket, Pipette,
  Undo2, Redo2, ZoomIn, ZoomOut, Save, Download, Trash2,
  Route, Type, Image
} from 'lucide-react';
import { ToolType } from '../types';

interface EditorToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  zoom: number;
  onSave: () => void;
  onExport: () => string | null;
  onClear: () => void;
}

const tools: { id: ToolType; icon: React.ReactNode; label: string; shortcut: string }[] = [
  { id: 'select', icon: <MousePointer2 className="w-4 h-4" />, label: 'Выделение', shortcut: 'V' },
  { id: 'pan', icon: <Hand className="w-4 h-4" />, label: 'Перемещение', shortcut: 'Space' },
  { id: 'brush', icon: <Brush className="w-4 h-4" />, label: 'Кисть', shortcut: 'B' },
  { id: 'eraser', icon: <Eraser className="w-4 h-4" />, label: 'Ластик', shortcut: 'E' },
  { id: 'fill', icon: <PaintBucket className="w-4 h-4" />, label: 'Заливка', shortcut: 'G' },
  { id: 'eyedropper', icon: <Pipette className="w-4 h-4" />, label: 'Пипетка', shortcut: 'I' },
  { id: 'path', icon: <Route className="w-4 h-4" />, label: 'Пути', shortcut: 'P' },
  { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Текст', shortcut: 'T' },
  { id: 'asset', icon: <Image className="w-4 h-4" />, label: 'Объекты', shortcut: 'A' },
];

export function EditorToolbar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoom,
  onSave,
  onExport,
  onClear
}: EditorToolbarProps) {
  const handleExport = () => {
    const dataUrl = onExport();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = 'map.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 px-3 py-2 bg-[#16213e] border-b border-border">
        {/* Tools */}
        <div className="flex items-center gap-1">
          {tools.map(tool => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onToolChange(tool.id)}
                >
                  {tool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {tool.label} ({tool.shortcut})
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUndo} disabled={!canUndo}>
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Отменить (Ctrl+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRedo} disabled={!canRedo}>
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Повторить (Ctrl+Y)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Уменьшить</TooltipContent>
          </Tooltip>
          <Button variant="ghost" size="sm" className="h-8 px-2 min-w-[60px]" onClick={onResetZoom}>
            {Math.round(zoom * 100)}%
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Увеличить</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onClear}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Очистить карту</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}>
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Экспорт PNG</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 gap-1" onClick={onSave}>
                <Save className="w-4 h-4" />
                Сохранить
              </Button>
            </TooltipTrigger>
            <TooltipContent>Сохранить карту</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
