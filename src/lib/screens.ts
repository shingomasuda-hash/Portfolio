import * as THREE from "three";
import { hash } from "./math";

export type Palette = {
  bg: string;
  surface: string;
  ink: string;
  accent: string;
  secondary: string;
};

export type ScreenKind =
  | "feed"
  | "post"
  | "reel"
  | "lp"
  | "site"
  | "dashboard"
  | "blueprint"
  | "menu"
  | "poster"
  | "card"
  | "ad"
  | "map"
  | "doc";

const SANS = `"Archivo","Zen Kaku Gothic New","Helvetica Neue",Arial,sans-serif`;
const MINCHO = `"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif`;

const cache = new Map<string, THREE.CanvasTexture>();

function make(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext("2d")! };
}

function toTexture(c: HTMLCanvasElement, key: string) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  cache.set(key, t);
  return t;
}

const alpha = (hex: string, a: number) => {
  const c = new THREE.Color(hex);
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;
};

/* --- small drawing primitives shared by every mock UI ---------------- */

function bar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  r = 0,
) {
  ctx.fillStyle = color;
  if (r > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  } else ctx.fillRect(x, y, w, h);
}

function textLines(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  count: number,
  color: string,
  lh = 14,
  seed = 1,
) {
  for (let i = 0; i < count; i++) {
    const ww = w * (0.62 + hash(seed * 13 + i) * 0.38);
    bar(ctx, x, y + i * lh, ww, lh * 0.42, color, lh * 0.2);
  }
}

/** An abstract photograph: layered tonal shapes, never a literal picture. */
function photoBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  p: Palette,
  seed: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, alpha(p.accent, 0.9));
  g.addColorStop(1, alpha(p.secondary, 0.85));
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = alpha(i % 2 ? "#ffffff" : "#000000", 0.06 + hash(seed + i) * 0.07);
    ctx.beginPath();
    ctx.ellipse(
      x + hash(seed + i * 3) * w,
      y + hash(seed + i * 7) * h,
      w * (0.2 + hash(seed + i * 5) * 0.5),
      h * (0.2 + hash(seed + i * 11) * 0.45),
      hash(seed + i) * 3,
      0,
      7,
    );
    ctx.fill();
  }
  ctx.restore();
}

/* --------------------------------------------------------------------- */

