import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stage } from "../state/experience";
import {
  easeInOutCubic,
  easeOutBackSoft,
  easeOutCubic,
  lerp,
  range,
  stagger,
} from "../lib/math";

const HALF_PI = Math.PI / 2;

export type RiseMode = "fold" | "extrude" | "unroll" | "flat";

type RiseProps = {
  /** order in the build-up; also the reverse order on the way down */
  index?: number;
  count?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /**
   * fold    — stands up out of the page like a pop-up panel (default)
   * extrude — grows upward out of the paper (terrain, buildings, bars)
   * unroll  — swings up from the side (screens, posters, sheets)
   * flat    — lies on the page and simply grows (roads, rugs, plans)
   */
  mode?: RiseMode;
  /** local idle motion once standing: float / turn / none */
  idle?: "float" | "turn" | "tilt" | "none";
  idleAmp?: number;
  children: ReactNode;
};

/**
 * Wraps every object on the page and runs the page-turn choreography:
 *
 *   shrink → fold flat → sink into the paper → gone
 *   … the page turns and comes to a complete stop …
 *   → rise out of the paper → unfold → lock into place
 *
 * Objects leave in reverse order and arrive in forward order, so the page
 * always looks like it is packing itself away and then rebuilding.
 */
export function Rise({
  index = 0,
  count = 8,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  mode = "fold",
  idle = "none",
  idleAmp = 1,
  children,
}: RiseProps) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const seed = useRef(index * 1.7 + 0.3);

  useFrame(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;

    const collapsing = stage.phase === "collapse";
    let sxz: number;
    let sy: number;
    let fold: number; // 0 standing, 1 flat in the page
    let sink: number;
    let presence: number;

    if (collapsing) {
      /* later arrivals are the first to be packed away */
      const t = stagger(stage.collapse, count - 1 - index, count, 0.46);
      const shrink = easeInOutCubic(range(t, 0.0, 0.4));
      const f = easeInOutCubic(range(t, 0.28, 0.74));
      const s = easeInOutCubic(range(t, 0.6, 1.0));
      const base = lerp(1, 0.58, shrink);
      sxz = base * lerp(1, 0.16, s);
      sy = base * lerp(1, 0.04, f) * lerp(1, 0.25, s);
      fold = f;
      sink = s;
      presence = 1 - s;
    } else {
      const t = stagger(stage.build, index, count, 0.55);
      const emerge = easeOutCubic(range(t, 0.0, 0.34));
      const unfold = easeInOutCubic(range(t, 0.22, 0.78));
      const lock = range(t, 0.6, 1.0);
      const over = 1 + (easeOutBackSoft(lock) - lock) * 0.06;
      sxz = lerp(0.16, 1, emerge) * over;
      sy = lerp(0.04, 1, Math.max(emerge * 0.12, unfold)) * over;
      fold = 1 - unfold;
      sink = 1 - emerge;
      presence = t > 0.0005 ? emerge : 0;
    }

    const visible = presence > 0.004;
    o.visible = visible;
    if (!visible) return;

    /* the object is literally inside the paper until it has emerged */
    o.position.set(position[0], position[1] - 0.075 * sink, position[2]);

    let rx = 0;
    let rz = 0;
    let localSy = sy;
    let localSxz = sxz;

    switch (mode) {
      case "fold":
        rx = -HALF_PI * fold;
        break;
      case "unroll":
        rz = HALF_PI * fold;
        break;
      case "extrude":
        /* no rotation: it grows straight up out of the ground plane */
        localSy = Math.max(0.001, sy);
        break;
      case "flat":
        localSy = lerp(0.02, 1, 1 - fold);
        localSxz = sxz;
        break;
    }

    /* a touch of paper-spring while it swings up */
    const wobble = mode === "extrude" || mode === "flat" ? 0 : fold * 0.14;
    i.rotation.set(rx, Math.sin(stage.time * 2.2 + seed.current) * wobble * 0.4, rz);
    i.scale.set(localSxz * scale, localSy * scale, localSxz * scale);

    /* idle life once the object has locked into place */
    if (idle !== "none" && presence > 0.98 && stage.phase === "idle") {
      const t = stage.time;
      if (idle === "float") {
        o.position.y += Math.sin(t * 1.1 + seed.current) * 0.012 * idleAmp;
      } else if (idle === "turn") {
        i.rotation.y += Math.sin(t * 0.45 + seed.current) * 0.08 * idleAmp;
      } else if (idle === "tilt") {
        i.rotation.z += Math.sin(t * 0.7 + seed.current) * 0.02 * idleAmp;
        o.position.y += Math.sin(t * 1.3 + seed.current) * 0.006 * idleAmp;
      }
    }
  });

  return (
    <group ref={outer} position={position} rotation={rotation}>
      <group ref={inner}>{children}</group>
    </group>
  );
}
