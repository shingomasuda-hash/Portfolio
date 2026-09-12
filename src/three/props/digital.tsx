import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { hash, hashRange } from "../../lib/math";
import { screenTexture, type Palette, type ScreenKind } from "../../lib/screens";
import { textTexture } from "../../lib/textures";
import { stage } from "../../state/experience";
import { Cyl, Surf } from "./base";

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ */
/*  Screen surface — lit, not neon                                     */
/* ------------------------------------------------------------------ */

function ScreenFace({
  map,
  w,
  h,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  glow = 0.34,
  scroll = 0,
  window: win = 1,
}: {
  map: THREE.Texture;
  w: number;
  h: number;
  position?: Vec3;
  rotation?: Vec3;
  glow?: number;
  /** px/sec of vertical travel — used for "scrolling the LP" */
  scroll?: number;
  /** 0..1 slice of the texture shown (a tall page seen through a device) */
  window?: number;
}) {
  const tex = useMemo(() => {
    const t = map.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, win);
    t.offset.set(0, 1 - win);
    return t;
  }, [map, win]);

  useFrame(() => {
    if (!scroll) return;
    const live = stage.phase === "idle";
    if (!live) return;
    const span = 1 - win;
    if (span <= 0) return;
    const t = (Math.sin(stage.time * scroll) * 0.5 + 0.5) * span;
    tex.offset.y = span - t;
  });

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        map={tex}
        emissiveMap={tex}
        emissive={new THREE.Color(0xffffff)}
        emissiveIntensity={glow}
        roughness={0.24}
        metalness={0.0}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Devices                                                            */
/* ------------------------------------------------------------------ */

export function Phone({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  h = 0.3,
  palette,
  kind = "feed",
  body = "#2C2E2D",
  seed = 1,
  scroll = 0,
  windowSlice = 1,
  standing = true,
}: {
  position?: Vec3;
  rotation?: Vec3;
  h?: number;
  palette: Palette;
  kind?: ScreenKind;
  body?: string;
  seed?: number;
  scroll?: number;
  windowSlice?: number;
  standing?: boolean;
}) {
  const w = h * 0.49;
  const map = useMemo(() => screenTexture(kind, palette, { seed }), [kind, palette, seed]);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, standing ? h / 2 : 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, h * 0.038]} />
        <meshStandardMaterial color={body} roughness={0.42} metalness={0.35} />
      </mesh>
      <ScreenFace
        map={map}
        w={w * 0.9}
        h={h * 0.9}
        window={windowSlice}
        scroll={scroll}
        position={[0, standing ? h / 2 : 0, h * 0.02]}
      />
      {standing && (
        <mesh position={[0, 0.004, -h * 0.06]} rotation={[0.38, 0, 0]}>
          <boxGeometry args={[w * 0.34, h * 0.2, 0.004]} />
          <meshStandardMaterial color={body} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

export function Monitor({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.46,
  palette,
  kind = "site",
  seed = 1,
  scroll = 0,
  windowSlice = 1,
  frame = "#DDDCD6",
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  palette: Palette;
  kind?: ScreenKind;
  seed?: number;
  scroll?: number;
  windowSlice?: number;
  frame?: string;
}) {
  const h = w * 0.62;
  const map = useMemo(
    () => screenTexture(kind, palette, { seed, w: 640, h: 400 }),
    [kind, palette, seed],
  );
  const standH = w * 0.2;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.42, 0.014, w * 0.24]} />
        <meshStandardMaterial color={frame} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, standH / 2, 0]} castShadow>
        <boxGeometry args={[w * 0.07, standH, w * 0.05]} />
        <meshStandardMaterial color={frame} roughness={0.4} metalness={0.5} />
      </mesh>
      <group position={[0, standH + h / 2, 0]} rotation={[-0.06, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, w * 0.03]} />
          <meshStandardMaterial color={frame} roughness={0.38} metalness={0.45} />
        </mesh>
        <ScreenFace
          map={map}
          w={w * 0.94}
          h={h * 0.9}
          window={windowSlice}
          scroll={scroll}
          position={[0, h * 0.018, w * 0.016]}
        />
      </group>
    </group>
  );
}

