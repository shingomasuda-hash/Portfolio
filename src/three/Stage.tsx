import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows, Preload } from "@react-three/drei";
import * as THREE from "three";
import { portfolioProjects } from "../data/portfolioProjects";
import { staging } from "../data/staging";
import { stage, useExperience } from "../state/experience";
import { paletteOf, SceneContext } from "./palette";
import { DIORAMAS } from "./dioramas";
import { Book } from "./Book";
import { Lighting } from "./Lighting";
import { Rig } from "./Rig";
import { Shelf, ShelfPicker, shelfSlots } from "./Shelf";

const SHELF_BG = "#E3E0D7";

/** The world colour follows whichever book is open. */
function Backdrop({ color }: { color: string }) {
  const scene = useThree((s) => s.scene);
  const want = useMemo(() => new THREE.Color(color), [color]);
  const cur = useRef(new THREE.Color(color));
  useFrame((_, dt) => {
    cur.current.lerp(want, Math.min(1, dt * 1.6));
    if (!(scene.background instanceof THREE.Color)) scene.background = cur.current.clone();
    else (scene.background as THREE.Color).copy(cur.current);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(cur.current);
  });
  return <fog attach="fog" args={[color, 6.5, 19]} />;
}

/** The furniture only exists while you are choosing. */
function ShelfWorld({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (g.current) g.current.visible = stage.open < 0.92;
  });
  return <group ref={g}>{children}</group>;
}

function World() {
  const index = useExperience((s) => s.index);
  const mode = useExperience((s) => s.mode);
  const scene = useExperience((s) => s.scene);

  const project = portfolioProjects[index];
  const palette = useMemo(() => paletteOf(project), [project]);
  const Diorama = DIORAMAS[project.id];
  const reading = mode === "reading";

  return (
    <>
      <Rig />
      <Lighting key={project.id + (reading ? "-r" : "-s")} project={project} />
      <Backdrop color={reading ? project.theme.background : SHELF_BG} />

      <ShelfWorld>
        <Shelf />
        <ShelfPicker />
      </ShelfWorld>

      {portfolioProjects.map((p, i) => (
        <Book
          key={p.id}
          project={p}
          design={staging[p.id].book}
          shelfPos={shelfSlots[i]}
          active={reading && i === index}
        >
          {reading && i === index && Diorama ? (
            <SceneContext.Provider value={{ palette, project, scene }}>
              <Diorama scene={scene} />
            </SceneContext.Provider>
          ) : null}
        </Book>
      ))}

      {reading && (
        <ContactShadows
          position={[0, 0.006, 0]}
          scale={5.2}
          resolution={512}
          blur={2.4}
          far={1.3}
          opacity={0.4}
          color="#3A342B"
          frames={Infinity}
        />
      )}
      <Preload all />
    </>
  );
}

export function Stage() {
  return (
    <Canvas
      className="stage"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.1, -3.2], fov: 36, near: 0.05, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.94;
      }}
    >
      <World />
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
