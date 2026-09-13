import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { portfolioProjects } from "../data/portfolioProjects";
import { staging } from "../data/staging";
import { hash, hashRange } from "../lib/math";
import { roughnessTexture, surfaceTexture, textTexture } from "../lib/textures";
import { stage, useExperience } from "../state/experience";
import { Cyl, Surf } from "./props/base";
import { Plant } from "./props/food";

export const SHELF_Z = -7.6;
export const PLANK_Y = 0.0;
const GAP = 0.035;
const END = 0.46; // free plank either side of the row

/** Where each volume stands. Books differ in thickness, so the row is uneven. */
export const shelfSlots = (() => {
  const widths = portfolioProjects.map((p) => staging[p.id].book.thickness);
  const total = widths.reduce((a, b) => a + b, 0) + GAP * (widths.length - 1);
  let x = -total / 2;
  return portfolioProjects.map((p, i) => {
    const w = widths[i];
    const slot: [number, number, number] = [
      x + w / 2,
      PLANK_Y + staging[p.id].book.height / 2,
      SHELF_Z,
    ];
    x += w + GAP;
    return slot;
  });
})();

export const shelfWidth = (() => {
  const first = shelfSlots[0][0];
  const last = shelfSlots[shelfSlots.length - 1][0];
  return last - first + END * 2;
})();

/* ------------------------------------------------------------------ */
/*  Dressing — a shelf nobody uses does not look like a library        */
/* ------------------------------------------------------------------ */

function FlatBooks({
  position,
  rotation = 0,
  count = 3,
  seed = 1,
}: {
  position: [number, number, number];
  rotation?: number;
  count?: number;
  seed?: number;
}) {
  const tones = ["#8E7A5E", "#5E6A57", "#B8B2A4", "#4A4742", "#A8734E"];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const w = 0.78 - i * 0.05;
        const d = 0.52 - i * 0.03;
        const h = 0.05 + hash(seed + i) * 0.035;
        let y = 0;
        for (let k = 0; k < i; k++) y += 0.05 + hash(seed + k) * 0.035 + 0.004;
        return (
          <group key={i} position={[hashRange(seed + i, -0.03, 0.03), y, hashRange(seed + i * 3, -0.02, 0.02)]} rotation={[0, hashRange(seed + i * 7, -0.09, 0.09), 0]}>
            <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, h, d]} />
              <Surf kind={i % 2 ? "linen" : "board"} color={tones[(seed + i) % tones.length]} seed={seed + i} rough={0.9} />
            </mesh>
            <mesh position={[0, h / 2, 0]} castShadow>
              <boxGeometry args={[w * 0.97, h * 0.7, d * 1.012]} />
              <meshStandardMaterial color="#E8E2D4" roughness={0.95} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Vessel({
  position,
  h = 0.22,
  color = "#C4B49A",
  seed = 1,
}: {
  position: [number, number, number];
  h?: number;
  color?: string;
  seed?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, h * 0.42, 0]} castShadow receiveShadow>
        <sphereGeometry args={[h * 0.42, 20, 16]} />
        <Surf kind="clay" color={color} seed={seed} rough={0.62} />
      </mesh>
      <mesh position={[0, h * 0.86, 0]} castShadow>
        <cylinderGeometry args={[h * 0.14, h * 0.2, h * 0.24, 18, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** A folder leaning where a volume is missing. */
function Folder({
  position,
  rotation = 0,
  h = 0.9,
  color = "#A99476",
  seed = 1,
}: {
  position: [number, number, number];
  rotation?: number;
  h?: number;
  color?: string;
  seed?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0.2]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, h, 0.62]} />
        <Surf kind="board" color={color} seed={seed} rough={0.94} />
      </mesh>
      <mesh position={[0, h * 0.5, 0]} castShadow>
        <boxGeometry args={[0.056, h * 0.94, 0.58]} />
        <meshStandardMaterial color="#EDE7D8" roughness={0.96} />
      </mesh>
    </group>
  );
}

