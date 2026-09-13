import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { loadGallery, placeholderTexture, type Palette } from "../../lib/screens";
import { outputTypeLabel } from "../../data/glossary";
import { textTexture } from "../../lib/textures";
import { stage } from "../../state/experience";
import type { PortfolioProject } from "../../data/portfolioProjects";
import { Cyl, Surf } from "./base";

type Vec3 = [number, number, number];
type Output = PortfolioProject["outputs"][number];

/**
 * Real work images live in /public/works/**. Until a file is dropped in, an
 * editorial placeholder stands in — the layout never changes, so swapping in
 * the final photography is a pure file copy.
 */
export function useGalleryTextures(project: PortfolioProject, palette: Palette) {
  const fallbacks = useMemo(
    () =>
      project.gallery.map((_, i) =>
        placeholderTexture(
          i,
          project.outputs[i]?.label ?? project.category,
          project.title,
          palette,
          1,
          outputTypeLabel[project.outputs[i]?.type ?? ""] ?? "",
        ),
      ),
    [project, palette],
  );
  const [textures, setTextures] = useState<THREE.Texture[]>(fallbacks);

  useEffect(() => {
    let alive = true;
    setTextures(fallbacks);
    Promise.all(project.gallery.map((u) => loadGallery(u))).then((res) => {
      if (!alive) return;
      setTextures(res.map((t, i) => t ?? fallbacks[i]));
    });
    return () => {
      alive = false;
    };
  }, [project, fallbacks]);

  return textures;
}

/** object-fit: cover, so client photography never stretches. */
function useCover(tex: THREE.Texture, aspect: number) {
  return useMemo(() => {
    const t = tex.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    const img = tex.image as { width?: number; height?: number } | undefined;
    const src = img?.width && img?.height ? img.width / img.height : 1;
    if (src > aspect) {
      const r = aspect / src;
      t.repeat.set(r, 1);
      t.offset.set((1 - r) / 2, 0);
    } else {
      const r = src / aspect;
      t.repeat.set(1, r);
      t.offset.set(0, (1 - r) / 2);
    }
    return t;
  }, [tex, aspect]);
}

function Caption({
  text,
  w,
  position,
  rotation = [-Math.PI / 2, 0, 0],
  color = "rgba(30,30,28,0.55)",
}: {
  text: string;
  w: number;
  position: Vec3;
  rotation?: Vec3;
  color?: string;
}) {
  const map = useMemo(
    () =>
      textTexture(text, {
        width: 768,
        height: 128,
        size: 60,
        weight: 600,
        tracking: 16,
        align: "left",
        color,
      }),
    [text, color],
  );
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[w, w * 0.167]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Carriers — each output type gets the object it really lives on     */
/* ------------------------------------------------------------------ */

function DesktopCarrier({ tex, palette, w = 0.5 }: { tex: THREE.Texture; palette: Palette; w?: number }) {
  const h = w * 0.6;
  const map = useCover(tex, w / h);
  return (
    <group>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.4, 0.014, w * 0.22]} />
        <meshStandardMaterial color="#D6D6D0" roughness={0.35} metalness={0.55} />
      </mesh>
      <mesh position={[0, w * 0.1, 0]} castShadow>
        <boxGeometry args={[w * 0.06, w * 0.2, w * 0.05]} />
        <meshStandardMaterial color="#D6D6D0" roughness={0.35} metalness={0.55} />
      </mesh>
      <group position={[0, w * 0.2 + h / 2, 0]} rotation={[-0.05, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, 0.014]} />
          <meshStandardMaterial color="#E3E3DE" roughness={0.34} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.0085]}>
          <planeGeometry args={[w * 0.94, h * 0.9]} />
          <meshStandardMaterial
            map={map}
            emissiveMap={map}
            emissive={new THREE.Color(0xffffff)}
            emissiveIntensity={0.3}
            roughness={0.25}
          />
        </mesh>
      </group>
      <mesh position={[0, 0.004, w * 0.34]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w * 0.42, w * 0.16]} />
        <meshStandardMaterial color={palette.surface} roughness={0.7} />
      </mesh>
    </group>
  );
}

