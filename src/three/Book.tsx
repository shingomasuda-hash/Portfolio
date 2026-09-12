import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { blankPageTexture, pageTexture } from "../lib/pages";
import { easeInOutCubic, easeOutCubic, lerp, range } from "../lib/math";
import { roughnessTexture, surfaceTexture, textTexture } from "../lib/textures";
import { SCENE_LABELS, stage } from "../state/experience";
import type { BookDesign } from "../data/staging";
import type { PortfolioProject } from "../data/portfolioProjects";

export const HW = 1.56; // half-width of the open spread
export const HD = 1.06; // half-depth of the open spread
const BOARD = 0.016;

/** Intrinsic thickness of the closed volume, before the shelf scale. */
/** Page block per side. Boards + block add back up to the volume's thickness. */
const stackHeight = (d: BookDesign) => Math.max(0.03, d.thickness - BOARD * 2);
const closedThickness = (d: BookDesign) => stackHeight(d) + BOARD * 2;

/** How the open stage has to shrink to become this book on the shelf. */
function shelfScale(d: BookDesign): [number, number, number] {
  return [d.depth / HW, d.thickness / closedThickness(d), d.height / (HD * 2)];
}

/**
 * A page in flight. It rotates about the spine and curls on the way — and it
 * is the only thing moving, because every object folded itself into the paper
 * before the turn was allowed to start.
 */
