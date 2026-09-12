import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Flow, LPScroll, Phone, PostCard } from "../props/digital";
import { Blueprint, CameraProp, Conduit, IDCard, Machine, Rack, Tools } from "../props/studio";
import { Person, Signboard } from "../props/world";
import { OutputStage, Plate, WordBlock, type DioramaProps } from "./shared";

/**
 * HIRING EXPERIENCE — a technical site translated into something a young
 * applicant can picture themselves inside. The jargon is literally a wall,
 * and the page takes it down.
 */
export function EngineeringDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const deep = palette.accent;
  const grey = palette.secondary;

  /* ---------------- SCENE 01 — the technical site ---------------- */
  if (scene === 0) {
    const n = 8;
    return (
      <group>
        <Plate position={[0, 0.001, -0.05]} size={[2.4, 1.4]} color="#CFD2D0" opacity={0.4} />
        <Rise index={0} count={n} position={[-0.6, 0, -0.4]} mode="extrude">
          <Rack w={0.24} h={0.44} accent={deep} seed={3} />
        </Rise>
        <Rise index={1} count={n} position={[-0.22, 0, -0.4]} mode="extrude">
          <Rack w={0.2} h={0.36} body="#AEB6B7" accent={grey} seed={5} />
        </Rise>
        <Rise index={2} count={n} position={[0.3, 0, -0.32]} mode="extrude">
          <Conduit len={0.66} h={0.42} seed={7} />
        </Rise>
        <Rise index={3} count={n} position={[0.9, 0, 0.06]} mode="extrude">
          <Machine w={0.3} h={0.2} body="#B4BABA" accent={deep} rotation={-0.4} seed={9} />
        </Rise>
        <Rise index={4} count={n} position={[-0.1, 0, 0.42]} mode="extrude">
          <Person h={0.44} wear="#46565F" gear="helmet" rotation={0.15} seed={11} />
        </Rise>
        <Rise index={5} count={n} position={[0.42, 0, 0.5]} mode="fold">
          <Tools accent={deep} seed={13} />
        </Rise>
        <Rise index={6} count={n} position={[-0.95, 0, 0.42]} mode="flat">
          <Blueprint w={0.42} palette={palette} rotation={0.2} seed={15} />
        </Rise>
        <Rise index={7} count={n} position={[1.22, 0, -0.4]} mode="fold" idle="tilt">
          <Signboard text="SITE" bg={deep} w={0.26} h={0.09} postH={0.28} />
        </Rise>
      </group>
    );
  }

  /* --------- SCENE 02 — the wall of words in the way --------- */
  if (scene === 1) {
    const words = ["受変電設備", "施工管理", "制御盤", "保全", "電気工事士", "図面"];
    const n = words.length + 3;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, -0.55]} mode="extrude">
          <Person h={0.42} wear="#4E5E67" gear="helmet" rotation={0} seed={11} />
        </Rise>
        <Rise index={1} count={n} position={[0, 0, -0.78]} mode="extrude">
          <Rack w={0.22} h={0.34} accent={deep} seed={3} />
        </Rise>
        {words.map((w, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <Rise
              key={w}
              index={2 + i}
              count={n}
              position={[-0.62 + col * 0.62, row * 0.09, 0.1 - row * 0.12]}
              mode="fold"
            >
              <WordBlock
                text={w}
                w={0.34}
                h={0.075}
                bg="#E7E7E2"
                fg="rgba(56,76,87,0.78)"
                font="mincho"
              />
            </Rise>
          );
        })}
        <Rise index={n - 1} count={n} position={[0.05, 0, 0.68]} mode="extrude">
          <Person h={0.4} wear="#94999A" rotation={Math.PI} seed={17} />
        </Rise>
      </group>
    );
  }

  /* ------ SCENE 03 — translate the site into a story ------ */
  if (scene === 2) {
    const n = 9;
    return (
      <group>
        <Rise index={0} count={n} position={[-0.9, 0, 0.34]} mode="flat">
          <Blueprint w={0.44} palette={palette} rotation={0.12} seed={15} />
        </Rise>
        {["つくる", "まもる", "つづける"].map((t, i) => (
          <Rise key={t} index={1 + i} count={n} position={[-0.95 + i * 0.02, 0.16 + i * 0.1, 0.34]} mode="fold">
            <WordBlock text={t} w={0.24} h={0.07} bg="#F2F1EC" fg={`rgba(56,76,87,0.85)`} font="mincho" />
          </Rise>
        ))}
        <Rise index={4} count={n} position={[0.1, 0, 0.1]} mode="extrude">
          <Person h={0.46} wear="#46565F" gear="helmet" rotation={0.1} seed={11} />
        </Rise>
        <Rise index={5} count={n} position={[0.56, 0, 0.44]} mode="fold">
          <CameraProp w={0.1} accent={deep} rotation={-2.4} />
        </Rise>
        <Rise index={6} count={n} position={[0.92, 0, -0.1]} mode="unroll">
          <LPScroll w={0.26} h={0.58} palette={palette} title="ENGINEER" seed={4} />
        </Rise>
        <Rise index={7} count={n} position={[1.26, 0.42, 0.3]} mode="unroll">
          <IDCard w={0.08} accent={deep} />
        </Rise>
        <Rise index={8} count={n} position={[-0.34, 0, -0.5]} mode="extrude">
          <Rack w={0.2} h={0.32} accent={deep} seed={3} />
        </Rise>
        <Flow from={[-0.9, 0.1, 0.34]} to={[0.1, 0.4, 0.1]} color={deep} packets={2} speed={0.26} />
        <Flow from={[0.1, 0.4, 0.1]} to={[0.92, 0.4, -0.1]} color={deep} packets={2} speed={0.3} offset={0.4} />
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
          { pos: [-0.82, 0, 0.1], rot: 0.24, scale: 0.95, mode: "fold" },
          { pos: [0.12, 0, 0.38], rot: -0.1, scale: 0.95, mode: "unroll" },
          { pos: [0.82, 0, -0.2], rot: -0.36, scale: 0.95, mode: "unroll" },
        ]}
      />
    );
  }

  /* ------------- SCENE 05 — it can be pictured now ------------- */
  const n = 9;
  return (
    <group>
      <Rise index={0} count={n} position={[-0.75, 0, -0.3]} mode="extrude">
        <Rack w={0.24} h={0.42} accent={deep} seed={3} />
      </Rise>
      <Rise index={1} count={n} position={[-0.36, 0, -0.32]} mode="extrude">
        <Conduit len={0.6} h={0.4} seed={7} />
      </Rise>
      <Rise index={2} count={n} position={[0.28, 0, -0.3]} mode="extrude">
        <Machine w={0.3} h={0.2} body="#B4BABA" accent={deep} rotation={0.2} seed={9} />
      </Rise>
      <Rise index={3} count={n} position={[-0.15, 0, 0.3]} mode="extrude">
        <Person h={0.46} wear="#46565F" gear="helmet" rotation={0.1} seed={11} />
      </Rise>
      <Rise index={4} count={n} position={[0.34, 0, 0.36]} mode="extrude">
        <Person h={0.42} wear="#7E898C" rotation={-0.3} seed={19} />
      </Rise>
      <Rise index={5} count={n} position={[0.95, 0, 0.16]} mode="unroll">
        <LPScroll w={0.24} h={0.54} palette={palette} title="CAREER" seed={4} />
      </Rise>
      <Rise index={6} count={n} position={[1.3, 0, -0.22]} mode="unroll">
        <Phone h={0.28} palette={palette} kind="reel" seed={6} />
      </Rise>
      <Rise index={7} count={n} position={[-1.22, 0, 0.3]} mode="unroll">
        <PostCard w={0.15} palette={palette} kind="post" seed={8} />
      </Rise>
      <Rise index={8} count={n} position={[-0.95, 0, 0.62]} mode="flat">
        <Blueprint w={0.36} palette={palette} rotation={-0.15} seed={15} />
      </Rise>
    </group>
  );
}