function NotebookCarrier({ tex, w = 0.46 }: { tex: THREE.Texture; w?: number }) {
  const d = w * 0.68;
  const map = useCover(tex, w / (d * 0.62));
  return (
    <group>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.016, d]} />
        <meshStandardMaterial color="#D9D9D4" roughness={0.32} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.017, d * 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.8, d * 0.46]} />
        <meshStandardMaterial color="#A2A39E" roughness={0.75} />
      </mesh>
      <group position={[0, 0.016, -d / 2]} rotation={[-1.66, 0, 0]}>
        <mesh position={[0, d * 0.33, 0]} castShadow>
          <boxGeometry args={[w, d * 0.66, 0.008]} />
          <meshStandardMaterial color="#D9D9D4" roughness={0.32} metalness={0.55} />
        </mesh>
        <mesh position={[0, d * 0.33, 0.005]}>
          <planeGeometry args={[w * 0.92, d * 0.58]} />
          <meshStandardMaterial
            map={map}
            emissiveMap={map}
            emissive={new THREE.Color(0xffffff)}
            emissiveIntensity={0.26}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}

/** A long-scroll LP: a tall screen that keeps travelling down the page. */
function TallScreenCarrier({ tex, h = 0.62 }: { tex: THREE.Texture; h?: number }) {
  const w = h * 0.42;
  const map = useMemo(() => {
    const t = tex.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [tex]);
  const img = tex.image as { width?: number; height?: number } | undefined;
  const srcAspect = img?.width && img?.height ? img.width / img.height : 0.72;
  const view = Math.min(1, (w / h) / srcAspect);
  useFrame(() => {
    map.repeat.set(1, view);
    const span = 1 - view;
    if (span <= 0.001 || stage.phase !== "idle") {
      map.offset.set(0, span);
      return;
    }
    const t = (Math.sin(stage.time * 0.32) * 0.5 + 0.5) * span;
    map.offset.set(0, span - t);
  });
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.06, h * 1.03, 0.012]} />
        <meshStandardMaterial color="#2E3130" roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[0, h / 2, 0.0075]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={map}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.3}
          roughness={0.24}
        />
      </mesh>
      <mesh position={[0, 0.006, -0.02]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[w * 0.5, h * 0.12, 0.006]} />
        <meshStandardMaterial color="#2E3130" roughness={0.5} />
      </mesh>
    </group>
  );
}

function PhoneCarrier({ tex, h = 0.34, play = false }: { tex: THREE.Texture; h?: number; play?: boolean }) {
  const w = h * 0.49;
  const map = useCover(tex, w / h);
  const tri = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!tri.current) return;
    const s = stage.phase === "idle" ? 1 + Math.sin(stage.time * 2) * 0.05 : 0.001;
    tri.current.scale.setScalar(s);
  });
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, h * 0.04]} />
        <meshStandardMaterial color="#2B2D2C" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, h / 2, h * 0.021]}>
        <planeGeometry args={[w * 0.9, h * 0.91]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={map}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.3}
          roughness={0.22}
        />
      </mesh>
      {play && (
        <mesh ref={tri} position={[0, h / 2, h * 0.03]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[h * 0.06, h * 0.1, 3]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} transparent opacity={0.92} />
        </mesh>
      )}
      <mesh position={[0, 0.004, -h * 0.05]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[w * 0.36, h * 0.2, 0.004]} />
        <meshStandardMaterial color="#2B2D2C" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Store work: the photograph becomes a panel on the wall of the shop. */
