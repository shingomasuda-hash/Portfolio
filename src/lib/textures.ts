import * as THREE from "three";
import { hash } from "./math";

/* ------------------------------------------------------------------ */
/*  Canvas helpers                                                     */
/* ------------------------------------------------------------------ */

const cache = new Map<string, THREE.CanvasTexture>();

const SANS = `"Archivo","Zen Kaku Gothic New","Helvetica Neue",Arial,sans-serif`;
const MINCHO = `"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif`;

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  return { c, ctx };
}

function finish(
  c: HTMLCanvasElement,
  key: string,
  opts: { repeat?: [number, number]; srgb?: boolean; aniso?: number } = {},
) {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  if (opts.repeat) tex.repeat.set(opts.repeat[0], opts.repeat[1]);
  tex.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  tex.anisotropy = opts.aniso ?? 8;
  tex.needsUpdate = true;
  cache.set(key, tex);
  return tex;
}

function memo(key: string, build: () => THREE.CanvasTexture) {
  const hit = cache.get(key);
  if (hit) return hit;
  return build();
}

const shade = (hex: string, amount: number) =>
  "#" + new THREE.Color(hex).offsetHSL(0, 0, amount).getHexString();

/* ------------------------------------------------------------------ */
/*  Material surfaces — every book / prop gets a real grain            */
/* ------------------------------------------------------------------ */

export type SurfaceKind =
  | "paper"
  | "linen"
  | "wood"
  | "metal"
  | "concrete"
  | "soil"
  | "stone"
  | "board"
  | "screenGlass"
  | "clay";

