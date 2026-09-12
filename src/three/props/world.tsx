import { useMemo } from "react";
import { hash, hashRange } from "../../lib/math";
import { textTexture } from "../../lib/textures";
import { Block, Cyl, Surf } from "./base";

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ */
/*  People — small, but unmistakably human                             */
/* ------------------------------------------------------------------ */

export function Person({
  position = [0, 0, 0],
  rotation = 0,
  h = 0.34,
  wear,
  skin = "#C79A77",
  hair = "#2C2522",
  gear,
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  h?: number;
  wear: string;
  skin?: string;
  hair?: string;
  /** helmet = plant floor, cap = staff, apron = kitchen */
  gear?: "helmet" | "cap" | "apron" | "none";
  seed?: number;
}) {
  const legH = h * 0.44;
  const bodyH = h * 0.36;
  const headR = h * 0.105;
  const w = h * 0.19;
  const stance = hashRange(seed, -0.018, 0.018);
  const shoulder = legH + bodyH;
  const headY = shoulder + headR * 0.9;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* legs */}
      <mesh position={[-w * 0.26, legH / 2, 0]} castShadow>
        <capsuleGeometry args={[w * 0.16, legH * 0.74, 3, 8]} />
        <meshStandardMaterial color="#3B3A38" roughness={0.92} />
      </mesh>
      <mesh position={[w * 0.26, legH / 2, stance]} castShadow>
        <capsuleGeometry args={[w * 0.16, legH * 0.74, 3, 8]} />
        <meshStandardMaterial color="#3B3A38" roughness={0.92} />
      </mesh>
      {/* torso */}
      <mesh position={[0, legH + bodyH * 0.46, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w * 0.5, w * 0.4, bodyH * 0.94, 16]} />
        <meshStandardMaterial color={wear} roughness={0.94} />
      </mesh>
      {/* shoulders, so the arms do not step off a cylinder */}
      <mesh position={[0, shoulder - bodyH * 0.06, 0]} castShadow>
        <sphereGeometry args={[w * 0.5, 16, 10]} />
        <meshStandardMaterial color={wear} roughness={0.94} />
      </mesh>
      {gear === "apron" && (
        <mesh position={[0, legH + bodyH * 0.36, w * 0.3]} castShadow>
          <boxGeometry args={[w * 0.76, bodyH * 0.86, 0.004]} />
          <meshStandardMaterial color="#E8E1D2" roughness={0.96} />
        </mesh>
      )}
      {/* arms, hanging close to the body */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * w * 0.5, shoulder - bodyH * 0.46, 0]}
          rotation={[0, 0, -s * 0.13]}
          castShadow
        >
          <capsuleGeometry args={[w * 0.14, bodyH * 0.72, 3, 8]} />
          <meshStandardMaterial color={wear} roughness={0.92} />
        </mesh>
      ))}
      {/* neck */}
      <mesh position={[0, shoulder + headR * 0.16, 0]}>
        <cylinderGeometry args={[headR * 0.38, headR * 0.44, headR * 0.5, 10]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>
      {/* head */}
      <mesh position={[0, headY, 0]} castShadow>
        <sphereGeometry args={[headR, 18, 14]} />
        <meshStandardMaterial color={skin} roughness={0.78} />
      </mesh>
      {gear !== "helmet" && (
        <mesh position={[0, headY + headR * 0.16, -headR * 0.06]} castShadow>
          <sphereGeometry args={[headR * 0.99, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
      )}
      {gear === "helmet" && (
        <group position={[0, headY + headR * 0.2, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[headR * 1.02, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#D9C452" roughness={0.42} metalness={0.06} />
          </mesh>
          <mesh position={[0, -headR * 0.02, headR * 0.55]} rotation={[-0.18, 0, 0]} castShadow>
            <boxGeometry args={[headR * 1.5, 0.005, headR * 0.72]} />
            <meshStandardMaterial color="#D9C452" roughness={0.42} />
          </mesh>
          <mesh position={[0, headR * 0.3, 0]}>
            <boxGeometry args={[headR * 0.14, headR * 0.36, headR * 1.55]} />
            <meshStandardMaterial color="#C6B043" roughness={0.5} />
          </mesh>
          <mesh position={[0, -headR * 0.03, 0]}>
            <cylinderGeometry args={[headR * 1.06, headR * 1.06, headR * 0.1, 18]} />
            <meshStandardMaterial color="#BFA93F" roughness={0.55} />
          </mesh>
        </group>
      )}
      {gear === "cap" && (
        <group position={[0, headY + headR * 0.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[headR * 0.98, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#33403A" roughness={0.92} />
          </mesh>
          <mesh position={[0, -headR * 0.04, headR * 0.7]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[headR * 1.2, 0.004, headR * 0.7]} />
            <meshStandardMaterial color="#33403A" roughness={0.92} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Landscape                                                          */
/* ------------------------------------------------------------------ */

export function Tree({
  position = [0, 0, 0],
  h = 0.3,
  leaf = "#5E7350",
  trunk = "#6C5540",
  seed = 1,
}: {
  position?: Vec3;
  h?: number;
  leaf?: string;
  trunk?: string;
  seed?: number;
}) {
  const tiers = 3;
  return (
    <group position={position}>
      <Cyl r={h * 0.05} rTop={h * 0.04} h={h * 0.42} color={trunk} kind="wood" seed={seed} rough={0.95} />
      {Array.from({ length: tiers }).map((_, i) => {
        const t = i / Math.max(1, tiers - 1);
        const r = h * (0.25 - t * 0.07);
        return (
          <mesh
            key={i}
            position={[hashRange(seed + i * 5, -0.012, 0.012) * h, h * (0.44 + i * 0.13), 0]}
            rotation={[0, hash(seed + i) * 3, 0]}
            castShadow
          >
            <icosahedronGeometry args={[r, 1]} />
            <meshStandardMaterial
              color={leaf}
              roughness={0.95}
              flatShading
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** Layered contour plate — the land itself, cut like a paper model. */
export function Terrain({
  size = [3.0, 2.0],
  layers = 3,
  color,
  edge,
  seed = 1,
}: {
  size?: [number, number];
  layers?: number;
  color: string;
  edge: string;
  seed?: number;
}) {
  return (
    <group>
      {Array.from({ length: layers }).map((_, i) => {
        const k = 1 - i * 0.1;
        const h = 0.024;
        return (
          <group key={i} position={[hashRange(seed + i, -0.05, 0.05), i * h, hashRange(seed + i * 3, -0.04, 0.04)]}>
            <mesh position={[0, h / 2, 0]} receiveShadow castShadow>
              <boxGeometry args={[size[0] * k, h, size[1] * k]} />
              <Surf kind="soil" color={i === 0 ? color : edge} seed={seed + i} rough={0.98} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function House({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.3,
  d = 0.26,
  h = 0.3,
  wall = "#E4DFD2",
  roof = "#7A6455",
  roofKind = "gable",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  d?: number;
  h?: number;
  wall?: string;
  roof?: string;
  roofKind?: "gable" | "hip" | "flat";
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, h, d]} color={wall} kind="concrete" seed={seed} rough={0.92} />
      {roofKind === "gable" && (
        <>
          <mesh position={[0, h + w * 0.17, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[w * 0.52, w * 0.52, d * 1.06, 3, 1]} />
            <Surf kind="clay" color={roof} seed={seed + 2} rough={0.9} />
          </mesh>
        </>
      )}
      {roofKind === "hip" && (
        <mesh position={[0, h + w * 0.13, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[w * 0.76, w * 0.3, 4]} />
          <Surf kind="clay" color={roof} seed={seed + 2} rough={0.9} />
        </mesh>
      )}
      {roofKind === "flat" && (
        <Block size={[w * 1.04, 0.018, d * 1.04]} position={[0, h, 0]} color={roof} kind="concrete" seed={seed + 2} />
      )}
      {/* windows read as small recessed darks */}
      <mesh position={[0, h * 0.55, d / 2 + 0.002]}>
        <planeGeometry args={[w * 0.3, h * 0.28]} />
        <meshStandardMaterial color="#3A4247" roughness={0.35} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function Shop({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.44,
  d = 0.3,
  h = 0.32,
  wall = "#EDE6D8",
  awning,
  sign,
  signColor = "#59684F",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  d?: number;
  h?: number;
  wall?: string;
  awning?: string;
  sign?: string;
  signColor?: string;
  seed?: number;
}) {
  const signMap = useMemo(
    () =>
      sign
        ? textTexture(sign, {
            width: 512,
            height: 128,
            size: 62,
            fit: true,
            weight: 600,
            tracking: 8,
            align: "center",
            color: "#F6F2E9",
            bg: signColor,
          })
        : null,
    [sign, signColor],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, h, d]} color={wall} kind="concrete" seed={seed} rough={0.9} />
      {/* shopfront glazing */}
      <mesh position={[0, h * 0.42, d / 2 + 0.003]}>
        <planeGeometry args={[w * 0.78, h * 0.5]} />
        <meshStandardMaterial color="#2F3A3C" roughness={0.2} metalness={0.25} />
      </mesh>
      {awning && (
        <mesh position={[0, h * 0.74, d / 2 + w * 0.09]} rotation={[-0.42, 0, 0]} castShadow>
          <boxGeometry args={[w * 0.92, 0.012, w * 0.26]} />
          <Surf kind="linen" color={awning} seed={seed + 3} rough={0.95} />
        </mesh>
      )}
      {signMap && (
        <mesh position={[0, h + 0.045, d / 2 - 0.01]} castShadow>
          <boxGeometry args={[w * 0.7, 0.075, 0.016]} />
          <meshStandardMaterial map={signMap} roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

/** Saw-tooth roofed workshop — reads as "factory" at a glance. */
export function Factory({
  position = [0, 0, 0],
  rotation = 0,
  w = 1.1,
  d = 0.6,
  h = 0.32,
  wall = "#D9D8D2",
  roof = "#7D868B",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  d?: number;
  h?: number;
  wall?: string;
  roof?: string;
  seed?: number;
}) {
  const teeth = 4;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, h, d]} color={wall} kind="concrete" seed={seed} rough={0.9} />
      {Array.from({ length: teeth }).map((_, i) => {
        const tw = w / teeth;
        const x = -w / 2 + tw / 2 + i * tw;
        return (
          <group key={i} position={[x, h, 0]}>
            <mesh position={[0, tw * 0.17, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <cylinderGeometry args={[tw * 0.5, tw * 0.5, d, 3, 1]} />
              <Surf kind="metal" color={roof} seed={seed + i} rough={0.5} metal={0.4} />
            </mesh>
            {/* north light glazing on the steep face */}
            <mesh position={[tw * 0.19, tw * 0.2, 0]} rotation={[0, 0, -0.1]}>
              <planeGeometry args={[tw * 0.34, d * 0.98]} />
              <meshStandardMaterial color="#5C6A70" roughness={0.25} metalness={0.2} side={2} />
            </mesh>
          </group>
        );
      })}
      <Cyl
        r={w * 0.035}
        h={h * 0.9}
        position={[w * 0.4, h, -d * 0.3]}
        color="#B9B6AE"
        kind="concrete"
        seed={seed + 9}
      />
      <mesh position={[0, h * 0.4, d / 2 + 0.003]}>
        <planeGeometry args={[w * 0.22, h * 0.62]} />
        <meshStandardMaterial color="#4A5257" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Signboard({
  position = [0, 0, 0],
  rotation = 0,
  text,
  w = 0.34,
  h = 0.12,
  postH = 0.22,
  bg = "#59684F",
  fg = "#F6F2E9",
}: {
  position?: Vec3;
  rotation?: number;
  text: string;
  w?: number;
  h?: number;
  postH?: number;
  bg?: string;
  fg?: string;
}) {
  const map = useMemo(
    () =>
      textTexture(text, {
        width: 640,
        height: 220,
        size: 74,
        fit: true,
        weight: 600,
        tracking: 10,
        align: "center",
        color: fg,
        bg,
      }),
    [text, bg, fg],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Cyl r={0.012} h={postH} color="#6A6257" kind="wood" rough={0.9} />
      <mesh position={[0, postH + h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, 0.018]} />
        <meshStandardMaterial map={map} roughness={0.78} />
      </mesh>
    </group>
  );
}

export function Stall({
  position = [0, 0, 0],
  rotation = 0,
  w = 0.34,
  d = 0.24,
  canopy = "#BE795A",
  seed = 1,
}: {
  position?: Vec3;
  rotation?: number;
  w?: number;
  d?: number;
  canopy?: string;
  seed?: number;
}) {
  const h = 0.16;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[w, h * 0.55, d]} color="#C9B08A" kind="wood" seed={seed} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Cyl
            key={`${sx}${sz}`}
            r={0.007}
            h={h * 1.5}
            position={[(sx * w) / 2 - sx * 0.02, 0, (sz * d) / 2 - sz * 0.02]}
            color="#7A6A55"
            kind="wood"
          />
        )),
      )}
      <mesh position={[0, h * 1.52, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[w * 1.12, 0.012, d * 1.12]} />
        <Surf kind="linen" color={canopy} seed={seed + 4} rough={0.95} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          position={[-w * 0.3 + i * (w * 0.2), h * 0.62, 0]}
          castShadow
        >
          <sphereGeometry args={[0.022, 10, 8]} />
          <meshStandardMaterial color={i % 2 ? "#C4714A" : "#7E8A58"} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}