function TurningPage({ surface }: { surface: string }) {
  const pivot = useRef<THREE.Group>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(HW, HD * 2, 26, 2), []);
  const base = useMemo(
    () => Float32Array.from(geo.attributes.position.array),
    [geo],
  );
  const map = useMemo(() => blankPageTexture(surface), [surface]);

  useFrame(() => {
    const g = pivot.current;
    if (!g) return;
    const turning = stage.phase === "turn";
    g.visible = turning;
    if (!turning) return;

    const p = easeInOutCubic(stage.turn);
    const a = stage.turnDir > 0 ? Math.PI * p : Math.PI * (1 - p);
    g.rotation.z = a;

    const curl = Math.sin(p * Math.PI) * 0.3;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const u = (x + HW / 2) / HW;
      pos.setXYZ(
        i,
        x,
        y,
        base[i * 3 + 2] +
          Math.sin(u * Math.PI) * curl * (1 - Math.abs(y) / (HD * 1.6)),
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <group ref={pivot} position={[0, BOARD * 1.4, 0]}>
      <mesh
        geometry={geo}
        position={[HW / 2, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      >
        <meshStandardMaterial
          map={map}
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function BoardMaterial({
  design,
  which,
}: {
  design: BookDesign;
  which: "cover" | "spine";
}) {
  const kind = which === "cover" ? design.coverSurface : design.spineSurface;
  const color = which === "cover" ? design.cover : design.spine;
  const seed = which === "cover" ? 3 : 7;
  const map = useMemo(
    () => surfaceTexture(kind, color, seed),
    [kind, color, seed],
  );
  const rmap = useMemo(() => roughnessTexture(kind, seed), [kind, seed]);
  if (design.translucent) {
    return (
      <meshPhysicalMaterial
        map={map}
        roughnessMap={rmap}
        roughness={design.roughness}
        metalness={design.metalness}
        transmission={design.translucent}
        thickness={0.08}
        ior={1.4}
      />
    );
  }
  return (
    <meshStandardMaterial
      map={map}
      roughnessMap={rmap}
      roughness={design.roughness}
      metalness={design.metalness}
    />
  );
}

function Spine({
  design,
  project,
}: {
  design: BookDesign;
  project: PortfolioProject;
}) {
  const t = design.thickness;
  const map = useMemo(
    () =>
      textTexture(project.title, {
        width: 1400,
        height: 190,
        size: 78,
        fit: true,
        weight: 600,
        tracking: 12,
        align: "left",
        padding: 90,
        color: design.foil,
        sub: project.category,
        subColor: design.foil,
        subSize: 34,
      }),
    [project.title, project.category, design.foil],
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[t * 0.8, closedThickness(design), HD * 1.94]} />
        <BoardMaterial design={design} which="spine" />
      </mesh>
      <mesh position={[-t * 0.41, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[HD * 1.86, closedThickness(design) * 0.82]} />
        <meshBasicMaterial
          map={map}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * The book. Closed it lives on the shelf at its own size; chosen, it slides
 * out, travels to the table, lies down and opens — and from that moment it is
 * the stage everything else is built on.
 */
export function Book({
  project,
  design,
  shelfPos,
  active,
  children,
}: {
  project: PortfolioProject;
  design: BookDesign;
  shelfPos: [number, number, number];
  active: boolean;
  children?: ReactNode;
}) {
  const root = useRef<THREE.Group>(null);
  const front = useRef<THREE.Group>(null);
  const leftStack = useRef<THREE.Mesh>(null);
  const rightStack = useRef<THREE.Mesh>(null);
  const content = useRef<THREE.Group>(null);
  const spine = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const leftMat = useRef<THREE.MeshStandardMaterial>(null);
  const rightMat = useRef<THREE.MeshStandardMaterial>(null);
  const leftPage = useRef<THREE.Mesh>(null);
  const rightPage = useRef<THREE.Mesh>(null);

  const scl = useMemo(() => shelfScale(design), [design]);
  const edgeMap = useMemo(
    () => surfaceTexture("paper", design.edge, 11),
    [design.edge],
  );
  const firstPages = useMemo(
    () => ({
      l: pageTexture(project, 0, "left", SCENE_LABELS[0]),
      r: pageTexture(project, 0, "right", SCENE_LABELS[0]),
    }),
    [project],
  );

  useFrame(() => {
    const r = root.current;
    if (!r) return;
    r.rotation.order = "YXZ";

    /* once the chosen volume is open, the rest of the shelf stops rendering */
    r.visible = active || stage.open < 0.92;
    if (!r.visible) return;

    const o = active ? stage.open : 0;
    const pull = easeOutCubic(range(o, 0, 0.26));
    const travel = easeInOutCubic(range(o, 0.16, 0.68));
    const opened = easeInOutCubic(range(o, 0.56, 1));

    r.position.set(
      lerp(shelfPos[0], lerp(HW / 2, 0, opened), travel),
      lerp(shelfPos[1], 0, travel),
      lerp(shelfPos[2] + pull * 0.75, 0, travel),
    );
    r.rotation.set(
      lerp(-Math.PI / 2, 0, travel),
      lerp(Math.PI / 2, 0, travel),
      lerp(design.lean, 0, travel),
    );
    r.scale.set(
      lerp(scl[0], 1, travel),
      lerp(scl[1], 1, travel),
      lerp(scl[2], 1, travel),
    );

    /* Open, the page surface is the origin; closed, the volume has to sit
       centred on its slot or it leans into the book beside it. */
    if (body.current) body.current.position.y = (stackH / 2) * (1 - opened);

    /* the binding tucks under the spread — visible on the shelf, not on the page */
    if (spine.current) {
      const closed = stackH + BOARD * 2;
      const open = stackH + BOARD;
      spine.current.scale.y = lerp(1, open / closed, opened);
      spine.current.position.y = lerp(-stackH / 2, -open / 2 - 0.003, opened);
    }

    if (front.current) {
      front.current.rotation.z = Math.PI * opened;
      front.current.position.y = lerp(BOARD / 2, -stackH - BOARD / 2, opened);
    }

    /* a closed book must not show the spread it is hiding */
    const spread = opened > 0.03;
    if (leftPage.current) leftPage.current.visible = spread;
    if (rightPage.current) rightPage.current.visible = spread;

    const read = stage.scene / (SCENE_LABELS.length - 1);
    if (leftStack.current) {
      const k = lerp(0.1, 1, read);
      leftStack.current.visible = opened > 0.03;
      leftStack.current.scale.y = k;
      leftStack.current.position.y = (stackH * (1 - k)) / 2;
    }
    if (rightStack.current) {
      const k = lerp(1, 0.1, read);
      rightStack.current.visible = opened > 0.03;
      rightStack.current.scale.y = k;
      rightStack.current.position.y = (stackH * (1 - k)) / 2;
    }

    if (active && leftMat.current && rightMat.current) {
      leftMat.current.map = pageTexture(
        project,
        stage.scene,
        "left",
        SCENE_LABELS[stage.scene],
      );
      rightMat.current.map = pageTexture(
        project,
        stage.scene,
        "right",
        SCENE_LABELS[stage.scene],
      );
    }

    if (content.current) content.current.visible = opened > 0.5;
  });

  const stackH = stackHeight(design);

  return (
    <group ref={root}>
      <group ref={body}>
        <mesh
          position={[HW / 2, -stackH - BOARD / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[HW * 1.03, BOARD, HD * 2.06]} />
          <BoardMaterial design={design} which="cover" />
        </mesh>

        <group ref={spine}>
          <Spine design={design} project={project} />
        </group>

        <group position={[0, -stackH / 2, 0]}>
          <mesh
            ref={rightStack}
            position={[HW / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[HW, stackH, HD * 2]} />
            <meshStandardMaterial map={edgeMap} roughness={0.95} />
          </mesh>
          <mesh
            ref={leftStack}
            position={[-HW / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[HW, stackH, HD * 2]} />
            <meshStandardMaterial map={edgeMap} roughness={0.95} />
          </mesh>
        </group>

        <mesh
          ref={leftPage}
          position={[-HW / 2, 0.0006, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[HW, HD * 2]} />
          <meshStandardMaterial
            ref={leftMat}
            map={firstPages.l}
            roughness={0.96}
          />
        </mesh>
        <mesh
          ref={rightPage}
          position={[HW / 2, 0.0006, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[HW, HD * 2]} />
          <meshStandardMaterial
            ref={rightMat}
            map={firstPages.r}
            roughness={0.96}
          />
        </mesh>

        {active && <TurningPage surface={design.edge} />}

        <group ref={front}>
          <mesh position={[HW / 2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[HW * 1.03, BOARD, HD * 2.06]} />
            <BoardMaterial design={design} which="cover" />
          </mesh>
          {design.deboss && (
            <mesh
              position={[HW / 2, BOARD * 0.51, -HD * 0.62]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[HW * 0.46, 0.006]} />
              <meshStandardMaterial
                color={design.foil}
                roughness={0.45}
                metalness={0.3}
              />
            </mesh>
          )}
          {design.stitched && (
            <mesh
              position={[BOARD * 2.4, BOARD * 0.51, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.01, HD * 1.7]} />
              <meshStandardMaterial
                color={design.foil}
                roughness={0.8}
                transparent
                opacity={0.5}
              />
            </mesh>
          )}
        </group>
      </group>
      <group ref={content}>{children}</group>
    </group>
  );
}

export { closedThickness, shelfScale, stackHeight };