function Papers({ position, seed = 1 }: { position: [number, number, number]; seed?: number }) {
  return (
    <group position={position}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[hashRange(seed + i, -0.02, 0.02), 0.002 + i * 0.004, hashRange(seed + i * 3, -0.02, 0.02)]}
          rotation={[0, hashRange(seed + i * 5, -0.12, 0.12), 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.56, 0.004, 0.4]} />
          <meshStandardMaterial color="#F1EDE2" roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */

/** The furniture the books stand in. Quiet, so the spines do the talking. */
export function Shelf() {
  const wood = useMemo(() => {
    const t = surfaceTexture("wood", "#8C7455", 21).clone();
    t.repeat.set(3, 1);
    t.needsUpdate = true;
    return t;
  }, []);
  const woodR = useMemo(() => roughnessTexture("wood", 21), []);
  /* the plaster has to stay fine-grained — one tile over a whole wall blurs */
  const wall = useMemo(() => {
    const t = surfaceTexture("paper", "#D5D1C6", 23).clone();
    t.repeat.set(7, 5);
    t.needsUpdate = true;
    return t;
  }, []);
  const back = useMemo(() => {
    const t = surfaceTexture("concrete", "#BDB8AB", 27).clone();
    t.repeat.set(4, 2);
    t.needsUpdate = true;
    return t;
  }, []);
  const plate = useMemo(
    () =>
      textTexture("ANYWARE  ARCHIVE  —  VOL. 01–10", {
        width: 1400,
        height: 110,
        size: 44,
        weight: 600,
        tracking: 20,
        align: "center",
        color: "rgba(40,38,32,0.42)",
      }),
    [],
  );
  const w = shelfWidth;
  const top = PLANK_Y + 1.54;
  const FLOOR = -1.05;

  return (
    <group>
      {/* the room */}
      <mesh position={[0, PLANK_Y + 1.6, SHELF_Z - 0.95]} receiveShadow>
        <planeGeometry args={[w + 12, 9]} />
        <meshStandardMaterial map={wall} color="#CFCABE" roughness={0.99} />
      </mesh>
      <mesh position={[0, FLOOR, SHELF_Z + 1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w + 12, 7]} />
        <meshStandardMaterial map={wall} color="#B6B0A2" roughness={0.98} />
      </mesh>

      {/* back panel, a shade deeper so the case reads as a box */}
      <mesh position={[0, PLANK_Y + 0.74, SHELF_Z - 0.62]} receiveShadow>
        <boxGeometry args={[w + 0.34, 1.86, 0.05]} />
        <meshStandardMaterial map={back} roughness={0.99} />
      </mesh>

      {/* base plank */}
      <mesh position={[0, PLANK_Y - 0.035, SHELF_Z - 0.2]} receiveShadow castShadow>
        <boxGeometry args={[w + 0.34, 0.07, 1.14]} />
        <meshStandardMaterial map={wood} roughnessMap={woodR} roughness={0.78} />
      </mesh>

      {/* upper plank */}
      <mesh position={[0, top, SHELF_Z - 0.2]} receiveShadow castShadow>
        <boxGeometry args={[w + 0.34, 0.07, 1.14]} />
        <meshStandardMaterial map={wood} roughnessMap={woodR} roughness={0.78} />
      </mesh>

      {/* uprights, carried down to the floor so the case is furniture */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[(s * (w + 0.34)) / 2, (top + FLOOR) / 2, SHELF_Z - 0.2]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[0.07, top - FLOOR, 1.14]} />
          <meshStandardMaterial map={wood} roughnessMap={woodR} roughness={0.78} />
        </mesh>
      ))}
      {/* the closed cabinet under the open shelf */}
      <mesh position={[0, PLANK_Y - 0.56, SHELF_Z - 0.26]} receiveShadow castShadow>
        <boxGeometry args={[w + 0.2, 0.98, 1.0]} />
        <meshStandardMaterial map={wood} roughnessMap={woodR} roughness={0.84} color="#B49B76" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={`d${s}`}
          position={[(s * (w + 0.14)) / 4, PLANK_Y - 0.56, SHELF_Z + 0.248]}
          castShadow
        >
          <boxGeometry args={[(w + 0.14) / 2 - 0.012, 0.88, 0.018]} />
          <meshStandardMaterial map={wood} roughnessMap={woodR} color="#AC9370" roughness={0.82} />
        </mesh>
      ))}
      <mesh position={[0, PLANK_Y - 0.56, SHELF_Z + 0.244]}>
        <planeGeometry args={[w + 0.16, 0.92]} />
        <meshStandardMaterial color="#7A6449" roughness={0.92} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`h${s}`} position={[s * 0.14, PLANK_Y - 0.56, SHELF_Z + 0.262]}>
          <boxGeometry args={[0.1, 0.016, 0.016]} />
          <meshStandardMaterial color="#6E6153" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {/* toe kick */}
      <mesh position={[0, FLOOR + 0.05, SHELF_Z - 0.3]} receiveShadow>
        <boxGeometry args={[w + 0.1, 0.1, 0.9]} />
        <meshStandardMaterial color="#5E4E3B" roughness={0.94} />
      </mesh>

      {/* engraved plate on the front edge of the plank */}
      <mesh position={[0, PLANK_Y - 0.037, SHELF_Z + 0.372]}>
        <planeGeometry args={[2.6, 0.062]} />
        <meshBasicMaterial map={plate} transparent depthWrite={false} toneMapped={false} />
      </mesh>

      {/* --- dressing, upper shelf --- */}
      <group position={[0, top + 0.035, SHELF_Z - 0.2]}>
        <FlatBooks position={[-w / 2 + 0.75, 0, 0.08]} rotation={0.1} count={3} seed={3} />
        <Vessel position={[-w / 2 + 1.6, 0, -0.02]} h={0.26} color="#B9A489" seed={5} />
        <Plant position={[w / 2 - 0.8, 0, 0.02]} h={0.5} leaf="#5E7350" pot="#A8845E" seed={7} />
        <FlatBooks position={[w / 2 - 1.7, 0, -0.04]} rotation={-0.24} count={2} seed={11} />
        <Vessel position={[w / 2 - 2.3, 0, 0.1]} h={0.19} color="#8E9483" seed={13} />
        <Papers position={[-0.2, 0, 0.12]} seed={17} />
        <Cyl r={0.02} h={0.2} position={[0.5, 0, 0.1]} color="#6E6355" kind="metal" seed={19} rough={0.5} metal={0.4} />
      </group>

      {/* --- dressing, either end of the row --- */}
      <group position={[0, PLANK_Y, SHELF_Z - 0.18]}>
        <Folder position={[-w / 2 + 0.15, 0, 0.02]} rotation={0.04} h={0.92} seed={23} />
        <FlatBooks position={[w / 2 - 0.34, 0, 0.06]} rotation={-0.12} count={2} seed={29} />
        <Vessel position={[w / 2 - 0.32, 0.14, -0.1]} h={0.2} color="#C0B49B" seed={31} />
      </group>

      {/* the table the book gets opened on */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial map={wood} roughnessMap={woodR} roughness={0.86} />
      </mesh>
    </group>
  );
}

/** Invisible handles — hovering lifts a volume, clicking takes it out. */
export function ShelfPicker() {
  const openBook = useExperience((s) => s.openBook);
  const setHovered = useExperience((s) => s.setHovered);
  const mode = useExperience((s) => s.mode);
  if (mode !== "shelf") return null;
  return (
    <group>
      {portfolioProjects.map((p, i) => {
        const d = staging[p.id].book;
        const slot = shelfSlots[i];
        return (
          <mesh
            key={p.id}
            position={[slot[0], slot[1], SHELF_Z - d.depth / 2]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(i);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHovered(null);
              document.body.style.cursor = "";
            }}
            onClick={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "";
              openBook(i);
            }}
          >
            <boxGeometry args={[d.thickness + GAP * 0.8, d.height, d.depth]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.FrontSide} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Very slight parallax, so the library feels like a room you are standing in. */
export function Parallax() {
  const target = useRef({ x: 0, y: 0 });
  useFrame(() => {
    const t = target.current;
    stage.parallaxX += (t.x - stage.parallaxX) * 0.045;
    stage.parallaxY += (t.y - stage.parallaxY) * 0.045;
  });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return null;
}
