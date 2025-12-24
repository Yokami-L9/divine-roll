export type ToolType = 'select' | 'pan' | 'brush' | 'eraser' | 'marker' | 'text' | 'line' | 'rect' | 'ellipse' | 'polygon' | 'fill' | 'measure';

export type ShapeType = 'line' | 'rect' | 'ellipse' | 'polygon';

export type TerrainType = 'grass' | 'forest' | 'water' | 'mountain' | 'desert' | 'snow' | 'road' | 'swamp';

export type MarkerType = 'city' | 'village' | 'camp' | 'dungeon' | 'ruins' | 'tower' | 'cave' | 'port';

export interface ObjectNote {
  id: string;
  objectId: string;
  text: string;
  createdAt: string;
}

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
  { id: 'grass', label: 'Трава', color: '#4a7c59', pattern: 'solid' },
  { id: 'forest', label: 'Лес', color: '#2d5a3d', pattern: 'dots' },
  { id: 'water', label: 'Вода', color: '#3b82f6', pattern: 'waves' },
  { id: 'mountain', label: 'Горы', color: '#78716c', pattern: 'triangles' },
  { id: 'desert', label: 'Пустыня', color: '#d4a373', pattern: 'dots' },
  { id: 'snow', label: 'Снег', color: '#e2e8f0', pattern: 'solid' },
  { id: 'road', label: 'Дорога', color: '#a3a3a3', pattern: 'solid' },
  { id: 'swamp', label: 'Болото', color: '#5c6d4f', pattern: 'waves' },
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
