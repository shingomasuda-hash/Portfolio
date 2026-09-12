import type { SurfaceKind } from "../lib/textures";

export type BookDesign = {
  /** spine thickness — no two books share a silhouette */
  thickness: number;
  height: number;
  depth: number;
  cover: string;
  coverSurface: SurfaceKind;
  spine: string;
  spineSurface: SurfaceKind;
  edge: string;
  foil: string;
  roughness: number;
  metalness: number;
  /** frosted / semi-transparent boards (AI) */
  translucent?: number;
  /** exposed binding stitches (LOCAL, FOOD) */
  stitched?: boolean;
  /** debossed rule on the cover */
  deboss?: boolean;
  lean: number;
  materialNote: string;
};

export type CameraMotion = "sway" | "drift" | "orbit" | "descend" | "push" | "breathe";

/**
 * Shots are polar, not hand-placed: an angle around the book, a height, and a
 * distance. That keeps every framing honest about the stage it has to cover
 * (the open spread is 3.12 × 2.12) while still letting each project have its
 * own way of moving.
 */
export type Shot = {
  /** degrees around the spine — 0 looks straight down the front of the book */
  az: number;
  /** degrees above the page — 0 is eye level, 90 is straight down */
  el: number;
  /** metres from the point of interest */
  dist: number;
  target: [number, number, number];
  fov: number;
  motion: CameraMotion;
};

const D = Math.PI / 180;

export function shotPosition(s: Shot): [number, number, number] {
  const ce = Math.cos(s.el * D);
  return [
    s.target[0] + Math.sin(s.az * D) * ce * s.dist,
    s.target[1] + Math.sin(s.el * D) * s.dist,
    s.target[2] + Math.cos(s.az * D) * ce * s.dist,
  ];
}

export type Staging = {
  book: BookDesign;
  /** one framing per SCENE — never the same move twice */
  shots: [Shot, Shot, Shot, Shot, Shot];
};

