export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Frame-rate independent exponential approach. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** Re-normalise `t` inside the window [from, to]. */
export const range = (t: number, from: number, to: number) =>
  clamp((t - from) / Math.max(1e-6, to - from));

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
export const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/** Gentle overshoot used when an object finally locks into place. */
export const easeOutBackSoft = (t: number) => {
  const c1 = 1.12;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Deterministic pseudo-random in [0,1) — keeps layouts stable across reloads. */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const hashRange = (n: number, min: number, max: number) =>
  min + hash(n) * (max - min);

/**
 * Stagger window for item `i` of `count` items across a 0..1 timeline.
 * `spread` is how much of the timeline is consumed by the stagger itself.
 */
export const stagger = (t: number, i: number, count: number, spread = 0.55) => {
  const step = count > 1 ? spread / (count - 1) : 0;
  const from = step * i;
  return range(t, from, from + (1 - spread));
};