export function Laptop({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.34,
  palette,
  kind = "dashboard",
  seed = 1,
  shell = "#D8D8D3",
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  palette: Palette;
  kind?: ScreenKind;
  seed?: number;
  shell?: string;
}) {
  const d = w * 0.7;
  const map = useMemo(
    () => screenTexture(kind, palette, { seed, w: 640, h: 420 }),
    [kind, palette, seed],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.016, d]} />
        <meshStandardMaterial color={shell} roughness={0.34} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.017, d * 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.82, d * 0.5]} />
        <meshStandardMaterial color="#9FA09B" roughness={0.7} />
      </mesh>
      <group position={[0, 0.016, -d / 2]} rotation={[-1.86, 0, 0]}>
        <mesh position={[0, d * 0.34, 0]} castShadow>
          <boxGeometry args={[w, d * 0.68, 0.008]} />
          <meshStandardMaterial color={shell} roughness={0.34} metalness={0.55} />
        </mesh>
        <ScreenFace map={map} w={w * 0.92} h={d * 0.6} position={[0, d * 0.34, 0.005]} />
      </group>
    </group>
  );
}

/** The long-scroll LP as a physical ribbon of paper-thin screen. */
export function LPScroll({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  w = 0.26,
  h = 0.62,
  palette,
  seed = 1,
  title = "RECRUIT",
}: {
  position?: Vec3;
  rotation?: Vec3;
  w?: number;
  h?: number;
  palette: Palette;
  seed?: number;
  title?: string;
}) {
  const map = useMemo(
    () => screenTexture("lp", palette, { seed, title, w: 420, h: 980 }),
    [palette, seed, title],
  );
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    if (stage.phase !== "idle") return;
    g.current.rotation.y = Math.sin(stage.time * 0.4 + seed) * 0.05;
  });
  return (
    <group ref={g} position={position} rotation={rotation}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.006]} />
        <meshStandardMaterial color="#F4F3EF" roughness={0.5} />
      </mesh>
      <ScreenFace map={map} w={w * 0.96} h={h * 0.98} position={[0, h / 2, 0.004]} glow={0.28} />
      {/* it curls at the bottom like unrolled paper */}
      <mesh position={[0, 0.012, 0.014]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[w, w * 0.16, 0.006]} />
        <meshStandardMaterial color="#EDECE7" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** A social post that has left the phone and become a physical card. */
export function PostCard({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  w = 0.17,
  palette,
  kind = "post",
  seed = 1,
  float = true,
}: {
  position?: Vec3;
  rotation?: Vec3;
  w?: number;
  palette: Palette;
  kind?: ScreenKind;
  seed?: number;
  float?: boolean;
}) {
  const h = w * 1.32;
  const map = useMemo(
    () => screenTexture(kind, palette, { seed, w: 360, h: 480 }),
    [kind, palette, seed],
  );
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current || !float) return;
    if (stage.phase !== "idle") return;
    g.current.position.y = Math.sin(stage.time * 0.9 + seed * 2) * 0.012;
    g.current.rotation.z = Math.sin(stage.time * 0.6 + seed) * 0.03;
  });
  return (
    <group position={position} rotation={rotation}>
      <group ref={g}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, 0.005]} />
          <meshStandardMaterial color={palette.surface} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.0032]}>
          <planeGeometry args={[w * 0.94, h * 0.95]} />
          <meshStandardMaterial map={map} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

