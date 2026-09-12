import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Bars, Flow, Phone, PostCard } from "../props/digital";
import { Person } from "../props/world";
import { Marker, OutputStage, WordBlock, type DioramaProps } from "./shared";

const LOOP: [number, number, number][] = [
  [-0.92, 0.26, 0.32],
  [0.0, 0.5, -0.42],
  [0.92, 0.26, 0.32],
  [0.0, 0.14, 0.7],
];

/**
 * SOCIAL & AD — one phone at the centre and everything it produces treated
 * as physical objects around it. The camera ends up almost inside the screen.
 */
export function SocialDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const ink = palette.accent;
  const rust = palette.secondary;

  /* -------------- SCENE 01 — one device, one brand -------------- */
  if (scene === 0) {
    const n = 6;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, 0]} mode="unroll">
          <Phone h={0.56} palette={palette} kind="feed" seed={3} />
        </Rise>
        {[
          [-0.72, 0.42, 0.22],
          [0.74, 0.36, 0.18],
          [-0.5, 0.06, 0.52],
          [0.55, 0.1, 0.5],
        ].map(([x, y, z], i) => (
          <Rise key={i} index={1 + i} count={n} position={[x, y, z]} mode="unroll">
            <PostCard w={0.17} palette={palette} kind={i === 1 ? "reel" : "post"} seed={7 + i} />
          </Rise>
        ))}
        <Rise index={5} count={n} position={[0, 0, -0.62]} mode="extrude">
          <Bars count={5} maxH={0.16} gap={0.05} color={ink} highlight={rust} seed={9} />
        </Rise>
      </group>
    );
  }

  /* --------- SCENE 02 — plenty of posts, no reaction --------- */
  if (scene === 1) {
    const n = 11;
    return (
      <group>
        {Array.from({ length: 9 }).map((_, i) => {
          const col = i % 3;
          const row = (i / 3) | 0;
          return (
            <Rise
              key={i}
              index={i}
              count={n}
              position={[-0.86 + col * 0.86, row * 0.012, -0.4 + row * 0.46]}
              rotation={[0, (((i * 41) % 7) - 3) * 0.06, 0]}
              mode="flat"
            >
              <PostCard
                w={0.22}
                palette={{ ...palette, accent: "#B6B2A8", secondary: "#C6C1B6" }}
                kind="post"
                seed={20 + i}
                float={false}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </Rise>
          );
        })}
        <Rise index={9} count={n} position={[1.24, 0, -0.3]} mode="extrude">
          <Bars count={5} maxH={0.06} gap={0.042} color="#B3AEA4" highlight="#BFB9AE" seed={4} />
        </Rise>
        <Rise index={10} count={n} position={[1.22, 0, 0.42]} mode="fold">
          <WordBlock text="REACH  ?" w={0.28} h={0.065} bg="#EDEAE2" fg="rgba(51,53,53,0.55)" />
        </Rise>
      </group>
    );
  }

  /* ------- SCENE 03 — plan, make, spend, learn: one loop ------- */
  if (scene === 2) {
    const labels = ["企画", "制作", "広告", "分析"];
    const n = 8;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, 0]} mode="unroll">
          <Phone h={0.42} palette={palette} kind="post" seed={3} />
        </Rise>
        {LOOP.map(([x, y, z], i) => (
          <Rise key={i} index={1 + i} count={n} position={[x, y, z]} mode="fold">
            <Marker n={i + 1} color={i === 2 ? rust : ink} h={0.05} />
            <WordBlock
              text={labels[i]}
              position={[0, 0.12, 0]}
              w={0.18}
              h={0.06}
              bg="#F2EFE8"
              fg="rgba(51,53,53,0.82)"
              font="mincho"
            />
          </Rise>
        ))}
        {LOOP.map((p, i) => {
          const q = LOOP[(i + 1) % LOOP.length];
          return (
            <Flow
              key={i}
              from={[p[0], p[1] + 0.1, p[2]]}
              to={[q[0], q[1] + 0.1, q[2]]}
              color={i === 2 ? rust : ink}
              packets={2}
              speed={0.24}
              offset={i * 0.25}
              height={0.06}
            />
          );
        })}
        <Rise index={5} count={n} position={[-1.3, 0, -0.4]} mode="extrude">
          <Bars count={5} maxH={0.2} gap={0.045} color={ink} highlight={rust} seed={9} />
        </Rise>
        <Rise index={6} count={n} position={[1.3, 0, -0.42]} mode="unroll">
          <PostCard w={0.15} palette={palette} kind="ad" seed={11} />
        </Rise>
        <Rise index={7} count={n} position={[1.28, 0, 0.62]} mode="unroll">
          <PostCard w={0.13} palette={palette} kind="reel" seed={13} />
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
          { pos: [-0.72, 0, 0.12], rot: 0.22, scale: 1.05, mode: "unroll" },
          { pos: [0.16, 0, -0.3], rot: -0.08, scale: 1.05, mode: "unroll" },
          { pos: [0.98, 0, 0.3], rot: -0.42, scale: 0.95, mode: "unroll" },
        ]}
      />
    );
  }

  /* ------------ SCENE 05 — attention turns into people ------------ */
  const n = 12;
  return (
    <group>
      <Rise index={0} count={n} position={[0, 0, -0.1]} mode="unroll">
        <Phone h={0.6} palette={palette} kind="feed" seed={3} />
      </Rise>
      {[
        [-0.86, 0.62, 0.1],
        [-0.62, 0.26, 0.46],
        [0.66, 0.3, 0.42],
        [0.9, 0.64, 0.06],
        [-1.2, 0.44, -0.34],
        [1.22, 0.48, -0.3],
      ].map(([x, y, z], i) => (
        <Rise key={i} index={1 + i} count={n} position={[x, y, z]} mode="unroll">
          <PostCard
            w={0.16}
            palette={palette}
            kind={i % 3 === 1 ? "reel" : i % 3 === 2 ? "ad" : "post"}
            seed={30 + i}
          />
        </Rise>
      ))}
      <Rise index={7} count={n} position={[0, 0, 0.68]} mode="extrude">
        <Bars count={9} maxH={0.26} gap={0.05} color={ink} highlight={rust} seed={9} />
      </Rise>
      {[-0.5, 0.0, 0.5].map((x, i) => (
        <Rise key={x} index={8 + i} count={n} position={[x, 0, 1.0]} mode="extrude">
          <Person h={0.24} wear={["#6C6E68", "#A8714E", "#7A7F6E"][i]} rotation={Math.PI} seed={40 + i} />
        </Rise>
      ))}
      <Rise index={11} count={n} position={[-1.28, 0, 0.52]} mode="fold">
        <WordBlock text="ACTION" w={0.26} h={0.062} bg="#F1EEE6" fg="rgba(51,53,53,0.8)" />
      </Rise>
    </group>
  );
}
