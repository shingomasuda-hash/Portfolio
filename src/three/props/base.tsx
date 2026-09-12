import { useMemo } from "react";
import * as THREE from "three";
import { roughnessTexture, surfaceTexture, type SurfaceKind } from "../../lib/textures";

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ */
/*  Materials                                                          */
/* ------------------------------------------------------------------ */

export function Surf({
  kind = "paper",
  color,
  seed = 1,
  rough = 0.82,
  metal = 0,
  repeat,
}: {
  kind?: SurfaceKind;
  color: string;
  seed?: number;
  rough?: number;
  metal?: number;
  repeat?: number;
}) {
  const map = useMemo(() => {
    const t = surfaceTexture(kind, color, seed).clone();
    t.needsUpdate = true;
    if (repeat) t.repeat.set(repeat, repeat);
    return t;
  }, [kind, color, seed, repeat]);
  const rmap = useMemo(() => roughnessTexture(kind, seed), [kind, seed]);
  return (
    <meshStandardMaterial map={map} roughnessMap={rmap} roughness={rough} metalness={metal} />
  );
}

export function Block({
  size,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  kind = "paper",
  seed = 1,
  rough = 0.82,
  metal = 0,
  anchor = "bottom",
}: {
  size: Vec3;
  position?: Vec3;
  rotation?: Vec3;
  color: string;
  kind?: SurfaceKind;
  seed?: number;
  rough?: number;
  metal?: number;
  /** bottom = sits on its own base (the natural way things stand on a page) */
  anchor?: "bottom" | "center";
}) {
  const y = anchor === "bottom" ? position[1] + size[1] / 2 : position[1];
  return (
    <mesh position={[position[0], y, position[2]]} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <Surf kind={kind} color={color} seed={seed} rough={rough} metal={metal} />
    </mesh>
  );
}

export function Cyl({
  r = 0.1,
  rTop,
  h = 0.2,
  seg = 24,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  kind = "clay",
  seed = 1,
  rough = 0.7,
  metal = 0,
  anchor = "bottom",
}: {
  r?: number;
  rTop?: number;
  h?: number;
  seg?: number;
  position?: Vec3;
  rotation?: Vec3;
  color: string;
  kind?: SurfaceKind;
  seed?: number;
  rough?: number;
  metal?: number;
  anchor?: "bottom" | "center";
}) {
  const y = anchor === "bottom" ? position[1] + h / 2 : position[1];
  return (
    <mesh position={[position[0], y, position[2]]} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, h, seg]} />
      <Surf kind={kind} color={color} seed={seed} rough={rough} metal={metal} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Flat printed / displayed things                                    */
/* ------------------------------------------------------------------ */

export function Panel({
  map,
  width,
  height,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  thickness = 0.012,
  backing = "#F2EFE8",
  emissive = 0,
  anchor = "bottom",
  double = false,
}: {
  map: THREE.Texture;
  width: number;
  height: number;
  position?: Vec3;
  rotation?: Vec3;
  thickness?: number;
  backing?: string;
  /** screens glow a little — paper does not */
  emissive?: number;
  anchor?: "bottom" | "center";
  double?: boolean;
}) {
  const y = anchor === "bottom" ? position[1] + height / 2 : position[1];
  return (
    <group position={[position[0], y, position[2]]} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial color={backing} roughness={0.85} metalness={0.03} />
      </mesh>
      <mesh position={[0, 0, thickness / 2 + 0.0012]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={map}
          roughness={emissive > 0 ? 0.28 : 0.92}
          metalness={0}
          emissiveMap={emissive > 0 ? map : null}
          emissive={emissive > 0 ? new THREE.Color(0xffffff) : new THREE.Color(0x000000)}
          emissiveIntensity={emissive}
          toneMapped
        />
      </mesh>
      {double && (
        <mesh position={[0, 0, -thickness / 2 - 0.0012]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={map} roughness={0.92} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Connective tissue                                                  */
/* ------------------------------------------------------------------ */

/** A drawn line on the page — routes, flows, relationships. */
export function Route({
  points,
  color,
  width = 0.02,
  y = 0.006,
}: {
  points: [number, number][];
  color: string;
  width?: number;
  y?: number;
}) {
  const segs = useMemo(() => {
    const out: { pos: Vec3; rot: number; len: number }[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, z1] = points[i];
      const [x2, z2] = points[i + 1];
      const dx = x2 - x1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      out.push({
        pos: [(x1 + x2) / 2, y, (z1 + z2) / 2],
        rot: Math.atan2(dz, dx),
        len,
      });
    }
    return out;
  }, [points, y]);

  return (
    <group>
      {segs.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[-Math.PI / 2, 0, -s.rot]}>
          <planeGeometry args={[s.len, width]} />
          <meshStandardMaterial color={color} roughness={0.97} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}