/** Performance, as physical bars growing out of the page. */
export function Bars({
  position = [0, 0, 0],
  rotation = 0,
  count = 7,
  w = 0.032,
  gap = 0.046,
  maxH = 0.2,
  color,
  highlight,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  count?: number;
  w?: number;
  gap?: number;
  maxH?: number;
  color: string;
  highlight: string;
  seed?: number;
}) {
  const g = useRef<THREE.Group>(null);
  const targets = useMemo(
    () => Array.from({ length: count }, (_, i) => 0.28 + hash(seed * 5 + i) * 0.72),
    [count, seed],
  );
  useFrame(() => {
    if (!g.current) return;
    g.current.children.forEach((c, i) => {
      const grow = stage.phase === "idle" || stage.phase === "raise" ? 1 : 0.04;
      const wave = 1 + Math.sin(stage.time * 0.8 + i * 0.6) * 0.08;
      const want = targets[i] * grow * wave;
      c.scale.y = THREE.MathUtils.lerp(c.scale.y, want, 0.08);
      c.position.y = (c.scale.y * maxH) / 2;
    });
  });
  return (
    <group ref={g} position={position} rotation={[0, rotation, 0]}>
      {targets.map((_, i) => (
        <mesh key={i} position={[(i - (count - 1) / 2) * gap, 0, 0]} scale={[1, 0.04, 1]} castShadow>
          <boxGeometry args={[w, maxH, w]} />
          <meshStandardMaterial
            color={i === count - 1 ? highlight : color}
            roughness={0.78}
            metalness={0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Cursor({
  position = [0, 0, 0],
  color = "#222828",
  size = 0.05,
}: {
  position?: Vec3;
  color?: string;
  size?: number;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current || stage.phase !== "idle") return;
    g.current.position.x = position[0] + Math.sin(stage.time * 0.7) * 0.05;
    g.current.position.y = position[1] + Math.cos(stage.time * 0.5) * 0.03;
  });
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, -1);
    s.lineTo(0.26, -0.74);
    s.lineTo(0.44, -1.12);
    s.lineTo(0.6, -1.04);
    s.lineTo(0.42, -0.68);
    s.lineTo(0.74, -0.66);
    s.closePath();
    return s;
  }, []);
  return (
    <group ref={g} position={position}>
      <mesh scale={[size, size, size]} castShadow>
        <extrudeGeometry args={[shape, { depth: 0.06, bevelEnabled: false }]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function CTAButton({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  label = "ENTRY",
  color,
  fg = "#F7F5F0",
  w = 0.18,
}: {
  position?: Vec3;
  rotation?: Vec3;
  label?: string;
  color: string;
  fg?: string;
  w?: number;
}) {
  const map = useMemo(
    () =>
      textTexture(label, {
        width: 512,
        height: 160,
        size: 72,
        weight: 700,
        tracking: 12,
        align: "center",
        color: fg,
        bg: color,
      }),
    [label, color, fg],
  );
  const m = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!m.current || stage.phase !== "idle") return;
    m.current.position.y = Math.sin(stage.time * 1.6) * 0.006;
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh ref={m} castShadow>
        <boxGeometry args={[w, w * 0.31, 0.014]} />
        <meshStandardMaterial map={map} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  System / workflow objects (AI page)                                */
/* ------------------------------------------------------------------ */

/** A workflow step: a milled block, labelled, with an intake slot. */
export function NodeBlock({
  position = [0, 0, 0],
  rotation = 0,
  label,
  w = 0.16,
  h = 0.1,
  color = "#CFD8D5",
  accent,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  label: string;
  w?: number;
  h?: number;
  color?: string;
  accent: string;
  seed?: number;
}) {
  const map = useMemo(
    () =>
      textTexture(label, {
        width: 512,
        height: 200,
        size: 62,
        weight: 600,
        tracking: 10,
        align: "center",
        color: "rgba(30,36,38,0.78)",
        bg: color,
      }),
    [label, color],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, w * 0.62]} />
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.22} />
      </mesh>
      <mesh position={[0, h / 2, w * 0.311]}>
        <planeGeometry args={[w * 0.88, h * 0.6]} />
        <meshStandardMaterial map={map} roughness={0.5} />
      </mesh>
      <mesh position={[0, h + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.62, w * 0.08]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
      <Surf kind="metal" color={color} seed={seed} />
    </group>
  );
}

/** A physical link between two workflow steps, with work travelling along it. */
export function Flow({
  from,
  to,
  color,
  packets = 2,
  speed = 0.35,
  offset = 0,
  height = 0.03,
}: {
  from: Vec3;
  to: Vec3;
  color: string;
  packets?: number;
  speed?: number;
  offset?: number;
  height?: number;
}) {
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += height * 0.6 + a.distanceTo(b) * 0.03;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to, height]);

  const geo = useMemo(() => new THREE.TubeGeometry(curve, 24, 0.003, 6, false), [curve]);
  const dots = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!dots.current) return;
    const live = stage.phase === "idle";
    dots.current.children.forEach((c, i) => {
      const t = live ? (stage.time * speed + offset + i / packets) % 1 : 0;
      const p = curve.getPoint(t);
      c.position.copy(p);
      const s = live ? Math.sin(t * Math.PI) * 0.9 + 0.1 : 0;
      c.scale.setScalar(s);
    });
  });

  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={0.32} />
      </mesh>
      <group ref={dots}>
        {Array.from({ length: packets }).map((_, i) => (
          <mesh key={i} castShadow>
            <boxGeometry args={[0.014, 0.011, 0.014]} />
            <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Database({
  position = [0, 0, 0],
  r = 0.06,
  layers = 3,
  color = "#C9D2CE",
  accent,
}: {
  position?: Vec3;
  r?: number;
  layers?: number;
  color?: string;
  accent: string;
}) {
  const lh = r * 0.42;
  return (
    <group position={position}>
      {Array.from({ length: layers }).map((_, i) => (
        <group key={i} position={[0, i * (lh + 0.006), 0]}>
          <Cyl r={r} h={lh} color={color} kind="metal" seed={i + 1} rough={0.38} metal={0.35} />
          <mesh position={[0, lh * 0.5, r * 0.98]}>
            <boxGeometry args={[r * 0.5, lh * 0.18, 0.003]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function MailStack({
  position = [0, 0, 0],
  rotation = 0,
  count = 3,
  w = 0.11,
  color = "#F2F0EA",
  accent,
}: {
  position?: Vec3;
  rotation?: number;
  count?: number;
  w?: number;
  color?: string;
  accent: string;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current || stage.phase !== "idle") return;
    g.current.children.forEach((c, i) => {
      c.position.y = i * 0.012 + Math.sin(stage.time * 1.1 + i) * 0.008;
    });
  });
  return (
    <group ref={g} position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[0, i * 0.012, 0]} rotation={[0, hashRange(i + 1, -0.2, 0.2), 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w, 0.008, w * 0.64]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.0045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.96, w * 0.6]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.0052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.5, w * 0.06]} />
            <meshStandardMaterial color={accent} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * The model that runs the workflow. Deliberately NOT a glowing orb —
 * a machined aluminium block with a slow frosted ring around it.
 */
export function AICore({
  position = [0, 0, 0],
  size = 0.13,
  color = "#C6D0CD",
  accent,
}: {
  position?: Vec3;
  size?: number;
  color?: string;
  accent: string;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const live = stage.phase === "idle";
    if (ring.current) ring.current.rotation.y += live ? 0.0035 : 0;
    if (ring2.current) {
      ring2.current.rotation.x += live ? 0.0022 : 0;
      ring2.current.rotation.z += live ? 0.0016 : 0;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, size * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.45} />
      </mesh>
      {/* milled slots — machined, not magical */}
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[0, size * 0.5 + i * size * 0.22, size * 0.503]}>
          <planeGeometry args={[size * 0.74, size * 0.055]} />
          <meshStandardMaterial color={accent} roughness={0.55} />
        </mesh>
      ))}
      <mesh ref={ring} position={[0, size * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 0.96, size * 0.035, 8, 40]} />
        <meshPhysicalMaterial
          color="#EDF1EF"
          roughness={0.18}
          transmission={0.6}
          thickness={0.05}
          metalness={0.1}
        />
      </mesh>
      <mesh ref={ring2} position={[0, size * 0.5, 0]} rotation={[0.6, 0, 0.4]}>
        <torusGeometry args={[size * 1.22, size * 0.018, 8, 40]} />
        <meshStandardMaterial color={accent} roughness={0.45} metalness={0.3} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[size * 1.35, 40]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
