import { useState } from "react";
import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Route } from "../props/base";
import {
  Bowl,
  Chair,
  Glass,
  MenuCard,
  Pendant,
  Plant,
  Rail,
  Plate,
  Steam,
  Table,
} from "../props/food";
import { Bars, Phone, PostCard } from "../props/digital";
import { CameraProp, Receipt } from "../props/studio";
import { Person, Shop, Signboard } from "../props/world";
import { Marker, OutputStage, type DioramaProps } from "./shared";

const TOP = 0.194; // table height

/**
 * RESTAURANT EXPERIENCE — the same table, re-staged five times: the room as
 * a guest meets it, the gap between the food and the screen, the journey we
 * designed across both, the work, and a full evening service.
 */
export function RestaurantDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const [evening, setEvening] = useState(false);
  const warm = palette.accent;
  const olive = palette.secondary;

  /* ------------- SCENE 01 — the table, at guest eye level ------------- */
  if (scene === 0) {
    const n = 10;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, -0.74]} mode="extrude">
          <Shop w={1.5} d={0.2} h={0.52} wall="#E9E1D2" awning={undefined} sign="" seed={21} />
        </Rise>
        <Rise index={0} count={n} position={[0, 0, 0]} mode="extrude">
          <Table w={0.78} d={0.5} h={0.18} top="#A9793F" seed={2} />
        </Rise>
        <Rise index={1} count={n} position={[-0.2, TOP, 0.02]} mode="fold" idle="float">
          <Bowl r={0.1} glaze="#F1EADC" accent={olive} seed={5} />
          <Steam position={[0, 0.1, 0]} count={5} />
        </Rise>
        <Rise index={2} count={n} position={[0.2, TOP, 0.06]} mode="fold">
          <Plate r={0.085} food={warm} seed={7} />
        </Rise>
        <Rise index={3} count={n} position={[0.34, TOP, -0.12]} mode="fold">
          <Glass liquid={warm} />
        </Rise>
        <Rise index={4} count={n} position={[-0.34, TOP, -0.14]} mode="fold">
          <Glass h={0.06} liquid="#C9B487" />
        </Rise>
        <Rise index={5} count={n} position={[0, 0, -0.46]} mode="extrude">
          <Chair h={0.17} color="#7A6450" seed={9} />
        </Rise>
        <Rise index={5} count={n} position={[0, 0, 0.46]} mode="extrude">
          <Chair h={0.17} rotation={Math.PI} color="#7A6450" seed={10} />
        </Rise>
        <Rise index={6} count={n} position={[0.62, 0, -0.3]} mode="unroll">
          <MenuCard h={0.2} palette={palette} title="お品書き" seed={3} />
        </Rise>
        <Rise index={7} count={n} position={[-0.86, 0, -0.2]} mode="extrude">
          <Plant h={0.28} leaf={olive} pot={warm} seed={11} />
        </Rise>
        <Rise index={8} count={n} position={[0, 0.56, 0]} mode="extrude">
          <Rail w={0.56} />
        </Rise>
        <Rise index={8} count={n} position={[0, 0.56, 0]} mode="extrude">
          <group onClick={() => setEvening((v) => !v)}>
            <Pendant drop={0.16} on={evening} shade="#E9DECB" />
          </group>
        </Rise>
      </group>
    );
  }

  /* ------- SCENE 02 — the food is good; the screen says nothing ------- */
  if (scene === 1) {
    const n = 8;
    return (
      <group>
        <Rise index={0} count={n} position={[-0.35, 0, 0.05]} mode="extrude">
          <Table w={0.66} d={0.46} h={0.18} top="#A9793F" seed={2} />
        </Rise>
        <Rise index={1} count={n} position={[-0.4, TOP, 0.02]} mode="fold" idle="float">
          <Bowl r={0.105} accent={olive} seed={5} />
          <Steam position={[0, 0.11, 0]} count={5} />
        </Rise>
        <Rise index={2} count={n} position={[-0.12, TOP, 0.1]} mode="fold">
          <Plate r={0.075} food={warm} seed={6} />
        </Rise>
        {/* the phone is here, but the feed is empty */}
        <Rise index={3} count={n} position={[0.72, 0, 0.1]} mode="unroll">
          <Phone h={0.32} palette={{ ...palette, accent: "#B9B5AC", secondary: "#CBC7BE" }} kind="feed" seed={4} />
        </Rise>
        <Rise index={4} count={n} position={[0.36, TOP, -0.2]} mode="fold">
          <CameraProp w={0.09} accent="#A6A199" />
        </Rise>
        <Rise index={5} count={n} position={[0.1, TOP, 0.3]} mode="flat">
          <Receipt w={0.07} h={0.18} rotation={0.3} seed={8} />
        </Rise>
        <Rise index={6} count={n} position={[-0.35, 0, 0.52]} mode="extrude">
          <Chair h={0.17} rotation={Math.PI} color="#8A7A66" seed={9} />
        </Rise>
        <Rise index={7} count={n} position={[1.12, 0, -0.36]} mode="extrude">
          <Person h={0.34} wear="#9C978B" rotation={2.6} seed={12} />
        </Rise>
        {/* the gap between the room and the screen, drawn on the page */}
        <Route
          points={[
            [-0.05, 0.05],
            [0.42, 0.1],
          ]}
          color="#B4AFA4"
          width={0.006}
        />
      </group>
    );
  }

  /* ---------- SCENE 03 — the journey, before / during / after ---------- */
  if (scene === 2) {
    const n = 10;
    const path: [number, number][] = [
      [-1.18, 0.4],
      [-0.6, 0.1],
      [0.0, -0.1],
      [0.6, 0.1],
      [1.18, 0.4],
    ];
    return (
      <group>
        <Route points={path} color={warm} width={0.016} />
        {path.map(([x, z], i) => (
          <Rise key={i} index={i} count={n} position={[x, 0, z + 0.14]} mode="extrude">
            <Marker n={i + 1} color={warm} h={0.07} />
          </Rise>
        ))}
        <Rise index={0} count={n} position={[-1.18, 0, 0.4]} mode="unroll">
          <Phone h={0.26} palette={palette} kind="feed" seed={4} />
        </Rise>
        <Rise index={2} count={n} position={[-0.6, 0, 0.1]} mode="fold" idle="tilt">
          <Signboard text="ARRIVE" bg={warm} w={0.26} h={0.09} postH={0.2} />
        </Rise>
        <Rise index={4} count={n} position={[0.0, 0, -0.12]} mode="extrude">
          <Table w={0.42} d={0.3} h={0.15} top="#A9793F" seed={2} />
        </Rise>
        <Rise index={5} count={n} position={[0.0, 0.164, -0.12]} mode="fold" idle="float">
          <Bowl r={0.075} accent={olive} chopsticks={false} seed={5} />
          <Steam position={[0, 0.08, 0]} count={4} scale={0.7} />
        </Rise>
        <Rise index={6} count={n} position={[0.6, 0, 0.08]} mode="flat">
          <Receipt w={0.075} h={0.2} rotation={-0.2} seed={8} />
        </Rise>
        <Rise index={7} count={n} position={[0.62, 0, -0.22]} mode="fold">
          <CameraProp w={0.085} accent={warm} rotation={-0.5} />
        </Rise>
        <Rise index={8} count={n} position={[1.18, 0.22, 0.4]} mode="unroll">
          <PostCard w={0.17} palette={palette} kind="post" seed={6} />
        </Rise>
        <Rise index={9} count={n} position={[1.18, 0, 0.4]} mode="unroll">
          <PostCard w={0.13} palette={palette} kind="reel" seed={9} float={false} />
        </Rise>
      </group>
    );
  }

  /* ---------------------- SCENE 04 — the work ---------------------- */
  if (scene === 3) {
    return (
      <OutputStage
        project={project}
        palette={palette}
        spots={[
          { pos: [-0.92, 0, -0.18], rot: 0.26, scale: 0.95, mode: "fold" },
          { pos: [-0.02, 0, 0.3], rot: -0.08, scale: 0.95, mode: "unroll" },
          { pos: [0.66, 0, -0.26], rot: -0.3, scale: 0.9, mode: "unroll" },
          { pos: [1.2, 0, 0.26], rot: -0.5, scale: 0.85, mode: "unroll" },
        ]}
      />
    );
  }

  /* ---------------- SCENE 05 — evening service ---------------- */
  const n = 11;
  return (
    <group>
      <Rise index={0} count={n} position={[-0.42, 0, -0.05]} mode="extrude">
        <Table w={0.62} d={0.44} h={0.18} top="#A9793F" seed={2} />
      </Rise>
      <Rise index={1} count={n} position={[0.62, 0, 0.12]} mode="extrude">
        <Table w={0.52} d={0.4} h={0.18} top="#9E7340" seed={3} />
      </Rise>
      {[
        [-0.58, -0.06],
        [-0.22, 0.04],
        [0.5, 0.08],
        [0.78, 0.18],
      ].map(([x, z], i) => (
        <Rise key={i} index={2 + i} count={n} position={[x, TOP, z]} mode="fold" idle="float">
          <Bowl r={0.082} accent={olive} chopsticks={i % 2 === 0} seed={5 + i} />
          <Steam position={[0, 0.09, 0]} count={4} scale={0.8} />
        </Rise>
      ))}
      {[
        [-0.42, 0.5, Math.PI],
        [-0.42, -0.5, 0],
        [0.62, 0.56, Math.PI],
      ].map(([x, z, r], i) => (
        <Rise key={i} index={6 + i} count={n} position={[x, 0, z]} mode="extrude">
          <Person h={0.36} wear={["#6E5F52", "#7A8470", "#8D6A53"][i]} rotation={r} seed={16 + i} />
        </Rise>
      ))}
      <Rise index={0} count={n} position={[0, 0, -0.78]} mode="extrude">
        <Shop w={1.6} d={0.2} h={0.5} wall="#E9E1D2" awning={undefined} sign="" seed={21} />
      </Rise>
      <Rise index={8} count={n} position={[0.1, 0.66, 0.02]} mode="extrude">
        <Rail w={1.5} />
      </Rise>
      <Rise index={8} count={n} position={[-0.42, 0.68, -0.05]} mode="extrude">
        <Pendant drop={0.2} on />
      </Rise>
      <Rise index={8} count={n} position={[0.62, 0.68, 0.12]} mode="extrude">
        <Pendant drop={0.26} on />
      </Rise>
      {[
        [-1.22, 0.46, -0.3],
        [1.24, 0.52, -0.2],
      ].map(([x, y, z], i) => (
        <Rise key={i} index={9} count={n} position={[x, y, z]} mode="unroll">
          <PostCard w={0.16} palette={palette} kind={i ? "reel" : "post"} seed={22 + i} />
        </Rise>
      ))}
      <Rise index={10} count={n} position={[0.0, 0, -0.62]} mode="extrude">
        <Bars count={7} maxH={0.22} gap={0.05} color={olive} highlight={warm} seed={11} />
      </Rise>
    </group>
  );
}
