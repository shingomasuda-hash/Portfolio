import type { ReactNode } from "react";
import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Route } from "../props/base";
import { Bars, Flow, Monitor, Phone, PostCard } from "../props/digital";
import { Product } from "../props/studio";
import { House, Person, Shop, Signboard, Tree } from "../props/world";
import { Marker, OutputStage, Plate, WordBlock, type DioramaProps } from "./shared";

type Vec3 = [number, number, number];

const DISTRICTS: { key: string; label: string; pos: Vec3 }[] = [
  { key: "store", label: "店舗", pos: [-1.05, 0, 0.34] },
  { key: "recruit", label: "採用", pos: [-0.42, 0, -0.46] },
  { key: "web", label: "Web", pos: [0.45, 0, -0.44] },
  { key: "sns", label: "SNS", pos: [1.08, 0, 0.36] },
];

/**
 * BUSINESS DESIGN — the thesis of the shelf. Store, hiring, web, social and
 * product are not five services: they are districts of one small economy, and
 * the page ends by pulling back far enough to show they are wired together.
 */
export function BusinessDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const ink = palette.accent;
  const green = palette.secondary;

  const District = ({
    which,
    children,
  }: {
    which: string;
    children?: ReactNode;
  }) => {
    switch (which) {
      case "store":
        return (
          <group>
            <Shop w={0.38} d={0.26} h={0.26} wall="#E8E3D6" awning={green} sign="" seed={3} />
            {children}
          </group>
        );
      case "recruit":
        return (
          <group>
            <Person h={0.3} wear="#5C6A5E" rotation={0.3} seed={7} />
            <Person position={[0.14, 0, 0.08]} h={0.27} wear="#8A7A66" rotation={-0.4} seed={9} />
            {children}
          </group>
        );
      case "web":
        return (
          <group>
            <Monitor w={0.34} palette={palette} kind="site" seed={11} />
            {children}
          </group>
        );
      default:
        return (
          <group>
            <Phone h={0.26} palette={palette} kind="feed" seed={13} />
            {children}
          </group>
        );
    }
  };

  /* ---------- SCENE 01 — one measure, doing its best alone ---------- */
  if (scene === 0) {
    const n = 5;
    return (
      <group>
        <Plate position={[-0.5, 0.001, 0.1]} size={[1.0, 0.8]} color="#D8D4CB" opacity={0.55} />
        <Rise index={0} count={n} position={[-0.72, 0, 0.0]} mode="extrude">
          <Shop w={0.44} d={0.3} h={0.3} wall="#E8E3D6" awning={green} sign="" seed={3} />
        </Rise>
        <Rise index={1} count={n} position={[-0.2, 0, 0.32]} mode="unroll">
          <Monitor w={0.34} palette={palette} kind="site" seed={11} />
        </Rise>
        <Rise index={2} count={n} position={[-0.9, 0, 0.46]} mode="extrude">
          <Person h={0.28} wear="#6E7A66" rotation={0.6} seed={7} />
        </Rise>
        <Rise index={3} count={n} position={[0.32, 0, -0.36]} mode="fold">
          <WordBlock text="施策は動いている" w={0.4} h={0.062} bg="#F0EEE7" fg="rgba(45,51,49,0.7)" font="mincho" />
        </Rise>
        <Rise index={4} count={n} position={[0.5, 0, 0.42]} mode="extrude">
          <Bars count={4} maxH={0.14} gap={0.046} color="#A9A79F" highlight="#B5B3AA" seed={5} />
        </Rise>
      </group>
    );
  }

  /* ------- SCENE 02 — four islands, none of them speaking ------- */
  if (scene === 1) {
    const n = DISTRICTS.length * 2;
    return (
      <group>
        {DISTRICTS.map((d, i) => (
          <group key={d.key}>
            <Plate position={[d.pos[0], 0.001, d.pos[2]]} size={[0.72, 0.6]} color="#D9D5CC" opacity={0.5} />
            <Rise index={i} count={n} position={d.pos} mode="extrude">
              <District which={d.key} />
            </Rise>
            <Rise
              index={DISTRICTS.length + i}
              count={n}
              position={[d.pos[0], 0, d.pos[2] + 0.34]}
              mode="fold"
            >
              <WordBlock
                text={d.label}
                w={0.18}
                h={0.055}
                bg="#F0EEE7"
                fg="rgba(45,51,49,0.72)"
                font="mincho"
              />
            </Rise>
          </group>
        ))}
      </group>
    );
  }

  /* --------- SCENE 03 — wire them into one business --------- */
  if (scene === 2) {
    const n = DISTRICTS.length + 4;
    const centre: Vec3 = [0, 0, 0.02];
    return (
      <group>
        {DISTRICTS.map((d) => (
          <Route
            key={d.key}
            points={[
              [centre[0], centre[2]],
              [d.pos[0], d.pos[2]],
            ]}
            color={green}
            width={0.014}
          />
        ))}
        {DISTRICTS.map((d, i) => (
          <Rise key={d.key} index={i} count={n} position={d.pos} mode="extrude">
            <District which={d.key} />
          </Rise>
        ))}
        {DISTRICTS.map((d, i) => (
          <Flow
            key={`f${d.key}`}
            from={[centre[0], 0.16, centre[2]]}
            to={[d.pos[0], 0.14, d.pos[2]]}
            color={i % 2 ? green : ink}
            packets={2}
            speed={0.26}
            offset={i * 0.24}
            height={0.05}
          />
        ))}
        <Rise index={DISTRICTS.length} count={n} position={centre} mode="extrude">
          <Marker n={0} color={ink} h={0.1} />
        </Rise>
        <Rise index={DISTRICTS.length + 1} count={n} position={[0, 0.16, 0.02]} mode="fold">
          <WordBlock text="STRATEGY" w={0.3} h={0.06} bg="#F2F0E9" fg="rgba(45,51,49,0.82)" />
        </Rise>
        <Rise index={DISTRICTS.length + 2} count={n} position={[0, 0, 0.74]} mode="extrude">
          <Product h={0.16} accent={green} seed={15} />
        </Rise>
        <Rise index={DISTRICTS.length + 3} count={n} position={[0, 0, -0.72]} mode="extrude">
          <Bars count={6} maxH={0.2} gap={0.046} color={green} highlight={ink} seed={17} />
        </Rise>
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
          { pos: [-0.9, 0, 0.0], rot: 0.26, scale: 0.95, mode: "unroll" },
          { pos: [0.05, 0, 0.4], rot: -0.06, scale: 1.0, mode: "unroll" },
          { pos: [0.92, 0, -0.24], rot: -0.36, scale: 0.95, mode: "unroll" },
        ]}
      />
    );
  }

  /* ------------- SCENE 05 — one economy, seen from above ------------- */
  const n = 18;
  const ring: [number, number][] = [
    [-1.05, 0.34],
    [-0.42, -0.46],
    [0.45, -0.44],
    [1.08, 0.36],
    [-1.05, 0.34],
  ];
  return (
    <group>
      <Route points={ring} color={green} width={0.032} />
      <Route
        points={[
          [-0.42, -0.46],
          [1.08, 0.36],
        ]}
        color={green}
        width={0.02}
      />
      <Route
        points={[
          [-1.05, 0.34],
          [0.45, -0.44],
        ]}
        color={green}
        width={0.02}
      />
      {DISTRICTS.map((d, i) => (
        <Rise key={d.key} index={i} count={n} position={d.pos} mode="extrude">
          <District which={d.key} />
        </Rise>
      ))}
      {DISTRICTS.map((d, i) => {
        const q = DISTRICTS[(i + 1) % DISTRICTS.length];
        return (
          <Flow
            key={`fl${i}`}
            from={[d.pos[0], 0.14, d.pos[2]]}
            to={[q.pos[0], 0.14, q.pos[2]]}
            color={i % 2 ? green : ink}
            packets={2}
            speed={0.22}
            offset={i * 0.2}
            height={0.06}
          />
        );
      })}
      {[
        [-0.72, 0.68],
        [-0.05, 0.62],
        [0.62, 0.66],
        [1.24, 0.02],
        [-1.3, -0.1],
      ].map(([x, z], i) => (
        <Rise key={`p${i}`} index={4 + i} count={n} position={[x, 0, z]} mode="extrude">
          <Person
            h={0.24}
            wear={["#6B7A63", "#9A6B52", "#4A5448", "#8C8471", "#707E70"][i]}
            rotation={i * 1.2}
            seed={40 + i}
          />
        </Rise>
      ))}
      {[
        [-0.5, -0.72],
        [0.15, -0.78],
        [0.82, 0.72],
      ].map(([x, z], i) => (
        <Rise key={`h${i}`} index={9 + i} count={n} position={[x, 0, z]} mode="extrude">
          <House
            w={0.22}
            d={0.2}
            h={0.2}
            wall="#E4E0D6"
            roof={i ? "#8A8474" : "#6E7A66"}
            roofKind={i === 1 ? "hip" : "gable"}
            rotation={i * 0.5}
            seed={50 + i}
          />
        </Rise>
      ))}
      <Rise index={12} count={n} position={[-1.32, 0, 0.66]} mode="extrude">
        <Tree h={0.24} leaf={green} seed={60} />
      </Rise>
      <Rise index={13} count={n} position={[1.32, 0, 0.72]} mode="extrude">
        <Product h={0.15} accent={green} seed={15} />
      </Rise>
      <Rise index={14} count={n} position={[0.0, 0, 0.0]} mode="extrude">
        <Signboard text="ONE  BUSINESS" bg={ink} w={0.38} h={0.1} postH={0.16} />
      </Rise>
      <Rise index={15} count={n} position={[0.0, 0, -0.86]} mode="extrude">
        <Bars count={8} maxH={0.24} gap={0.05} color={green} highlight={ink} seed={17} />
      </Rise>
      <Rise index={16} count={n} position={[-1.34, 0.5, -0.5]} mode="unroll">
        <PostCard w={0.14} palette={palette} kind="ad" seed={19} />
      </Rise>
      <Rise index={17} count={n} position={[1.34, 0.5, -0.5]} mode="unroll">
        <PostCard w={0.14} palette={palette} kind="post" seed={21} />
      </Rise>
    </group>
  );
}
