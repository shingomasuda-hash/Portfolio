import * as THREE from "three";
import { hash } from "./math";
import type { PortfolioProject } from "../data/portfolioProjects";
import { headlineFigure } from "../data/outcomes";

const SANS = `"Archivo","Zen Kaku Gothic New","Helvetica Neue",Arial,sans-serif`;
const MINCHO = `"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif`;

const cache = new Map<string, THREE.CanvasTexture>();

/**
 * The paper itself is printed: running heads, folios, a hairline, and the
 * scene number set large and faint. The message lives in the interface —
 * the page carries the bibliography of the book.
 */
export function pageTexture(
  project: PortfolioProject,
  scene: number,
  side: "left" | "right",
  sceneLabel: string,
) {
  const key = `page:${project.id}:${scene}:${side}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const W = 1024;
  const H = 700;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = project.theme.surface;
  ctx.fillRect(0, 0, W, H);

  /* paper fibre */
  for (let i = 0; i < 16000; i++) {
    const v = hash(i + scene * 13);
    ctx.fillStyle = v > 0.5 ? `rgba(0,0,0,${v * 0.035})` : `rgba(255,255,255,${v * 0.05})`;
    ctx.fillRect(hash(i * 3) * W, hash(i * 7) * H, 2, 2);
  }

  /* the gutter shadow, so the spread reads as a real fold */
  const gx = side === "left" ? W : 0;
  const g = ctx.createLinearGradient(gx, 0, side === "left" ? W - 190 : 190, 0);
  g.addColorStop(0, "rgba(60,52,42,0.26)");
  g.addColorStop(0.45, "rgba(60,52,42,0.06)");
  g.addColorStop(1, "rgba(60,52,42,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const ink = "rgba(36,36,33,";
  const M = 54;

  ctx.textBaseline = "alphabetic";

  if (side === "left") {
    /* On the result spread the paper carries the number itself; elsewhere,
       the scene number, printed large and quiet. */
    const fig = scene === 4 ? headlineFigure(project.id) : undefined;
    ctx.textAlign = "left";
    if (fig) {
      const avail = W - M * 2 - 120;
      let size = 240;
      ctx.font = `600 ${size}px ${MINCHO}`;
      const w = ctx.measureText(fig.value).width;
      if (w > avail) size = Math.max(72, Math.floor(size * (avail / w)));
      ctx.fillStyle = `${ink}0.1)`;
      ctx.font = `600 ${size}px ${MINCHO}`;
      ctx.fillText(fig.value, M + 6, H - 132);
      ctx.fillStyle = `${ink}0.3)`;
      ctx.font = `600 22px ${SANS}`;
      ctx.fillText(spaced(fig.label), M + 10, H - 96);
    } else {
      ctx.fillStyle = `${ink}0.075)`;
      ctx.font = `600 300px ${MINCHO}`;
      ctx.fillText(String(scene + 1).padStart(2, "0"), M + 6, H - 96);
    }

    ctx.fillStyle = `${ink}0.5)`;
    ctx.font = `600 20px ${SANS}`;
    const label = `SCENE ${String(scene + 1).padStart(2, "0")} — ${sceneLabel}`;
    ctx.fillText(spaced(label), M, M + 14);

    ctx.fillStyle = `${ink}0.18)`;
    ctx.fillRect(M, M + 30, W - M * 2 - 160, 1.5);

    ctx.fillStyle = `${ink}0.34)`;
    ctx.font = `500 18px ${MINCHO}`;
    ctx.fillText(project.titleJa, M, H - M);
  } else {
    ctx.textAlign = "right";
    ctx.fillStyle = `${ink}0.5)`;
    ctx.font = `600 20px ${SANS}`;
    ctx.fillText(spaced(project.title), W - M, M + 14);
    ctx.fillStyle = `${ink}0.18)`;
    ctx.fillRect(M + 160, M + 30, W - M * 2 - 160, 1.5);

    ctx.fillStyle = `${ink}0.34)`;
    ctx.font = `500 18px ${SANS}`;
    ctx.fillText(`${project.clientLabel}   ·   ${project.year}`, W - M, H - M);

    ctx.textAlign = "left";
    ctx.fillStyle = `${ink}0.3)`;
    ctx.font = `600 18px ${SANS}`;
    ctx.fillText(spaced("ANYWARE ARCHIVE"), M, H - M);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}

function spaced(s: string) {
  return [...s].join(" ").replace(/ {3}/g, "  ");
}

/** The blank verso used by the page that is mid-flight. */
export function blankPageTexture(surface: string) {
  const key = `blank:${surface}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const W = 512;
  const H = 350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 6000; i++) {
    const v = hash(i * 5);
    ctx.fillStyle = v > 0.5 ? `rgba(0,0,0,${v * 0.03})` : `rgba(255,255,255,${v * 0.04})`;
    ctx.fillRect(hash(i * 3) * W, hash(i * 11) * H, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}
