import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Route } from "../props/base";
import { Bars, CTAButton, Cursor, Laptop, LPScroll, Monitor, Phone, PostCard } from "../props/digital";
import { Marker, OutputStage, WordBlock, type DioramaProps } from "./shared";

/**
 * DIGITAL EXPERIENCE — devices as objects on a page, then the information
 * inside them put in order. The camera pushes all the way into the screen.
 */
export function DigitalDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const ink = palette.accent;
  const teal = palette.secondary;

  /* ---------------- SCENE 01 — the devices ---------------- */
  if (scene === 0) {
    const n = 6;
    return (
      <group>
        <Rise index={0} count={n} position={[-0.3, 0, -0.2]} mode="unroll">
          <Monitor w={0.6} palette={palette} kind="site" seed={3} windowSlice={0.9} scroll={0.18} />
        </Rise>
        <Rise index={1} count={n} position={[0.62, 0, 0.16]} mode="unroll">
          <Laptop w={0.42} palette={palette} kind="dashboard" seed={5} rotation={-0.4} />
        </Rise>
        <Rise index={2} count={n} position={[-0.95, 0, 0.42]} mode="unroll">
          <Phone h={0.3} palette={palette} kind="post" seed={7} />
        </Rise>
        <Rise index={3} count={n} position={[1.2, 0, -0.3]} mode="unroll">
          <LPScroll w={0.24} h={0.52} palette={palette} title="CAMPAIGN" seed={9} />
        </Rise>
        <Rise index={4} count={n} position={[0.1, 0.16, 0.55]} mode="fold" idle="float">
          <Cursor color={ink} size={0.06} />
        </Rise>
        <Rise index={5} count={n} position={[-0.3, 0, 0.58]} mode="flat">
          <Route
            points={[
              [-0.6, 0],
              [0.6, 0],
            ]}
            color={teal}
            width={0.01}
          />
        </Rise>
      </group>
    );
  }

  /* -------- SCENE 02 — everything is there, in no order -------- */
  if (scene === 1) {
    const chips = ["会社概要", "実績", "強み", "沿革", "お知らせ", "採用", "FAQ", "お問い合わせ"];
    const n = chips.length + 2;
    return (
      <group>
        {chips.map((c, i) => {
          const x = -1.15 + (i % 4) * 0.78 + ((i / 4) | 0) * 0.16;
          const z = -0.4 + ((i / 4) | 0) * 0.62;
          return (
            <Rise
              key={c}
              index={i}
              count={n}
              position={[x, ((i * 37) % 5) * 0.035, z]}
              rotation={[0, (((i * 53) % 7) - 3) * 0.09, 0]}
              mode="fold"
            >
              <WordBlock text={c} w={0.32} h={0.07} bg="#EFEFEB" fg="rgba(34,40,40,0.62)" font="mincho" />
            </Rise>
          );
        })}
        <Rise index={n - 2} count={n} position={[0.15, 0.34, 0.2]} mode="fold" idle="float">
          <Cursor color={ink} size={0.07} />
        </Rise>
        <Rise index={n - 1} count={n} position={[1.3, 0, 0.45]} mode="unroll">
          <Phone h={0.26} palette={{ ...palette, accent: "#9FA3A0" }} kind="site" seed={4} />
        </Rise>
      </group>
    );
  }

  /* --------- SCENE 03 — the order people actually read --------- */
  if (scene === 2) {
    const steps = ["知る", "わかる", "比べる", "決める"];
    const n = steps.length + 4;
    const path: [number, number][] = [
      [-1.1, 0.42],
      [-0.4, 0.2],
      [0.35, -0.02],
      [1.05, -0.26],
    ];
    return (
      <group>
        <Route points={path} color={teal} width={0.014} />
        {steps.map((s, i) => (
          <Rise key={s} index={i} count={n} position={[path[i][0], 0, path[i][1]]} mode="fold">
            <Marker n={i + 1} color={teal} h={0.055} />
            <WordBlock
              text={s}
              position={[0, 0.13, 0]}
              w={0.2}
              h={0.06}
              bg="#F3F3EF"
              fg="rgba(34,40,40,0.8)"
              font="mincho"
            />
          </Rise>
        ))}
        <Rise index={4} count={n} position={[-0.6, 0, -0.46]} mode="unroll">
          <Monitor w={0.52} palette={palette} kind="site" seed={3} windowSlice={0.85} scroll={0.22} />
        </Rise>
        <Rise index={5} count={n} position={[0.62, 0, -0.4]} mode="unroll">
          <LPScroll w={0.26} h={0.6} palette={palette} title="SERVICE" seed={9} />
        </Rise>
        <Rise index={6} count={n} position={[1.22, 0.08, 0.34]} mode="unroll">
          <CTAButton label="CONTACT" color={ink} w={0.22} />
        </Rise>
        <Rise index={7} count={n} position={[-1.18, 0, -0.2]} mode="unroll">
          <Phone h={0.28} palette={palette} kind="lp" seed={7} windowSlice={0.5} scroll={0.3} />
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
          { pos: [-0.78, 0, -0.16], rot: 0.24, scale: 1.0, mode: "unroll" },
          { pos: [0.5, 0, -0.26], rot: -0.3, scale: 0.95, mode: "unroll" },
          { pos: [-0.1, 0, 0.46], rot: 0.05, scale: 0.9, mode: "fold" },
        ]}
      />
    );
  }

  /* --------------- SCENE 05 — one path, measured --------------- */
  const n = 7;
  return (
    <group>
      <Rise index={0} count={n} position={[-0.55, 0, -0.28]} mode="unroll">
        <Monitor w={0.58} palette={palette} kind="site" seed={3} windowSlice={0.8} scroll={0.26} />
      </Rise>
      <Rise index={1} count={n} position={[0.55, 0, -0.2]} mode="unroll">
        <LPScroll w={0.26} h={0.62} palette={palette} title="CV" seed={9} />
      </Rise>
      <Rise index={2} count={n} position={[1.2, 0.06, 0.2]} mode="unroll">
        <CTAButton label="ENTRY" color={ink} w={0.22} />
      </Rise>
      <Rise index={3} count={n} position={[-1.2, 0, 0.3]} mode="unroll">
        <Phone h={0.3} palette={palette} kind="lp" seed={7} windowSlice={0.45} scroll={0.34} />
      </Rise>
      <Rise index={4} count={n} position={[-0.1, 0, 0.5]} mode="extrude">
        <Bars count={8} maxH={0.22} gap={0.048} color={teal} highlight={ink} seed={11} />
      </Rise>
      <Rise index={5} count={n} position={[0.62, 0.2, 0.48]} mode="fold" idle="float">
        <Cursor color={ink} size={0.06} />
      </Rise>
      <Rise index={6} count={n} position={[1.3, 0, -0.5]} mode="unroll">
        <PostCard w={0.14} palette={palette} kind="ad" seed={13} />
      </Rise>
      <Route
        points={[
          [-1.2, 0.3],
          [-0.55, -0.05],
          [0.55, 0.0],
          [1.2, 0.2],
        ]}
        color={teal}
        width={0.012}
      />
    </group>
  );
}
