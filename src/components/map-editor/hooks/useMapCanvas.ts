import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { textureGenerator } from '../textures/TextureGenerator';
import { ToolType, TerrainType, BrushSettings, MapPath, PathPoint, MarkerData, HistoryState } from '../types';
import { toast } from 'sonner';

export interface UseMapCanvasProps {
  width: number;
  height: number;
  onSave?: (data: string) => void;
}

export function useMapCanvas({ width, height, onSave }: UseMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const textureLayerRef = useRef<HTMLCanvasElement | null>(null);
  
  // State
  const [isReady, setIsReady] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // Brush settings
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    size: 50,
    opacity: 1,
    hardness: 0.7,
    spacing: 0.15,
    terrain: 'grass'
  });
  
  // History
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Paths
  const [paths, setPaths] = useState<MapPath[]>([]);
  const [currentPath, setCurrentPath] = useState<PathPoint[]>([]);
  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [pathColor, setPathColor] = useState('#8B4513');
  const [pathWidth, setPathWidth] = useState(3);
  
  // Markers
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  
  // Grid
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(50);
  
  // Cursor
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Layers
  const [activeLayerId, setActiveLayerId] = useState('terrain');
  
  // Drawing state
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#1a1a2e',
      selection: activeTool === 'select',
      isDrawingMode: false,
    });

    fabricRef.current = canvas;
    
    // Create texture layer canvas (for terrain painting)
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = width;
    textureCanvas.height = height;
    const textureCtx = textureCanvas.getContext('2d')!;
    textureCtx.fillStyle = '#2d3748';
    textureCtx.fillRect(0, 0, width, height);
    textureLayerRef.current = textureCanvas;
    
    // Add texture layer as background image
    updateBackgroundFromTexture();
    
    setIsReady(true);
    saveToHistory();
    
    toast.success('Редактор карт готов к работе!');

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Update background from texture layer
  const updateBackgroundFromTexture = useCallback(() => {
    if (!fabricRef.current || !textureLayerRef.current) return;
    
    const dataUrl = textureLayerRef.current.toDataURL('image/png');
    
    FabricImage.fromURL(dataUrl).then((img) => {
      if (fabricRef.current) {
        fabricRef.current.backgroundImage = img;
        fabricRef.current.renderAll();
      }
    });
  }, []);

  // Paint terrain with procedural texture
  const paintTerrain = useCallback((x: number, y: number) => {
    if (!textureLayerRef.current) return;
    
    const ctx = textureLayerRef.current.getContext('2d')!;
    const { size, opacity, hardness, terrain } = brushSettings;
    
    // Generate brush pattern
    const pattern = textureGenerator.generateBrushPattern(terrain, size);
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw the textured brush
    ctx.drawImage(pattern, x - size / 2, y - size / 2, size, size);
    
    ctx.restore();
  }, [brushSettings]);

  // Erase terrain
  const eraseTerrain = useCallback((x: number, y: number) => {
    if (!textureLayerRef.current) return;
    
    const ctx = textureLayerRef.current.getContext('2d')!;
    const { size } = brushSettings;
    
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    
    // Create soft eraser
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, [brushSettings]);

  // Interpolate points for smooth strokes
  const interpolatePoints = useCallback((x1: number, y1: number, x2: number, y2: number, callback: (x: number, y: number) => void) => {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const spacing = brushSettings.size * brushSettings.spacing;
    const steps = Math.max(1, Math.floor(distance / spacing));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      callback(x, y);
    }
  }, [brushSettings]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - pan.x;
    const y = (e.clientY - rect.top) / zoom - pan.y;
    
    if (activeTool === 'brush') {
      isDrawingRef.current = true;
      lastPointRef.current = { x, y };
      paintTerrain(x, y);
    } else if (activeTool === 'eraser') {
      isDrawingRef.current = true;
      lastPointRef.current = { x, y };
      eraseTerrain(x, y);
    } else if (activeTool === 'path') {
      if (!isDrawingPath) {
        setIsDrawingPath(true);
        setCurrentPath([{ x, y }]);
      } else {
        setCurrentPath(prev => [...prev, { x, y }]);
      }
    }
  }, [activeTool, zoom, pan, isDrawingPath, paintTerrain, eraseTerrain]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - pan.x;
    const y = (e.clientY - rect.top) / zoom - pan.y;
    
    setCursorPosition({ x: Math.round(x), y: Math.round(y) });
    
    if (!isDrawingRef.current || !lastPointRef.current) return;
    
    if (activeTool === 'brush') {
      interpolatePoints(lastPointRef.current.x, lastPointRef.current.y, x, y, paintTerrain);
      lastPointRef.current = { x, y };
      updateBackgroundFromTexture();
    } else if (activeTool === 'eraser') {
      interpolatePoints(lastPointRef.current.x, lastPointRef.current.y, x, y, eraseTerrain);
      lastPointRef.current = { x, y };
      updateBackgroundFromTexture();
    }
  }, [activeTool, zoom, pan, interpolatePoints, paintTerrain, eraseTerrain, updateBackgroundFromTexture]);

  const handleMouseUp = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      updateBackgroundFromTexture();
      saveToHistory();
    }
  }, [updateBackgroundFromTexture]);

  // History management
  const saveToHistory = useCallback(() => {
    if (!fabricRef.current || !textureLayerRef.current) return;
    
    const canvasData = textureLayerRef.current.toDataURL();
    const newState: HistoryState = {
      canvasData,
      paths: [...paths],
      markers: [...markers]
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newState];
    });
    setHistoryIndex(prev => prev + 1);
  }, [paths, markers, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const prevIndex = historyIndex - 1;
    const state = history[prevIndex];
    
    if (state && textureLayerRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = textureLayerRef.current!.getContext('2d')!;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        updateBackgroundFromTexture();
      };
      img.src = state.canvasData;
      
      setPaths(state.paths);
      setMarkers(state.markers);
      setHistoryIndex(prevIndex);
    }
  }, [historyIndex, history, width, height, updateBackgroundFromTexture]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    const nextIndex = historyIndex + 1;
    const state = history[nextIndex];
    
    if (state && textureLayerRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = textureLayerRef.current!.getContext('2d')!;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        updateBackgroundFromTexture();
      };
      img.src = state.canvasData;
      
      setPaths(state.paths);
      setMarkers(state.markers);
      setHistoryIndex(nextIndex);
    }
  }, [historyIndex, history, width, height, updateBackgroundFromTexture]);

  // Finish path
  const finishPath = useCallback(() => {
    if (currentPath.length < 2) {
      setCurrentPath([]);
      setIsDrawingPath(false);
      return;
    }
    
    const newPath: MapPath = {
      id: `path_${Date.now()}`,
      points: currentPath,
      color: pathColor,
      width: pathWidth,
      style: 'solid'
    };
    
    setPaths(prev => [...prev, newPath]);
    setCurrentPath([]);
    setIsDrawingPath(false);
    saveToHistory();
    toast.success('Маршрут создан');
  }, [currentPath, pathColor, pathWidth, saveToHistory]);

  const cancelPath = useCallback(() => {
    setCurrentPath([]);
    setIsDrawingPath(false);
  }, []);

  // Export
  const exportAsImage = useCallback(() => {
    if (!textureLayerRef.current) return;
    
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d')!;
    
    // Draw texture layer
    ctx.drawImage(textureLayerRef.current, 0, 0);
    
    // Draw paths
    paths.forEach(path => {
      if (path.points.length < 2) return;
      
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
    
    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    
    const link = document.createElement('a');
    link.download = `map_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    
    toast.success('Карта экспортирована!');
  }, [width, height, paths, showGrid, gridSize]);

  // Zoom controls
  const zoomIn = useCallback(() => setZoom(z => Math.min(z * 1.2, 5)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(z / 1.2, 0.2)), []);
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (!textureLayerRef.current) return;
    
    const ctx = textureLayerRef.current.getContext('2d')!;
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 0, width, height);
    
    updateBackgroundFromTexture();
    setPaths([]);
    setMarkers([]);
    saveToHistory();
    
    toast.success('Холст очищен');
  }, [width, height, updateBackgroundFromTexture, saveToHistory]);

  // Fill terrain
  const fillTerrain = useCallback((terrain: TerrainType) => {
    if (!textureLayerRef.current) return;
    
    const texture = textureGenerator.generateTerrainTexture(terrain, width, height);
    const ctx = textureLayerRef.current.getContext('2d')!;
    ctx.drawImage(texture, 0, 0);
    
    updateBackgroundFromTexture();
    saveToHistory();
    
    toast.success(`Заливка: ${terrain}`);
  }, [width, height, updateBackgroundFromTexture, saveToHistory]);

  return {
    canvasRef,
    fabricRef,
    isReady,
    activeTool,
    setActiveTool,
    zoom,
    setZoom,
    pan,
    setPan,
    brushSettings,
    setBrushSettings,
    paths,
    setPaths,
    currentPath,
    isDrawingPath,
    pathColor,
    setPathColor,
    pathWidth,
    setPathWidth,
    markers,
    setMarkers,
    showGrid,
    setShowGrid,
    gridSize,
    setGridSize,
    cursorPosition,
    activeLayerId,
    setActiveLayerId,
    historyIndex,
    history,
    
    // Methods
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undo,
    redo,
    finishPath,
    cancelPath,
    exportAsImage,
    zoomIn,
    zoomOut,
    resetZoom,
    clearCanvas,
    fillTerrain,
    saveToHistory,
  };
}
