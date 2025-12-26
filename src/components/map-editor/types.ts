export type ToolType = 'select' | 'pan' | 'brush' | 'eraser' | 'marker' | 'text' | 'line' | 'rect' | 'ellipse' | 'polygon' | 'fill' | 'measure' | 'eyedropper' | 'path' | 'asset' | 'stamp';

export type ShapeType = 'line' | 'rect' | 'ellipse' | 'polygon';

export type TerrainType = 
  | 'grass' 
  | 'forest' 
  | 'water' 
  | 'mountain' 
  | 'desert' 
  | 'snow' 
  | 'road' 
  | 'swamp'
  | 'deepWater'
  | 'shallowWater'
  | 'denseForest'
  | 'plains'
  | 'tundra'
  | 'volcanic'
  | 'dirt'
  | 'stone'
  | 'jungle'
  | 'savanna'
  | 'farmland'
  | 'sand';

export type MarkerType = 'city' | 'village' | 'camp' | 'dungeon' | 'ruins' | 'tower' | 'cave' | 'port';

export interface ObjectNote {
  id: string;
  objectId: string;
  text: string;
  createdAt: string;
}

export interface BrushSettings {
  size: number;
  opacity: number;
  hardness: number;
  spacing: number;
  terrain: TerrainType;
}

export interface PathPoint {
  x: number;
  y: number;
}

export interface MapPath {
  id: string;
  points: PathPoint[];
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  label?: string;
}

export interface MarkerData {
  id: string;
  x: number;
  y: number;
  type: MarkerType;
  label: string;
  icon: string;
}

export interface HistoryState {
  canvasData: string;
  paths: MapPath[];
  markers: MarkerData[];
}

export interface TerrainConfig {
  id: TerrainType;
  label: string;
  color: string;
  category: 'land' | 'water' | 'special';
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
  opacity: number;
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
  // Land terrains
  { id: 'grass', label: 'Трава', color: '#4a7c59', category: 'land' },
  { id: 'plains', label: 'Равнины', color: '#8cb369', category: 'land' },
  { id: 'forest', label: 'Лес', color: '#2d5a3d', category: 'land' },
  { id: 'denseForest', label: 'Густой лес', color: '#1a4025', category: 'land' },
  { id: 'jungle', label: 'Джунгли', color: '#1e5a23', category: 'land' },
  { id: 'savanna', label: 'Саванна', color: '#b4a060', category: 'land' },
  { id: 'farmland', label: 'Поля', color: '#826440', category: 'land' },
  { id: 'mountain', label: 'Горы', color: '#78716c', category: 'land' },
  { id: 'stone', label: 'Камень', color: '#6e6a65', category: 'land' },
  { id: 'dirt', label: 'Земля', color: '#785a3c', category: 'land' },
  { id: 'road', label: 'Дорога', color: '#5f5041', category: 'land' },
  { id: 'sand', label: 'Песок', color: '#d2b98c', category: 'land' },
  { id: 'desert', label: 'Пустыня', color: '#dcb470', category: 'land' },
  
  // Cold terrains
  { id: 'snow', label: 'Снег', color: '#f0f5fa', category: 'land' },
  { id: 'tundra', label: 'Тундра', color: '#aab4af', category: 'land' },
  
  // Water terrains
  { id: 'water', label: 'Вода', color: '#2366a0', category: 'water' },
  { id: 'shallowWater', label: 'Мелководье', color: '#4196b4', category: 'water' },
  { id: 'deepWater', label: 'Глубокая вода', color: '#0f3264', category: 'water' },
  { id: 'swamp', label: 'Болото', color: '#374b32', category: 'water' },
  
  // Special terrains
  { id: 'volcanic', label: 'Вулканическая', color: '#2d2320', category: 'special' },
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

// Additional marker types
export type IconMarkerType = 'castle' | 'town' | 'forest_icon' | 'mountain_icon' | 'lake' | 'bridge' | 'temple' | 'mine';

export const ICON_MARKERS: { id: IconMarkerType; label: string; svg: string; color: string }[] = [
  { id: 'castle', label: 'Замок', svg: 'M3 21V7l9-4 9 4v14H3zm2-2h14V8.2l-7-3.1-7 3.1V19z', color: '#eab308' },
  { id: 'town', label: 'Городок', svg: 'M4 21V10.1l8-4.8 8 4.8V21H4zm2-2h4v-4h4v4h4v-8.1l-6-3.6-6 3.6V19z', color: '#a855f7' },
  { id: 'forest_icon', label: 'Лес', svg: 'M12 2L7 10h2l-3 6h3l-3 6h14l-3-6h3l-3-6h2L12 2z', color: '#22c55e' },
  { id: 'mountain_icon', label: 'Гора', svg: 'M12 4l-8 16h16L12 4zm0 5l4 8H8l4-8z', color: '#78716c' },
  { id: 'lake', label: 'Озеро', svg: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z', color: '#0ea5e9' },
  { id: 'bridge', label: 'Мост', svg: 'M4 12h16M6 12c0-2 2-4 6-4s6 2 6 4M4 16h16', color: '#78716c' },
  { id: 'temple', label: 'Храм', svg: 'M12 2L3 9v2h2v10h14V11h2V9L12 2zm0 3.5L18 9H6l6-3.5z', color: '#f59e0b' },
  { id: 'mine', label: 'Шахта', svg: 'M12 2L6 12h12L12 2zm-6 12v6h12v-6H6z', color: '#52525b' },
];
