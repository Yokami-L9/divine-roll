import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, FabricText, PencilBrush, IText, Group, Line, Rect, Ellipse, Polygon, Point } from 'fabric';
import type { ToolType, TerrainType, MarkerType, MapState } from './types';
import { TERRAIN_CONFIGS, MARKER_CONFIGS } from './types';
import { toast } from 'sonner';

interface UseMapCanvasOptions {
  width: number;
  height: number;
  initialData?: object | null;
  onSave?: (data: MapState) => void;
}

export const useMapCanvas = ({ width, height, initialData, onSave }: UseMapCanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [activeTerrain, setActiveTerrain] = useState<TerrainType>('grass');
  const [activeMarker, setActiveMarker] = useState<MarkerType>('city');
  const [brushSize, setBrushSize] = useState(30);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fillColor, setFillColor] = useState('#4a7c59');
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isLoadingRef = useRef(false);
  const isPanningRef = useRef(false);
  const isDrawingShapeRef = useRef(false);
  const shapeStartRef = useRef({ x: 0, y: 0 });
  const currentShapeRef = useRef<any>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const activeToolRef = useRef(activeTool);
  const zoomRef = useRef(zoom);
  const polygonPointsRef = useRef<Point[]>([]);

  // Keep refs in sync
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // Save to history for undo/redo
  const saveToHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());
    
    // Remove future states if we're not at the end
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    
    historyRef.current.push(json);
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Limit history size
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
    
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#1a1a2e',
      selection: true,
    });

    // Setup brush
    const brush = new PencilBrush(canvas);
    brush.color = TERRAIN_CONFIGS[0].color;
    brush.width = 30;
    canvas.freeDrawingBrush = brush;

    fabricRef.current = canvas;
    setIsReady(true);

    // Load initial data if provided
    if (initialData && typeof initialData === 'object' && 'canvasData' in initialData) {
      const mapState = initialData as MapState;
      if (mapState.canvasData && Object.keys(mapState.canvasData).length > 0) {
        isLoadingRef.current = true;
        canvas.loadFromJSON(mapState.canvasData).then(() => {
          canvas.renderAll();
          isLoadingRef.current = false;
          saveToHistory();
        });
      } else {
        saveToHistory();
      }
    } else {
      saveToHistory();
    }

    // Track changes for undo/redo
    canvas.on('object:added', () => {
      if (!isLoadingRef.current && !isDrawingShapeRef.current) saveToHistory();
    });
    canvas.on('object:modified', () => {
      if (!isLoadingRef.current) saveToHistory();
    });
    canvas.on('object:removed', () => {
      if (!isLoadingRef.current) saveToHistory();
    });

    // Mouse handlers for shapes and pan
    canvas.on('mouse:down', (opt) => {
      const tool = activeToolRef.current;
      const pointer = canvas.getPointer(opt.e);
      
      if (tool === 'pan') {
        isPanningRef.current = true;
        canvas.selection = false;
        lastPosRef.current = { x: pointer.x, y: pointer.y };
        canvas.defaultCursor = 'grabbing';
      } else if (['line', 'rect', 'ellipse'].includes(tool)) {
        isDrawingShapeRef.current = true;
        shapeStartRef.current = { x: pointer.x, y: pointer.y };
        
        const terrain = TERRAIN_CONFIGS.find(t => t.id === activeTerrain);
        const color = terrain?.color || '#4a7c59';
        
        if (tool === 'line') {
          currentShapeRef.current = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            stroke: color,
            strokeWidth: strokeWidth,
            selectable: false,
          });
        } else if (tool === 'rect') {
          currentShapeRef.current = new Rect({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            fill: color,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            selectable: false,
          });
        } else if (tool === 'ellipse') {
          currentShapeRef.current = new Ellipse({
            left: pointer.x,
            top: pointer.y,
            rx: 0,
            ry: 0,
            fill: color,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            selectable: false,
          });
        }
        
        if (currentShapeRef.current) {
          canvas.add(currentShapeRef.current);
        }
      }
    });

    canvas.on('mouse:move', (opt) => {
      const tool = activeToolRef.current;
      const pointer = canvas.getPointer(opt.e);
      
      if (isPanningRef.current && tool === 'pan') {
        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += (pointer.x - lastPosRef.current.x) * zoomRef.current;
          vpt[5] += (pointer.y - lastPosRef.current.y) * zoomRef.current;
          canvas.requestRenderAll();
          lastPosRef.current = { x: pointer.x, y: pointer.y };
        }
      } else if (isDrawingShapeRef.current && currentShapeRef.current) {
        const startX = shapeStartRef.current.x;
        const startY = shapeStartRef.current.y;
        
        if (tool === 'line') {
          currentShapeRef.current.set({
            x2: pointer.x,
            y2: pointer.y,
          });
        } else if (tool === 'rect') {
          const width = Math.abs(pointer.x - startX);
          const height = Math.abs(pointer.y - startY);
          currentShapeRef.current.set({
            left: Math.min(startX, pointer.x),
            top: Math.min(startY, pointer.y),
            width,
            height,
          });
        } else if (tool === 'ellipse') {
          const rx = Math.abs(pointer.x - startX) / 2;
          const ry = Math.abs(pointer.y - startY) / 2;
          currentShapeRef.current.set({
            left: Math.min(startX, pointer.x),
            top: Math.min(startY, pointer.y),
            rx,
            ry,
          });
        }
        
        canvas.renderAll();
      }
    });

    canvas.on('mouse:up', () => {
      const tool = activeToolRef.current;
      
      isPanningRef.current = false;
      canvas.selection = tool === 'select';
      
      if (tool === 'pan') {
        canvas.defaultCursor = 'grab';
      }
      
      if (isDrawingShapeRef.current && currentShapeRef.current) {
        currentShapeRef.current.set({ selectable: true });
        canvas.setActiveObject(currentShapeRef.current);
        isDrawingShapeRef.current = false;
        currentShapeRef.current = null;
        saveToHistory();
      }
    });

    // Double-click to finish polygon
    canvas.on('mouse:dblclick', () => {
      if (activeToolRef.current === 'polygon' && polygonPointsRef.current.length >= 3) {
        const terrain = TERRAIN_CONFIGS.find(t => t.id === activeTerrain);
        const color = terrain?.color || '#4a7c59';
        
        const polygon = new Polygon(polygonPointsRef.current, {
          fill: color,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
        
        canvas.add(polygon);
        polygonPointsRef.current = [];
        saveToHistory();
      }
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [saveToHistory, strokeColor, strokeWidth, activeTerrain]);

  // Undo
  const undo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || historyIndexRef.current <= 0) return;

    historyIndexRef.current--;
    isLoadingRef.current = true;
    
    canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
      canvas.renderAll();
      isLoadingRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return;

    historyIndexRef.current++;
    isLoadingRef.current = true;
    
    canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
      canvas.renderAll();
      isLoadingRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  // Update tool mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const isDrawingTool = activeTool === 'brush' || activeTool === 'eraser';
    const isShapeTool = ['line', 'rect', 'ellipse', 'polygon'].includes(activeTool);
    
    canvas.isDrawingMode = isDrawingTool;
    canvas.selection = activeTool === 'select';

    if (canvas.freeDrawingBrush) {
      if (activeTool === 'eraser') {
        canvas.freeDrawingBrush.color = '#1a1a2e';
        canvas.freeDrawingBrush.width = brushSize;
      } else if (activeTool === 'brush') {
        const terrain = TERRAIN_CONFIGS.find(t => t.id === activeTerrain);
        canvas.freeDrawingBrush.color = terrain?.color || '#4a7c59';
        canvas.freeDrawingBrush.width = brushSize;
      }
    }

    // Update cursor
    if (activeTool === 'pan') {
      canvas.defaultCursor = 'grab';
      canvas.hoverCursor = 'grab';
    } else if (isDrawingTool || isShapeTool) {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    } else if (activeTool === 'marker' || activeTool === 'text') {
      canvas.defaultCursor = 'pointer';
      canvas.hoverCursor = 'pointer';
    } else {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
    }
  }, [activeTool, activeTerrain, brushSize]);

  // Update brush size
  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize]);

  // Handle zoom
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: width * zoom,
      height: height * zoom,
    });
  }, [zoom, width, height]);

  // Add marker
  const addMarker = useCallback((x: number, y: number, type?: MarkerType) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const markerType = type || activeMarker;
    const config = MARKER_CONFIGS.find(m => m.id === markerType);
    if (!config) return;

    const circle = new Circle({
      radius: 18,
      fill: config.color,
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });

    const text = new FabricText(config.icon, {
      fontSize: 18,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });

    const group = new Group([circle, text], {
      left: x - 18,
      top: y - 18,
      selectable: true,
      hasControls: true,
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  }, [activeMarker]);

  // Add text label
  const addText = useCallback((x: number, y: number, label: string = 'Название') => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new IText(label, {
      left: x,
      top: y,
      fontSize: 18,
      fill: '#ffffff',
      fontFamily: 'Georgia, serif',
      stroke: '#000000',
      strokeWidth: 0.5,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  }, []);

  // Add polygon point
  const addPolygonPoint = useCallback((x: number, y: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    polygonPointsRef.current.push(new Point(x, y));
    
    // Draw preview dot
    const dot = new Circle({
      left: x - 4,
      top: y - 4,
      radius: 4,
      fill: '#eab308',
      stroke: '#ffffff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
    
    canvas.add(dot);
    canvas.renderAll();
    
    if (polygonPointsRef.current.length >= 2) {
      toast.info(`${polygonPointsRef.current.length} точек. Двойной клик для завершения.`);
    }
  }, []);

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    if (canvas.getActiveObject()) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (activeTool === 'marker') {
      addMarker(x, y);
    } else if (activeTool === 'text') {
      addText(x, y);
    } else if (activeTool === 'polygon') {
      addPolygonPoint(x, y);
    }
  }, [activeTool, zoom, addMarker, addText, addPolygonPoint]);

  // Delete selected objects
  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      toast.success('Объекты удалены');
    }
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#1a1a2e';
    canvas.renderAll();
    polygonPointsRef.current = [];
    saveToHistory();
    toast.success('Холст очищен');
  }, [saveToHistory]);

  // Export as image
  const exportAsImage = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

    return canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
  }, []);

  // Get map state for saving
  const getMapState = useCallback((): MapState => {
    const canvas = fabricRef.current;
    return {
      width,
      height,
      backgroundColor: '#1a1a2e',
      layers: [],
      canvasData: canvas ? canvas.toJSON() : {},
    };
  }, [width, height]);

  // Save map
  const saveMap = useCallback(() => {
    if (onSave) {
      onSave(getMapState());
    }
  }, [getMapState, onSave]);

  return {
    canvasRef,
    isReady,
    activeTool,
    setActiveTool,
    activeTerrain,
    setActiveTerrain,
    activeMarker,
    setActiveMarker,
    brushSize,
    setBrushSize,
    strokeWidth,
    setStrokeWidth,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    zoom,
    setZoom,
    showGrid,
    setShowGrid,
    canUndo,
    canRedo,
    undo,
    redo,
    deleteSelected,
    clearCanvas,
    exportAsImage,
    getMapState,
    saveMap,
    handleCanvasClick,
  };
};
