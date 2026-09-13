import { useMemo, useRef } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { PortfolioProject } from "../data/portfolioProjects";
import { SHELF_Z } from "./Shelf";

const MOODS = {
  warm: { key: "#FFE7C6", fill: "#E9DCC8", rim: "#FFD6A3", sky: "#EFE5D4", ground: "#B9A88F", i: 2.15 },
  neutral: { key: "#FFF8EE", fill: "#E4E4DE", rim: "#D8DBD6", sky: "#ECEBE5", ground: "#B0AFA7", i: 2.0 },
  cool: { key: "#F0F6F6", fill: "#DCE4E3", rim: "#CFDCDC", sky: "#E8EDEB", ground: "#A9B3B0", i: 1.95 },
};

/**
 * No studio HDRI, no neon. A key light with a real shadow, a soft fill, a rim
 * to separate objects from the paper, and a small procedural environment so
 * ceramics and metal have something to reflect.
 */
export function Lighting({ project, focus }: { project: PortfolioProject; focus: "shelf" | "book" }) {
  const m = focus === "shelf" ? MOODS.warm : MOODS[project.theme.lighting];
  const onShelf = focus === "shelf";
  const target = useRef<THREE.Object3D>(null);
  const targetPos = useMemo<[number, number, number]>(
    () => (onShelf ? [0, 0.5, SHELF_Z] : [0, 0, 0]),
    [onShelf],
  );

  return (
    <>
      <object3D ref={target} position={targetPos} />
      <hemisphereLight args={[m.sky, m.ground, onShelf ? 0.95 : 0.72]} />
      <directionalLight
        position={onShelf ? [-3.4, 5.2, SHELF_Z + 5.4] : [3.2, 5.4, 3.6]}
        target={target.current ?? undefined}
        intensity={onShelf ? 2.3 : m.i}
        color={m.key}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-near={0.5}
        shadow-camera-far={onShelf ? 22 : 18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0009}
        shadow-normalBias={0.02}
      />
      <directionalLight
        position={onShelf ? [4.6, 2.2, SHELF_Z + 4.2] : [-4.2, 2.6, 1.8]}
        intensity={onShelf ? 0.72 : 0.5}
        color={m.fill}
      />
      <directionalLight
        position={onShelf ? [0, 3.4, SHELF_Z - 3] : [0, 2.4, -5.2]}
        intensity={onShelf ? 0.42 : 0.7}
        color={m.rim}
      />
      {/* a shelf light, so the spines are read and the case has depth */}
      {onShelf && (
        <spotLight
          position={[0, 2.2, SHELF_Z + 0.75]}
          angle={1.0}
          penumbra={1}
          distance={3.6}
          decay={1.4}
          intensity={1.5}
          color="#FFEBD0"
        />
      )}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.5} color={m.sky} scale={[8, 5, 1]} position={[0, 5, 2]} rotation={[-Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={0.6} color={m.key} scale={[5, 4, 1]} position={[4, 2, 2]} rotation={[0, -Math.PI / 3, 0]} />
        <Lightformer form="rect" intensity={0.45} color={m.fill} scale={[5, 4, 1]} position={[-4, 1.5, 1]} rotation={[0, Math.PI / 3, 0]} />
        <Lightformer form="rect" intensity={0.3} color={m.ground} scale={[10, 6, 1]} position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]} />
      </Environment>
    </>
  );
}
