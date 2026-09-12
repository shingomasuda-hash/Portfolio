import { useMemo } from "react";
import * as THREE from "three";
import { portfolioProjects } from "../data/portfolioProjects";
import { staging } from "../data/staging";
import { surfaceTexture, textTexture } from "../lib/textures";
import { useExperience } from "../state/experience";

export const SHELF_Z = -7.6;
export const PLANK_Y = 0.0;
const GAP = 0.035;

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
  return last - first + 0.6;
})();

/** The furniture the books stand in. Quiet, so the spines do the talking. */
export function Shelf() {
  const wood = useMemo(() => surfaceTexture("wood", "#8A7458", 21), []);
  const back = useMemo(() => surfaceTexture("concrete", "#D9D5CC", 23), []);
  const plate = useMemo(
    () =>
      textTexture("ANYWARE ARCHIVE", {
        width: 1200,
        height: 120,
        size: 46,
        weight: 600,
        tracking: 26,
        align: "center",
        color: "rgba(40,40,36,0.5)",
      }),
    [],
  );
  const w = shelfWidth;
  return (
    <group>
      {/* back panel */}
      <mesh position={[0, PLANK_Y + 0.78, SHELF_Z - 0.62]} receiveShadow>
        <boxGeometry args={[w + 0.5, 2.0, 0.06]} />
        <meshStandardMaterial map={back} roughness={0.98} color="#C9C6BC" />
      </mesh>
      {/* the plank the books stand on */}
      <mesh position={[0, PLANK_Y - 0.03, SHELF_Z - 0.2]} receiveShadow castShadow>
        <boxGeometry args={[w + 0.5, 0.06, 1.1]} />
        <meshStandardMaterial map={wood} roughness={0.8} />
      </mesh>
      {/* shelf above, to say this is a library and not a display */}
      <mesh position={[0, PLANK_Y + 1.6, SHELF_Z - 0.2]} receiveShadow castShadow>
        <boxGeometry args={[w + 0.5, 0.06, 1.1]} />
        <meshStandardMaterial map={wood} roughness={0.8} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * (w + 0.5)) / 2, PLANK_Y + 0.79, SHELF_Z - 0.2]} receiveShadow castShadow>
          <boxGeometry args={[0.06, 1.7, 1.1]} />
          <meshStandardMaterial map={wood} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, PLANK_Y - 0.032, SHELF_Z + 0.356]}>
        <planeGeometry args={[1.5, 0.05]} />
        <meshBasicMaterial map={plate} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {/* the table the book gets opened on */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[9, 0.1, 5]} />
        <meshStandardMaterial map={wood} roughness={0.86} />
      </mesh>
    </group>
  );
}

/** Invisible handles — hovering lifts a volume, clicking takes it out. */
export function ShelfPicker() {
  const { openBook, setHovered, mode } = useExperience();
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
