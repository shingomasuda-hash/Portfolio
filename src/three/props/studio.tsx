import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { hash, hashRange } from "../../lib/math";
import { screenTexture, type Palette, type ScreenKind } from "../../lib/screens";
import { textTexture } from "../../lib/textures";
import { stage } from "../../state/experience";
import { Block, Cyl, Surf } from "./base";

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ */
/*  Print & identity                                                   */
/* ------------------------------------------------------------------ */

export function Poster({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  h = 0.4,
  palette,
  kind = "poster",
  title,
  seed = 1,
  lean = true,
}: {
  position?: Vec3;
  rotation?: Vec3;
  h?: number;
  palette: Palette;
  kind?: ScreenKind;
  title?: string;
  seed?: number;
  lean?: boolean;
}) {
  const w = h * 0.707;
  const map = useMemo(
    () => screenTexture(kind, palette, { seed, title, w: 440, h: 620 }),
    [kind, palette, seed, title],
  );
  return (
    <group position={position} rotation={rotation}>
      <group rotation={[lean ? -0.09 : 0, 0, 0]}>
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, 0.005]} />
          <meshStandardMaterial color={palette.surface} roughness={0.94} />
        </mesh>
        <mesh position={[0, h / 2, 0.0032]}>
          <planeGeometry args={[w * 0.97, h * 0.98]} />
          <meshStandardMaterial map={map} roughness={0.94} />
        </mesh>
      </group>
    </group>
  );
}

/** A brand book that actually opens when the page has settled. */
export function BrandBook({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.26,
  palette,
  cover = "#202424",
  foil = "#A98653",
  title = "BRAND",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  palette: Palette;
  cover?: string;
  foil?: string;
  title?: string;
  seed?: number;
}) {
  const d = w * 0.74;
  const map = useMemo(
    () =>
      textTexture(title, {
        width: 512,
        height: 340,
        size: 62,
        weight: 700,
        tracking: 14,
        align: "center",
        color: foil,
        bg: cover,
      }),
    [title, foil, cover],
  );
  const spread = useMemo(
    () => screenTexture("doc", palette, { seed, title, w: 420, h: 560 }),
    [palette, seed, title],
  );
  const lid = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!lid.current) return;
    const want = stage.phase === "idle" ? -2.5 : -0.02;
    lid.current.rotation.z = THREE.MathUtils.lerp(lid.current.rotation.z, want, 0.045);
  });
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* pages */}
      <mesh position={[w / 2, 0.014, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.97, 0.022, d * 0.97]} />
        <meshStandardMaterial color="#F4F1E9" roughness={0.95} />
      </mesh>
      <mesh position={[w / 2, 0.0262, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.9, d * 0.9]} />
        <meshStandardMaterial map={spread} roughness={0.95} />
      </mesh>
      {/* back board */}
      <mesh position={[w / 2, 0.002, 0]} receiveShadow>
        <boxGeometry args={[w * 1.02, 0.006, d * 1.02]} />
        <Surf kind="linen" color={cover} seed={seed} rough={0.9} />
      </mesh>
      {/* front board, hinged at the spine */}
      <group ref={lid} position={[0, 0.028, 0]}>
        <mesh position={[w / 2, 0.004, 0]} castShadow>
          <boxGeometry args={[w * 1.02, 0.008, d * 1.02]} />
          <Surf kind="linen" color={cover} seed={seed + 1} rough={0.88} />
        </mesh>
        <mesh position={[w / 2, 0.0085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w * 0.8, d * 0.5]} />
          <meshStandardMaterial map={map} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export function BizCards({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.09,
  color = "#F6F4EE",
  accent,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  color?: string;
  accent: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[i * w * 0.42, 0.003 + i * 0.0035, hashRange(seed + i, -0.012, 0.012)]}
          rotation={[0, hashRange(seed + i * 3, -0.25, 0.25), 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w, 0.0035, w * 0.58]} />
          <meshStandardMaterial color={i === 1 ? accent : color} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

export function Envelope({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.14,
  color = "#EFEBE0",
  accent,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  color?: string;
  accent: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.003, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.006, w * 0.62]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.0065, -w * 0.155]} rotation={[-Math.PI / 2 + 0.24, 0, 0]}>
        <planeGeometry args={[w * 0.98, w * 0.3]} />
        <meshStandardMaterial color={color} roughness={0.94} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[w * 0.3, 0.0064, w * 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.24, w * 0.1]} />
        <meshStandardMaterial color={accent} roughness={0.85} />
      </mesh>
    </group>
  );
}

