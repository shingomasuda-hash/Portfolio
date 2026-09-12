import { useScene } from "../palette";
import { Rise } from "../Rise";
import { Route } from "../props/base";
import { House, Person, Shop, Signboard, Stall, Terrain, Tree } from "../props/world";
import { Monitor, PostCard } from "../props/digital";
import { Poster } from "../props/studio";
import { OutputStage, type DioramaProps } from "./shared";

const RING: [number, number][] = [
  [-1.15, 0.45],
  [-0.55, 0.18],
  [0.05, 0.42],
  [0.7, 0.12],
  [1.15, -0.25],
];

/**
 * LOCAL CREATION — the land first, then what is already standing on it, then
 * the connections that turn scattered assets into one place people travel to.
 * The camera starts directly above and walks down into the street.
 */
export function LocalDiorama({ scene }: DioramaProps) {
  const { palette, project } = useScene();
  const green = palette.accent;
  const clay = palette.secondary;

  /* ------------- SCENE 01 — only the ground, so far ------------- */
  if (scene === 0) {
    const n = 7;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, 0]} mode="extrude">
          <Terrain size={[2.6, 1.7]} layers={4} color="#C9C4A9" edge="#D6D2B9" seed={2} />
        </Rise>
        {[
          [-0.9, -0.3],
          [-0.2, 0.35],
          [0.55, -0.45],
          [1.05, 0.3],
          [0.1, -0.1],
        ].map(([x, z], i) => (
          <Rise key={i} index={1 + i} count={n} position={[x, 0.1, z]} mode="extrude">
            <Tree h={0.26 + (i % 3) * 0.06} leaf={green} seed={5 + i} />
          </Rise>
        ))}
        <Rise index={6} count={n} position={[-1.25, 0.1, 0.5]} mode="fold" idle="tilt">
          <Signboard text="LOCAL" bg={green} w={0.28} h={0.09} postH={0.18} />
        </Rise>
      </group>
    );
  }

  /* ------ SCENE 02 — good things, none of them connected ------ */
  if (scene === 1) {
    const n = 9;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, 0]} mode="extrude">
          <Terrain size={[2.6, 1.7]} layers={3} color="#C9C4A9" edge="#D6D2B9" seed={2} />
        </Rise>
        <Rise index={1} count={n} position={[-1.0, 0.08, 0.42]} mode="extrude">
          <Shop w={0.34} d={0.24} h={0.24} wall="#E7E1D0" awning={clay} sign="" seed={4} />
        </Rise>
        <Rise index={2} count={n} position={[-0.15, 0.08, -0.42]} mode="extrude">
          <House w={0.26} d={0.24} h={0.24} wall="#E2DCCB" roof="#9E8A6E" seed={6} />
        </Rise>
        <Rise index={3} count={n} position={[0.82, 0.08, 0.4]} mode="extrude">
          <Stall w={0.3} d={0.22} canopy={clay} seed={8} />
        </Rise>
        <Rise index={4} count={n} position={[1.2, 0.08, -0.35]} mode="extrude">
          <House w={0.22} d={0.2} h={0.2} wall="#DFD9C8" roof="#8E9578" roofKind="hip" seed={10} />
        </Rise>
        <Rise index={5} count={n} position={[0.2, 0.08, 0.5]} mode="extrude">
          <Tree h={0.3} leaf={green} seed={12} />
        </Rise>
        <Rise index={6} count={n} position={[-0.6, 0.08, 0.05]} mode="extrude">
          <Person h={0.22} wear="#9A9585" rotation={2.2} seed={14} />
        </Rise>
        <Rise index={7} count={n} position={[0.5, 0.08, -0.05]} mode="extrude">
          <Person h={0.22} wear="#8E9279" rotation={-1.0} seed={16} />
        </Rise>
        <Rise index={8} count={n} position={[-1.28, 0.08, -0.3]} mode="extrude">
          <Tree h={0.24} leaf="#7C8768" seed={18} />
        </Rise>
      </group>
    );
  }

  /* --------- SCENE 03 — roads, people, one story --------- */
  if (scene === 2) {
    const n = 14;
    return (
      <group>
        <Rise index={0} count={n} position={[0, 0, 0]} mode="extrude">
          <Terrain size={[2.6, 1.7]} layers={3} color="#C9C4A9" edge="#D6D2B9" seed={2} />
        </Rise>
        <group position={[0, 0.086, 0]}>
          <Route points={RING} color={clay} width={0.04} />
          <Route
            points={[
              [-0.55, 0.18],
              [-0.35, -0.42],
            ]}
            color={clay}
            width={0.028}
          />
        </group>
        {RING.map(([x, z], i) => (
          <Rise key={i} index={1 + i} count={n} position={[x, 0.086, z - 0.22]} mode="extrude">
            {i % 2 === 0 ? (
              <Shop w={0.3} d={0.22} h={0.22} wall="#E9E3D2" awning={i ? clay : green} sign="" seed={4 + i} />
            ) : (
              <Stall w={0.28} d={0.2} canopy={i === 1 ? green : clay} seed={9 + i} />
            )}
          </Rise>
        ))}
        {[
          [-0.35, -0.42],
          [0.4, -0.5],
          [-0.9, -0.1],
        ].map(([x, z], i) => (
          <Rise key={`h${i}`} index={6 + i} count={n} position={[x, 0.086, z]} mode="extrude">
            <House
              w={0.24}
              d={0.22}
              h={0.22}
              wall="#E3DDCC"
              roof={i ? "#9E8A6E" : "#7F8B6B"}
              roofKind={i === 1 ? "hip" : "gable"}
              rotation={i * 0.5}
              seed={20 + i}
            />
          </Rise>
        ))}
        {[
          [-0.8, 0.35],
          [-0.1, 0.3],
          [0.55, 0.26],
          [1.0, -0.1],
        ].map(([x, z], i) => (
          <Rise key={`p${i}`} index={9 + i} count={n} position={[x, 0.086, z]} mode="extrude">
            <Person
              h={0.2}
              wear={["#6E7A5C", "#A2714E", "#7E8A8E", "#8B7A63"][i]}
              rotation={i * 1.3}
              seed={26 + i}
            />
          </Rise>
        ))}
        <Rise index={13} count={n} position={[1.28, 0.086, 0.5]} mode="fold" idle="tilt">
          <Signboard text="MARKET" bg={green} w={0.28} h={0.09} postH={0.16} />
        </Rise>
      </group>
    );
  }

  /* --------------------- SCENE 04 — the work --------------------- */
  if (scene === 3) {
    return (
      <OutputStage
        project={project}
        palette={palette}
        spots={[
          { pos: [-0.9, 0, 0.14], rot: 0.3, scale: 0.95, mode: "unroll" },
          { pos: [0.1, 0, -0.3], rot: -0.05, scale: 0.9, mode: "unroll" },
          { pos: [0.92, 0, 0.34], rot: -0.4, scale: 0.95, mode: "unroll" },
        ]}
      />
    );
  }

  /* ---------------- SCENE 05 — a place with a flow ---------------- */
  const n = 15;
  return (
    <group>
      <Rise index={0} count={n} position={[0, 0, 0]} mode="extrude">
        <Terrain size={[2.7, 1.8]} layers={4} color="#C6C2A6" edge="#D4D0B6" seed={2} />
      </Rise>
      <group position={[0, 0.114, 0]}>
        <Route points={RING} color={clay} width={0.045} />
        <Route
          points={[
            [-0.55, 0.18],
            [-0.3, -0.45],
            [0.45, -0.52],
          ]}
          color={clay}
          width={0.03}
        />
      </group>
      {RING.map(([x, z], i) => (
        <Rise key={i} index={1 + i} count={n} position={[x, 0.114, z - 0.24]} mode="extrude">
          {i % 2 === 0 ? (
            <Shop w={0.32} d={0.24} h={0.24} wall="#EAE4D3" awning={i ? clay : green} sign="" seed={4 + i} />
          ) : (
            <Stall w={0.3} d={0.22} canopy={i === 1 ? green : clay} seed={9 + i} />
          )}
        </Rise>
      ))}
      {[
        [-0.3, -0.45],
        [0.45, -0.52],
        [-1.0, -0.2],
        [1.2, 0.42],
      ].map(([x, z], i) => (
        <Rise key={`h${i}`} index={6 + i} count={n} position={[x, 0.114, z]} mode="extrude">
          <House
            w={0.24}
            d={0.22}
            h={0.2 + (i % 2) * 0.06}
            wall="#E5DFCE"
            roof={i % 2 ? "#9E8A6E" : "#7F8B6B"}
            roofKind={i === 2 ? "hip" : "gable"}
            rotation={i * 0.6}
            seed={30 + i}
          />
        </Rise>
      ))}
      {[
        [-0.85, 0.3],
        [-0.2, 0.26],
        [0.3, 0.36],
        [0.85, 0.02],
        [1.05, 0.3],
      ].map(([x, z], i) => (
        <Rise key={`p${i}`} index={10 + i} count={n} position={[x, 0.114, z]} mode="extrude">
          <Person
            h={0.21}
            wear={["#6E7A5C", "#A2714E", "#7E8A8E", "#8B7A63", "#5F6B55"][i]}
            rotation={i * 1.1}
            seed={40 + i}
          />
        </Rise>
      ))}
      {[
        [-1.2, 0.5],
        [0.9, -0.4],
      ].map(([x, z], i) => (
        <Rise key={`t${i}`} index={13} count={n} position={[x, 0.114, z]} mode="extrude">
          <Tree h={0.28} leaf={green} seed={50 + i} />
        </Rise>
      ))}
      <Rise index={14} count={n} position={[-1.3, 0.55, 0.1]} mode="unroll">
        <PostCard w={0.15} palette={palette} kind="map" seed={7} />
      </Rise>
      <Rise index={14} count={n} position={[1.32, 0.1, -0.5]} mode="unroll">
        <Poster h={0.3} palette={palette} kind="poster" title="地域を\n編集する。" seed={11} />
      </Rise>
      <Rise index={14} count={n} position={[0.0, 0.114, 0.72]} mode="unroll">
        <Monitor w={0.36} palette={palette} kind="site" seed={9} />
      </Rise>
    </group>
  );
}
