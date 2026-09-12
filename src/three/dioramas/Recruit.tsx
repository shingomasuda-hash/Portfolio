import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Route } from "../props/base";
import { Bars, CTAButton, Flow, LPScroll, Phone, PostCard } from "../props/digital";
import { Machine, Tools } from "../props/studio";
import { Factory, Person, Signboard } from "../props/world";
import { Marker, OutputStage, Plate, WordBlock, type DioramaProps } from "./shared";

/**
 * RECRUIT COMMUNICATION — a workplace and its digital shadow on the same
 * page. The camera walks in from the yard, stops at eye level with a person,
 * and ends on the funnel that brings people back.
 */
export function RecruitDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const steel = palette.accent;
  const orange = palette.secondary;

  /* ---------------- SCENE 01 — the place itself ---------------- */
  if (scene === 0) {
    const n = 9;
    return (
      <group>
        <Plate position={[0, 0.001, -0.1]} size={[2.5, 1.5]} color="#D2D1CA" opacity={0.45} />
        <Rise index={0} count={n} position={[-0.1, 0, -0.5]} mode="extrude">
          <Factory w={1.5} d={0.6} h={0.4} wall="#DCDBD4" roof="#8B9296" seed={3} />
        </Rise>
        <Rise index={1} count={n} position={[-0.62, 0, 0.12]} mode="extrude">
          <Machine w={0.34} h={0.24} accent={orange} seed={5} />
        </Rise>
        <Rise index={2} count={n} position={[0.1, 0, 0.2]} mode="extrude">
          <Machine w={0.3} h={0.2} body="#ADB3B1" accent={steel} rotation={-0.3} seed={7} />
        </Rise>
        <Rise index={3} count={n} position={[-0.2, 0, 0.56]} mode="extrude">
          <Person h={0.4} wear="#5B6A72" gear="helmet" rotation={0.25} seed={9} />
        </Rise>
        <Rise index={4} count={n} position={[0.62, 0, 0.5]} mode="extrude">
          <Person h={0.38} wear="#7C8A8E" gear="helmet" rotation={-0.4} seed={11} />
        </Rise>
        <Rise index={5} count={n} position={[0.98, 0, 0.08]} mode="fold">
          <Tools accent={orange} seed={13} />
        </Rise>
        <Rise index={6} count={n} position={[1.24, 0, -0.3]} mode="fold" idle="tilt">
          <Signboard text="FACTORY" bg={steel} w={0.32} h={0.1} postH={0.26} />
        </Rise>
        <Rise index={7} count={n} position={[-1.24, 0, 0.3]} mode="extrude">
          <Machine w={0.26} h={0.18} body="#C3C7C3" accent={orange} rotation={0.6} seed={15} />
        </Rise>
        <Rise index={8} count={n} position={[0.0, 0, 0.86]} mode="flat">
          <Route
            points={[
              [-1.3, 0],
              [1.3, 0],
            ]}
            color="#A8ADAC"
            width={0.07}
          />
        </Rise>
      </group>
    );
  }

  /* ------- SCENE 02 — a job posting is not a workplace ------- */
  if (scene === 1) {
    const n = 8;
    return (
      <group>
        <Rise index={0} count={n} position={[-0.15, 0, -0.62]} mode="extrude">
          <Factory w={1.1} d={0.4} h={0.28} wall="#D3D2CC" roof="#9DA3A5" seed={3} />
        </Rise>
        {/* the sheet that stands between the company and the person */}
        <Rise index={1} count={n} position={[-0.1, 0, 0.06]} mode="unroll">
          <LPScroll
            w={0.44}
            h={0.5}
            palette={{ ...palette, accent: "#A5A9A6", secondary: "#BFC2BD" }}
            title="求人票"
            seed={4}
          />
        </Rise>
        {["年齢不問", "経験不問", "詳細は面談で"].map((t, i) => (
          <Rise key={t} index={2 + i} count={n} position={[0.62, 0.34 - i * 0.12, 0.16 + i * 0.06]} mode="fold">
            <WordBlock text={t} w={0.28} h={0.06} bg="#E4E3DE" fg="rgba(70,74,76,0.7)" font="mincho" />
          </Rise>
        ))}
        <Rise index={5} count={n} position={[1.2, 0, 0.52]} mode="extrude">
          <Person h={0.4} wear="#8D9295" rotation={2.5} seed={12} />
        </Rise>
        <Rise index={6} count={n} position={[-1.16, 0, 0.42]} mode="extrude">
          <Person h={0.38} wear="#7E8A8E" gear="helmet" rotation={0.5} seed={14} />
        </Rise>
        <Route
          points={[
            [-1.16, 0.42],
            [-0.6, 0.3],
          ]}
          color="#AEB2B0"
          width={0.008}
        />
      </group>
    );
  }

  /* ---- SCENE 03 — the people become the communication ---- */
  if (scene === 2) {
    const n = 8;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, 0.12]} mode="extrude">
          <Person h={0.46} wear="#54636B" gear="helmet" rotation={0.05} seed={9} />
        </Rise>
        <Rise index={1} count={n} position={[-0.78, 0, -0.12]} mode="unroll">
          <LPScroll w={0.28} h={0.66} palette={palette} title="RECRUIT" seed={4} />
        </Rise>
        <Rise index={2} count={n} position={[0.72, 0, -0.06]} mode="unroll">
          <Phone h={0.34} palette={palette} kind="reel" seed={6} />
        </Rise>
        <Rise index={3} count={n} position={[1.2, 0, 0.3]} mode="unroll">
          <PostCard w={0.16} palette={palette} kind="post" seed={8} />
        </Rise>
        <Rise index={4} count={n} position={[-1.2, 0, 0.34]} mode="unroll">
          <PostCard w={0.15} palette={palette} kind="ad" seed={10} />
        </Rise>
        <Rise index={5} count={n} position={[0.32, 0, 0.56]} mode="fold">
          <Tools accent={orange} seed={13} />
        </Rise>
        <Rise index={6} count={n} position={[-0.5, 0, 0.5]} mode="extrude">
          <Machine w={0.24} h={0.16} accent={orange} rotation={0.4} seed={15} />
        </Rise>
        <Rise index={7} count={n} position={[-0.52, 0, -0.62]} mode="fold" idle="tilt">
          <Signboard text="PEOPLE" bg={steel} w={0.3} h={0.09} postH={0.22} />
        </Rise>
        <Flow from={[0, 0.4, 0.12]} to={[-0.78, 0.34, -0.12]} color={steel} packets={2} speed={0.3} />
        <Flow from={[0, 0.4, 0.12]} to={[0.72, 0.3, -0.06]} color={steel} packets={2} speed={0.26} offset={0.3} />
        <Flow from={[0, 0.4, 0.12]} to={[1.2, 0.2, 0.3]} color={orange} packets={1} speed={0.22} offset={0.6} />
        <Flow from={[0, 0.4, 0.12]} to={[-1.2, 0.2, 0.34]} color={orange} packets={1} speed={0.24} offset={0.15} />
      </group>
    );
  }

  /* ------------------- SCENE 04 — the work ------------------- */
  if (scene === 3) {
    return (
      <OutputStage
        project={project}
        palette={palette}
        spots={[
          { pos: [-0.86, 0, -0.1], rot: 0.22, scale: 0.95, mode: "unroll" },
          { pos: [0.1, 0, 0.34], rot: -0.06, scale: 0.92, mode: "unroll" },
          { pos: [0.78, 0, -0.18], rot: -0.34, scale: 0.88, mode: "unroll" },
          { pos: [-0.05, 0, -0.6], rot: 0.04, scale: 1.0, mode: "fold" },
        ]}
      />
    );
  }

  /* --------------- SCENE 05 — a funnel, not a queue --------------- */
  const n = 10;
  const path: [number, number][] = [
    [-1.2, 0.5],
    [-0.5, 0.3],
    [0.2, 0.12],
    [0.86, -0.12],
  ];
  return (
    <group>
      <Route points={path} color={steel} width={0.018} />
      {path.map(([x, z], i) => (
        <Rise key={i} index={i} count={n} position={[x, 0, z + 0.16]} mode="extrude">
          <Marker n={i + 1} color={i === 3 ? orange : steel} h={0.06} />
        </Rise>
      ))}
      <Rise index={0} count={n} position={[-1.2, 0, 0.5]} mode="unroll">
        <PostCard w={0.16} palette={palette} kind="ad" seed={10} />
      </Rise>
      <Rise index={1} count={n} position={[-0.5, 0, 0.3]} mode="unroll">
        <Phone h={0.3} palette={palette} kind="reel" seed={6} />
      </Rise>
      <Rise index={2} count={n} position={[0.2, 0, 0.12]} mode="unroll">
        <LPScroll w={0.26} h={0.6} palette={palette} title="ENTRY" seed={4} />
      </Rise>
      <Rise index={3} count={n} position={[0.86, 0.1, -0.12]} mode="unroll">
        <CTAButton label="ENTRY" color={orange} w={0.2} />
      </Rise>
      <Rise index={4} count={n} position={[0.2, 0, -0.62]} mode="extrude">
        <Factory w={1.0} d={0.36} h={0.26} wall="#DCDBD4" roof="#8B9296" seed={3} />
      </Rise>
      {[0.5, 0.86, 1.2].map((x, i) => (
        <Rise key={x} index={5 + i} count={n} position={[x, 0, 0.42 - i * 0.1]} mode="extrude">
          <Person h={0.34} wear={["#5F6E76", "#7C8A8E", "#8A7C6E"][i]} rotation={-1.9} seed={20 + i} />
        </Rise>
      ))}
      <Rise index={8} count={n} position={[-1.1, 0, -0.32]} mode="extrude">
        <Bars count={6} maxH={0.24} color={steel} highlight={orange} seed={9} />
      </Rise>
      <Rise index={9} count={n} position={[-0.5, 0, -0.58]} mode="fold" idle="tilt">
        <Signboard text="HIRED" bg={steel} w={0.28} h={0.09} postH={0.2} />
      </Rise>
    </group>
  );
}