/** A single letterform cut as a solid — typography as an object. */
export function TypeBlock({
  position = [0, 0, 0],
  rotation = 0,
  glyph = "A",
  h = 0.2,
  color = "#202424",
  face = "#F6F4EE",
}: {
  position?: Vec3;
  rotation?: number;
  glyph?: string;
  h?: number;
  color?: string;
  face?: string;
}) {
  const map = useMemo(
    () =>
      textTexture(glyph, {
        width: 400,
        height: 400,
        size: 300,
        weight: 700,
        align: "center",
        font: "mincho",
        color,
        bg: face,
      }),
    [glyph, color, face],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[h * 0.8, h, h * 0.28]} />
        <meshStandardMaterial color={face} roughness={0.9} />
      </mesh>
      <mesh position={[0, h / 2, h * 0.141]}>
        <planeGeometry args={[h * 0.78, h * 0.98]} />
        <meshStandardMaterial map={map} roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Industry & site                                                    */
/* ------------------------------------------------------------------ */

/** A working machine — it actually turns while the page is settled. */
export function Machine({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.3,
  h = 0.22,
  body = "#B8BCB8",
  accent,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  h?: number;
  body?: string;
  accent: string;
  seed?: number;
}) {
  const wheel = useRef<THREE.Mesh>(null);
  const arm = useRef<THREE.Group>(null);
  useFrame(() => {
    const live = stage.phase === "idle";
    if (wheel.current) wheel.current.rotation.z += live ? 0.02 : 0;
    if (arm.current)
      arm.current.rotation.x = live ? Math.sin(stage.time * 1.1) * 0.22 - 0.1 : -0.1;
  });
  const d = w * 0.6;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, h * 0.62, d]} color={body} kind="metal" seed={seed} rough={0.48} metal={0.5} />
      <Block
        size={[w * 0.42, h * 0.42, d * 0.8]}
        position={[-w * 0.24, h * 0.62, 0]}
        color={body}
        kind="metal"
        seed={seed + 1}
        rough={0.42}
        metal={0.55}
      />
      <mesh ref={wheel} position={[w * 0.3, h * 0.5, d * 0.52]} castShadow>
        <torusGeometry args={[h * 0.26, h * 0.05, 8, 24]} />
        <meshStandardMaterial color={accent} roughness={0.45} metalness={0.3} />
      </mesh>
      <group ref={arm} position={[w * 0.16, h * 0.62, 0]}>
        <mesh position={[0, h * 0.2, 0]} castShadow>
          <boxGeometry args={[w * 0.08, h * 0.44, w * 0.08]} />
          <meshStandardMaterial color="#8E948F" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, h * 0.44, 0]} castShadow>
          <boxGeometry args={[w * 0.18, h * 0.07, w * 0.14]} />
          <meshStandardMaterial color={accent} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
      {/* control panel */}
      <mesh position={[-w * 0.24, h * 0.84, d * 0.4]} rotation={[-0.5, 0, 0]}>
        <planeGeometry args={[w * 0.3, h * 0.2]} />
        <meshStandardMaterial color="#3D474B" roughness={0.4} />
      </mesh>
      <Cyl r={0.008} h={h * 0.9} position={[w * 0.44, h * 0.62, -d * 0.3]} color="#A6ABA6" kind="metal" seed={seed + 4} metal={0.6} rough={0.4} />
    </group>
  );
}

export function Rack({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.2,
  h = 0.36,
  body = "#9FA8AA",
  accent,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  h?: number;
  body?: string;
  accent: string;
  seed?: number;
}) {
  const d = w * 0.62;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, h, d]} color={body} kind="metal" seed={seed} rough={0.44} metal={0.5} />
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, h * (0.16 + i * 0.17), d / 2 + 0.002]}>
          <planeGeometry args={[w * 0.82, h * 0.05]} />
          <meshStandardMaterial color="#5C666A" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[w * 0.28, h * 0.9, d / 2 + 0.003]}>
        <circleGeometry args={[w * 0.09, 20]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Conduit runs — the actual language of an electrical / plant site. */
export function Conduit({
  position = [0, 0, 0],
  rotation = 0,
  len = 0.5,
  h = 0.3,
  color = "#96A0A3",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  len?: number;
  h?: number;
  color?: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[0, 1].map((i) => {
        const y = h - i * 0.055;
        return (
          <group key={i}>
            <Cyl
              r={0.012}
              h={len}
              position={[0, y, 0]}
              rotation={[0, 0, Math.PI / 2]}
              color={color}
              kind="metal"
              seed={seed + i}
              rough={0.4}
              metal={0.6}
              anchor="center"
            />
            <mesh position={[len / 2, y - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.02, 0.012, 8, 12, Math.PI / 2]} />
              <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
            </mesh>
          </group>
        );
      })}
      <Cyl r={0.014} h={h} position={[-len / 2, 0, 0]} color={color} kind="metal" seed={seed + 5} rough={0.4} metal={0.6} />
      <Cyl r={0.014} h={h - 0.055} position={[len / 2, 0, 0]} color={color} kind="metal" seed={seed + 6} rough={0.4} metal={0.6} />
    </group>
  );
}

