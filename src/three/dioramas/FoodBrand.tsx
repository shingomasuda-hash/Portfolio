import { useState } from "react";
import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Route } from "../props/base";
import {
  Bowl,
  CardStack,
  Chair,
  Counter,
  Glass,
  MenuCard,
  Noren,
  Pendant,
  Plant,
  Plate,
  Rail,
  Steam,
  TakeoutBox,
  TakeoutCup,
} from "../props/food";
import { Bars, Phone, PostCard } from "../props/digital";
import { House, Person, Shop, Signboard } from "../props/world";
import { Product } from "../props/studio";
import { OutputStage, type DioramaProps } from "./shared";

const TOP = 0.204; // counter working height

/**
 * FOOD BRANDING — a shop is built out of the page, not illustrated on it.
 * Scene by scene the same world is re-staged: the room, the silence before
 * anyone knows it exists, the toolkit that was designed, the work itself,
 * and finally a full house.
 */
export function FoodBrandDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const [lamps, setLamps] = useState(true);
  const [steamOn, setSteamOn] = useState(true);
  const warm = palette.secondary;
  const green = palette.accent;

  /* ---------------- SCENE 01 — the shop itself ---------------- */
  if (scene === 0) {
    const n = 10;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, -0.16]} mode="extrude">
          <Counter w={1.5} d={0.36} top="#9C6C44" base="#7B6650" seed={2} />
        </Rise>
        <Rise index={1} count={n} position={[-0.05, 0, -0.62]} mode="extrude">
          <Shop w={1.35} d={0.22} h={0.62} wall="#E8E0CF" awning={warm} sign="" seed={4} />
        </Rise>
        <Rise index={2} count={n} position={[0, 0.44, 0.06]} mode="fold">
          <Noren w={0.72} h={0.16} color={green} seed={3} />
        </Rise>
        <Rise index={3} count={n} position={[-0.95, 0, 0.1]} mode="fold" idle="tilt">
          <Signboard text="OPEN" bg={green} w={0.3} h={0.11} postH={0.3} />
        </Rise>
        <Rise index={4} count={n} position={[-0.38, 0, -0.44]} mode="extrude">
          <Person h={0.42} wear="#4A5448" gear="apron" rotation={0.18} seed={5} />
        </Rise>
        <Rise index={5} count={n} position={[0.12, TOP, -0.04]} mode="fold" idle="float">
          <group onClick={() => setSteamOn((v) => !v)}>
            <Bowl r={0.115} accent={green} seed={7} />
            <Steam position={[0, 0.12, 0]} count={steamOn ? 6 : 0} />
          </group>
        </Rise>
        <Rise index={6} count={n} position={[-0.42, TOP, 0.02]} mode="fold">
          <Plate r={0.08} food={warm} seed={9} />
        </Rise>
        <Rise index={7} count={n} position={[0.5, TOP, 0.0]} mode="fold">
          <Glass liquid={warm} />
        </Rise>
        <Rise index={8} count={n} position={[0.92, 0, -0.18]} mode="extrude">
          <Plant h={0.3} leaf={green} pot={warm} seed={11} />
        </Rise>
        <Rise index={9} count={n} position={[0.1, 0.72, -0.1]} mode="extrude">
          <Rail w={1.5} />
        </Rise>
        <Rise index={9} count={n} position={[-0.2, 0.72, -0.1]} mode="extrude">
          <group onClick={() => setLamps((v) => !v)}>
            <Pendant drop={0.2} on={lamps} />
          </group>
        </Rise>
        <Rise index={9} count={n} position={[0.42, 0.92, -0.1]} mode="extrude">
          <Pendant drop={0.34} on={lamps} />
        </Rise>
        {[-0.5, 0.0, 0.5].map((x, i) => (
          <Rise key={x} index={5 + i} count={n} position={[x, 0, 0.4]} mode="extrude">
            <Chair h={0.14} rotation={Math.PI} color="#7A6450" seed={13 + i} />
          </Rise>
        ))}
      </group>
    );
  }

  /* ------- SCENE 02 — good product, nobody knows it is here ------- */
  if (scene === 1) {
    const town = [-1.3, -1.0, -0.72, 0.66, 0.96, 1.28];
    const n = 6 + town.length;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, -0.2]} mode="extrude">
          <Shop w={0.58} d={0.32} h={0.34} wall="#EDE6D6" awning={warm} sign="" seed={2} />
        </Rise>
        <Rise index={1} count={n} position={[0, 0.3, 0.02]} mode="fold">
          <Noren w={0.44} h={0.1} color={green} seed={3} />
        </Rise>
        {/* the town, all of it facing the other way */}
        {town.map((x, i) => (
          <Rise key={x} index={2 + i} count={n} position={[x, 0, -0.66 + (i % 2) * 0.2]} mode="extrude">
            <House
              w={0.2}
              d={0.18}
              h={0.17 + (i % 3) * 0.035}
              wall="#D7D4CA"
              roof="#9A968C"
              roofKind={i % 2 ? "gable" : "hip"}
              rotation={i * 0.4}
              seed={20 + i}
            />
          </Rise>
        ))}
        {/* one counter, one bowl, and no one in front of it */}
        <Rise index={n - 4} count={n} position={[0, 0, 0.3]} mode="extrude">
          <Counter w={0.56} d={0.22} h={0.17} top="#9C6C44" base="#7B6650" seed={5} />
        </Rise>
        <Rise index={n - 3} count={n} position={[0, 0.176, 0.3]} mode="fold" idle="float">
          <Bowl r={0.085} accent={green} chopsticks={false} seed={7} />
          <Steam position={[0, 0.09, 0]} count={4} scale={0.8} />
        </Rise>
        <Rise index={n - 2} count={n} position={[1.0, 0, 0.5]} mode="extrude">
          <Person h={0.24} wear="#8E8B80" rotation={2.4} seed={9} />
        </Rise>
        <Rise index={n - 1} count={n} position={[-0.92, 0, 0.56]} mode="extrude">
          <Person h={0.22} wear="#9A968C" rotation={-2.1} seed={12} />
        </Rise>
        <Route
          points={[
            [-1.35, 0.7],
            [1.35, 0.7],
          ]}
          color="#A9A499"
          width={0.055}
        />
      </group>
    );
  }

  /* ---------- SCENE 03 — everything we actually designed ---------- */
  if (scene === 2) {
    const n = 9;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, 0.16]} mode="fold" idle="float">
          <Bowl r={0.12} accent={green} seed={7} />
          <Steam position={[0, 0.13, 0]} count={4} />
        </Rise>
        <Rise index={1} count={n} position={[-0.82, 0, -0.1]} mode="unroll">
          <MenuCard h={0.24} palette={palette} title="お品書き" seed={3} />
        </Rise>
        <Rise index={2} count={n} position={[0.5, 0, -0.06]} mode="unroll">
          <Phone h={0.3} palette={palette} kind="feed" seed={5} />
        </Rise>
        <Rise index={3} count={n} position={[-0.35, 0, 0.5]} mode="fold">
          <CardStack w={0.13} accent={green} label="SHOP CARD" seed={4} />
        </Rise>
        <Rise index={4} count={n} position={[0.92, 0, 0.3]} mode="extrude">
          <TakeoutCup h={0.13} band={green} seed={6} />
        </Rise>
        <Rise index={5} count={n} position={[1.12, 0, -0.02]} mode="extrude">
          <TakeoutBox w={0.16} rotation={0.3} seed={8} />
        </Rise>
        <Rise index={6} count={n} position={[-1.14, 0, 0.28]} mode="fold" idle="tilt">
          <Signboard text="BRAND" bg={green} w={0.3} h={0.1} postH={0.24} />
        </Rise>
        <Rise index={7} count={n} position={[0.3, 0, 0.56]} mode="extrude">
          <Product h={0.14} accent={warm} seed={10} />
        </Rise>
        <Rise index={8} count={n} position={[-0.95, 0, -0.5]} mode="extrude">
          <Plant h={0.24} leaf={green} pot={warm} seed={11} />
        </Rise>
        <Route
          points={[
            [-1.14, 0.28],
            [-0.82, -0.1],
            [0, 0.16],
            [0.5, -0.06],
            [0.92, 0.3],
          ]}
          color={green}
          width={0.012}
        />
      </group>
    );
  }

  /* -------------------- SCENE 04 — the work -------------------- */
  if (scene === 3) {
    return (
      <OutputStage
        project={project}
        palette={palette}
        spots={[
          { pos: [-1.0, 0, -0.2], rot: 0.3, scale: 0.95, mode: "unroll" },
          { pos: [-0.06, 0, -0.52], rot: 0.02, scale: 1.0, mode: "unroll" },
          { pos: [0.84, 0, -0.12], rot: -0.34, scale: 0.92, mode: "fold" },
          { pos: [0.34, 0, 0.42], rot: -0.18, scale: 0.9, mode: "unroll" },
          { pos: [-0.62, 0, 0.5], rot: 0.4, scale: 0.85, mode: "fold" },
        ]}
      />
    );
  }

  /* ---------------- SCENE 05 — a full house ---------------- */
  const n = 12;
  return (
    <group>
      <Rise index={0} count={n} position={[0, 0, -0.2]} mode="extrude">
        <Counter w={1.5} d={0.34} top="#9C6C44" base="#7B6650" seed={2} />
      </Rise>
      <Rise index={1} count={n} position={[-0.05, 0, -0.66]} mode="extrude">
        <Shop w={1.3} d={0.2} h={0.6} wall="#E8E0CF" awning={warm} sign="" seed={4} />
      </Rise>
      {[-0.46, 0.0, 0.46].map((x, i) => (
        <Rise key={x} index={2 + i} count={n} position={[x, TOP, -0.06]} mode="fold" idle="float">
          <Bowl r={0.1} accent={green} seed={7 + i} />
          <Steam position={[0, 0.11, 0]} count={4} scale={0.9} />
        </Rise>
      ))}
      {[-0.72, -0.16, 0.4, 0.94].map((x, i) => (
        <Rise key={x} index={5 + i} count={n} position={[x, 0, 0.4]} mode="extrude">
          <Person
            h={0.36}
            wear={["#6B7A63", "#9A6B52", "#4A5448", "#8C8471"][i]}
            rotation={Math.PI + (i - 1.5) * 0.2}
            gear={i === 3 ? "cap" : "none"}
            seed={14 + i}
          />
        </Rise>
      ))}
      <Rise index={9} count={n} position={[0.1, 0.72, -0.14]} mode="extrude">
        <Rail w={1.5} />
      </Rise>
      <Rise index={9} count={n} position={[-0.2, 0.72, -0.14]} mode="extrude">
        <Pendant drop={0.2} on />
      </Rise>
      <Rise index={9} count={n} position={[0.42, 0.72, -0.14]} mode="extrude">
        <Pendant drop={0.24} on />
      </Rise>
      {[
        [-1.22, 0.48, 0.1],
        [1.16, 0.55, -0.14],
        [1.0, 0.34, 0.42],
      ].map(([x, y, z], i) => (
        <Rise key={i} index={10} count={n} position={[x, y, z]} mode="unroll">
          <PostCard w={0.16} palette={palette} kind={i === 1 ? "reel" : "post"} seed={30 + i} />
        </Rise>
      ))}
      <Rise index={11} count={n} position={[-1.15, 0, -0.4]} mode="extrude">
        <Bars count={6} maxH={0.24} color={green} highlight={warm} seed={9} />
      </Rise>
      <Rise index={11} count={n} position={[1.2, 0, 0.02]} mode="fold">
        <CardStack w={0.12} accent={green} label="REPEAT" seed={4} />
      </Rise>
    </group>
  );
}
