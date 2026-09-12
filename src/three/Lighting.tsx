import { Environment, Lightformer } from "@react-three/drei";
import type { PortfolioProject } from "../data/portfolioProjects";

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
export function Lighting({ project }: { project: PortfolioProject }) {
  const m = MOODS[project.theme.lighting];
  return (
    <>
      <hemisphereLight args={[m.sky, m.ground, 0.72]} />
      <directionalLight
        position={[3.2, 5.4, 3.6]}
        intensity={m.i}
        color={m.key}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0009}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-4.2, 2.6, 1.8]} intensity={0.5} color={m.fill} />
      <directionalLight position={[0, 2.4, -5.2]} intensity={0.7} color={m.rim} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.5} color={m.sky} scale={[8, 5, 1]} position={[0, 5, 2]} rotation={[-Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={0.6} color={m.key} scale={[5, 4, 1]} position={[4, 2, 2]} rotation={[0, -Math.PI / 3, 0]} />
        <Lightformer form="rect" intensity={0.45} color={m.fill} scale={[5, 4, 1]} position={[-4, 1.5, 1]} rotation={[0, Math.PI / 3, 0]} />
        <Lightformer form="rect" intensity={0.3} color={m.ground} scale={[10, 6, 1]} position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]} />
      </Environment>
    </>
  );
}