export function screenTexture(
  kind: ScreenKind,
  p: Palette,
  opts: { seed?: number; title?: string; w?: number; h?: number } = {},
) {
  const seed = opts.seed ?? 1;
  const key = `screen:${kind}:${p.accent}${p.secondary}${p.surface}:${seed}:${opts.title ?? ""}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const W = opts.w ?? 512;
  const H = opts.h ?? 768;
  const { c, ctx } = make(W, H);
  ctx.fillStyle = p.surface;
  ctx.fillRect(0, 0, W, H);
  const ink = p.ink;
  const soft = alpha(ink, 0.16);
  const softer = alpha(ink, 0.09);

  switch (kind) {
    case "feed": {
      bar(ctx, 0, 0, W, 64, p.surface);
      ctx.fillStyle = ink;
      ctx.font = `600 24px ${SANS}`;
      ctx.fillText(opts.title ?? "BRAND", 24, 42);
      bar(ctx, 0, 64, W, 1, soft);
      const cell = (W - 32) / 3;
      for (let i = 0; i < 9; i++) {
        const cx = 16 + (i % 3) * cell;
        const cy = 84 + Math.floor(i / 3) * cell;
        photoBlock(ctx, cx + 2, cy + 2, cell - 4, cell - 4, p, seed + i * 3);
      }
      const gridEnd = 84 + 3 * cell + 24;
      textLines(ctx, 24, gridEnd, W - 48, 3, softer, 20, seed);
      break;
    }
    case "post": {
      bar(ctx, 0, 0, W, 72, p.surface);
      ctx.beginPath();
      ctx.arc(44, 36, 20, 0, 7);
      ctx.fillStyle = alpha(p.accent, 0.85);
      ctx.fill();
      bar(ctx, 76, 26, 150, 10, soft, 5);
      bar(ctx, 76, 44, 96, 8, softer, 4);
      photoBlock(ctx, 0, 72, W, W, p, seed);
      const y = 72 + W + 28;
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = alpha(ink, 0.55);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(36 + i * 52, y, 12, 0, 7);
        ctx.stroke();
      }
      textLines(ctx, 24, y + 34, W - 48, 3, softer, 20, seed + 5);
      break;
    }
    case "reel": {
      photoBlock(ctx, 0, 0, W, H, p, seed);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.moveTo(W / 2 - 22, H / 2 - 30);
      ctx.lineTo(W / 2 + 32, H / 2);
      ctx.lineTo(W / 2 - 22, H / 2 + 30);
      ctx.closePath();
      ctx.fill();
      bar(ctx, 24, H - 96, W - 48, 8, "rgba(255,255,255,0.35)", 4);
      bar(ctx, 24, H - 96, (W - 48) * 0.42, 8, "rgba(255,255,255,0.9)", 4);
      textLines(ctx, 24, H - 68, W * 0.6, 2, "rgba(255,255,255,0.55)", 18, seed);
      break;
    }
    case "lp": {
      bar(ctx, 0, 0, W, 56, p.surface);
      ctx.fillStyle = ink;
      ctx.font = `700 20px ${SANS}`;
      ctx.fillText(opts.title ?? "RECRUIT", 24, 35);
      bar(ctx, W - 120, 16, 96, 24, p.accent, 12);
      photoBlock(ctx, 0, 56, W, 300, p, seed);
      ctx.fillStyle = "#fff";
      ctx.font = `700 40px ${MINCHO}`;
      ctx.fillText("はたらく、を", 32, 190);
      ctx.fillText("見せる。", 32, 240);
      let y = 392;
      for (let s = 0; s < 4; s++) {
        bar(ctx, 32, y, 40, 3, p.accent);
        ctx.fillStyle = ink;
        ctx.font = `600 18px ${SANS}`;
        ctx.fillText(["ABOUT", "WORK", "PEOPLE", "ENTRY"][s], 32, y + 30);
        textLines(ctx, 32, y + 48, W - 200, 2, softer, 16, seed + s);
        photoBlock(ctx, W - 150, y - 6, 118, 88, p, seed + s * 9);
        y += 128;
      }
      bar(ctx, 32, H - 92, W - 64, 52, p.accent, 26);
      ctx.fillStyle = p.surface;
      ctx.font = `700 22px ${SANS}`;
      ctx.textAlign = "center";
      ctx.fillText("ENTRY", W / 2, H - 58);
      ctx.textAlign = "left";
      break;
    }
    case "site": {
      bar(ctx, 0, 0, W, 44, alpha(ink, 0.05));
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = alpha(ink, 0.22);
        ctx.beginPath();
        ctx.arc(22 + i * 20, 22, 6, 0, 7);
        ctx.fill();
      }
      bar(ctx, 88, 12, W - 120, 20, alpha(ink, 0.07), 10);
      bar(ctx, 0, 44, W, 64, p.surface);
      ctx.fillStyle = ink;
      ctx.font = `700 22px ${SANS}`;
      ctx.fillText(opts.title ?? "COMPANY", 32, 84);
      for (let i = 0; i < 4; i++) bar(ctx, W - 300 + i * 70, 70, 48, 8, soft, 4);
      photoBlock(ctx, 0, 108, W, 260, p, seed);
      ctx.fillStyle = "#fff";
      ctx.font = `600 34px ${MINCHO}`;
      ctx.fillText("事業を、編集する。", 32, 250);
      let y = 400;
      for (let r = 0; r < 2; r++) {
        for (let i = 0; i < 3; i++) {
          const cw = (W - 96) / 3;
          photoBlock(ctx, 32 + i * (cw + 16), y, cw, 96, p, seed + r * 5 + i);
          textLines(ctx, 32 + i * (cw + 16), y + 108, cw, 2, softer, 14, seed + i);
        }
        y += 170;
      }
      break;
    }
    case "dashboard": {
      bar(ctx, 0, 0, W, 56, alpha(ink, 0.06));
      ctx.fillStyle = ink;
      ctx.font = `600 20px ${SANS}`;
      ctx.fillText(opts.title ?? "WORKFLOW MONITOR", 24, 35);
      for (let i = 0; i < 3; i++) {
        const cw = (W - 72) / 3;
        bar(ctx, 24 + i * (cw + 12), 76, cw, 92, alpha(ink, 0.05), 8);
        ctx.fillStyle = p.accent;
        ctx.font = `700 30px ${SANS}`;
        ctx.fillText(["82%", "1,240", "0.4s"][i], 36 + i * (cw + 12), 124);
        bar(ctx, 36 + i * (cw + 12), 140, cw * 0.5, 6, softer, 3);
      }
      bar(ctx, 24, 188, W - 48, 200, alpha(ink, 0.04), 8);
      const bw = (W - 96) / 12;
      for (let i = 0; i < 12; i++) {
        const bh = 30 + hash(seed + i) * 130;
        bar(ctx, 40 + i * bw, 368 - bh, bw * 0.55, bh, i % 4 === 3 ? p.secondary : p.accent, 2);
      }
      let ry = 412;
      for (let i = 0; i < 5; i++) {
        bar(ctx, 24, ry, W - 48, 1, soft);
        bar(ctx, 36, ry + 14, 10, 10, i < 3 ? p.accent : softer, 5);
        bar(ctx, 60, ry + 16, 140 + hash(i + seed) * 120, 8, softer, 4);
        bar(ctx, W - 96, ry + 16, 56, 8, softer, 4);
        ry += 40;
      }
      break;
    }
    case "blueprint": {
      ctx.fillStyle = p.surface;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = alpha(p.accent, 0.18);
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.strokeStyle = alpha(p.accent, 0.9);
      ctx.lineWidth = 2.5;
      ctx.strokeRect(64, 96, W - 128, 200);
      ctx.strokeRect(96, 128, 120, 136);
      ctx.beginPath();
      ctx.arc(W - 150, 196, 56, 0, 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(64, 340);
      ctx.lineTo(W - 64, 340);
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(64 + i * ((W - 128) / 3), 332);
        ctx.lineTo(64 + i * ((W - 128) / 3), 348);
        ctx.stroke();
      }
      ctx.fillStyle = alpha(p.accent, 0.75);
      ctx.font = `500 16px ${SANS}`;
      ctx.fillText("SECTION  A–A", 64, 382);
      ctx.strokeRect(64, 410, W - 128, H - 474);
      textLines(ctx, 84, 440, W - 200, 6, alpha(p.accent, 0.3), 22, seed);
      break;
    }
    case "menu": {
      ctx.fillStyle = p.surface;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = alpha(ink, 0.35);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(26, 26, W - 52, H - 52);
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.font = `500 44px ${MINCHO}`;
      ctx.fillText(opts.title ?? "お品書き", W / 2, 108);
      ctx.font = `500 14px ${SANS}`;
      ctx.fillStyle = alpha(ink, 0.5);
      ctx.fillText("S I G N A T U R E", W / 2, 140);
      ctx.textAlign = "left";
      let y = 196;
      const items = ["定番", "季節", "自家製", "甘味", "飲みもの"];
      for (let i = 0; i < items.length; i++) {
        ctx.fillStyle = ink;
        ctx.font = `500 26px ${MINCHO}`;
        ctx.fillText(items[i], 62, y);
        ctx.font = `500 20px ${SANS}`;
        ctx.textAlign = "right";
        ctx.fillStyle = alpha(ink, 0.7);
        ctx.fillText(`¥${900 + i * 180}`, W - 62, y);
        ctx.textAlign = "left";
        ctx.strokeStyle = alpha(ink, 0.18);
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.moveTo(62, y + 14);
        ctx.lineTo(W - 62, y + 14);
        ctx.stroke();
        ctx.setLineDash([]);
        y += 78;
      }
      break;
    }
    case "poster": {
      ctx.fillStyle = p.surface;
      ctx.fillRect(0, 0, W, H);
      photoBlock(ctx, 0, 0, W, H * 0.56, p, seed);
      ctx.fillStyle = ink;
      ctx.font = `600 58px ${MINCHO}`;
      const lines = (opts.title ?? "地域を\n編集する。").split("\n");
      lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, 44, H * 0.68 + i * 68));
      bar(ctx, 44, H * 0.78, 120, 3, p.accent);
      ctx.font = `500 16px ${SANS}`;
      ctx.fillStyle = alpha(ink, 0.55);
      ctx.fillText("LOCAL  CREATION  /  ANYWARE", 44, H * 0.86);
      break;
    }
    case "card": {
      ctx.fillStyle = p.surface;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = ink;
      ctx.font = `700 34px ${SANS}`;
      ctx.fillText(opts.title ?? "ANYWARE", 44, H / 2 - 8);
      bar(ctx, 44, H / 2 + 12, 64, 3, p.accent);
      ctx.font = `500 16px ${SANS}`;
      ctx.fillStyle = alpha(ink, 0.5);
      ctx.fillText("BUSINESS  EDITING", 44, H / 2 + 46);
      break;
    }
    case "ad": {
      photoBlock(ctx, 0, 0, W, H * 0.62, p, seed);
      ctx.fillStyle = p.surface;
      ctx.fillRect(0, H * 0.62, W, H * 0.38);
      ctx.fillStyle = ink;
      ctx.font = `700 30px ${SANS}`;
      ctx.fillText(opts.title ?? "採用強化中", 32, H * 0.62 + 58);
      textLines(ctx, 32, H * 0.62 + 82, W - 200, 2, softer, 20, seed);
      bar(ctx, W - 170, H * 0.62 + 64, 132, 46, p.accent, 6);
      ctx.fillStyle = p.surface;
      ctx.font = `700 18px ${SANS}`;
      ctx.textAlign = "center";
      ctx.fillText("詳しく見る", W - 104, H * 0.62 + 93);
      ctx.textAlign = "left";
      break;
    }
    case "map": {
      ctx.fillStyle = p.surface;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = alpha(ink, 0.12);
      ctx.lineWidth = 1;
      for (let i = 0; i < 26; i++) {
        ctx.beginPath();
        ctx.ellipse(W * 0.45, H * 0.5, 20 + i * 16, 14 + i * 11, 0.4, 0, 7);
        ctx.stroke();
      }
      ctx.strokeStyle = alpha(p.accent, 0.8);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(40, H * 0.78);
      ctx.bezierCurveTo(W * 0.3, H * 0.6, W * 0.4, H * 0.42, W - 50, H * 0.2);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = p.secondary;
        ctx.beginPath();
        ctx.arc(70 + i * ((W - 140) / 4), H * 0.76 - i * (H * 0.13), 9, 0, 7);
        ctx.fill();
      }
      break;
    }
    case "doc": {
      ctx.fillStyle = p.surface;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = ink;
      ctx.font = `600 26px ${MINCHO}`;
      ctx.fillText(opts.title ?? "WORKFLOW", 44, 78);
      bar(ctx, 44, 96, 80, 3, p.accent);
      let y = 132;
      for (let s = 0; s < 4; s++) {
        bar(ctx, 44, y, W - 88, 1, soft);
        textLines(ctx, 44, y + 16, W - 140, 3, softer, 18, seed + s);
        y += 110;
      }
      break;
    }
  }

  /* print / screen grain so nothing looks vector-flat */
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(0,0,0,${hash(seed * 3 + i) * 0.035})`;
    ctx.fillRect(hash(i * 5 + seed) * W, hash(i * 9 + seed) * H, 1.5, 1.5);
  }

  return toTexture(c, key);
}