function StorePanelCarrier({ tex, palette, w = 0.44 }: { tex: THREE.Texture; palette: Palette; w?: number }) {
  const h = w * 0.72;
  const map = useCover(tex, w / h);
  return (
    <group>
      <mesh position={[0, h / 2 + 0.03, -0.01]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.14, h * 1.16, 0.02]} />
        <Surf kind="concrete" color={palette.surface} seed={3} rough={0.95} />
      </mesh>
      <mesh position={[0, h / 2 + 0.03, 0.002]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={map} roughness={0.8} />
      </mesh>
      {/* the ledge below, where the real shop begins */}
      <mesh position={[0, 0.015, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.14, 0.03, 0.12]} />
        <Surf kind="wood" color="#9C7449" seed={5} rough={0.7} />
      </mesh>
      <Cyl r={0.016} h={0.05} position={[w * 0.36, 0.03, 0.07]} color="#7E8A58" kind="clay" seed={7} />
    </group>
  );
}

/** Menu / package / sign — the way food work actually appears in a shop. */
function FoodCarrier({
  tex,
  palette,
  variant,
  w = 0.3,
}: {
  tex: THREE.Texture;
  palette: Palette;
  variant: number;
  w?: number;
}) {
  const h = w * 1.36;
  const map = useCover(tex, w / h);
  if (variant % 3 === 0) {
    /* standing menu board */
    return (
      <group>
        <mesh position={[0, h / 2 + 0.02, 0]} rotation={[-0.08, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[w * 1.1, h * 1.08, 0.016]} />
          <Surf kind="wood" color="#8A6B44" seed={2} rough={0.8} />
        </mesh>
        <mesh position={[0, h / 2 + 0.02, 0.011]} rotation={[-0.08, 0, 0]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={map} roughness={0.9} />
        </mesh>
        <mesh position={[0, h * 0.16, -0.07]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[w * 0.16, h * 0.7, 0.012]} />
          <meshStandardMaterial color="#8A6B44" roughness={0.85} />
        </mesh>
      </group>
    );
  }
  if (variant % 3 === 1) {
    /* package */
    return (
      <group>
        <mesh position={[0, h * 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[w * 0.8, h * 0.76, w * 0.42]} />
          <Surf kind="board" color={palette.surface} seed={4} rough={0.92} />
        </mesh>
        <mesh position={[0, h * 0.38, w * 0.211]}>
          <planeGeometry args={[w * 0.72, h * 0.68]} />
          <meshStandardMaterial map={map} roughness={0.9} />
        </mesh>
        <mesh position={[0, h * 0.77, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w * 0.8, w * 0.42]} />
          <meshStandardMaterial color={palette.accent} roughness={0.9} />
        </mesh>
      </group>
    );
  }
  /* hanging shop sign */
  return (
    <group>
      <Cyl r={0.008} h={h * 0.9} position={[-w * 0.62, 0, 0]} color="#6E5B48" kind="wood" seed={6} />
      <mesh position={[-w * 0.16, h * 0.88, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, w * 0.95, 8]} />
        <meshStandardMaterial color="#6E5B48" roughness={0.85} />
      </mesh>
      <group position={[w * 0.16, h * 0.46, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w * 0.88, h * 0.72, 0.014]} />
          <Surf kind="wood" color="#6E5B48" seed={8} rough={0.85} />
        </mesh>
        <mesh position={[0, 0, 0.0085]}>
          <planeGeometry args={[w * 0.8, h * 0.64]} />
          <meshStandardMaterial map={map} roughness={0.88} />
        </mesh>
      </group>
    </group>
  );
}

/** Graphic work: poster on the wall, book on the table, card in hand. */
function PrintCarrier({
  tex,
  palette,
  variant,
  w = 0.32,
}: {
  tex: THREE.Texture;
  palette: Palette;
  variant: number;
  w?: number;
}) {
  const h = w * 1.414;
  const map = useCover(tex, variant % 3 === 2 ? 1.72 : w / h);
  if (variant % 3 === 0) {
    return (
      <group rotation={[-0.06, 0, 0]}>
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w * 1.04, h * 1.03, 0.005]} />
          <meshStandardMaterial color={palette.surface} roughness={0.95} />
        </mesh>
        <mesh position={[0, h / 2, 0.0035]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={map} roughness={0.95} />
        </mesh>
      </group>
    );
  }
  if (variant % 3 === 1) {
    return (
      <group>
        <mesh position={[0, 0.016, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, 0.03, w * 0.76]} />
          <meshStandardMaterial color="#F3F0E8" roughness={0.96} />
        </mesh>
        <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w * 0.96, w * 0.72]} />
          <meshStandardMaterial map={map} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.006, 0]} castShadow>
          <boxGeometry args={[w * 1.03, 0.012, w * 0.79]} />
          <Surf kind="linen" color={palette.accent} seed={9} rough={0.92} />
        </mesh>
      </group>
    );
  }
  return (
    <group>
      {[0, 1].map((i) => (
        <mesh
          key={i}
          position={[i * w * 0.3, 0.004 + i * 0.005, i * 0.02]}
          rotation={[0, i * 0.22 - 0.1, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w * 0.62, 0.005, w * 0.36]} />
          <meshStandardMaterial color={palette.surface} roughness={0.93} />
        </mesh>
      ))}
      <mesh position={[w * 0.3, 0.0122, 0.02]} rotation={[-Math.PI / 2, 0.22 - 0.1, 0]}>
        <planeGeometry args={[w * 0.6, w * 0.35]} />
        <meshStandardMaterial map={map} roughness={0.93} />
      </mesh>
    </group>
  );
}

