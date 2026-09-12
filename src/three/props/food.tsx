import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { hash, hashRange } from "../../lib/math";
import { screenTexture, type Palette } from "../../lib/screens";
import { textTexture } from "../../lib/textures";
import { stage } from "../../state/experience";
import { Block, Cyl, Surf } from "./base";

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ */
/*  The room                                                           */
/* ------------------------------------------------------------------ */

export function Counter({
  position = [0, 0, 0],
  rotation = 0,
  w = 1.5,
  d = 0.34,
  h = 0.2,
  top = "#9C6C44",
  base = "#7E6A55",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  d?: number;
  h?: number;
  top?: string;
  base?: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, h * 0.86, d * 0.86]} color={base} kind="wood" seed={seed} rough={0.9} />
      <mesh position={[0, h * 0.86 + 0.016, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.04, 0.032, d]} />
        <Surf kind="wood" color={top} seed={seed + 1} rough={0.55} />
      </mesh>
      {/* toe kick shadow line */}
      <mesh position={[0, 0.012, d * 0.43]}>
        <boxGeometry args={[w * 0.98, 0.024, 0.012]} />
        <meshStandardMaterial color="#5A4B3C" roughness={0.95} />
      </mesh>
    </group>
  );
}

export function Table({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.7,
  d = 0.46,
  h = 0.18,
  top = "#A9793F",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  d?: number;
  h?: number;
  top?: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Cyl
            key={`${sx}${sz}`}
            r={0.012}
            h={h}
            position={[(sx * w) / 2 - sx * 0.05, 0, (sz * d) / 2 - sz * 0.05]}
            color="#6E5B48"
            kind="wood"
            seed={seed}
            rough={0.9}
          />
        )),
      )}
      <mesh position={[0, h + 0.014, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.028, d]} />
        <Surf kind="wood" color={top} seed={seed + 1} rough={0.5} />
      </mesh>
    </group>
  );
}