/** A drawing lying on the page — the brief before it becomes a building. */
export function Blueprint({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.42,
  palette,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  palette: Palette;
  seed?: number;
}) {
  const map = useMemo(
    () => screenTexture("blueprint", palette, { seed, w: 560, h: 420 }),
    [palette, seed],
  );
  const h = w * 0.72;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={map} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* the curled edge that tells you it is paper */}
      <mesh position={[0, 0.012, h / 2 - 0.012]} rotation={[-Math.PI / 2 + 0.8, 0, 0]}>
        <planeGeometry args={[w, h * 0.1]} />
        <meshStandardMaterial map={map} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Tools({
  position = [0, 0, 0],
  rotation = 0,
  color = "#7E868A",
  accent,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  color?: string;
  accent: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* wrench */}
      <group rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <boxGeometry args={[0.012, 0.11, 0.008]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.006, -0.058]} castShadow>
          <torusGeometry args={[0.014, 0.005, 6, 14, Math.PI * 1.4]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.7} />
        </mesh>
      </group>
      {/* driver */}
      <group position={[0.06, 0, 0.03]} rotation={[0, -0.7, 0]}>
        <mesh position={[0, 0.008, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, 0.05, 10]} />
          <meshStandardMaterial color={accent} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.008, 0.045]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.0035, 0.0035, 0.05, 8]} />
          <meshStandardMaterial color="#B7BDBE" roughness={0.3} metalness={0.75} />
        </mesh>
      </group>
      <mesh position={[-0.06, 0.004, 0.02]} rotation={[0, hashRange(seed, -0.4, 0.4), 0]} castShadow>
        <boxGeometry args={[0.05, 0.008, 0.026]} />
        <meshStandardMaterial color={accent} roughness={0.75} />
      </mesh>
    </group>
  );
}

/** Staff ID on a lanyard — the "who works here" detail. */
export function IDCard({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.07,
  color = "#F5F3EE",
  accent,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  color?: string;
  accent: string;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current || stage.phase !== "idle") return;
    g.current.rotation.z = Math.sin(stage.time * 1.3) * 0.06;
  });
  const h = w * 1.45;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group ref={g}>
        <mesh position={[0, -h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, 0.004]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        <mesh position={[0, -h * 0.22, 0.003]}>
          <planeGeometry args={[w * 0.62, w * 0.62]} />
          <meshStandardMaterial color={accent} roughness={0.8} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0, -h * 0.72, 0.003]}>
          <planeGeometry args={[w * 0.66, h * 0.05]} />
          <meshStandardMaterial color="#9A9A93" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <torusGeometry args={[0.02, 0.0025, 6, 16, Math.PI]} />
          <meshStandardMaterial color={accent} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export function CameraProp({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.1,
  body = "#3A3B38",
  accent,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  body?: string;
  accent: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, w * 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, w * 0.6, w * 0.42]} />
        <meshStandardMaterial color={body} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, w * 0.3, w * 0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[w * 0.2, w * 0.22, w * 0.26, 20]} />
        <meshStandardMaterial color="#26282A" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, w * 0.3, w * 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[w * 0.15, 20]} />
        <meshStandardMaterial color="#1B2528" roughness={0.15} metalness={0.6} />
      </mesh>
      <mesh position={[w * 0.3, w * 0.62, 0]}>
        <boxGeometry args={[w * 0.18, w * 0.06, w * 0.2]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
    </group>
  );
}

/** A till receipt — the proof that the experience converted. */
export function Receipt({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.07,
  h = 0.19,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  h?: number;
  seed?: number;
}) {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = 420;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#FBF9F3";
    ctx.fillRect(0, 0, 160, 420);
    ctx.fillStyle = "rgba(40,40,38,0.55)";
    for (let i = 0; i < 16; i++) {
      const w2 = 40 + hash(seed + i) * 90;
      ctx.fillRect(20, 40 + i * 22, w2, 4);
      if (i % 3 === 2) ctx.fillRect(120, 40 + i * 22, 22, 4);
    }
    ctx.fillRect(20, 392, 120, 5);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [seed]);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={map} roughness={0.96} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.012, -h * 0.44]} rotation={[-Math.PI / 2 + 0.9, 0, 0]}>
        <planeGeometry args={[w, h * 0.16]} />
        <meshStandardMaterial map={map} roughness={0.96} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Product({
  position = [0, 0, 0],
  rotation = 0,
  h = 0.13,
  color = "#E7E1D2",
  accent,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  h?: number;
  color?: string;
  accent: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[h * 0.26, h * 0.28, h, 22]} />
        <Surf kind="board" color={color} seed={seed} rough={0.86} />
      </mesh>
      <mesh position={[0, h * 0.52, 0]}>
        <cylinderGeometry args={[h * 0.265, h * 0.265, h * 0.3, 22]} />
        <meshStandardMaterial color={accent} roughness={0.82} />
      </mesh>
      <mesh position={[0, h + 0.006, 0]} castShadow>
        <cylinderGeometry args={[h * 0.2, h * 0.24, 0.014, 20]} />
        <meshStandardMaterial color="#6F6A60" roughness={0.5} metalness={0.25} />
      </mesh>
    </group>
  );
}