export const staging: Record<string, Staging> = {
  /* 01 — FOOD BRANDING : thick warm wood board, exposed stitching */
  "food-brand-launch": {
    book: {
      thickness: 0.27,
      height: 1.46,
      depth: 0.95,
      cover: "#9C6C44",
      coverSurface: "wood",
      spine: "#59684F",
      spineSurface: "linen",
      edge: "#F3EADB",
      foil: "#F5EBDA",
      roughness: 0.78,
      metalness: 0.0,
      stitched: true,
      lean: 0.02,
      materialNote: "WOOD BOARD / LINEN SPINE",
    },
    shots: [
      { az: 0, el: 26, dist: 4.5, target: [0, 0.34, 0], fov: 32, motion: "sway" },
      { az: -22, el: 11, dist: 3.5, target: [-0.1, 0.3, 0], fov: 30, motion: "drift" },
      { az: 8, el: 58, dist: 4.6, target: [0, 0.18, 0.05], fov: 30, motion: "descend" },
      { az: 22, el: 21, dist: 3.7, target: [0.05, 0.3, 0.02], fov: 29, motion: "push" },
      { az: -6, el: 30, dist: 5.0, target: [0, 0.35, 0], fov: 34, motion: "breathe" },
    ],
  },

  /* 02 — RESTAURANT EXPERIENCE : soft cloth, guest-eye camera */
  "restaurant-experience": {
    book: {
      thickness: 0.19,
      height: 1.31,
      depth: 0.89,
      cover: "#8D5C46",
      coverSurface: "linen",
      spine: "#686044",
      spineSurface: "linen",
      edge: "#F2E8DA",
      foil: "#EFE3D2",
      roughness: 0.9,
      metalness: 0.0,
      stitched: true,
      lean: -0.035,
      materialNote: "LINEN / CERAMIC EDGE",
    },
    shots: [
      { az: 0, el: 15, dist: 3.0, target: [0, 0.32, 0], fov: 30, motion: "drift" },
      { az: -17, el: 15, dist: 2.5, target: [-0.12, 0.3, 0.05], fov: 27, motion: "push" },
      { az: 34, el: 31, dist: 4.4, target: [0, 0.22, 0], fov: 32, motion: "orbit" },
      { az: -28, el: 22, dist: 3.2, target: [-0.05, 0.3, 0.05], fov: 29, motion: "sway" },
      { az: 6, el: 20, dist: 4.6, target: [0, 0.34, 0], fov: 33, motion: "breathe" },
    ],
  },

  /* 03 — RECRUIT COMMUNICATION : steel board, paper spine */
  "manufacturing-recruit": {
    book: {
      thickness: 0.22,
      height: 1.38,
      depth: 0.9,
      cover: "#5E6A71",
      coverSurface: "metal",
      spine: "#D9D5CB",
      spineSurface: "paper",
      edge: "#EFEEE8",
      foil: "#E6E4DD",
      roughness: 0.46,
      metalness: 0.55,
      deboss: true,
      lean: 0.03,
      materialNote: "BRUSHED STEEL / PAPER",
    },
    shots: [
      { az: -8, el: 33, dist: 4.8, target: [0, 0.3, 0], fov: 33, motion: "descend" },
      { az: 15, el: 16, dist: 3.3, target: [0.05, 0.35, 0.05], fov: 30, motion: "drift" },
      { az: 5, el: 18, dist: 3.5, target: [0, 0.34, 0.04], fov: 29, motion: "sway" },
      { az: 24, el: 22, dist: 3.4, target: [0.05, 0.3, 0], fov: 29, motion: "push" },
      { az: -4, el: 30, dist: 5.0, target: [0, 0.3, 0], fov: 34, motion: "breathe" },
    ],
  },

  /* 04 — HIRING EXPERIENCE : slim concrete-grey field notebook */
  "engineering-recruit": {
    book: {
      thickness: 0.14,
      height: 1.2,
      depth: 0.84,
      cover: "#9AA4A5",
      coverSurface: "concrete",
      spine: "#384C57",
      spineSurface: "metal",
      edge: "#EAE9E4",
      foil: "#E3E6E5",
      roughness: 0.82,
      metalness: 0.12,
      deboss: true,
      lean: -0.05,
      materialNote: "CONCRETE BOARD / METAL SPINE",
    },
    shots: [
      { az: -21, el: 27, dist: 4.4, target: [0, 0.3, 0], fov: 32, motion: "drift" },
      { az: 0, el: 15, dist: 3.2, target: [0, 0.32, 0.1], fov: 29, motion: "push" },
      { az: 11, el: 15, dist: 3.4, target: [0.05, 0.38, 0.03], fov: 29, motion: "sway" },
      { az: -24, el: 24, dist: 3.4, target: [0, 0.3, 0], fov: 29, motion: "push" },
      { az: 4, el: 28, dist: 4.8, target: [0, 0.3, 0], fov: 34, motion: "breathe" },
    ],
  },

  /* 05 — LOCAL CREATION : thickest volume, soil-dyed board */
  "local-creation": {
    book: {
      thickness: 0.31,
      height: 1.5,
      depth: 1.0,
      cover: "#53694A",
      coverSurface: "soil",
      spine: "#8F7A55",
      spineSurface: "stone",
      edge: "#EDE6D3",
      foil: "#F0E8D4",
      roughness: 0.95,
      metalness: 0.0,
      stitched: true,
      lean: 0.015,
      materialNote: "SOIL-DYED BOARD / STONE SPINE",
    },
    shots: [
      { az: 0, el: 68, dist: 4.6, target: [0, 0.1, 0], fov: 30, motion: "descend" },
      { az: 31, el: 48, dist: 4.4, target: [0, 0.12, 0], fov: 32, motion: "orbit" },
      { az: 10, el: 16, dist: 3.2, target: [0.05, 0.3, 0.06], fov: 28, motion: "push" },
      { az: -19, el: 24, dist: 3.8, target: [0, 0.3, 0], fov: 30, motion: "sway" },
      { az: -12, el: 45, dist: 5.0, target: [0, 0.14, 0], fov: 34, motion: "orbit" },
    ],
  },

  /* 06 — DIGITAL EXPERIENCE : thin aluminium volume, macro camera */
  "digital-experience": {
    book: {
      thickness: 0.12,
      height: 1.34,
      depth: 0.82,
      cover: "#E7E7E3",
      coverSurface: "metal",
      spine: "#222828",
      spineSurface: "metal",
      edge: "#FAFAF7",
      foil: "#E9E9E4",
      roughness: 0.34,
      metalness: 0.45,
      deboss: true,
      lean: 0.0,
      materialNote: "ANODISED ALUMINIUM / GLASS EDGE",
    },
    shots: [
      { az: 0, el: 22, dist: 4.2, target: [0, 0.36, 0], fov: 32, motion: "drift" },
      { az: -18, el: 35, dist: 3.9, target: [0, 0.2, 0], fov: 30, motion: "sway" },
      { az: 8, el: 14, dist: 2.4, target: [-0.2, 0.4, 0.02], fov: 25, motion: "push" },
      { az: 20, el: 22, dist: 3.6, target: [0, 0.3, 0], fov: 29, motion: "orbit" },
      { az: 0, el: 26, dist: 4.6, target: [0, 0.32, 0], fov: 33, motion: "breathe" },
    ],
  },

  /* 07 — SOCIAL & AD : paper cover with a screen-bright band */
  "social-advertising": {
    book: {
      thickness: 0.16,
      height: 1.17,
      depth: 0.86,
      cover: "#EFE9DE",
      coverSurface: "paper",
      spine: "#CC7655",
      spineSurface: "paper",
      edge: "#F7F3EB",
      foil: "#333535",
      roughness: 0.88,
      metalness: 0.0,
      lean: 0.06,
      materialNote: "UNCOATED PAPER / SCREEN BAND",
    },
    shots: [
      { az: 0, el: 12, dist: 2.9, target: [0, 0.46, 0], fov: 27, motion: "push" },
      { az: -10, el: 47, dist: 4.2, target: [0, 0.1, 0.05], fov: 30, motion: "sway" },
      { az: 27, el: 30, dist: 4.2, target: [0, 0.3, 0], fov: 30, motion: "orbit" },
      { az: -16, el: 21, dist: 3.7, target: [0, 0.3, 0], fov: 30, motion: "sway" },
      { az: -6, el: 24, dist: 4.4, target: [0, 0.36, 0], fov: 33, motion: "push" },
    ],
  },

  /* 08 — BRAND IDENTITY : fine paper, foil-blocked spine */
  "brand-identity": {
    book: {
      thickness: 0.2,
      height: 1.42,
      depth: 0.92,
      cover: "#E6E1D6",
      coverSurface: "paper",
      spine: "#202424",
      spineSurface: "linen",
      edge: "#F8F6F1",
      foil: "#A98653",
      roughness: 0.86,
      metalness: 0.0,
      deboss: true,
      lean: -0.02,
      materialNote: "FINE PAPER / FOIL-BLOCKED CLOTH",
    },
    shots: [
      { az: 10, el: 26, dist: 4.0, target: [0, 0.22, 0], fov: 31, motion: "drift" },
      { az: 0, el: 62, dist: 4.4, target: [0, 0.12, 0], fov: 30, motion: "descend" },
      { az: -20, el: 16, dist: 2.7, target: [-0.2, 0.28, 0.05], fov: 26, motion: "push" },
      { az: 16, el: 22, dist: 3.6, target: [0, 0.3, 0], fov: 29, motion: "sway" },
      { az: 0, el: 30, dist: 4.8, target: [0, 0.22, 0], fov: 33, motion: "breathe" },
    ],
  },

  /* 09 — AI / AUTOMATION : frosted board, cool light */
  "ai-automation": {
    book: {
      thickness: 0.17,
      height: 1.27,
      depth: 0.88,
      cover: "#E2E7E5",
      coverSurface: "screenGlass",
      spine: "#263538",
      spineSurface: "metal",
      edge: "#F0F2EE",
      foil: "#E8EDEB",
      roughness: 0.22,
      metalness: 0.3,
      translucent: 0.35,
      lean: 0.0,
      materialNote: "FROSTED PANEL / ALUMINIUM",
    },
    shots: [
      { az: -12, el: 26, dist: 4.3, target: [0, 0.28, 0], fov: 32, motion: "drift" },
      { az: 6, el: 50, dist: 4.4, target: [0, 0.12, 0], fov: 31, motion: "descend" },
      { az: 0, el: 9, dist: 2.3, target: [0, 0.32, 0], fov: 26, motion: "push" },
      { az: 27, el: 22, dist: 3.4, target: [0.05, 0.3, 0], fov: 28, motion: "orbit" },
      { az: -8, el: 34, dist: 5.2, target: [0, 0.28, 0], fov: 35, motion: "orbit" },
    ],
  },

  /* 10 — BUSINESS DESIGN : the heavy dark volume, the thesis of the shelf */
  "business-design": {
    book: {
      thickness: 0.29,
      height: 1.44,
      depth: 0.96,
      cover: "#2D3331",
      coverSurface: "linen",
      spine: "#6B806B",
      spineSurface: "wood",
      edge: "#EFEBE2",
      foil: "#E7E4DD",
      roughness: 0.84,
      metalness: 0.05,
      stitched: true,
      deboss: true,
      lean: -0.015,
      materialNote: "DARK CLOTH / FOIL / WOOD SPINE",
    },
    shots: [
      { az: -18, el: 15, dist: 2.9, target: [-0.3, 0.28, 0.05], fov: 28, motion: "push" },
      { az: 16, el: 31, dist: 4.0, target: [0, 0.2, 0], fov: 29, motion: "sway" },
      { az: 0, el: 26, dist: 4.2, target: [0, 0.24, 0], fov: 31, motion: "drift" },
      { az: 24, el: 22, dist: 3.7, target: [0, 0.3, 0], fov: 29, motion: "orbit" },
      { az: -10, el: 46, dist: 5.4, target: [0, 0.14, 0], fov: 36, motion: "orbit" },
    ],
  },
};

export const DEFAULT_SHOT: Shot = {
  az: 0,
  el: 26,
  dist: 4.5,
  target: [0, 0.3, 0],
  fov: 33,
  motion: "drift",
};
