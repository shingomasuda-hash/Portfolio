import { useScene } from "../palette";
import { Rise } from "../Rise";
import {
  AICore,
  Bars,
  Database,
  Flow,
  Laptop,
  MailStack,
  Monitor,
  NodeBlock,
} from "../props/digital";
import { Person } from "../props/world";
import { OutputStage, Plate, WordBlock, type DioramaProps } from "./shared";

const CHAIN: [number, number, number][] = [
  [-1.12, 0, 0.3],
  [-0.56, 0, -0.06],
  [0.56, 0, -0.06],
  [1.12, 0, 0.3],
];

/**
 * AI / AUTOMATION — never a glowing orb. Work arrives as real objects (mail,
 * files, records), passes through machined steps connected by physical links,
 * and comes out the other side. The camera flies through the chain.
 */
export function AIDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const deep = palette.accent;
  const sage = palette.secondary;

  /* ------------- SCENE 01 — the work as it arrives ------------- */
  if (scene === 0) {
    const n = 7;
    return (
      <group>
        <Plate position={[0, 0.001, 0]} size={[2.3, 1.4]} color="#D3D6D2" opacity={0.4} />
        <Rise index={0} count={n} position={[-0.3, 0, 0.1]} mode="unroll">
          <Laptop w={0.44} palette={palette} kind="doc" seed={3} rotation={0.12} />
        </Rise>
        <Rise index={1} count={n} position={[0.52, 0, 0.3]} mode="flat">
          <MailStack count={4} w={0.13} accent={sage} rotation={0.3} />
        </Rise>
        <Rise index={2} count={n} position={[0.98, 0, -0.16]} mode="extrude">
          <Database r={0.07} layers={3} accent={sage} />
        </Rise>
        <Rise index={3} count={n} position={[-1.06, 0, -0.2]} mode="flat">
          <MailStack count={3} w={0.12} accent={deep} rotation={-0.2} />
        </Rise>
        <Rise index={4} count={n} position={[-0.6, 0, 0.62]} mode="extrude">
          <Person h={0.36} wear="#5D6F72" rotation={0.3} seed={9} />
        </Rise>
        <Rise index={5} count={n} position={[0.16, 0, -0.5]} mode="fold">
          <WordBlock text="MANUAL" w={0.26} h={0.06} bg="#EDEFEB" fg="rgba(38,53,56,0.7)" />
        </Rise>
        <Rise index={6} count={n} position={[1.3, 0, 0.42]} mode="flat">
          <MailStack count={3} w={0.11} accent={sage} rotation={0.5} />
        </Rise>
      </group>
    );
  }

  /* ---------- SCENE 02 — the same task, again and again ---------- */
  if (scene === 1) {
    const n = 12;
    return (
      <group>
        {Array.from({ length: 8 }).map((_, i) => (
          <Rise
            key={i}
            index={i}
            count={n}
            position={[-1.2 + (i % 4) * 0.8, 0, -0.34 + ((i / 4) | 0) * 0.6]}
            mode="flat"
          >
            <MailStack count={3 + (i % 2)} w={0.12} accent={i % 3 ? sage : deep} rotation={i * 0.4} />
          </Rise>
        ))}
        <Rise index={8} count={n} position={[0, 0, 0.78]} mode="extrude">
          <Person h={0.36} wear="#5D6F72" rotation={Math.PI} seed={9} />
        </Rise>
        <Rise index={9} count={n} position={[-0.62, 0, 0.78]} mode="fold">
          <WordBlock text="毎日" w={0.18} h={0.055} bg="#EDEFEB" fg="rgba(38,53,56,0.7)" font="mincho" />
        </Rise>
        <Rise index={10} count={n} position={[0.62, 0, 0.78]} mode="fold">
          <WordBlock text="同じ手順" w={0.24} h={0.055} bg="#EDEFEB" fg="rgba(38,53,56,0.7)" font="mincho" />
        </Rise>
        <Rise index={11} count={n} position={[1.3, 0, 0.78]} mode="extrude">
          <Bars count={4} maxH={0.2} gap={0.044} color="#A8B0AE" highlight="#B6BCBA" seed={5} />
        </Rise>
      </group>
    );
  }

  /* ------ SCENE 03 — a chain: what a person keeps, what does not ------ */
  if (scene === 2) {
    const labels = ["INPUT", "AI", "CHECK", "SAVE"];
    const n = 9;
    return (
      <group>
        {CHAIN.map(([x, , z], i) => (
          <Rise key={i} index={i} count={n} position={[x, 0, z]} mode="extrude">
            {i === 1 ? (
              <AICore size={0.15} accent={deep} />
            ) : (
              <NodeBlock label={labels[i]} w={0.2} h={0.12} accent={i === 2 ? sage : deep} seed={3 + i} />
            )}
          </Rise>
        ))}
        {CHAIN.slice(0, -1).map((p, i) => (
          <Flow
            key={i}
            from={[p[0], 0.1, p[2]]}
            to={[CHAIN[i + 1][0], 0.1, CHAIN[i + 1][2]]}
            color={deep}
            packets={2}
            speed={0.3}
            offset={i * 0.2}
          />
        ))}
        <Rise index={4} count={n} position={[0.0, 0, 0.66]} mode="extrude">
          <Person h={0.36} wear="#5D6F72" rotation={Math.PI} seed={9} />
        </Rise>
        <Rise index={5} count={n} position={[0.56, 0, 0.66]} mode="fold">
          <WordBlock text="人が判断" w={0.24} h={0.055} bg="#EFF1ED" fg="rgba(38,53,56,0.78)" font="mincho" />
        </Rise>
        <Rise index={6} count={n} position={[-0.6, 0, 0.66]} mode="fold">
          <WordBlock text="AIが処理" w={0.24} h={0.055} bg="#EFF1ED" fg="rgba(38,53,56,0.78)" font="mincho" />
        </Rise>
        <Rise index={7} count={n} position={[1.2, 0, -0.52]} mode="extrude">
          <Database r={0.065} layers={3} accent={sage} />
        </Rise>
        <Rise index={8} count={n} position={[-1.2, 0, -0.5]} mode="flat">
          <MailStack count={3} w={0.12} accent={sage} rotation={0.2} />
        </Rise>
        <Flow from={[0.56, 0.1, -0.06]} to={[1.2, 0.14, -0.52]} color={sage} packets={1} speed={0.22} offset={0.5} />
        <Flow from={[-1.2, 0.05, -0.5]} to={[-1.12, 0.1, 0.3]} color={sage} packets={1} speed={0.2} />
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
          { pos: [-0.88, 0, 0.16], rot: 0.3, scale: 0.95, mode: "unroll" },
          { pos: [0.0, 0, -0.34], rot: -0.04, scale: 0.95, mode: "unroll" },
          { pos: [0.9, 0, 0.2], rot: -0.36, scale: 1.0, mode: "unroll" },
        ]}
      />
    );
  }

  /* ------------ SCENE 05 — it runs whether you watch or not ------------ */
  const n = 11;
  return (
    <group>
      <Rise index={0} count={n} position={[0, 0, -0.05]} mode="extrude">
        <AICore size={0.17} accent={deep} />
      </Rise>
      {[
        [-0.85, 0.35],
        [0.85, 0.35],
        [-0.85, -0.4],
        [0.85, -0.4],
      ].map(([x, z], i) => (
        <Rise key={i} index={1 + i} count={n} position={[x, 0, z]} mode="extrude">
          <NodeBlock
            label={["INTAKE", "DRAFT", "RECORD", "REPORT"][i]}
            w={0.19}
            h={0.11}
            accent={i % 2 ? sage : deep}
            seed={5 + i}
          />
        </Rise>
      ))}
      {[
        [-0.85, 0.35],
        [0.85, 0.35],
        [-0.85, -0.4],
        [0.85, -0.4],
      ].map(([x, z], i) => (
        <Flow
          key={`f${i}`}
          from={[0, 0.16, -0.05]}
          to={[x, 0.11, z]}
          color={i % 2 ? sage : deep}
          packets={2}
          speed={0.26}
          offset={i * 0.22}
          height={0.05}
        />
      ))}
      <Rise index={5} count={n} position={[1.3, 0, 0.0]} mode="extrude">
        <Database r={0.07} layers={4} accent={sage} />
      </Rise>
      <Rise index={6} count={n} position={[-1.3, 0, 0.0]} mode="flat">
        <MailStack count={3} w={0.12} accent={deep} rotation={0.1} />
      </Rise>
      <Rise index={7} count={n} position={[0, 0, 0.72]} mode="unroll">
        <Monitor w={0.46} palette={palette} kind="dashboard" seed={11} />
      </Rise>
      <Rise index={8} count={n} position={[-0.66, 0, 0.76]} mode="extrude">
        <Bars count={6} maxH={0.2} gap={0.044} color={sage} highlight={deep} seed={13} />
      </Rise>
      <Rise index={9} count={n} position={[0.72, 0, 0.78]} mode="extrude">
        <Person h={0.34} wear="#5D6F72" rotation={Math.PI - 0.3} seed={9} />
      </Rise>
      <Rise index={10} count={n} position={[1.24, 0, -0.62]} mode="fold">
        <WordBlock text="LESS  MANUAL" w={0.32} h={0.058} bg="#EFF1ED" fg="rgba(38,53,56,0.78)" />
      </Rise>
    </group>
  );
}