/** Paid media: the creative up on a board, where money meets the work. */
function AdBoardCarrier({ tex, palette, w = 0.42 }: { tex: THREE.Texture; palette: Palette; w?: number }) {
  const h = w * 0.62;
  const map = useCover(tex, w / h);
  const post = 0.16;
  return (
    <group>
      {[-1, 1].map((s) => (
        <Cyl key={s} r={0.011} h={post} position={[(s * w) / 3, 0, 0]} color="#8B8F8A" kind="metal" seed={2} rough={0.45} metal={0.5} />
      ))}
      <group position={[0, post + h / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w * 1.06, h * 1.1, 0.016]} />
          <Surf kind="metal" color={palette.surface} seed={3} rough={0.5} metal={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.009]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={map} roughness={0.7} />
        </mesh>
        <mesh position={[w * 0.38, -h * 0.36, 0.011]}>
          <planeGeometry args={[w * 0.2, h * 0.14]} />
          <meshStandardMaterial color={palette.accent} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */

export function OutputCarrier({
  output,
  tex,
  palette,
  index,
}: {
  output: Output;
  tex: THREE.Texture;
  palette: Palette;
  index: number;
}) {
  const isLP = /LP|LANDING/i.test(output.label);
  switch (output.type) {
    case "web":
      if (isLP) return <TallScreenCarrier tex={tex} />;
      return index % 2 === 0 ? (
        <DesktopCarrier tex={tex} palette={palette} />
      ) : (
        <NotebookCarrier tex={tex} />
      );
    case "ai":
      return <NotebookCarrier tex={tex} />;
    case "sns":
      return <PhoneCarrier tex={tex} />;
    case "video":
      return <PhoneCarrier tex={tex} play />;
    case "store":
      return <StorePanelCarrier tex={tex} palette={palette} />;
    case "food":
      return <FoodCarrier tex={tex} palette={palette} variant={index} />;
    case "graphic":
    case "branding":
      return <PrintCarrier tex={tex} palette={palette} variant={index} />;
    case "advertising":
      return <AdBoardCarrier tex={tex} palette={palette} />;
    default:
      return <PrintCarrier tex={tex} palette={palette} variant={index} />;
  }
}

export { Caption as OutputCaption };