/* ------------------------------------------------------------------ */
/*  Gallery images — real work, with an editorial placeholder until    */
/*  the files are dropped into /public/works/**                        */
/* ------------------------------------------------------------------ */

export function placeholderTexture(
  index: number,
  label: string,
  projectTitle: string,
  p: Palette,
  aspect = 1,
  kind = "",
) {
  const key = `ph:${projectTitle}:${label}:${kind}:${index}:${p.accent}:${aspect}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const W = 760;
  const H = Math.round(W / aspect);
  const { c, ctx } = make(W, H);

  /* Carriers crop this to their own shape, so everything that has to survive
     lives in the middle: a tinted field edge to edge, type dead centre. */
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, alpha(p.accent, 0.96));
  g.addColorStop(1, alpha(p.secondary, 0.9));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = alpha(i % 2 ? "#ffffff" : "#000000", 0.05 + hash(index * 7 + i) * 0.06);
    ctx.beginPath();
    ctx.ellipse(
      hash(index + i * 3) * W,
      hash(index + i * 5) * H,
      W * (0.2 + hash(index + i) * 0.45),
      H * (0.2 + hash(index + i * 9) * 0.45),
      hash(index + i) * 3,
      0,
      7,
    );
    ctx.fill();
  }

  const cx = W / 2;
  const cy = H / 2;
  ctx.textAlign = "center";

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = `600 ${Math.round(H * 0.03)}px ${SANS}`;
  ctx.fillText(String(index + 1).padStart(2, "0"), cx, cy - H * 0.115);

  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${Math.round(H * 0.082)}px ${MINCHO}`;
  ctx.fillText(label, cx, cy + H * 0.01);

  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.055, cy + H * 0.052);
  ctx.lineTo(cx + W * 0.055, cy + H * 0.052);
  ctx.stroke();

  if (kind) {
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = `500 ${Math.round(H * 0.031)}px ${SANS}`;
    ctx.fillText(kind, cx, cy + H * 0.105);
  }
  ctx.textAlign = "left";

  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(0,0,0,${hash(index * 3 + i) * 0.03})`;
    ctx.fillRect(hash(i * 5 + index) * W, hash(i * 9 + index) * H, 1.5, 1.5);
  }

  return toTexture(c, key);
}

const loader = new THREE.TextureLoader();
const loaded = new Map<string, THREE.Texture | null>();

/** Resolves to the real asset, or null when the file is not in place yet. */
export function loadGallery(url: string): Promise<THREE.Texture | null> {
  if (loaded.has(url)) return Promise.resolve(loaded.get(url)!);
  return new Promise((resolve) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        loaded.set(url, tex);
        resolve(tex);
      },
      undefined,
      () => {
        loaded.set(url, null);
        resolve(null);
      },
    );
  });
}
