import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Route } from "../props/base";
import { Monitor, PostCard } from "../props/digital";
import { BizCards, BrandBook, Envelope, Poster, TypeBlock } from "../props/studio";
import { OutputStage, WordBlock, type DioramaProps } from "./shared";

/**
 * BRAND IDENTITY — printed matter as objects. The page moves between a
 * top-down layout view and close detail, the way a designer checks a system.
 */
export function BrandingDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const ink = palette.accent;
  const gold = palette.secondary;

  /* ---------------- SCENE 01 — the volume itself ---------------- */
  if (scene === 0) {
    const n = 6;
    return (
      <group>
        <Rise index={0} count={n} position={[-0.34, 0, 0.05]} mode="fold">
          <BrandBook w={0.42} palette={palette} cover={ink} foil={gold} title="BRAND" seed={3} />
        </Rise>
        <Rise index={1} count={n} position={[0.62, 0, -0.12]} mode="extrude">
          <TypeBlock glyph="編" h={0.26} color={ink} />
        </Rise>
        <Rise index={2} count={n} position={[0.5, 0, 0.44]} mode="fold">
          <BizCards w={0.1} accent={gold} seed={5} />
        </Rise>
        <Rise index={3} count={n} position={[1.15, 0, 0.2]} mode="fold">
          <Envelope w={0.16} accent={gold} rotation={0.3} />
        </Rise>
        <Rise index={4} count={n} position={[-1.15, 0, -0.18]} mode="unroll">
          <Poster h={0.42} palette={palette} kind="poster" title="一貫性が\n信頼をつくる。" seed={7} />
        </Rise>
        <Rise index={5} count={n} position={[-0.9, 0, 0.55]} mode="fold">
          <WordBlock text="ONE BRAND" w={0.3} h={0.06} bg="#F4F2EC" fg="rgba(32,36,36,0.78)" />
        </Rise>
      </group>
    );
  }

  /* ------ SCENE 02 — every department speaks differently ------ */
  if (scene === 1) {
    const tones = ["#B98B5E", "#6E8474", "#9A6F6F", "#7E8494", "#A99160"];
    const n = tones.length + 2;
    return (
      <group>
        {tones.map((c, i) => (
          <Rise
            key={c}
            index={i}
            count={n}
            position={[-1.1 + i * 0.56, ((i * 31) % 4) * 0.02, -0.3 + ((i * 17) % 5) * 0.16]}
            rotation={[0, (((i * 29) % 7) - 3) * 0.16, 0]}
            mode="unroll"
          >
            <Poster
              h={0.3}
              palette={{ ...palette, accent: c, secondary: c }}
              kind={i % 2 ? "card" : "poster"}
              title={["採用", "営業", "広報", "SNS", "会社案内"][i]}
              seed={10 + i}
            />
          </Rise>
        ))}
        <Rise index={n - 2} count={n} position={[-0.6, 0, 0.6]} mode="fold">
          <BizCards w={0.09} color="#EFEAE0" accent="#9A6F6F" seed={5} />
        </Rise>
        <Rise index={n - 1} count={n} position={[0.75, 0, 0.62]} mode="fold">
          <BizCards w={0.09} color="#F1EFE6" accent="#6E8474" seed={9} />
        </Rise>
      </group>
    );
  }

  /* --------- SCENE 03 — one grid, one voice, one accent --------- */
  if (scene === 2) {
    const n = 8;
    return (
      <group>
        <Route
          points={[
            [-1.25, -0.5],
            [1.25, -0.5],
          ]}
          color={ink}
          width={0.004}
        />
        <Route
          points={[
            [-1.25, 0.55],
            [1.25, 0.55],
          ]}
          color={ink}
          width={0.004}
        />
        <Rise index={0} count={n} position={[-1.05, 0, -0.1]} mode="unroll">
          <Poster h={0.44} palette={palette} kind="poster" title="言葉を\nひとつに。" seed={7} />
        </Rise>
        <Rise index={1} count={n} position={[-0.45, 0, -0.1]} mode="unroll">
          <Poster h={0.44} palette={palette} kind="card" title="ANYWARE" seed={8} />
        </Rise>
        <Rise index={2} count={n} position={[0.2, 0, -0.14]} mode="extrude">
          <TypeBlock glyph="A" h={0.3} color={ink} />
        </Rise>
        <Rise index={3} count={n} position={[0.86, 0, -0.12]} mode="unroll">
          <Monitor w={0.44} palette={palette} kind="site" seed={11} />
        </Rise>
        <Rise index={4} count={n} position={[-0.9, 0, 0.36]} mode="fold">
          <BizCards w={0.1} accent={gold} seed={5} />
        </Rise>
        <Rise index={5} count={n} position={[-0.15, 0, 0.38]} mode="fold">
          <Envelope w={0.16} accent={gold} rotation={0.12} />
        </Rise>
        <Rise index={6} count={n} position={[0.55, 0, 0.4]} mode="fold">
          <WordBlock text="TONE" w={0.22} h={0.055} bg="#F4F2EC" fg="rgba(32,36,36,0.75)" />
        </Rise>
        <Rise index={7} count={n} position={[1.15, 0, 0.36]} mode="unroll">
          <PostCard w={0.14} palette={palette} kind="post" seed={13} />
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
          { pos: [-0.85, 0, -0.05], rot: 0.2, scale: 1.0, mode: "unroll" },
          { pos: [0.05, 0, 0.34], rot: -0.05, scale: 0.95, mode: "fold" },
          { pos: [0.88, 0, -0.16], rot: -0.32, scale: 0.95, mode: "unroll" },
        ]}
      />
    );
  }

  /* --------------- SCENE 05 — the standard, open --------------- */
  const n = 8;
  return (
    <group>
      <Rise index={0} count={n} position={[-0.3, 0, 0.1]} mode="fold">
        <BrandBook w={0.46} palette={palette} cover={ink} foil={gold} title="STANDARD" seed={3} />
      </Rise>
      <Rise index={1} count={n} position={[-1.12, 0, -0.2]} mode="unroll">
        <Poster h={0.42} palette={palette} kind="poster" title="一貫性が\n信頼をつくる。" seed={7} />
      </Rise>
      <Rise index={2} count={n} position={[0.76, 0, -0.22]} mode="unroll">
        <Monitor w={0.46} palette={palette} kind="site" seed={11} />
      </Rise>
      <Rise index={3} count={n} position={[0.45, 0, 0.5]} mode="fold">
        <BizCards w={0.1} accent={gold} seed={5} />
      </Rise>
      <Rise index={4} count={n} position={[1.2, 0, 0.32]} mode="fold">
        <Envelope w={0.16} accent={gold} rotation={-0.25} />
      </Rise>
      <Rise index={5} count={n} position={[-0.95, 0, 0.52]} mode="extrude">
        <TypeBlock glyph="信" h={0.24} color={ink} />
      </Rise>
      <Rise index={6} count={n} position={[1.28, 0, -0.5]} mode="unroll">
        <PostCard w={0.14} palette={palette} kind="post" seed={13} />
      </Rise>
      <Rise index={7} count={n} position={[-0.3, 0, 0.66]} mode="fold">
        <WordBlock text="ONE  BRAND" w={0.34} h={0.06} bg="#F4F2EC" fg="rgba(32,36,36,0.8)" />
      </Rise>
    </group>
  );
}
