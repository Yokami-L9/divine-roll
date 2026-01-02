// ============================================
// PATH EDITOR HOOK
// Selection, control point manipulation, path editing
// ============================================

import { useState, useCallback, useRef } from 'react';
import { MapPath, PathPoint } from '../types';

interface PathEditorState {
  selectedPathId: string | null;
  selectedPointIndex: number | null;
  hoveredPointIndex: number | null;
  isDraggingPoint: boolean;
  isDrawingPath: boolean;
  currentPathPoints: PathPoint[];
}

interface UsePathEditorProps {
  paths: MapPath[];
  addPath: (path: Omit<MapPath, 'id'>) => void;
  updatePath: (id: string, updates: Partial<MapPath>) => void;
  deletePath: (id: string) => void;
}

export function usePathEditor({ paths, addPath, updatePath, deletePath }: UsePathEditorProps) {
  const [state, setState] = useState<PathEditorState>({
    selectedPathId: null,
    selectedPointIndex: null,
    hoveredPointIndex: null,
    isDraggingPoint: false,
    isDrawingPath: false,
    currentPathPoints: [],
  });

  const pathSettingsRef = useRef<{ type: MapPath['type']; width: number; color: string; style: MapPath['style'] }>({
    type: 'road',
    width: 6,
    color: '#8B7355',
    style: 'solid',
  });

  const POINT_HIT_RADIUS = 12;

  // Path settings
  const setPathSettings = useCallback((settings: Partial<typeof pathSettingsRef.current>) => {
    pathSettingsRef.current = { ...pathSettingsRef.current, ...settings };
  }, []);

  // Select a path
  const selectPath = useCallback((pathId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedPathId: pathId,
      selectedPointIndex: null,
      hoveredPointIndex: null,
    }));
  }, []);

  // Get selected path
  const getSelectedPath = useCallback((): MapPath | null => {
    if (!state.selectedPathId) return null;
    return paths.find(p => p.id === state.selectedPathId) || null;
  }, [paths, state.selectedPathId]);

  // Start drawing a new path
  const startDrawing = useCallback((point: PathPoint) => {
    setState(prev => ({
      ...prev,
      isDrawingPath: true,
      currentPathPoints: [point],
      selectedPathId: null,
      selectedPointIndex: null,
    }));
  }, []);

  // Add point while drawing
  const addPointToCurrentPath = useCallback((point: PathPoint) => {
    setState(prev => ({
      ...prev,
      currentPathPoints: [...prev.currentPathPoints, point],
    }));
  }, []);

  // Finish drawing path
  const finishDrawing = useCallback(() => {
    if (state.currentPathPoints.length >= 2) {
      const settings = pathSettingsRef.current;
      addPath({
        type: settings.type,
        points: state.currentPathPoints,
        width: settings.width,
        color: settings.color,
        style: settings.style,
      });
    }
    setState(prev => ({
      ...prev,
      isDrawingPath: false,
      currentPathPoints: [],
    }));
  }, [state.currentPathPoints, addPath]);

  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDrawingPath: false,
      currentPathPoints: [],
    }));
  }, []);

  // Hit test for control points
  const hitTestPoint = useCallback((
    x: number, 
    y: number, 
    path: MapPath
  ): number | null => {
    for (let i = 0; i < path.points.length; i++) {
      const point = path.points[i];
      const dx = x - point.x;
      const dy = y - point.y;
      if (dx * dx + dy * dy <= POINT_HIT_RADIUS * POINT_HIT_RADIUS) {
        return i;
      }
    }
    return null;
  }, []);

  // Hit test for path itself (approximate)
  const hitTestPath = useCallback((x: number, y: number): string | null => {
    for (const path of paths) {
      for (let i = 0; i < path.points.length - 1; i++) {
        const p1 = path.points[i];
        const p2 = path.points[i + 1];
        
        // Distance from point to line segment
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) continue;
        
        const t = Math.max(0, Math.min(1, 
          ((x - p1.x) * dx + (y - p1.y) * dy) / (length * length)
        ));
        
        const closestX = p1.x + t * dx;
        const closestY = p1.y + t * dy;
        
        const distSq = (x - closestX) ** 2 + (y - closestY) ** 2;
        const hitRadius = Math.max(path.width / 2 + 5, 10);
        
        if (distSq <= hitRadius * hitRadius) {
          return path.id;
        }
      }
    }
    return null;
  }, [paths]);

  // Handle mouse down
  const handleMouseDown = useCallback((x: number, y: number): boolean => {
    // First check if clicking on a control point of selected path
    if (state.selectedPathId) {
      const selectedPath = paths.find(p => p.id === state.selectedPathId);
      if (selectedPath) {
        const pointIndex = hitTestPoint(x, y, selectedPath);
        if (pointIndex !== null) {
          setState(prev => ({
            ...prev,
            selectedPointIndex: pointIndex,
            isDraggingPoint: true,
          }));
          return true;
        }
      }
    }

    // Check if clicking on any path
    const pathId = hitTestPath(x, y);
    if (pathId) {
      const path = paths.find(p => p.id === pathId);
      if (path) {
        const pointIndex = hitTestPoint(x, y, path);
        setState(prev => ({
          ...prev,
          selectedPathId: pathId,
          selectedPointIndex: pointIndex,
          isDraggingPoint: pointIndex !== null,
        }));
        return true;
      }
    }

    // Deselect if clicking elsewhere
    if (state.selectedPathId) {
      setState(prev => ({
        ...prev,
        selectedPathId: null,
        selectedPointIndex: null,
      }));
    }

    return false;
  }, [state.selectedPathId, paths, hitTestPoint, hitTestPath]);

  // Handle mouse move
  const handleMouseMove = useCallback((x: number, y: number): void => {
    if (state.isDraggingPoint && state.selectedPathId && state.selectedPointIndex !== null) {
      const path = paths.find(p => p.id === state.selectedPathId);
      if (path) {
        const newPoints = [...path.points];
        newPoints[state.selectedPointIndex] = { x, y };
        updatePath(state.selectedPathId, { points: newPoints });
      }
      return;
    }

    // Update hover state for control points
    if (state.selectedPathId) {
      const path = paths.find(p => p.id === state.selectedPathId);
      if (path) {
        const pointIndex = hitTestPoint(x, y, path);
        if (pointIndex !== state.hoveredPointIndex) {
          setState(prev => ({ ...prev, hoveredPointIndex: pointIndex }));
        }
      }
    }
  }, [state, paths, updatePath, hitTestPoint]);

  // Handle mouse up
  const handleMouseUp = useCallback((): void => {
    if (state.isDraggingPoint) {
      setState(prev => ({ ...prev, isDraggingPoint: false }));
    }
  }, [state.isDraggingPoint]);

  // Add point to existing path
  const addPointToPath = useCallback((afterIndex: number) => {
    if (!state.selectedPathId) return;
    
    const path = paths.find(p => p.id === state.selectedPathId);
    if (!path || afterIndex < 0 || afterIndex >= path.points.length - 1) return;

    const p1 = path.points[afterIndex];
    const p2 = path.points[afterIndex + 1];
    const newPoint: PathPoint = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };

    const newPoints = [
      ...path.points.slice(0, afterIndex + 1),
      newPoint,
      ...path.points.slice(afterIndex + 1),
    ];
    
    updatePath(state.selectedPathId, { points: newPoints });
  }, [state.selectedPathId, paths, updatePath]);

  // Delete selected point
  const deleteSelectedPoint = useCallback(() => {
    if (!state.selectedPathId || state.selectedPointIndex === null) return;
    
    const path = paths.find(p => p.id === state.selectedPathId);
    if (!path || path.points.length <= 2) return;

    const newPoints = path.points.filter((_, i) => i !== state.selectedPointIndex);
    updatePath(state.selectedPathId, { points: newPoints });
    
    setState(prev => ({ ...prev, selectedPointIndex: null }));
  }, [state.selectedPathId, state.selectedPointIndex, paths, updatePath]);

  // Delete selected path
  const deleteSelectedPath = useCallback(() => {
    if (!state.selectedPathId) return;
    deletePath(state.selectedPathId);
    setState(prev => ({
      ...prev,
      selectedPathId: null,
      selectedPointIndex: null,
    }));
  }, [state.selectedPathId, deletePath]);

  // Close path (connect last point to first)
  const closePath = useCallback(() => {
    if (!state.selectedPathId) return;
    
    const path = paths.find(p => p.id === state.selectedPathId);
    if (!path || path.points.length < 3) return;

    const first = path.points[0];
    const last = path.points[path.points.length - 1];
    
    // Check if already closed
    if (first.x === last.x && first.y === last.y) return;

    const newPoints = [...path.points, { ...first }];
    updatePath(state.selectedPathId, { points: newPoints });
  }, [state.selectedPathId, paths, updatePath]);

  // Reverse path direction
  const reversePath = useCallback(() => {
    if (!state.selectedPathId) return;
    
    const path = paths.find(p => p.id === state.selectedPathId);
    if (!path) return;

    const newPoints = [...path.points].reverse();
    updatePath(state.selectedPathId, { points: newPoints });
  }, [state.selectedPathId, paths, updatePath]);

  return {
    // State
    selectedPathId: state.selectedPathId,
    selectedPointIndex: state.selectedPointIndex,
    hoveredPointIndex: state.hoveredPointIndex,
    isDrawingPath: state.isDrawingPath,
    currentPathPoints: state.currentPathPoints,
    isDraggingPoint: state.isDraggingPoint,
    
    // Actions
    selectPath,
    getSelectedPath,
    startDrawing,
    addPointToCurrentPath,
    finishDrawing,
    cancelDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    addPointToPath,
    deleteSelectedPoint,
    deleteSelectedPath,
    closePath,
    reversePath,
    setPathSettings,
    pathSettings: pathSettingsRef.current,
  };
}
