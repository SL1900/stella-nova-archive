export interface ItemData {
  id: string;
  type: string;
  category: string;
  sub_category: string[] | null;
  title: string;
  description: string;
  source: string[];

  meta: {
    width: number;
    height: number;
    frames: number | null;
    version: string;
  };

  overlays: [
    {
      id: string;
      frame: { s: number; e: number } | null;
      bounds: { x: number; y: number; w: number; h: number };
      bounds_end: { x: number; y: number; w: number; h: number } | null;
      rotation: number;
      shear: number;
      text: string;
      notes: string | null;
    }
  ];
}