export function Chair({
  position = [0, 0, 0],
  rotation = 0,
  h = 0.16,
  color = "#7A6450",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  h?: number;
  color?: string;
  seed?: number;
}) {
  const s = 0.12;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Cyl
            key={`${sx}${sz}`}
            r={0.008}
            h={h}
            position={[(sx * s) / 2 - sx * 0.015, 0, (sz * s) / 2 - sz * 0.015]}
            color={color}
            kind="wood"
            seed={seed}
          />
        )),
      )}
      <mesh position={[0, h + 0.008, 0]} castShadow>
        <boxGeometry args={[s, 0.016, s]} />
        <Surf kind="wood" color={color} seed={seed + 1} rough={0.7} />
      </mesh>
      <mesh position={[0, h + s * 0.5, -s / 2 + 0.008]} castShadow>
        <boxGeometry args={[s, s * 0.86, 0.012]} />
        <Surf kind="wood" color={color} seed={seed + 2} rough={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  What is actually on the table                                      */
/* ------------------------------------------------------------------ */

/** The hero bowl: ceramic, broth, toppings, chopsticks. */
export function Bowl({
  position = [0, 0, 0],
  r = 0.11,
  glaze = "#F3EEE4",
  inner = "#6B4A2E",
  broth = "#B4763C",
  accent = "#59684F",
  chopsticks = true,
  seed = 1,
}: {
  position?: Vec3;
  r?: number;
  glaze?: string;
  inner?: string;
  broth?: string;
  accent?: string;
  chopsticks?: boolean;
  seed?: number;
}) {
  const h = r * 0.62;
  return (
    <group position={position}>
      {/* foot ring */}
      <Cyl r={r * 0.42} h={h * 0.12} color={glaze} kind="clay" seed={seed} rough={0.45} />
      {/* body */}
      <mesh position={[0, h * 0.12 + h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 0.46, h, 28, 1, true]} />
        <meshStandardMaterial color={glaze} roughness={0.34} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>
      {/* rim */}
      <mesh position={[0, h * 0.12 + h, 0]} castShadow>
        <torusGeometry args={[r, r * 0.026, 8, 30]} />
        <meshStandardMaterial color={glaze} roughness={0.3} />
      </mesh>
      {/* broth surface */}
      <mesh position={[0, h * 0.12 + h * 0.82, 0]} receiveShadow>
        <circleGeometry args={[r * 0.9, 28]} />
        <meshStandardMaterial color={broth} roughness={0.24} metalness={0.04} />
      </mesh>
      <mesh position={[0, h * 0.12 + h * 0.2, 0]}>
        <cylinderGeometry args={[r * 0.9, r * 0.44, h * 0.62, 24]} />
        <meshStandardMaterial color={inner} roughness={0.5} />
      </mesh>
      {/* plated to one side, the way a dish is actually composed */}
      {[
        [-0.42, -0.18, 0.2, "#D8C9A8"],
        [-0.2, -0.42, 0.19, "#C9B489"],
        [0.02, -0.3, 0.17, "#8E5F3C"],
        [0.34, 0.1, 0.14, "#7D8C5A"],
        [-0.08, 0.4, 0.12, "#C4713F"],
      ].map(([ox, oz, rr, col], i) => (
        <mesh
          key={i}
          position={[(ox as number) * r, h * 0.12 + h * (0.84 + i * 0.012), (oz as number) * r]}
          rotation={[hashRange(seed + i, -0.22, 0.22), i * 1.1, hashRange(seed + i * 3, -0.16, 0.16)]}
          castShadow
        >
          <cylinderGeometry args={[r * (rr as number), r * (rr as number), 0.01, 14]} />
          <meshStandardMaterial color={col as string} roughness={0.72} />
        </mesh>
      ))}
      {/* a green garnish at the rim, not in the middle */}
      <mesh
        position={[r * 0.46, h * 0.12 + h * 0.87, r * 0.4]}
        rotation={[0.1, 0.6, 0.08]}
        castShadow
      >
        <boxGeometry args={[r * 0.34, 0.008, r * 0.2]} />
        <meshStandardMaterial color={accent} roughness={0.85} />
      </mesh>
      {chopsticks && (
        <group position={[r * 0.75, h * 0.6, 0]} rotation={[0, -0.35, 0.32]}>
          {[-0.012, 0.012].map((o) => (
            <mesh key={o} position={[0, 0, o]} castShadow>
              <cylinderGeometry args={[0.0045, 0.003, r * 2.1, 6]} />
              <meshStandardMaterial color="#6E5741" roughness={0.85} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

export function Plate({
  position = [0, 0, 0],
  r = 0.085,
  color = "#F2EDE3",
  food = "#B9784A",
  seed = 1,
}: {
  position?: Vec3;
  r?: number;
  color?: string;
  food?: string;
  seed?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 0.88, 0.016, 30]} />
        <meshStandardMaterial color={color} roughness={0.28} />
      </mesh>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            hashRange(seed + i, -r * 0.34, r * 0.34),
            0.022,
            hashRange(seed + i * 3, -r * 0.3, r * 0.3),
          ]}
          rotation={[0, hash(seed + i) * 3, 0]}
          castShadow
        >
          <boxGeometry args={[r * 0.5, 0.016, r * 0.34]} />
          <meshStandardMaterial color={i === 1 ? "#7D8C5A" : food} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function Glass({
  position = [0, 0, 0],
  r = 0.028,
  h = 0.072,
  liquid = "#A9743E",
}: {
  position?: Vec3;
  r?: number;
  h?: number;
  liquid?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r * 0.86, h, 20, 1, true]} />
        <meshPhysicalMaterial
          color="#EDF1F0"
          roughness={0.08}
          metalness={0}
          transmission={0.86}
          thickness={0.02}
          ior={1.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, h * 0.34, 0]}>
        <cylinderGeometry args={[r * 0.92, r * 0.82, h * 0.6, 18]} />
        <meshStandardMaterial color={liquid} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[r * 0.88, r * 0.88, 0.008, 18]} />
        <meshPhysicalMaterial color="#EDF1F0" roughness={0.1} transmission={0.8} thickness={0.01} />
      </mesh>
    </group>
  );
}

export function TakeoutCup({
  position = [0, 0, 0],
  h = 0.1,
  body = "#EFE7D8",
  band = "#59684F",
  seed = 1,
}: {
  position?: Vec3;
  h?: number;
  body?: string;
  band?: string;
  seed?: number;
}) {
  const r = h * 0.3;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 0.78, h, 22]} />
        <Surf kind="board" color={body} seed={seed} rough={0.9} />
      </mesh>
      <mesh position={[0, h * 0.46, 0]}>
        <cylinderGeometry args={[r * 1.012, r * 0.93, h * 0.3, 22]} />
        <Surf kind="board" color={band} seed={seed + 1} rough={0.92} />
      </mesh>
      <mesh position={[0, h + 0.006, 0]} castShadow>
        <cylinderGeometry args={[r * 1.06, r * 1.02, 0.014, 22]} />
        <meshStandardMaterial color="#D9D4C8" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function TakeoutBox({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.15,
  color = "#E3D9C4",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  color?: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, w * 0.42, w * 0.72]} color={color} kind="board" seed={seed} rough={0.95} />
      <Block
        size={[w * 1.02, 0.008, w * 0.74]}
        position={[0, w * 0.42, 0]}
        color={color}
        kind="board"
        seed={seed + 1}
      />
      <mesh position={[0, w * 0.436, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.3, w * 0.3]} />
        <meshStandardMaterial color="#59684F" roughness={0.9} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/** A standing menu card — opens when the page is settled. */
export function MenuCard({
  position = [0, 0, 0],
  rotation = 0,
  h = 0.2,
  palette,
  title = "お品書き",
  open = true,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  h?: number;
  palette: Palette;
  title?: string;
  open?: boolean;
  seed?: number;
}) {
  const map = useMemo(
    () => screenTexture("menu", palette, { seed, title, w: 380, h: 520 }),
    [palette, seed, title],
  );
  const w = h * 0.72;
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);

  useFrame(() => {
    const settled = stage.phase === "idle" ? 1 : 0;
    const a = open ? 0.36 + settled * 0.14 : 0.02;
    if (left.current) left.current.rotation.y = THREE.MathUtils.lerp(left.current.rotation.y, a, 0.06);
    if (right.current)
      right.current.rotation.y = THREE.MathUtils.lerp(right.current.rotation.y, -a, 0.06);
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group ref={left} position={[0, 0, 0]}>
        <mesh position={[-w / 2, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, 0.006]} />
          <meshStandardMaterial map={map} roughness={0.9} />
        </mesh>
      </group>
      <group ref={right} position={[0, 0, 0]}>
        <mesh position={[w / 2, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, 0.006]} />
          <meshStandardMaterial color={palette.surface} roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}

/** Shop card / coaster stack — brand touchpoints you can hold. */
export function CardStack({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.11,
  count = 4,
  color = "#F4EFE4",
  accent = "#59684F",
  label = "ANYWARE",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  count?: number;
  color?: string;
  accent?: string;
  label?: string;
  seed?: number;
}) {
  const map = useMemo(
    () =>
      textTexture(label, {
        width: 512,
        height: 300,
        size: 58,
        weight: 700,
        tracking: 8,
        align: "center",
        color: accent,
        bg: color,
      }),
    [label, accent, color],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[hashRange(seed + i, -0.004, 0.004), 0.004 + i * 0.005, hashRange(seed + i * 3, -0.004, 0.004)]}
          rotation={[0, hashRange(seed + i * 7, -0.08, 0.08), 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w, 0.005, w * 0.6]} />
          <meshStandardMaterial color={color} roughness={0.92} />
        </mesh>
      ))}
      <mesh position={[0, 0.004 + count * 0.005 + 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.98, w * 0.58]} />
        <meshStandardMaterial map={map} roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Plant({
  position = [0, 0, 0],
  h = 0.24,
  pot = "#B08560",
  leaf = "#5D7150",
  seed = 1,
}: {
  position?: Vec3;
  h?: number;
  pot?: string;
  leaf?: string;
  seed?: number;
}) {
  const potH = h * 0.3;
  return (
    <group position={position}>
      <Cyl r={h * 0.14} rTop={h * 0.16} h={potH} color={pot} kind="clay" seed={seed} rough={0.8} />
      <mesh position={[0, potH - 0.004, 0]}>
        <cylinderGeometry args={[h * 0.145, h * 0.145, 0.008, 18]} />
        <meshStandardMaterial color="#4A4038" roughness={0.98} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + hash(seed + i);
        const lean = 0.3 + hash(seed + i * 3) * 0.45;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * h * 0.08, potH + h * 0.24, Math.sin(a) * h * 0.08]}
            rotation={[Math.sin(a) * lean, -a, Math.cos(a) * lean]}
            castShadow
          >
            <sphereGeometry args={[h * 0.1, 8, 6]} />
            <meshStandardMaterial color={leaf} roughness={0.94} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

