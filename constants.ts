import { PrintZoneConfig, DesignLayer, ZoneId } from './types';

export const DEFAULT_TSHIRT_COLOR = '#ffffff';

export const ZONES: Record<ZoneId, PrintZoneConfig> = {
  front_center: {
    id: 'front_center',
    name: 'Frente (Centro)',
    view: 'front',
    area: { x: 300, y: 250, width: 400, height: 500 },
  },
  heart: {
    id: 'heart',
    name: 'Punto Corazón',
    view: 'front',
    area: { x: 580, y: 280, width: 120, height: 120 },
  },
  back_tabloid: {
    id: 'back_tabloid',
    name: 'Espalda',
    view: 'back',
    area: { x: 300, y: 200, width: 400, height: 550 },
  },
  sleeve_left: {
    id: 'sleeve_left',
    name: 'Manga Izquierda',
    view: 'left', // Looking at the left side of the shirt
    area: { x: 400, y: 300, width: 200, height: 200 },
  },
  sleeve_right: {
    id: 'sleeve_right',
    name: 'Manga Derecha',
    view: 'right', // Looking at the right side of the shirt
    area: { x: 400, y: 300, width: 200, height: 200 },
  },
};

export const INITIAL_LAYER: Omit<DesignLayer, 'id' | 'zoneId'> = {
  imageSrc: null,
  scale: 1,
  rotation: 0,
  x: 50,
  y: 50,
  opacity: 100,
  visible: true,
};

export const PRESET_COLORS = [
  '#ffffff', // White
  '#000000', // Black
  '#1f2937', // Gray 800
];
