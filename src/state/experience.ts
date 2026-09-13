import { create } from "zustand";

export type Phase =
  | "shelf"
  | "opening"
  | "idle"
  | "collapse"
  | "turn"
  | "settle"
  | "raise"
  | "closing";

export const SCENE_LABELS = [
  "INTRO",
  "CHALLENGE",
  "WHAT WE DID",
  "OUTPUT",
  "RESULT",
] as const;

export const SCENE_COUNT = SCENE_LABELS.length;

/**
 * The page-turn choreography is a strict sequence:
 *   collapse (shrink → fold → sink into the paper → gone)
 *   → turn (the page travels)
 *   → settle (the page comes to a complete stop)
 *   → raise (the next set of objects stands up, one after another)
 */
export const DUR = {
  open: 2.1,
  collapse: 0.95,
  turn: 1.2,
  settle: 0.34,
  raise: 1.5,
  close: 1.4,
};

/**
 * Per-frame animation values live outside React: dioramas read them inside
 * useFrame so a page turn never triggers a re-render storm.
 */
export const stage = {
  time: 0,
  /** 0 = standing on the shelf, 1 = open and flat on the table */
  open: 0,
  /** 0 → 1 while the objects stand up out of the page */
  build: 0,
  /** 0 → 1 while the objects fold away into the page */
  collapse: 0,
  /** 0 → 1 while the physical page sweeps across the spine */
  turn: 0,
  turnDir: 1,
  phase: "shelf" as Phase,
  scene: 0,
  prevScene: 0,
  index: 0,
  /** exposed for the camera rig: eases 0→1 across an entire scene change */
  sceneMix: 1,
  reduced: false,
  /** development only — lets a test harness run the choreography faster */
  timeScale: 1,
  /** −1..1 pointer position, eased; the camera leans with it */
  parallaxX: 0,
  parallaxY: 0,
};

let phaseStart = 0;
let pending = 0;
let closing = false;

export type ExperienceState = {
  mode: "shelf" | "reading";
  index: number;
  scene: number;
  phase: Phase;
  hovered: number | null;
  caseOpen: boolean;
  infoOpen: boolean;
  intro: boolean;
  hint: boolean;
  openBook: (i: number) => void;
  closeBook: () => void;
  goScene: (n: number) => void;
  next: () => void;
  prev: () => void;
  setHovered: (i: number | null) => void;
  setCaseOpen: (v: boolean) => void;
  setInfoOpen: (v: boolean) => void;
  dismissIntro: () => void;
  _setPhase: (p: Phase) => void;
  _setScene: (n: number) => void;
  _finishClose: () => void;
};

export const useExperience = create<ExperienceState>((set, get) => ({
  mode: "shelf",
  index: 0,
  scene: 0,
  phase: "shelf",
  hovered: null,
  caseOpen: false,
  infoOpen: false,
  intro: true,
  hint: true,

  openBook: (i) => {
    const s = get();
    if (s.mode !== "shelf" || s.phase !== "shelf") return;
    closing = false;
    stage.index = i;
    stage.scene = 0;
    stage.prevScene = 0;
    stage.build = 0;
    stage.collapse = 0;
    stage.turn = 0;
    stage.sceneMix = 1;
    stage.phase = "opening";
    phaseStart = stage.time;
    set({ mode: "reading", index: i, scene: 0, phase: "opening", caseOpen: false, intro: false });
  },

  closeBook: () => {
    const s = get();
    if (s.mode !== "reading" || s.phase !== "idle") return;
    closing = true;
    stage.phase = "collapse";
    phaseStart = stage.time;
    set({ phase: "collapse", caseOpen: false });
  },

  goScene: (n) => {
    const s = get();
    if (s.mode !== "reading" || s.phase !== "idle") return;
    const target = Math.max(0, Math.min(SCENE_COUNT - 1, n));
    if (target === s.scene) return;
    closing = false;
    pending = target;
    stage.turnDir = target > s.scene ? 1 : -1;
    stage.phase = "collapse";
    phaseStart = stage.time;
    set({ phase: "collapse", caseOpen: false, hint: false });
  },

  next: () => get().goScene(get().scene + 1),
  prev: () => get().goScene(get().scene - 1),

  setHovered: (i) => set({ hovered: i }),
  setCaseOpen: (v) => set({ caseOpen: v }),
  setInfoOpen: (v) => set({ infoOpen: v }),
  dismissIntro: () => set({ intro: false }),

  _setPhase: (p) => set({ phase: p }),
  _setScene: (n) => set({ scene: n }),
  _finishClose: () =>
    set({ mode: "shelf", phase: "shelf", scene: 0, caseOpen: false, hint: true }),
}));

/** Advances the state machine. Called once per frame from the R3F root. */
export function advanceStage(dt: number) {
  stage.time += dt;
  const api = useExperience.getState();
  const k = stage.reduced ? 0.45 : 1;
  const since = stage.time - phaseStart;

  switch (stage.phase) {
    case "opening": {
      const p = Math.min(1, since / (DUR.open * k));
      stage.open = p;
      if (p >= 1) {
        stage.phase = "raise";
        phaseStart = stage.time;
        api._setPhase("raise");
      }
      break;
    }
    case "collapse": {
      const p = Math.min(1, since / (DUR.collapse * k));
      stage.collapse = p;
      stage.build = 1;
      if (p >= 1) {
        stage.build = 0;
        stage.collapse = 1;
        if (closing) {
          stage.phase = "closing";
          phaseStart = stage.time;
          api._setPhase("closing");
        } else {
          stage.prevScene = stage.scene;
          stage.scene = pending;
          stage.sceneMix = 0;
          stage.phase = "turn";
          phaseStart = stage.time;
          api._setPhase("turn");
          api._setScene(pending);
        }
      }
      break;
    }
    case "turn": {
      const p = Math.min(1, since / (DUR.turn * k));
      stage.turn = p;
      if (p >= 1) {
        stage.turn = 1;
        stage.phase = "settle";
        phaseStart = stage.time;
        api._setPhase("settle");
      }
      break;
    }
    case "settle": {
      /* the page has to come to a complete stop before anything stands up */
      if (since >= DUR.settle * k) {
        stage.turn = 0;
        stage.collapse = 0;
        stage.build = 0;
        stage.phase = "raise";
        phaseStart = stage.time;
        api._setPhase("raise");
      }
      break;
    }
    case "raise": {
      const p = Math.min(1, since / (DUR.raise * k));
      stage.build = p;
      stage.collapse = 0;
      if (p >= 1) {
        stage.build = 1;
        stage.phase = "idle";
        api._setPhase("idle");
      }
      break;
    }
    case "closing": {
      const p = Math.min(1, since / (DUR.close * k));
      stage.open = 1 - p;
      if (p >= 1) {
        stage.open = 0;
        stage.build = 0;
        stage.collapse = 0;
        stage.turn = 0;
        stage.scene = 0;
        stage.prevScene = 0;
        stage.phase = "shelf";
        closing = false;
        api._finishClose();
      }
      break;
    }
    default:
      break;
  }

  /** smooth 0→1 used by the camera to glide between scene framings */
  if (stage.sceneMix < 1) {
    stage.sceneMix = Math.min(1, stage.sceneMix + dt / 1.6);
  }
}
