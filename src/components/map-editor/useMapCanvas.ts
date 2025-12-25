import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, FabricText, PencilBrush, IText, Group, Line, Rect, Ellipse, Polygon, Point, FabricImage, FabricObject, ActiveSelection } from 'fabric';
import type { ToolType, TerrainType, MarkerType, MapState, ObjectNote } from './types';
import { TERRAIN_CONFIGS, MARKER_CONFIGS } from './types';
import { toast } from 'sonner';
import type { MapTemplate } from './MapTemplates';
import type { Asset } from './AssetLibrary';
import type { PathPoint, MapPath } from './PathTool';

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
  const [fillOpacity, setFillOpacity] = useState(100);
  const [gridSize, setGridSize] = useState(40);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showFog, setShowFog] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [objectNotes, setObjectNotes] = useState<ObjectNote[]>([]);
  const [measureDistance, setMeasureDistance] = useState<number | null>(null);
  const [measureUnit, setMeasureUnit] = useState('футы');
  const [pixelsPerUnit, setPixelsPerUnit] = useState(40);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [lockedObjects, setLockedObjects] = useState<Set<string>>(new Set());
  
  // Path tool state
  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathPoint[]>([]);
  const [paths, setPaths] = useState<MapPath[]>([]);
  const [pathColor, setPathColor] = useState('#eab308');
  
  // Snap rotation angles
  const [snapRotation, setSnapRotation] = useState(false);
  
  const clipboardRef = useRef<FabricObject[]>([]);
  const measurePointRef = useRef<{ x: number; y: number } | null>(null);
  const measureLineRef = useRef<Line | null>(null);
  const pathLinesRef = useRef<Line[]>([]);
  const pathDotsRef = useRef<Circle[]>([]);
  
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
    
    // Track selection for notes
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      if (obj) {
        const objId = (obj as any).customId || obj.toString();
        setSelectedObjectId(objId);
      }
    });
    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      if (obj) {
        const objId = (obj as any).customId || obj.toString();
        setSelectedObjectId(objId);
      }
    });
    canvas.on('selection:cleared', () => {
      setSelectedObjectId(null);
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
      
      // Update cursor position
      setCursorPosition({ x: Math.round(pointer.x), y: Math.round(pointer.y) });
      
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

  // Fill tool - fill area with color
  const fillAtPoint = useCallback((x: number, y: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Create a filled rectangle at click position (simple fill implementation)
    const terrain = TERRAIN_CONFIGS.find(t => t.id === activeTerrain);
    const color = terrain?.color || fillColor;
    
    const fillRect = new Rect({
      left: x - 50,
      top: y - 50,
      width: 100,
      height: 100,
      fill: color,
      opacity: fillOpacity / 100,
      selectable: true,
    });
    
    canvas.add(fillRect);
    canvas.renderAll();
    saveToHistory();
  }, [activeTerrain, fillColor, fillOpacity, saveToHistory]);

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
    } else if (activeTool === 'fill') {
      fillAtPoint(x, y);
    } else if (activeTool === 'measure') {
      measureAtPoint(x, y);
    } else if (activeTool === 'eyedropper') {
      pickColorAt(x, y);
    } else if (activeTool === 'path' && isDrawingPath) {
      addPathPoint(x, y);
    }
  }, [activeTool, zoom, addMarker, addText, addPolygonPoint, fillAtPoint, isDrawingPath]);
  
  // Measure distance between two points
  const measureAtPoint = useCallback((x: number, y: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (!measurePointRef.current) {
      // First point
      measurePointRef.current = { x, y };
      const dot = new Circle({
        left: x - 5,
        top: y - 5,
        radius: 5,
        fill: '#eab308',
        stroke: '#ffffff',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      (dot as any).isMeasure = true;
      canvas.add(dot);
      canvas.renderAll();
      toast.info('Кликните на вторую точку для измерения');
    } else {
      // Second point - calculate distance
      const startX = measurePointRef.current.x;
      const startY = measurePointRef.current.y;
      const distance = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      
      // Remove old measure elements
      const measureElements = canvas.getObjects().filter((obj: any) => obj.isMeasure);
      measureElements.forEach((el) => canvas.remove(el));
      
      // Draw measurement line
      const line = new Line([startX, startY, x, y], {
        stroke: '#eab308',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });
      (line as any).isMeasure = true;
      
      // Draw end point
      const endDot = new Circle({
        left: x - 5,
        top: y - 5,
        radius: 5,
        fill: '#eab308',
        stroke: '#ffffff',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      (endDot as any).isMeasure = true;
      
      // Draw start point
      const startDot = new Circle({
        left: startX - 5,
        top: startY - 5,
        radius: 5,
        fill: '#eab308',
        stroke: '#ffffff',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      (startDot as any).isMeasure = true;
      
      canvas.add(line, startDot, endDot);
      canvas.renderAll();
      
      setMeasureDistance(distance);
      measurePointRef.current = null;
    }
  }, []);

  // Clear measurement
  const clearMeasurement = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const measureElements = canvas.getObjects().filter((obj: any) => obj.isMeasure);
    measureElements.forEach((el) => canvas.remove(el));
    canvas.renderAll();
    
    measurePointRef.current = null;
    setMeasureDistance(null);
  }, []);

  // Apply template
  const applyTemplate = useCallback((template: MapTemplate) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = template.backgroundColor;

    template.objects.forEach((obj) => {
      if (obj.type === 'rect') {
        const rect = new Rect({
          ...obj.props,
          selectable: true,
        });
        canvas.add(rect);
      } else if (obj.type === 'circle') {
        const circle = new Circle({
          ...obj.props,
          selectable: true,
        });
        canvas.add(circle);
      }
    });

    canvas.renderAll();
    saveToHistory();
    toast.success(`Шаблон "${template.name}" применён`);
  }, [saveToHistory]);

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

  // Import background image
  const importBackgroundImage = useCallback((file: File) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      const imgElement = new Image();
      imgElement.src = dataUrl;
      imgElement.onload = () => {
        const fabricImage = new FabricImage(imgElement, {
          left: 0,
          top: 0,
          selectable: true,
          evented: true,
        });
        
        // Scale to fit canvas while maintaining aspect ratio
        const scaleX = width / imgElement.width;
        const scaleY = height / imgElement.height;
        const scale = Math.min(scaleX, scaleY, 1);
        fabricImage.scale(scale);
        
        canvas.add(fabricImage);
        canvas.sendObjectToBack(fabricImage);
        canvas.renderAll();
        saveToHistory();
        toast.success('Изображение добавлено');
      };
    };
    reader.readAsDataURL(file);
  }, [width, height, saveToHistory]);

  // Copy selected objects
  const copySelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      toast.info('Выберите объекты для копирования');
      return;
    }

    clipboardRef.current = activeObjects;
    toast.success(`Скопировано ${activeObjects.length} объект(ов)`);
  }, []);

  // Paste objects
  const pasteObjects = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || clipboardRef.current.length === 0) {
      toast.info('Буфер обмена пуст');
      return;
    }

    clipboardRef.current.forEach((obj) => {
      obj.clone().then((cloned: FabricObject) => {
        cloned.set({
          left: (obj.left || 0) + 20,
          top: (obj.top || 0) + 20,
          evented: true,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
      });
    });
    
    canvas.renderAll();
    saveToHistory();
    toast.success('Объекты вставлены');
  }, [saveToHistory]);

  // Toggle fog of war
  const toggleFogOfWar = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (showFog) {
      // Remove fog layer
      const fogLayers = canvas.getObjects().filter((obj: any) => obj.isFog);
      fogLayers.forEach((fog) => canvas.remove(fog));
      setShowFog(false);
      toast.success('Туман войны убран');
    } else {
      // Add fog layer
      const fog = new Rect({
        left: 0,
        top: 0,
        width: width,
        height: height,
        fill: 'rgba(0, 0, 0, 0.85)',
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });
      (fog as any).isFog = true;
      canvas.add(fog);
      setShowFog(true);
      toast.success('Туман войны добавлен. Используйте ластик для открытия областей.');
    }
    canvas.renderAll();
  }, [showFog, width, height]);

  // Reveal area in fog (eraser mode for fog)
  const revealFogArea = useCallback((x: number, y: number, radius: number = 50) => {
    const canvas = fabricRef.current;
    if (!canvas || !showFog) return;

    // Add a "reveal" circle that cuts through fog
    const reveal = new Circle({
      left: x - radius,
      top: y - radius,
      radius: radius,
      fill: 'transparent',
      stroke: '#eab308',
      strokeWidth: 2,
      selectable: true,
      evented: true,
    });
    (reveal as any).isReveal = true;
    
    canvas.add(reveal);
    canvas.renderAll();
  }, [showFog]);

  // Snap position to grid
  const snapPosition = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Group selected objects
  const groupSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeSelection = canvas.getActiveObject();
    if (!activeSelection || activeSelection.type !== 'activeSelection') {
      toast.info('Выберите несколько объектов для группировки');
      return;
    }

    const objects = (activeSelection as ActiveSelection).getObjects();
    if (objects.length < 2) {
      toast.info('Выберите минимум 2 объекта');
      return;
    }

    const group = new Group(objects, {
      left: activeSelection.left,
      top: activeSelection.top,
    });

    objects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    saveToHistory();
    toast.success('Объекты сгруппированы');
  }, [saveToHistory]);

  // Ungroup selected group
  const ungroupSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'group') {
      toast.info('Выберите группу для разгруппировки');
      return;
    }

    const group = activeObject as Group;
    const items = group.getObjects();
    const { left = 0, top = 0, scaleX = 1, scaleY = 1, angle = 0 } = group;

    canvas.remove(group);

    items.forEach(item => {
      item.set({
        left: left + (item.left || 0) * scaleX,
        top: top + (item.top || 0) * scaleY,
        scaleX: (item.scaleX || 1) * scaleX,
        scaleY: (item.scaleY || 1) * scaleY,
        angle: (item.angle || 0) + angle,
      });
      item.setCoords();
      canvas.add(item);
    });

    canvas.renderAll();
    saveToHistory();
    toast.success('Группа разгруппирована');
  }, [saveToHistory]);

  // Duplicate selected objects
  const duplicateSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      toast.info('Выберите объекты для дублирования');
      return;
    }

    Promise.all(activeObjects.map(obj => obj.clone())).then(clones => {
      clones.forEach((cloned: FabricObject) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
          evented: true,
        });
        canvas.add(cloned);
      });
      canvas.discardActiveObject();
      if (clones.length === 1) {
        canvas.setActiveObject(clones[0]);
      }
      canvas.renderAll();
      saveToHistory();
      toast.success(`Дублировано ${clones.length} объект(ов)`);
    });
  }, [saveToHistory]);

  // Toggle lock on selected objects
  const toggleLockSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      toast.info('Выберите объекты для блокировки');
      return;
    }

    activeObjects.forEach(obj => {
      const isLocked = obj.lockMovementX;
      obj.set({
        lockMovementX: !isLocked,
        lockMovementY: !isLocked,
        lockScalingX: !isLocked,
        lockScalingY: !isLocked,
        lockRotation: !isLocked,
        hasControls: isLocked,
        selectable: true,
      });
    });

    canvas.renderAll();
    const isNowLocked = activeObjects[0].lockMovementX;
    toast.success(isNowLocked ? 'Объекты заблокированы' : 'Объекты разблокированы');
  }, []);

  // Pick color from canvas
  const pickColorAt = useCallback((x: number, y: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Get objects at point
    const objects = canvas.getObjects();
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (obj.containsPoint(new Point(x, y))) {
        const objFill = obj.fill;
        if (typeof objFill === 'string') {
          setFillColor(objFill);
          toast.success(`Цвет: ${objFill}`);
          setActiveTool('brush');
          return;
        }
      }
    }
    
    // If no object found, pick background
    const bgColor = canvas.backgroundColor;
    if (typeof bgColor === 'string') {
      setFillColor(bgColor);
      toast.success(`Цвет фона: ${bgColor}`);
    }
  }, [setActiveTool]);

  // Bring object to front
  const bringToFront = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringObjectToFront(activeObject);
      canvas.renderAll();
      saveToHistory();
    }
  }, [saveToHistory]);

  // Send object to back
  const sendToBack = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendObjectToBack(activeObject);
      canvas.renderAll();
      saveToHistory();
    }
  }, [saveToHistory]);

  // Add note to object
  const addObjectNote = useCallback((objectId: string, text: string) => {
    const note: ObjectNote = {
      id: crypto.randomUUID(),
      objectId,
      text,
      createdAt: new Date().toISOString(),
    };
    setObjectNotes(prev => [...prev, note]);
    toast.success('Заметка добавлена');
  }, []);

  // Delete note
  const deleteObjectNote = useCallback((noteId: string) => {
    setObjectNotes(prev => prev.filter(n => n.id !== noteId));
    toast.success('Заметка удалена');
  }, []);

  // Export JSON
  const exportAsJSON = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

    const data = {
      version: 1,
      width,
      height,
      backgroundColor: canvas.backgroundColor,
      canvasData: canvas.toJSON(),
      notes: objectNotes,
    };
    
    return JSON.stringify(data, null, 2);
  }, [width, height, objectNotes]);

  // Import JSON
  const importFromJSON = useCallback((data: object) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      const mapData = data as any;
      isLoadingRef.current = true;
      
      canvas.loadFromJSON(mapData.canvasData).then(() => {
        canvas.backgroundColor = mapData.backgroundColor || '#1a1a2e';
        canvas.renderAll();
        isLoadingRef.current = false;
        saveToHistory();
        
        if (mapData.notes) {
          setObjectNotes(mapData.notes);
        }
        
        toast.success('Карта импортирована');
      });
    } catch (error) {
      toast.error('Ошибка импорта карты');
    }
  }, [saveToHistory]);

  // Path tool functions
  const addPathPoint = useCallback((x: number, y: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const newPoint = { x, y };
    
    // Draw dot at point
    const dot = new Circle({
      left: x - 4,
      top: y - 4,
      radius: 4,
      fill: pathColor,
      stroke: '#ffffff',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    (dot as any).isPathElement = true;
    pathDotsRef.current.push(dot);
    canvas.add(dot);

    // Draw line from previous point if exists
    if (currentPath.length > 0) {
      const prevPoint = currentPath[currentPath.length - 1];
      const line = new Line([prevPoint.x, prevPoint.y, x, y], {
        stroke: pathColor,
        strokeWidth: 3,
        selectable: false,
        evented: false,
      });
      (line as any).isPathElement = true;
      pathLinesRef.current.push(line);
      canvas.add(line);
    }

    canvas.renderAll();
    setCurrentPath(prev => [...prev, newPoint]);
  }, [pathColor, currentPath]);

  const startPath = useCallback(() => {
    setIsDrawingPath(true);
    setCurrentPath([]);
    setActiveTool('path');
    toast.info('Кликайте на карту для создания маршрута');
  }, []);

  const finishPath = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || currentPath.length < 2) return;

    // Calculate total distance
    let totalDistance = 0;
    for (let i = 1; i < currentPath.length; i++) {
      totalDistance += Math.sqrt(
        Math.pow(currentPath[i].x - currentPath[i - 1].x, 2) +
        Math.pow(currentPath[i].y - currentPath[i - 1].y, 2)
      );
    }

    const newPath: MapPath = {
      id: crypto.randomUUID(),
      points: [...currentPath],
      color: pathColor,
      totalDistance,
    };

    setPaths(prev => [...prev, newPath]);
    setIsDrawingPath(false);
    setCurrentPath([]);
    pathLinesRef.current = [];
    pathDotsRef.current = [];
    saveToHistory();
    toast.success('Маршрут сохранён');
  }, [currentPath, pathColor, saveToHistory]);

  const cancelPath = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Remove all path elements
    pathLinesRef.current.forEach(line => canvas.remove(line));
    pathDotsRef.current.forEach(dot => canvas.remove(dot));
    pathLinesRef.current = [];
    pathDotsRef.current = [];
    canvas.renderAll();

    setIsDrawingPath(false);
    setCurrentPath([]);
    setActiveTool('select');
  }, []);

  const deletePath = useCallback((pathId: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Remove visual elements for this path
    const pathElements = canvas.getObjects().filter((obj: any) => obj.pathId === pathId);
    pathElements.forEach(el => canvas.remove(el));
    canvas.renderAll();

    setPaths(prev => prev.filter(p => p.id !== pathId));
    toast.success('Маршрут удалён');
  }, []);

  const clearAllPaths = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const pathElements = canvas.getObjects().filter((obj: any) => obj.isPathElement);
    pathElements.forEach(el => canvas.remove(el));
    canvas.renderAll();

    setPaths([]);
    toast.success('Все маршруты удалены');
  }, []);

  // Add asset to canvas
  const addAsset = useCallback((asset: Asset, x?: number, y?: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const posX = x ?? width / 2;
    const posY = y ?? height / 2;
    const size = asset.size || 30;

    const circle = new Circle({
      radius: size / 2 + 5,
      fill: asset.color + '33',
      stroke: asset.color,
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });

    const text = new FabricText(asset.emoji || '?', {
      fontSize: size,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });

    const group = new Group([circle, text], {
      left: posX - size / 2,
      top: posY - size / 2,
      selectable: true,
      hasControls: true,
    });

    (group as any).customId = `asset_${asset.id}_${Date.now()}`;
    (group as any).assetType = asset.id;

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    saveToHistory();
    toast.success(`Добавлен: ${asset.name}`);
  }, [width, height, saveToHistory]);

  // Snap rotation to angles (15, 45, 90)
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleRotating = (e: any) => {
      if (!snapRotation) return;
      
      const obj = e.target;
      if (!obj) return;

      const angle = obj.angle || 0;
      const snapAngles = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360];
      
      let closestAngle = snapAngles[0];
      let minDiff = Math.abs(angle - snapAngles[0]);
      
      for (const snap of snapAngles) {
        const diff = Math.abs(angle - snap);
        if (diff < minDiff) {
          minDiff = diff;
          closestAngle = snap;
        }
      }
      
      if (minDiff < 5) {
        obj.set('angle', closestAngle === 360 ? 0 : closestAngle);
      }
    };

    canvas.on('object:rotating', handleRotating);

    return () => {
      canvas.off('object:rotating', handleRotating);
    };
  }, [snapRotation]);

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
    fillOpacity,
    setFillOpacity,
    gridSize,
    setGridSize,
    snapToGrid,
    setSnapToGrid,
    showFog,
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
    fillAtPoint,
    applyTemplate,
    importBackgroundImage,
    copySelected,
    pasteObjects,
    toggleFogOfWar,
    revealFogArea,
    measureDistance,
    measureUnit,
    setMeasureUnit,
    pixelsPerUnit,
    setPixelsPerUnit,
    clearMeasurement,
    selectedObjectId,
    objectNotes,
    addObjectNote,
    deleteObjectNote,
    exportAsJSON,
    importFromJSON,
    cursorPosition,
    groupSelected,
    ungroupSelected,
    duplicateSelected,
    toggleLockSelected,
    bringToFront,
    sendToBack,
    // Path tool
    isDrawingPath,
    currentPath,
    paths,
    pathColor,
    setPathColor,
    startPath,
    finishPath,
    cancelPath,
    deletePath,
    clearAllPaths,
    // Asset
    addAsset,
    // Snap rotation
    snapRotation,
    setSnapRotation,
  };
};