/** Pendant lamp — the switch that turns the room into evening service. */
export function Rail({
  position = [0, 0, 0],
  w = 1.4,
  color = "#5E5348",
}: {
  position?: Vec3;
  w?: number;
  color?: string;
}) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, w, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.35} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * w) / 2, -0.03, 0]} castShadow>
          <boxGeometry args={[0.02, 0.06, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.6} metalness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function Pendant({
  position = [0, 0, 0],
  drop = 0.34,
  shade = "#E5DCCB",
  on = true,
}: {
  position?: Vec3;
  drop?: number;
  shade?: string;
  on?: boolean;
}) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!light.current) return;
    const want = on && stage.phase === "idle" ? 0.55 : 0;
    light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, want, 0.05);
  });
  return (
    <group position={position}>
      <mesh position={[0, -drop / 2, 0]}>
        <cylinderGeometry args={[0.002, 0.002, drop, 5]} />
        <meshStandardMaterial color="#4E4A43" roughness={0.8} />
      </mesh>
      <mesh position={[0, -drop - 0.02, 0]} castShadow>
        <coneGeometry args={[0.055, 0.05, 20, 1, true]} />
        <meshStandardMaterial color={shade} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -drop - 0.042, 0]}>
        <sphereGeometry args={[0.014, 10, 8]} />
        <meshStandardMaterial
          color="#FFF3DC"
          emissive={new THREE.Color("#FFE6B8")}
          emissiveIntensity={on ? 1.1 : 0}
          roughness={0.4}
        />
      </mesh>
      <pointLight ref={light} position={[0, -drop - 0.06, 0]} distance={1.1} decay={2} color="#FFD9A0" intensity={0} />
    </group>
  );
}

