export type ViewAngle = 'front' | 'back' | 'left' | 'right';

export type ZoneId = 'front_center' | 'heart' | 'back_tabloid' | 'sleeve_left' | 'sleeve_right';

export interface DesignLayer {
  id: string;
  zoneId: ZoneId;
  imageSrc: string | null;
  scale: number;
  rotation: number; // degrees
  x: number; // percentage 0-100 relative to print area
  y: number; // percentage 0-100 relative to print area
  opacity: number;
  visible: boolean;
}

export interface PrintZoneConfig {
  id: ZoneId;
  name: string;
  view: ViewAngle;
  // Coordinates are relative to a 1000x1000 coordinate system for the T-shirt SVG
  area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AppState {
  projectName: string;
  tshirtColor: string;
  selectedSize: 'S' | 'M' | 'L' | 'XL';
  currentView: ViewAngle;
  layers: Record<ZoneId, DesignLayer>;
  showGuides: boolean;
  showWatermark: boolean;
  isComparing: boolean; // Before/After toggle
}