export function surfaceTexture(kind: SurfaceKind, color: string, seed = 1) {
  return memo(`surf:${kind}:${color}:${seed}`, () => {
    const S = 512;
    const { c, ctx } = canvas(S, S);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, S, S);

    const grain = (count: number, alpha: number, size: number, dark: boolean) => {
      for (let i = 0; i < count; i++) {
        const n = seed * 1000 + i;
        const x = hash(n) * S;
        const y = hash(n + 0.5) * S;
        const a = alpha * (0.4 + hash(n + 0.25) * 0.6);
        ctx.fillStyle = dark ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`;
        ctx.fillRect(x, y, size, size);
      }
    };

    switch (kind) {
      case "paper":
        grain(9000, 0.05, 2, true);
        grain(6000, 0.06, 2, false);
        break;
      case "linen": {
        ctx.globalAlpha = 0.16;
        for (let y = 0; y < S; y += 4) {
          ctx.fillStyle = y % 8 === 0 ? "#ffffff" : "#000000";
          ctx.fillRect(0, y, S, 2);
        }
        for (let x = 0; x < S; x += 4) {
          ctx.fillStyle = x % 8 === 0 ? "#000000" : "#ffffff";
          ctx.fillRect(x, 0, 2, S);
        }
        ctx.globalAlpha = 1;
        grain(4000, 0.05, 2, true);
        break;
      }
      case "wood": {
        for (let i = 0; i < 90; i++) {
          const y = (i / 90) * S + hash(seed + i) * 5;
          ctx.strokeStyle = `rgba(0,0,0,${0.02 + hash(i + seed) * 0.07})`;
          ctx.lineWidth = 1 + hash(i * 3) * 3;
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x <= S; x += 32) {
            ctx.lineTo(x, y + Math.sin(x * 0.012 + i) * 3.5 + hash(i + x) * 2);
          }
          ctx.stroke();
        }
        grain(2500, 0.04, 2, true);
        break;
      }
      case "metal": {
        for (let i = 0; i < 1400; i++) {
          const y = hash(seed + i) * S;
          const a = 0.03 + hash(i * 7) * 0.06;
          ctx.strokeStyle = hash(i * 11) > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(hash(i * 5) * S, y);
          ctx.lineTo(hash(i * 5) * S + 40 + hash(i * 13) * 180, y);
          ctx.stroke();
        }
        break;
      }
      case "concrete":
      case "stone": {
        grain(14000, 0.07, 3, true);
        grain(8000, 0.05, 3, false);
        for (let i = 0; i < 22; i++) {
          ctx.fillStyle = `rgba(0,0,0,0.03)`;
          ctx.beginPath();
          ctx.arc(hash(i + seed) * S, hash(i * 3 + seed) * S, 12 + hash(i * 5) * 48, 0, 7);
          ctx.fill();
        }
        break;
      }
      case "soil": {
        grain(20000, 0.10, 3, true);
        grain(9000, 0.06, 2, false);
        break;
      }
      case "board": {
        grain(5000, 0.05, 2, true);
        ctx.globalAlpha = 0.08;
        for (let x = 0; x < S; x += 6) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x, 0, 1, S);
        }
        ctx.globalAlpha = 1;
        break;
      }
      case "clay": {
        grain(7000, 0.04, 3, true);
        grain(5000, 0.05, 3, false);
        break;
      }
      case "screenGlass": {
        const g = ctx.createLinearGradient(0, 0, S, S);
        g.addColorStop(0, shade(color, 0.06));
        g.addColorStop(1, shade(color, -0.05));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
        break;
      }
    }
    return finish(c, `surf:${kind}:${color}:${seed}`, { repeat: [1, 1] });
  });
}

/** Matching roughness map so grain also reads in the lighting, not just albedo. */
export function roughnessTexture(kind: SurfaceKind, seed = 1) {
  return memo(`rough:${kind}:${seed}`, () => {
    const S = 256;
    const { c, ctx } = canvas(S, S);
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, S, S);
    const n = kind === "metal" ? 3000 : 6000;
    for (let i = 0; i < n; i++) {
      const v = hash(seed * 31 + i);
      ctx.fillStyle = `rgba(${v > 0.5 ? "255,255,255" : "0,0,0"},0.16)`;
      if (kind === "metal") {
        const y = hash(i * 3 + seed) * S;
        ctx.fillRect(hash(i * 5) * S, y, 30 + hash(i) * 90, 1);
      } else {
        ctx.fillRect(hash(i * 5) * S, hash(i * 7) * S, 2, 2);
      }
    }
    return finish(c, `rough:${kind}:${seed}`, { srgb: false });
  });
}

/* ------------------------------------------------------------------ */
/*  Typography baked into textures (no remote font files in WebGL)     */
/* ------------------------------------------------------------------ */

export type TextTextureOpts = {
  width?: number;
  height?: number;
  bg?: string;
  color?: string;
  font?: "sans" | "mincho";
  size?: number;
  weight?: number;
  tracking?: number;
  align?: "left" | "center" | "right";
  vertical?: boolean;
  padding?: number;
  lineGap?: number;
  rule?: string | null;
  /** shrink the type until the line fits the canvas width */
  fit?: boolean;
  sub?: string;
  subColor?: string;
  subSize?: number;
};

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: "left" | "center" | "right",
) {
  if (!tracking) {
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    return;
  }
  const chars = [...text];
  const total =
    chars.reduce((s, ch) => s + ctx.measureText(ch).width, 0) + tracking * (chars.length - 1);
  let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
  ctx.textAlign = "left";
  for (const ch of chars) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
}

export function textTexture(text: string, o: TextTextureOpts = {}) {
  const key = `text:${text}:${JSON.stringify(o)}`;
  return memo(key, () => {
    const W = o.width ?? 1024;
    const H = o.height ?? 256;
    const { c, ctx } = canvas(W, H);
    if (o.bg) {
      ctx.fillStyle = o.bg;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
    const pad = o.padding ?? 40;
    const size = o.size ?? 96;
    const weight = o.weight ?? 600;
    const family = o.font === "mincho" ? MINCHO : SANS;
    ctx.fillStyle = o.color ?? "#1c1c1c";
    ctx.textBaseline = "middle";

    if (o.vertical) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.font = `${weight} ${size}px ${family}`;
      drawTracked(ctx, text, 0, 0, o.tracking ?? 0, "center");
      ctx.restore();
      return finish(c, key);
    }

    const lines = text.split("\n");
    let fitted = size;
    if (o.fit) {
      const avail = W - pad * 2;
      ctx.font = `${weight} ${size}px ${family}`;
      const widest = Math.max(
        ...lines.map(
          (l) =>
            ctx.measureText(l).width + (o.tracking ?? 0) * Math.max(0, [...l].length - 1),
        ),
      );
      if (widest > avail) fitted = Math.max(18, Math.floor(size * (avail / widest)));
    }
    const gap = o.lineGap ?? fitted * 1.32;
    const align = o.align ?? "left";
    const x = align === "center" ? W / 2 : align === "right" ? W - pad : pad;
    const blockH = (lines.length - 1) * gap + (o.sub ? gap * 0.9 : 0);
    let y = H / 2 - blockH / 2;

    ctx.font = `${weight} ${fitted}px ${family}`;
    for (const line of lines) {
      drawTracked(ctx, line, x, y, o.tracking ?? 0, align);
      y += gap;
    }
    if (o.sub) {
      ctx.font = `500 ${o.subSize ?? fitted * 0.42}px ${family}`;
      ctx.fillStyle = o.subColor ?? "rgba(0,0,0,0.5)";
      drawTracked(ctx, o.sub, x, y + gap * 0.1, (o.tracking ?? 0) * 1.6, align);
    }
    if (o.rule) {
      ctx.fillStyle = o.rule;
      ctx.fillRect(pad, H - pad, W - pad * 2, 3);
    }
    return finish(c, key);
  });
}