/** Soft rising steam — thin, warm, never a glowing effect. */
export function Steam({
  position = [0, 0, 0],
  count = 5,
  scale = 1,
  color = "#FFFFFF",
}: {
  position?: Vec3;
  count?: number;
  scale?: number;
  color?: string;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const live = stage.phase === "idle" || stage.phase === "raise";
    g.current.children.forEach((c, i) => {
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshBasicMaterial;
      const t = (stage.time * 0.32 + i / count) % 1;
      m.position.y = t * 0.24 * scale;
      m.position.x = Math.sin(t * 5 + i) * 0.022 * scale;
      const s = (0.4 + t * 1.5) * scale;
      m.scale.set(s, s, s);
      mat.opacity = live ? Math.sin(t * Math.PI) * 0.16 : 0;
    });
  });
  return (
    <group ref={g} position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, hash(i) * 3]}>
          <circleGeometry args={[0.05, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Noren curtain at the entrance — instantly reads as a shop front. */
export function Noren({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.44,
  h = 0.14,
  color = "#59684F",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  h?: number;
  color?: string;
  seed?: number;
}) {
  const panels = 3;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, h, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, w * 1.05, 8]} />
        <meshStandardMaterial color="#6E5B48" roughness={0.9} />
      </mesh>
      {Array.from({ length: panels }).map((_, i) => {
        const pw = w / panels - 0.006;
        return (
          <mesh
            key={i}
            position={[-w / 2 + pw / 2 + i * (w / panels) + 0.003, h - h / 2, 0]}
            rotation={[0, 0, hashRange(seed + i, -0.02, 0.02)]}
            castShadow
          >
            <boxGeometry args={[pw, h, 0.004]} />
            <Surf kind="linen" color={color} seed={seed + i} rough={0.96} />
          </mesh>
        );
      })}
    </group>
  );
}
