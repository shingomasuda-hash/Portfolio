import { useMemo } from "react";
import * as THREE from "three";
import { textTexture } from "../../lib/textures";
import type { Palette } from "../../lib/screens";
import type { PortfolioProject } from "../../data/portfolioProjects";
import { Rise, type RiseMode } from "../Rise";
import { OutputCarrier, OutputCaption, useGalleryTextures } from "../props/gallery";

type Vec3 = [number, number, number];

export type DioramaProps = { scene: number };

export type Spot = {
  pos: Vec3;
  rot?: number;
  scale?: number;
  mode?: RiseMode;
};

/**
 * The OUTPUT page. Every piece of work is mounted on the object it really
 * lives on — never a row of flat cards — and each project arranges them
 * differently so the page composition belongs to that industry.
 */
export function OutputStage({
  project,
  palette,
  spots,
}: {
  project: PortfolioProject;
  palette: Palette;
  spots: Spot[];
}) {
  const textures = useGalleryTextures(project, palette);
  const items = project.outputs.slice(0, spots.length);

  return (
    <group>
      {items.map((o, i) => {
        const spot = spots[i];
        const tex = textures[i % Math.max(1, textures.length)];
        if (!tex) return null;
        return (
          <Rise
            key={o.label}
            index={i}
            count={items.length}
            position={spot.pos}
            rotation={[0, spot.rot ?? 0, 0]}
            scale={spot.scale ?? 1}
            mode={spot.mode ?? "unroll"}
            idle="none"
          >
            <OutputCarrier output={o} tex={tex} palette={palette} index={i} />
            <OutputCaption
              text={o.label}
              w={0.26}
              position={[0, 0.004, 0.22]}
              color={`rgba(30,30,28,0.5)`}
            />
          </Rise>
        );
      })}
    </group>
  );
}

/** A numbered pin — used to mark the steps of a journey on the page. */
export function Marker({
  position = [0, 0, 0],
  n,
  color,
  h = 0.1,
}: {
  position?: Vec3;
  n: number;
  color: string;
  h?: number;
}) {
  const map = useMemo(
    () =>
      textTexture(String(n).padStart(2, "0"), {
        width: 128,
        height: 128,
        size: 76,
        weight: 700,
        align: "center",
        color: "#F7F5F0",
        bg: color,
      }),
    [n, color],
  );
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, h, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, h + 0.016, 0]} castShadow>
        <circleGeometry args={[0.022, 20]} />
        <meshStandardMaterial map={map} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.016, 0.021, 20]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/** A word made physical — jargon walls, message blocks, scattered claims. */
export function WordBlock({
  position = [0, 0, 0],
  rotation = 0,
  text,
  w = 0.17,
  h = 0.055,
  bg = "#EFEDE6",
  fg = "rgba(32,36,36,0.8)",
  font = "sans",
}: {
  position?: Vec3;
  rotation?: number;
  text: string;
  w?: number;
  h?: number;
  bg?: string;
  fg?: string;
  font?: "sans" | "mincho";
}) {
  const map = useMemo(
    () =>
      textTexture(text, {
        width: 512,
        height: 168,
        size: 62,
        weight: 600,
        tracking: 4,
        align: "center",
        color: fg,
        bg,
        font,
      }),
    [text, fg, bg, font],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.012]} />
        <meshStandardMaterial color={bg} roughness={0.9} />
      </mesh>
      <mesh position={[0, h / 2, 0.0068]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={map} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** A soft plate that defines a district / zone on the page. */
export function Plate({
  position = [0, 0, 0],
  size = [0.7, 0.5],
  color,
  opacity = 0.5,
  rotation = 0,
}: {
  position?: Vec3;
  size?: [number, number];
  color: string;
  opacity?: number;
  rotation?: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.97} transparent opacity={opacity} />
    </mesh>
  );
}
