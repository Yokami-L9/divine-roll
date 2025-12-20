export type ToolType = 'select' | 'pan' | 'brush' | 'eraser' | 'marker' | 'text';

export type TerrainType = 'grass' | 'forest' | 'water' | 'mountain' | 'desert' | 'snow' | 'road' | 'swamp';

export type MarkerType = 'city' | 'village' | 'camp' | 'dungeon' | 'ruins' | 'tower' | 'cave' | 'port';

export interface TerrainConfig {
  id: TerrainType;
  label: string;
  color: string;
  pattern?: string;
}

export interface MarkerConfig {
  id: MarkerType;
  label: string;
  icon: string;
  color: string;
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objects: string[]; // fabric object IDs
}

export interface MapState {
  width: number;
  height: number;
  backgroundColor: string;
  layers: MapLayer[];
  canvasData: object;
}

export const TERRAIN_CONFIGS: TerrainConfig[] = [
  { id: 'grass', label: 'Трава', color: '#4a7c59' },
  { id: 'forest', label: 'Лес', color: '#2d5a3d' },
  { id: 'water', label: 'Вода', color: '#3b82f6' },
  { id: 'mountain', label: 'Горы', color: '#78716c' },
  { id: 'desert', label: 'Пустыня', color: '#d4a373' },
  { id: 'snow', label: 'Снег', color: '#e2e8f0' },
  { id: 'road', label: 'Дорога', color: '#a3a3a3' },
  { id: 'swamp', label: 'Болото', color: '#5c6d4f' },
];

export const MARKER_CONFIGS: MarkerConfig[] = [
  { id: 'city', label: 'Город', icon: '🏰', color: '#eab308' },
  { id: 'village', label: 'Деревня', icon: '🏠', color: '#84cc16' },
  { id: 'camp', label: 'Лагерь', icon: '⛺', color: '#f97316' },
  { id: 'dungeon', label: 'Подземелье', icon: '🗝️', color: '#6366f1' },
  { id: 'ruins', label: 'Руины', icon: '🏛️', color: '#78716c' },
  { id: 'tower', label: 'Башня', icon: '🗼', color: '#8b5cf6' },
  { id: 'cave', label: 'Пещера', icon: '🕳️', color: '#52525b' },
  { id: 'port', label: 'Порт', icon: '⚓', color: '#0ea5e9' },
];
