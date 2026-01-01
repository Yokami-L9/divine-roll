// Asset Manager Hook - Handles asset selection, placement, and transformations

import { useState, useCallback, useRef, useEffect } from 'react';
import { MapAsset } from '../types';
import { AssetRenderer } from '../engine/AssetRenderer';

interface UseAssetManagerProps {
  assets: MapAsset[];
  onAddAsset: (asset: Omit<MapAsset, 'id'>) => MapAsset;
  onUpdateAsset: (assetId: string, updates: Partial<MapAsset>) => void;
  onDeleteAsset: (assetId: string) => void;
}

interface DragState {
  type: 'move' | 'rotate' | 'scale';
  startX: number;
  startY: number;
  startAssetX: number;
  startAssetY: number;
  startRotation: number;
  startScale: number;
  scaleHandle?: 'scale-tl' | 'scale-tr' | 'scale-bl' | 'scale-br';
}

export function useAssetManager({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}: UseAssetManagerProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  const [placingAssetId, setPlacingAssetId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const assetRendererRef = useRef<AssetRenderer | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  // Initialize renderer
  useEffect(() => {
    assetRendererRef.current = new AssetRenderer();
  }, []);

  const getAssetRenderer = useCallback(() => {
    if (!assetRendererRef.current) {
      assetRendererRef.current = new AssetRenderer();
    }
    return assetRendererRef.current;
  }, []);

  const getSelectedAsset = useCallback((): MapAsset | null => {
    if (!selectedAssetId) return null;
    return assets.find(a => a.id === selectedAssetId) || null;
  }, [selectedAssetId, assets]);

  const selectAssetForPlacement = useCallback((assetId: string) => {
    setPlacingAssetId(assetId);
    setSelectedAssetId(null);
  }, []);

  const placeAsset = useCallback((x: number, y: number) => {
    if (!placingAssetId) return null;
    
    const maxZIndex = assets.reduce((max, a) => Math.max(max, a.zIndex), 0);
    
    const newAsset = onAddAsset({
      assetId: placingAssetId,
      x,
      y,
      scale: 1,
      rotation: 0,
      flipX: false,
      zIndex: maxZIndex + 1,
    });
    
    setSelectedAssetId(newAsset.id);
    // Keep placingAssetId to allow multiple placements
    return newAsset;
  }, [placingAssetId, assets, onAddAsset]);

  const cancelPlacement = useCallback(() => {
    setPlacingAssetId(null);
  }, []);

  const handleMouseDown = useCallback((canvasX: number, canvasY: number): boolean => {
    const renderer = getAssetRenderer();
    
    // Check if clicking on selected asset's handles
    const selectedAsset = getSelectedAsset();
    if (selectedAsset) {
      const handle = renderer.getHandleAtPoint(canvasX, canvasY, selectedAsset);
      if (handle) {
        setIsDragging(true);
        dragStateRef.current = {
          type: handle === 'rotate' ? 'rotate' : 'scale',
          startX: canvasX,
          startY: canvasY,
          startAssetX: selectedAsset.x,
          startAssetY: selectedAsset.y,
          startRotation: selectedAsset.rotation,
          startScale: selectedAsset.scale,
          scaleHandle: handle !== 'rotate' ? handle : undefined,
        };
        return true;
      }
    }
    
    // Check if clicking on any asset
    const hitAsset = renderer.hitTest(canvasX, canvasY, assets);
    if (hitAsset) {
      setSelectedAssetId(hitAsset.id);
      setIsDragging(true);
      dragStateRef.current = {
        type: 'move',
        startX: canvasX,
        startY: canvasY,
        startAssetX: hitAsset.x,
        startAssetY: hitAsset.y,
        startRotation: hitAsset.rotation,
        startScale: hitAsset.scale,
      };
      return true;
    }
    
    // Clicked on empty space
    setSelectedAssetId(null);
    return false;
  }, [assets, getSelectedAsset, getAssetRenderer]);

  const handleMouseMove = useCallback((canvasX: number, canvasY: number): boolean => {
    const renderer = getAssetRenderer();
    
    if (isDragging && dragStateRef.current && selectedAssetId) {
      const drag = dragStateRef.current;
      
      if (drag.type === 'move') {
        const dx = canvasX - drag.startX;
        const dy = canvasY - drag.startY;
        onUpdateAsset(selectedAssetId, {
          x: drag.startAssetX + dx,
          y: drag.startAssetY + dy,
        });
      } else if (drag.type === 'rotate') {
        // Calculate angle from asset center to mouse
        const asset = getSelectedAsset();
        if (asset) {
          const angle = Math.atan2(canvasY - asset.y, canvasX - asset.x);
          const degrees = (angle * 180) / Math.PI + 90;
          onUpdateAsset(selectedAssetId, { rotation: degrees });
        }
      } else if (drag.type === 'scale') {
        const asset = getSelectedAsset();
        if (asset) {
          const startDist = Math.sqrt(
            Math.pow(drag.startX - drag.startAssetX, 2) + 
            Math.pow(drag.startY - drag.startAssetY, 2)
          );
          const currentDist = Math.sqrt(
            Math.pow(canvasX - asset.x, 2) + 
            Math.pow(canvasY - asset.y, 2)
          );
          const scaleFactor = currentDist / startDist;
          const newScale = Math.max(0.1, Math.min(5, drag.startScale * scaleFactor));
          onUpdateAsset(selectedAssetId, { scale: newScale });
        }
      }
      return true;
    }
    
    // Update hover state
    const hitAsset = renderer.hitTest(canvasX, canvasY, assets);
    setHoveredAssetId(hitAsset?.id || null);
    
    return false;
  }, [isDragging, selectedAssetId, assets, getSelectedAsset, onUpdateAsset, getAssetRenderer]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStateRef.current = null;
  }, []);

  const rotateSelected = useCallback((degrees: number) => {
    if (!selectedAssetId) return;
    const asset = getSelectedAsset();
    if (asset) {
      onUpdateAsset(selectedAssetId, {
        rotation: (asset.rotation + degrees) % 360,
      });
    }
  }, [selectedAssetId, getSelectedAsset, onUpdateAsset]);

  const scaleSelected = useCallback((delta: number) => {
    if (!selectedAssetId) return;
    const asset = getSelectedAsset();
    if (asset) {
      const newScale = Math.max(0.1, Math.min(5, asset.scale + delta));
      onUpdateAsset(selectedAssetId, { scale: newScale });
    }
  }, [selectedAssetId, getSelectedAsset, onUpdateAsset]);

  const flipSelected = useCallback(() => {
    if (!selectedAssetId) return;
    const asset = getSelectedAsset();
    if (asset) {
      onUpdateAsset(selectedAssetId, { flipX: !asset.flipX });
    }
  }, [selectedAssetId, getSelectedAsset, onUpdateAsset]);

  const deleteSelected = useCallback(() => {
    if (!selectedAssetId) return;
    onDeleteAsset(selectedAssetId);
    setSelectedAssetId(null);
  }, [selectedAssetId, onDeleteAsset]);

  const bringToFront = useCallback(() => {
    if (!selectedAssetId) return;
    const maxZIndex = assets.reduce((max, a) => Math.max(max, a.zIndex), 0);
    onUpdateAsset(selectedAssetId, { zIndex: maxZIndex + 1 });
  }, [selectedAssetId, assets, onUpdateAsset]);

  const sendToBack = useCallback(() => {
    if (!selectedAssetId) return;
    const minZIndex = assets.reduce((min, a) => Math.min(min, a.zIndex), 0);
    onUpdateAsset(selectedAssetId, { zIndex: minZIndex - 1 });
  }, [selectedAssetId, assets, onUpdateAsset]);

  return {
    selectedAssetId,
    hoveredAssetId,
    placingAssetId,
    isDragging,
    getAssetRenderer,
    getSelectedAsset,
    selectAssetForPlacement,
    placeAsset,
    cancelPlacement,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    rotateSelected,
    scaleSelected,
    flipSelected,
    deleteSelected,
    bringToFront,
    sendToBack,
    setSelectedAssetId,
  };
}
