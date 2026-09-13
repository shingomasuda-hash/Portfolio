import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DEFAULT_SHOT, shotPosition, staging, type Shot } from "../data/staging";
import { portfolioProjects } from "../data/portfolioProjects";
import { advanceStage, stage } from "../state/experience";
import { clamp, damp, easeInOutCubic, range } from "../lib/math";
import { SHELF_Z, PLANK_Y, shelfSlots } from "./Shelf";
import { useExperience } from "../state/experience";

const pos = new THREE.Vector3();
const tgt = new THREE.Vector3();
const tmp = new THREE.Vector3();
const right = new THREE.Vector3();

/** The idle life of the camera — different for every kind of subject. */
function applyMotion(shot: Shot, t: number, p: THREE.Vector3, q: THREE.Vector3) {
  switch (shot.motion) {
    case "sway":
      p.x += Math.sin(t * 0.24) * 0.11;
      p.y += Math.sin(t * 0.19 + 1) * 0.045;
      break;
    case "drift":
      p.x += Math.cos(t * 0.15) * 0.09;
      p.z += Math.sin(t * 0.17) * 0.1;
      break;
    case "orbit": {
      const a = Math.sin(t * 0.12) * 0.22;
      const dx = p.x - q.x;
      const dz = p.z - q.z;
      p.x = q.x + dx * Math.cos(a) - dz * Math.sin(a);
      p.z = q.z + dx * Math.sin(a) + dz * Math.cos(a);
      p.y += Math.sin(t * 0.2) * 0.06;
      break;
    }
    case "descend":
      p.y += Math.sin(t * 0.21) * 0.14;
      p.z += Math.cos(t * 0.13) * 0.06;
      break;
    case "push":
      tmp.copy(q).sub(p).normalize();
      p.addScaledVector(tmp, (Math.sin(t * 0.22) * 0.5 + 0.5) * 0.1);
      break;
    case "breathe":
      p.y += Math.sin(t * 0.16) * 0.07;
      p.x += Math.cos(t * 0.11) * 0.06;
      break;
  }
}

/** Where a shot starts from when a page has just settled — never the same twice. */
function entryOffset(shot: Shot, k: number, p: THREE.Vector3, q: THREE.Vector3) {
  if (k <= 0.001) return;
  switch (shot.motion) {
    case "push":
      tmp.copy(p).sub(q).normalize();
      p.addScaledVector(tmp, 0.75 * k);
      break;
    case "descend":
      p.y += 1.05 * k;
      break;
    case "orbit": {
      const a = 0.5 * k;
      const dx = p.x - q.x;
      const dz = p.z - q.z;
      p.x = q.x + dx * Math.cos(a) - dz * Math.sin(a);
      p.z = q.z + dx * Math.sin(a) + dz * Math.cos(a);
      break;
    }
    case "sway":
      p.x += 0.7 * k;
      break;
    case "drift":
      p.x -= 0.55 * k;
      p.z += 0.35 * k;
      break;
    case "breathe":
      p.y += 0.3 * k;
      tmp.copy(p).sub(q).normalize();
      p.addScaledVector(tmp, 0.5 * k);
      break;
  }
}

/**
 * One camera for the whole experience: the shelf, the walk to the table, and
 * a framing per scene that belongs to that industry rather than a house move.
 */
/** The stage is 3.12 wide; narrow viewports have to back off to still see it. */
const REF_ASPECT = 1.62;

