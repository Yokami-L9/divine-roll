// Map Editor Types - Professional Fantasy Map Editor

export type MapMode = 'world' | 'regional' | 'battle';

export type ToolType = 
  | 'select' 
  | 'pan' 
  | 'brush' 
  | 'eraser' 
  | 'fill'
  | 'eyedropper'
  | 'path'
  | 'text'
  | 'asset'
  | 'elevation'
  | 'fogOfWar';

export type TerrainType = 
  | 'deepWater'
  | 'shallowWater'
  | 'coastFoam'
  | 'grass'
  | 'forestFloor'
  | 'jungleFloor'
  | 'desert'
  | 'rock'
  | 'snow'
  | 'tundra'
  | 'swamp'
  | 'volcanic'
  | 'corrupted'
  | 'road'
  | 'farmland';

export interface TerrainConfig {
  id: TerrainType;
  name: string;
  category: 'water' | 'land' | 'special';
  baseColor: string;
}

export const TERRAIN_CONFIGS: TerrainConfig[] = [
  // Water
  { id: 'deepWater', name: 'Глубокая вода', category: 'water', baseColor: '#0a3d62' },
  { id: 'shallowWater', name: 'Мелководье', category: 'water', baseColor: '#3498db' },
  { id: 'coastFoam', name: 'Прибрежная пена', category: 'water', baseColor: '#74b9ff' },
  
  // Land
  { id: 'grass', name: 'Трава', category: 'land', baseColor: '#27ae60' },
  { id: 'forestFloor', name: 'Лесная почва', category: 'land', baseColor: '#1e5631' },
  { id: 'jungleFloor', name: 'Джунгли', category: 'land', baseColor: '#145a32' },
  { id: 'desert', name: 'Пустыня', category: 'land', baseColor: '#d4a574' },
  { id: 'rock', name: 'Камень', category: 'land', baseColor: '#6c757d' },
  { id: 'snow', name: 'Снег', category: 'land', baseColor: '#ecf0f1' },
  { id: 'tundra', name: 'Тундра', category: 'land', baseColor: '#95a5a6' },
  { id: 'swamp', name: 'Болото', category: 'land', baseColor: '#556b2f' },
  { id: 'farmland', name: 'Поля', category: 'land', baseColor: '#8B7355' },
  { id: 'road', name: 'Дорога', category: 'land', baseColor: '#5d4e37' },
  
  // Special
  { id: 'volcanic', name: 'Вулканическая', category: 'special', baseColor: '#2d2320' },
  { id: 'corrupted', name: 'Порченая', category: 'special', baseColor: '#4a1c4a' },
];

export interface BrushSettings {
  size: number;        // 1-500
  opacity: number;     // 0-1
  hardness: number;    // 0-1
  flow: number;        // 0-1
  spacing: number;     // 0.01-1
  jitter: number;      // 0-1
  randomRotation: boolean;
}

export interface PathPoint {
  x: number;
  y: number;
}

export interface MapPath {
  id: string;
  type: 'road' | 'river' | 'border' | 'custom';
  points: PathPoint[];
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface MapAsset {
  id: string;
  assetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flipX: boolean;
  zIndex: number;
}

export interface MapLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  outlineColor?: string;
  outlineWidth: number;
  rotation: number;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'terrain' | 'elevation' | 'assets' | 'paths' | 'labels' | 'effects' | 'grid' | 'fog';
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
}

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface GridSettings {
  enabled: boolean;
  type: 'square' | 'hex';
  size: number;
  opacity: number;
  color: string;
  snap: boolean;
}

export interface EffectSettings {
  fogOfWar: {
    enabled: boolean;
    opacity: number;
    color: string;
  };
  paperTexture: boolean;
  vignette: boolean;
  colorGrading: {
    enabled: boolean;
    warmth: number;
    saturation: number;
    contrast: number;
  };
}

export interface TerrainStroke {
  id: string;
  terrain: TerrainType;
  points: PathPoint[];
  brushSettings: BrushSettings;
  timestamp: number;
}

export interface MapState {
  id: string;
  name: string;
  mode: MapMode;
  width: number;
  height: number;
  
  // Data layers
  terrainStrokes: TerrainStroke[];
  assets: MapAsset[];
  paths: MapPath[];
  labels: MapLabel[];
  
  // Settings
  layers: MapLayer[];
  gridSettings: GridSettings;
  effects: EffectSettings;
  backgroundColor: string;
  
  // History
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  type: 'stroke' | 'asset' | 'path' | 'label' | 'delete' | 'transform';
  data: unknown;
  timestamp: number;
}

// Asset catalog types
export interface AssetCategory {
  id: string;
  name: string;
  icon: string;
}

export interface AssetDefinition {
  id: string;
  name: string;
  categoryId: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  tags: string[];
}

// Default values
export const DEFAULT_BRUSH_SETTINGS: BrushSettings = {
  size: 50,
  opacity: 1,
  hardness: 0.7,
  flow: 0.8,
  spacing: 0.1,
  jitter: 0.05,
  randomRotation: true,
};

export const DEFAULT_GRID_SETTINGS: GridSettings = {
  enabled: false,
  type: 'square',
  size: 50,
  opacity: 0.3,
  color: '#ffffff',
  snap: false,
};

export const DEFAULT_EFFECT_SETTINGS: EffectSettings = {
  fogOfWar: {
    enabled: false,
    opacity: 0.8,
    color: '#1a1a2e',
  },
  paperTexture: true,
  vignette: true,
  colorGrading: {
    enabled: true,
    warmth: 0.1,
    saturation: 1.1,
    contrast: 1.05,
  },
};

export const DEFAULT_LAYERS: MapLayer[] = [
  { id: 'terrain', name: 'Terrain', type: 'terrain', visible: true, locked: false, opacity: 1, order: 0 },
  { id: 'paths', name: 'Paths', type: 'paths', visible: true, locked: false, opacity: 1, order: 1 },
  { id: 'assets', name: 'Assets', type: 'assets', visible: true, locked: false, opacity: 1, order: 2 },
  { id: 'labels', name: 'Labels', type: 'labels', visible: true, locked: false, opacity: 1, order: 3 },
  { id: 'grid', name: 'Grid', type: 'grid', visible: false, locked: true, opacity: 1, order: 4 },
  { id: 'fog', name: 'Fog of War', type: 'fog', visible: false, locked: false, opacity: 1, order: 5 },
];

export function createEmptyMapState(name: string, mode: MapMode, width = 4096, height = 4096): MapState {
  return {
    id: crypto.randomUUID(),
    name,
    mode,
    width,
    height,
    terrainStrokes: [],
    assets: [],
    paths: [],
    labels: [],
    layers: [...DEFAULT_LAYERS],
    gridSettings: { ...DEFAULT_GRID_SETTINGS },
    effects: { ...DEFAULT_EFFECT_SETTINGS },
    backgroundColor: '#0a3d62',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
