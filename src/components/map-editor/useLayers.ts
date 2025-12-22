import { useState, useCallback } from 'react';
import type { MapLayer } from './types';

export const useLayers = () => {
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'base', name: 'Базовый слой', visible: true, locked: false, objects: [] },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('base');

  const addLayer = useCallback(() => {
    const newLayer: MapLayer = {
      id: `layer-${Date.now()}`,
      name: `Слой ${layers.length + 1}`,
      visible: true,
      locked: false,
      objects: [],
    };
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }, [layers.length]);

  const deleteLayer = useCallback((id: string) => {
    setLayers(prev => {
      const filtered = prev.filter(l => l.id !== id);
      if (activeLayerId === id && filtered.length > 0) {
        setActiveLayerId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeLayerId]);

  const toggleVisibility = useCallback((id: string) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === id ? { ...l, visible: !l.visible } : l
      )
    );
  }, []);

  const toggleLock = useCallback((id: string) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === id ? { ...l, locked: !l.locked } : l
      )
    );
  }, []);

  const moveLayer = useCallback((id: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const index = prev.findIndex(l => l.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newLayers = [...prev];
      [newLayers[index], newLayers[newIndex]] = [newLayers[newIndex], newLayers[index]];
      return newLayers;
    });
  }, []);

  const renameLayer = useCallback((id: string, name: string) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === id ? { ...l, name } : l
      )
    );
  }, []);

  const addObjectToLayer = useCallback((layerId: string, objectId: string) => {
    setLayers(prev =>
      prev.map(l =>
        l.id === layerId ? { ...l, objects: [...l.objects, objectId] } : l
      )
    );
  }, []);

  const removeObjectFromLayer = useCallback((objectId: string) => {
    setLayers(prev =>
      prev.map(l => ({
        ...l,
        objects: l.objects.filter(id => id !== objectId),
      }))
    );
  }, []);

  const getActiveLayer = useCallback(() => {
    return layers.find(l => l.id === activeLayerId) || layers[0];
  }, [layers, activeLayerId]);

  return {
    layers,
    setLayers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    deleteLayer,
    toggleVisibility,
    toggleLock,
    moveLayer,
    renameLayer,
    addObjectToLayer,
    removeObjectFromLayer,
    getActiveLayer,
  };
};