export function Rig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const index = useExperience((s) => s.index);
  const hovered = useExperience((s) => s.hovered);
  const ready = useRef(false);

  useFrame((_, dt) => {
    /* a 10fps floor keeps the choreography honest on slow hardware */
    const d = Math.min(dt, 0.1) * stage.timeScale;
    advanceStage(d);

    /* split the shortfall between backing off and opening the lens */
    const aspect = Math.max(0.35, size.width / Math.max(1, size.height));
    /* a portrait phone can never hold the whole spread — crop a little
       rather than shrink the book into the middle of the screen */
    const need = Math.min(2.5, Math.max(1, REF_ASPECT / aspect));
    const distK = Math.min(need, 1.7);
    const widen = need / distK;
    /* how far the subject has to move right to clear the reading column */
    const shift = size.width >= 1080 ? Math.min(0.38, (size.width - 1080) / 1900 + 0.24) : 0;

    const project = portfolioProjects[index];
    const plan = staging[project.id]?.shots;
    const shot = plan?.[stage.scene] ?? DEFAULT_SHOT;
    const shotFov =
      widen > 1.001
        ? Math.min(
            64,
            (2 * Math.atan(Math.tan(((shot.fov / 2) * Math.PI) / 180) * widen) * 180) / Math.PI,
          )
        : shot.fov;
    const t = stage.time;

    /* --- shelf framing --- */
    const slot = shelfSlots[hovered ?? index] ?? [0, 1, SHELF_Z];
    const lookX = hovered !== null ? slot[0] * 0.3 : 0;
    const shelfPos = tmp.set(lookX * 0.45, PLANK_Y + 0.98, SHELF_Z + 7.05 * Math.min(distK, 1.22));
    pos.copy(shelfPos);
    tgt.set(lookX, PLANK_Y + 0.62, SHELF_Z);
    pos.x += Math.sin(t * 0.14) * 0.1;
    pos.y += Math.sin(t * 0.1) * 0.045;

    /* --- reading framing --- */
    const o = stage.open;
    if (o > 0.001) {
      const rt = new THREE.Vector3(...shot.target);
      const rp = new THREE.Vector3(
        ...shotPosition({
          ...shot,
          /* trucking sideways costs frame width, so back off to pay for it */
          dist: shot.dist * distK * (1 + shift * 0.34),
          /* looking down a little harder puts the spread into a tall frame */
          el: Math.min(72, shot.el + (widen - 1) * 26),
        }),
      );
      /* on a tall frame, aim under the book so it sits above the copy */
      rt.y -= (widen - 1) * 0.85;
      applyMotion(shot, t, rp, rt);
      entryOffset(shot, 1 - easeInOutCubic(clamp(stage.sceneMix)), rp, rt);

      /* the camera eases back while a page is in flight */
      const away =
        stage.phase === "collapse"
          ? stage.collapse * 0.55
          : stage.phase === "turn" || stage.phase === "settle"
            ? 0.55
            : stage.phase === "raise"
              ? (1 - stage.build) * 0.55
              : 0;
      if (away > 0) {
        tmp.copy(rp).sub(rt).normalize();
        rp.addScaledVector(tmp, away * 0.55);
        rp.y += away * 0.16;
      }

      const mix = easeInOutCubic(range(o, 0.12, 0.92));
      pos.lerp(rp, mix);
      tgt.lerp(rt, mix);
    }

    /* the pointer leans the whole room a little */
    pos.x += stage.parallaxX * 0.16;
    pos.y -= stage.parallaxY * 0.09;

    /* on a wide screen the copy owns the left column, so truck the camera
       sideways — a parallel shift keeps the composition of the shot intact */
    if (shift !== 0) {
      right.set(camera.matrixWorld.elements[0], 0, camera.matrixWorld.elements[2]).normalize();
      pos.addScaledVector(right, -shift);
      tgt.addScaledVector(right, -shift);
    }

    const fov = THREE.MathUtils.lerp(36 * widen, shotFov, easeInOutCubic(range(o, 0.2, 0.95)));
    const lam = ready.current ? (stage.phase === "idle" ? 2.4 : 3.4) : 60;
    camera.position.set(
      damp(camera.position.x, pos.x, lam, d),
      damp(camera.position.y, pos.y, lam, d),
      damp(camera.position.z, pos.z, lam, d),
    );
    const look = camera.userData.look as THREE.Vector3 | undefined;
    const cur = look ?? (camera.userData.look = new THREE.Vector3().copy(tgt));
    cur.set(damp(cur.x, tgt.x, lam, d), damp(cur.y, tgt.y, lam, d), damp(cur.z, tgt.z, lam, d));
    camera.lookAt(cur);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = damp(camera.fov, fov, 2.6, d);
      camera.updateProjectionMatrix();
    }
    ready.current = true;
  });

  return null;
}
