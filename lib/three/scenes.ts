import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  C,
  makeVehicle,
  makeDrone,
  makeRobot,
  makeHub,
  makeTower,
  makeTree,
  makeShelf,
  makeConveyor,
  makeGantry,
  makeLamp,
  makeCrate,
  makeParcel,
  makeGround,
  makeRoad,
  blobShadow,
  box,
  mat,
  mulberry,
} from "./models";

export type SceneKit = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** per-frame update (t in seconds) */
  update?: (t: number, pointer: { x: number; y: number }) => void;
  /** layered groups for parallax */
  layers?: { far: THREE.Group; mid: THREE.Group; near: THREE.Group };
  /** anchors for HTML callouts, world space */
  anchors?: Record<string, THREE.Object3D>;
};

export function setupRenderer(renderer: THREE.WebGLRenderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
}

export function applyEnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer, intensity = 0.55) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = intensity;
  pmrem.dispose();
}

type Rig = { sun: THREE.DirectionalLight; hemi: THREE.HemisphereLight };
export function lightRig(
  scene: THREE.Scene,
  o: {
    warm?: number;
    sunI?: number;
    hemiI?: number;
    sky?: number;
    ground?: number;
    pos?: [number, number, number];
    span?: number;
    mapSize?: number;
    sunColor?: number;
  } = {},
): Rig {
  const hemi = new THREE.HemisphereLight(o.sky ?? 0xffffff, o.ground ?? 0xdfe3dc, o.hemiI ?? 1.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(o.sunColor ?? 0xfff6e8, o.sunI ?? 2.6);
  const p = o.pos ?? [8, 12, 9];
  sun.position.set(...p);
  sun.castShadow = true;
  const s = o.span ?? 16;
  sun.shadow.camera.left = -s;
  sun.shadow.camera.right = s;
  sun.shadow.camera.top = s;
  sun.shadow.camera.bottom = -s;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  sun.shadow.mapSize.set(o.mapSize ?? 2048, o.mapSize ?? 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 5;
  scene.add(sun);
  return { sun, hemi };
}

/* ======================= HERO (live) ======================= */
export function buildHero(opts: { mobile: boolean; mapSize: number }): SceneKit {
  const scene = new THREE.Scene();
  const bg = new THREE.Color(C.paper);
  scene.background = bg;
  scene.fog = new THREE.Fog(C.paper, 48, 120);

  const camera = new THREE.PerspectiveCamera(opts.mobile ? 40 : 26, 1, 0.1, 160);

  lightRig(scene, { mapSize: opts.mapSize, span: 20, pos: [10, 9, 11], sunI: 3.2, hemiI: 0.5 });

  const far = new THREE.Group();
  const mid = new THREE.Group();
  const near = new THREE.Group();
  scene.add(far, mid, near);

  const ground = makeGround(220, 0xc4c9c1);
  scene.add(ground);

  // ---- far: architecture & hub (kept calm and low-contrast: it is the stage, not the subject)
  const hub = makeHub(15, 3.6, 5.6);
  hub.position.set(7, 0, -12);
  far.add(hub);
  const towers: Array<[number, number, number, number, number, boolean]> = [
    [-14, -20, 3.2, 12, 3.4, false],
    [-8.5, -26, 3.6, 17, 3.4, true],
    [-2, -22, 3.0, 9, 3.0, false],
    [13, -19, 3.2, 11, 3.2, true],
    [18, -24, 3.8, 19, 3.6, false],
    [24, -17, 3.0, 8, 3.0, false],
    [8, -29, 3.4, 15, 3.4, true],
  ];
  for (const [x, z, w, h, d, glass] of towers) {
    const t = makeTower(w, h, d, { glass });
    t.position.set(x, 0, z);
    far.add(t);
  }
  // elevated guideway running behind the hub: slab on slim columns
  const guide = new THREE.Group();
  const slab = box(60, 0.22, 1.3, mat.matte(C.concreteDark, 0.7), 0);
  slab.position.set(0, 7.2, 0);
  guide.add(slab);
  for (let i = -12; i <= 12; i++) {
    const col = box(0.3, 7.1, 0.3, mat.matte(C.white, 0.6), 0.02, 1);
    col.position.set(i * 2.5, 3.55, 0);
    guide.add(col);
  }
  const rail = box(60, 0.05, 0.05, mat.glow(C.lime, 0.9), 0, 1);
  rail.position.set(0, 7.36, 0.6);
  guide.add(rail);
  guide.position.set(2, 0, -16);
  far.add(guide);
  // ground the stage: darken matte architecture so the machines read against it
  far.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (m && "color" in m && !(m.emissiveIntensity > 0)) m.color.multiplyScalar(0.7);
  });

  // lamp posts along the road (mid)
  for (const x of [-6, 1, 8, 15]) {
    const l = makeLamp(3.4);
    l.position.set(x, 0, -3.1);
    mid.add(l);
  }

  // ---- mid: road & vehicle
  const road = makeRoad(70, 5.2, false);
  road.position.set(0, 0, 0.4);
  mid.add(road);
  const vehicle = makeVehicle();
  vehicle.position.set(2.2, 0, 0.6);
  vehicle.rotation.y = -0.22;
  vehicle.scale.setScalar(1.04);
  mid.add(vehicle);
  // extra parcel stacks near hub for depth
  const crate = makeCrate(1, 0.6, 0.7);
  crate.position.set(-1.5, 0.3, -5.6);
  mid.add(crate);
  const crate2 = makeCrate(0.9, 0.5, 0.6);
  crate2.position.set(-0.3, 0.25, -5.8);
  crate2.rotation.y = 0.3;
  mid.add(crate2);

  // ---- near: robot on the pavement (lower right of the headline column)
  const pavement = box(70, 0.1, 3.4, mat.matte(C.concrete, 0.9), 0);
  pavement.position.set(0, 0.05, 6.1);
  pavement.castShadow = false;
  mid.add(pavement);
  const robot = makeRobot();
  robot.position.set(opts.mobile ? 0.4 : 0.6, 0.1, 6.4);
  robot.rotation.y = 0.35;
  robot.scale.setScalar(1.15);
  near.add(robot);
  const t1 = makeTree(2.6, 1);
  t1.position.set(-6.5, 0.1, 6.4);
  near.add(t1);
  const t2 = makeTree(2.1, 2);
  t2.position.set(-4.4, 0.1, 6.8);
  near.add(t2);
  const t3 = makeTree(2.4, 1);
  t3.position.set(14.5, 0.1, 6.4);
  near.add(t3);

  // ---- drone
  const drone = makeDrone();
  drone.scale.setScalar(1.35);
  const droneBase = new THREE.Vector3(opts.mobile ? 0.5 : 0.2, 5.6, 1.0);
  drone.position.copy(droneBase);
  near.add(drone);

  const anchors = {
    vehicle: new THREE.Object3D(),
    drone: new THREE.Object3D(),
    robot: new THREE.Object3D(),
  };
  vehicle.add(anchors.vehicle);
  anchors.vehicle.position.set(0.4, 2.2, 0);
  drone.add(anchors.drone);
  anchors.drone.position.set(0, 0.4, 0);
  robot.add(anchors.robot);
  anchors.robot.position.set(0.1, 1.3, 0);

  const base = {
    cam: new THREE.Vector3(opts.mobile ? 3.4 : 4.0, opts.mobile ? 4.4 : 4.2, opts.mobile ? 20 : 26),
    look: new THREE.Vector3(opts.mobile ? 1.4 : -0.4, opts.mobile ? 2.3 : 2.3, 1.5),
  };

  const update = (t: number, p: { x: number; y: number }) => {
    // drone: one flight in that settles into a hover (no constant drifting); rotors spin
    const k = Math.min(1, Math.max(0, (t - 0.3) / 3.6));
    const settle = Math.pow(1 - k, 3); // 1 -> 0, exponential ease-out
    drone.position.set(droneBase.x - 7 * settle, droneBase.y + 2.2 * settle, droneBase.z - 3 * settle);
    drone.rotation.z = -0.16 * settle;
    drone.rotation.y = 0.5 * settle;
    for (const r of drone.userData.rotors as THREE.Object3D[]) r.rotation.y = t * 38;
    // lidar: a single slow scan pulse after load, then steady
    const ring = vehicle.userData.lidar as THREE.Mesh;
    (ring.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.6 + Math.max(0, Math.sin(Math.min(t, 6) * 1.6)) * 0.4;
    // parallax: layers drift against the camera at different depths
    const px = p.x;
    const py = p.y;
    far.position.x = -px * 0.2;
    mid.position.x = -px * 0.55;
    near.position.x = -px * 1.0;
    far.position.y = py * 0.05;
    camera.position.set(base.cam.x + px * 0.5, base.cam.y + py * 0.25, base.cam.z);
    camera.lookAt(base.look);
  };

  return { scene, camera, update, layers: { far, mid, near }, anchors };
}

/* ======================= STILL SCENES ======================= */
type StillName =
  | "warehouse"
  | "drone"
  | "robot"
  | "vehicle"
  | "machines"
  | "retail"
  | "health"
  | "food"
  | "enterprise"
  | "city"
  | "green"
  | "dusk"
  | "cta";

function camAt(fov: number, pos: [number, number, number], look: [number, number, number]) {
  const c = new THREE.PerspectiveCamera(fov, 1, 0.1, 160);
  c.position.set(...pos);
  c.lookAt(...look);
  return c;
}

function dayScene(fogNear = 22, fogFar = 60, bg: number = C.paper) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  scene.fog = new THREE.Fog(bg, fogNear, fogFar);
  scene.add(makeGround(160, C.ground));
  return scene;
}

function nightScene(fogNear = 18, fogFar = 55) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.night);
  scene.fog = new THREE.Fog(C.night, fogNear, fogFar);
  const g = makeGround(160, 0x171d20);
  scene.add(g);
  return scene;
}

function city(scene: THREE.Scene, seed: number, z0 = -12, spread = 30, dark = false) {
  const rnd = mulberry(seed);
  for (let i = 0; i < 12; i++) {
    const w = 2.4 + rnd() * 2.2;
    const h = 5 + rnd() * 12;
    const t = makeTower(w, h, 2.6 + rnd() * 1.6, { glass: dark ? rnd() > 0.35 : rnd() > 0.6 });
    t.position.set(-spread / 2 + (i / 11) * spread + (rnd() - 0.5) * 1.5, 0, z0 - rnd() * 8);
    scene.add(t);
  }
}

export function buildStill(name: StillName, renderer: THREE.WebGLRenderer): SceneKit {
  const dark = name === "dusk" || name === "cta";
  let kit: SceneKit;
  switch (name) {
    case "warehouse": {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xe9ece7);
      scene.fog = new THREE.Fog(0xe9ece7, 20, 46);
      const floor = makeGround(80, 0xd9ddd7);
      scene.add(floor);
      lightRig(scene, { pos: [-5, 14, 8], sunI: 2.2, hemiI: 1.3, span: 16 });
      for (let i = 0; i < 4; i++) {
        const s = makeShelf(11, 4, i + 2);
        s.position.set(-1, 0, -7 + i * 3.6 - (i > 1 ? 0 : 0));
        if (i === 3) s.position.set(-1, 0, 5.2);
        scene.add(s);
      }
      const conv = makeConveyor(12, 4);
      conv.position.set(-0.5, 0, 1.8);
      scene.add(conv);
      const gantry = makeGantry(1.8, 2.0);
      gantry.position.set(1.5, 0.82, 1.8);
      scene.add(gantry);
      const robot = makeRobot();
      robot.position.set(-4.5, 0, 3.4);
      robot.rotation.y = 0.3;
      scene.add(robot);
      const robot2 = makeRobot(false);
      robot2.position.set(4.2, 0, 3.8);
      robot2.rotation.y = Math.PI + 0.2;
      scene.add(robot2);
      kit = { scene, camera: camAt(30, [9.5, 6.2, 15], [0, 1.4, 1]) };
      break;
    }
    case "drone": {
      const scene = dayScene(24, 64, 0xf3f5f1);
      lightRig(scene, { pos: [6, 12, 8], span: 14 });
      const hub = makeHub(14, 3.4, 5.4);
      hub.position.set(-2, 0, -2);
      scene.add(hub);
      const d = makeDrone();
      d.scale.setScalar(1.5);
      d.position.set(2.6, 6.8, 2.2);
      d.rotation.y = -0.5;
      d.rotation.z = -0.06;
      scene.add(d);
      // far towers
      city(scene, 3, -14, 36);
      // ground shadow of the drone
      const sh = blobShadow(4, 4, 0.22);
      sh.position.set(3.2, 0.02, 2.6);
      scene.add(sh);
      kit = { scene, camera: camAt(30, [0, 6.5, 22], [0.4, 4.2, 0]) };
      break;
    }
    case "robot": {
      const scene = dayScene(16, 46, 0xf3f5f1);
      lightRig(scene, { pos: [-6, 9, 9], span: 12 });
      // facade with door
      const wall = box(18, 5.2, 0.5, mat.matte(C.white, 0.7), 0);
      wall.position.set(0, 2.6, -3.2);
      scene.add(wall);
      const fins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 4.9, 0.3), mat.matte(C.concreteDark, 0.6), 30);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < 30; i++) {
        m4.setPosition(-8.5 + i * 0.585, 2.6, -2.9);
        fins.setMatrixAt(i, m4);
      }
      fins.castShadow = true;
      scene.add(fins);
      const door = box(1.7, 3.0, 0.2, mat.glass(), 0);
      door.position.set(2.2, 1.5, -2.8);
      scene.add(door);
      const dl = box(1.7, 0.06, 0.1, mat.glow(C.lime, 1.4), 0, 1);
      dl.position.set(2.2, 3.05, -2.7);
      scene.add(dl);
      // pavement
      const pav = box(24, 0.12, 6.4, mat.matte(C.concreteDark, 0.9), 0);
      pav.position.set(0, 0.06, -0.2);
      pav.castShadow = false;
      scene.add(pav);
      const r = makeRobot();
      r.scale.setScalar(1.55);
      r.position.set(0.4, 0.12, 1.1);
      r.rotation.y = -0.45;
      scene.add(r);
      const step = makeParcel(0.7, 0.45, 0.7);
      step.position.set(2.6, 0.35, -1.9);
      scene.add(step);
      const tree = makeTree(2.6, 2);
      tree.position.set(-5.5, 0.12, -1.2);
      scene.add(tree);
      const lamp = makeLamp(3.6);
      lamp.position.set(6.5, 0.12, -1.2);
      scene.add(lamp);
      kit = { scene, camera: camAt(30, [-5, 3.6, 11], [0.6, 1.6, 0]) };
      break;
    }
    case "vehicle": {
      const scene = dayScene(26, 66, 0xf3f5f1);
      lightRig(scene, { pos: [7, 11, 9], span: 15 });
      const road = makeRoad(80, 6, false);
      scene.add(road);
      const v = makeVehicle();
      v.scale.setScalar(1.12);
      v.position.set(0.4, 0.04, 0.4);
      v.rotation.y = -0.38;
      scene.add(v);
      city(scene, 5, -9, 40);
      for (const x of [-9, -1, 7]) {
        const l = makeLamp(3.6);
        l.position.set(x, 0, -3.8);
        scene.add(l);
      }
      kit = { scene, camera: camAt(26, [5, 3.0, 14], [0.2, 1.3, 0]) };
      break;
    }
    case "machines": {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xe9ece7);
      scene.fog = new THREE.Fog(0xe9ece7, 18, 44);
      scene.add(makeGround(80, 0xd9ddd7));
      lightRig(scene, { pos: [6, 13, 7], span: 14 });
      // sorting line: main belt + two diverter branches
      const main = makeConveyor(14, 9);
      main.position.set(0, 0, 0);
      scene.add(main);
      for (const [x, s] of [
        [-1.5, 1],
        [2.5, -1],
      ] as const) {
        const br = makeConveyor(6, 20 + x);
        br.rotation.y = (-s * Math.PI) / 2;
        br.position.set(x, 0, s * 3.5);
        scene.add(br);
      }
      const g1 = makeGantry(1.8, 2.1);
      g1.position.set(-4, 0.82, 0);
      scene.add(g1);
      const g2 = makeGantry(1.8, 2.1);
      g2.position.set(4.4, 0.82, 0);
      scene.add(g2);
      // loader arm: simple articulated boom over the line
      const arm = new THREE.Group();
      const m = mat.paint(C.graphite, 0.35, 0.4);
      arm.add(box(0.8, 0.5, 0.8, m, 0.08).translateY(0.25));
      arm.add(box(0.28, 2.2, 0.28, m, 0.06).translateY(1.5));
      const boom = box(2.6, 0.24, 0.28, m, 0.06);
      boom.position.set(1.2, 2.5, 0);
      arm.add(boom);
      arm.add(box(0.5, 0.12, 0.5, mat.glow(C.lime, 1.2), 0.03).translateX(2.4).translateY(2.3));
      arm.position.set(-1.0, 0, -2.6);
      scene.add(arm);
      kit = { scene, camera: camAt(30, [8.5, 7.4, 13], [0, 0.8, 0.4]) };
      break;
    }
    case "retail": {
      const scene = dayScene(14, 40, 0xf3f5f1);
      lightRig(scene, { pos: [-5, 9, 8], span: 10 });
      // stacked parcel wall and a robot beside
      const rnd = mulberry(11);
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 4; c++) {
          if (rnd() > 0.15) {
            const p = makeParcel(0.95, 0.62, 0.85);
            p.position.set(-2.3 + c * 1.02, 0.31 + r * 0.64, -1.6);
            scene.add(p);
          }
        }
      }
      const r = makeRobot();
      r.scale.setScalar(1.7);
      r.position.set(0.7, 0, 1.4);
      r.rotation.y = 0.45;
      scene.add(r);
      kit = { scene, camera: camAt(44, [3.4, 3.4, 9.8], [-0.4, 1.6, -0.2]) };
      break;
    }
    case "health": {
      const scene = dayScene(14, 44, 0xf3f5f1);
      lightRig(scene, { pos: [6, 11, 8], span: 11 });
      const hub = makeHub(10, 3, 4.2, false);
      hub.position.set(0, 0, -5);
      scene.add(hub);
      const d = makeDrone(false);
      d.scale.setScalar(1.4);
      d.position.set(-1.2, 4.3, 1.5);
      d.rotation.y = 0.5;
      const crate = makeCrate(0.7, 0.5, 0.7);
      crate.position.set(0, -0.78, 0);
      d.add(crate);
      scene.add(d);
      const sh = blobShadow(3.6, 3.6, 0.2);
      sh.position.set(-1, 0.02, 1.6);
      scene.add(sh);
      kit = { scene, camera: camAt(28, [3, 3.8, 13], [-0.4, 2.8, 0]) };
      break;
    }
    case "food": {
      const scene = dayScene(14, 42, 0xf3f5f1);
      lightRig(scene, { pos: [-6, 10, 8], span: 11 });
      const pav = box(22, 0.12, 6, mat.matte(C.concreteDark, 0.9), 0);
      pav.position.set(0, 0.06, 0);
      pav.castShadow = false;
      scene.add(pav);
      const r = makeRobot(false);
      r.scale.setScalar(1.5);
      r.position.set(-0.2, 0.12, 0.8);
      r.rotation.y = -0.5;
      const insul = makeCrate(0.8, 0.7, 0.6);
      insul.position.set(-0.05, 1.5, 0);
      r.add(insul);
      scene.add(r);
      for (const [x, s] of [
        [-4.2, 1.9],
        [4.8, 2.4],
      ] as const) {
        const tr = makeTree(s, x > 0 ? 1 : 2);
        tr.position.set(x, 0.12, -1.8);
        scene.add(tr);
      }
      const bench = box(2.2, 0.12, 0.6, mat.matte(C.concrete, 0.7), 0.03);
      bench.position.set(4, 0.5, 0.2);
      scene.add(bench);
      kit = { scene, camera: camAt(28, [-5, 3.2, 10], [0, 1.3, 0]) };
      break;
    }
    case "enterprise": {
      const scene = dayScene(26, 64, 0xf3f5f1);
      lightRig(scene, { pos: [6, 13, 9], span: 14 });
      const a = makeHub(11, 4.6, 5.2, false);
      a.position.set(-8, 0, -2);
      scene.add(a);
      const b = makeHub(11, 4.6, 5.2, false);
      b.position.set(10, 0, -2);
      scene.add(b);
      const road = makeRoad(60, 4.2, false);
      road.position.set(1, 0, 3.8);
      scene.add(road);
      const v = makeVehicle();
      v.position.set(1, 0.04, 3.9);
      scene.add(v);
      // overhead gantry bridge between buildings
      const bridge = box(8, 0.5, 1.4, mat.paint(C.white, 0.5, 0.05), 0.06);
      bridge.position.set(1, 3.8, -2);
      scene.add(bridge);
      scene.add(
        (() => {
          const m = box(7.8, 0.05, 0.05, mat.glow(C.lime, 1.0), 0, 1);
          m.position.set(1, 3.56, -1.28);
          return m;
        })(),
      );
      kit = { scene, camera: camAt(28, [4, 5.5, 20], [1, 2, 0]) };
      break;
    }
    case "city": {
      const scene = dayScene(34, 90, 0xf3f5f1);
      lightRig(scene, { pos: [10, 16, 10], span: 24, mapSize: 2048 });
      city(scene, 21, -10, 54);
      city(scene, 33, -22, 70);
      const road = makeRoad(90, 5, false);
      road.position.z = 3;
      scene.add(road);
      const v = makeVehicle();
      v.position.set(-3, 0.04, 3.1);
      scene.add(v);
      const v2 = makeVehicle();
      v2.position.set(9, 0.04, 3.1);
      v2.scale.setScalar(0.9);
      scene.add(v2);
      const d = makeDrone();
      d.scale.setScalar(1.2);
      d.position.set(3, 7.4, 4.5);
      scene.add(d);
      const d2 = makeDrone();
      d2.position.set(-9, 9.2, -2);
      d2.rotation.y = 0.6;
      scene.add(d2);
      for (let i = 0; i < 6; i++) {
        const t = makeTree(2.2, i);
        t.position.set(-15 + i * 5.5, 0, 8.5);
        scene.add(t);
      }
      kit = { scene, camera: camAt(30, [6, 6.8, 26], [0, 4.0, 0]) };
      break;
    }
    case "green": {
      const scene = dayScene(34, 92, 0xf0f4ee);
      lightRig(scene, { pos: [8, 14, 10], span: 22, hemiI: 1.25 });
      // park floor
      const park = box(120, 0.08, 40, mat.matte(0xcfdcc8, 0.95), 0);
      park.position.set(0, 0.04, -8);
      park.castShadow = false;
      scene.add(park);
      // survey grid on the park: the drawing-set ground, not an empty void
      const grid = new THREE.GridHelper(120, 30, 0xa9b9a3, 0xbccab6);
      grid.position.set(0, 0.1, -8);
      scene.add(grid);
      const rnd = mulberry(77);
      for (let i = 0; i < 70; i++) {
        const t = makeTree(2 + rnd() * 3.2, i);
        t.position.set(-34 + rnd() * 70, 0, -24 + rnd() * 19);
        scene.add(t);
      }
      const road = makeRoad(90, 5, false);
      road.position.z = 2.2;
      scene.add(road);
      const v = makeVehicle();
      v.position.set(-4, 0.04, 2.4);
      scene.add(v);
      const v2 = makeVehicle();
      v2.position.set(5, 0.04, 2.4);
      v2.rotation.y = Math.PI;
      scene.add(v2);
      // solar canopy over a charging bay
      const canopy = new THREE.Group();
      const cm = mat.paint(C.graphite, 0.35, 0.5);
      const roof = box(8, 0.14, 4, cm, 0.04);
      roof.position.y = 3.3;
      canopy.add(roof);
      for (const x of [-3.6, 3.6]) {
        const col = box(0.2, 3.3, 0.2, mat.paint(C.white, 0.5, 0.05), 0.02, 1);
        col.position.set(x, 1.65, -1.6);
        canopy.add(col);
      }
      canopy.add(box(7.4, 0.02, 3.6, mat.paint(0x1b2b3a, 0.15, 0.6), 0).translateY(3.4));
      const strip = box(7.6, 0.04, 0.05, mat.glow(C.lime, 1.0), 0, 1);
      strip.position.set(0, 3.2, 2.0);
      canopy.add(strip);
      canopy.position.set(-14, 0, -4.4);
      scene.add(canopy);
      const v3 = makeVehicle();
      v3.position.set(-14, 0.04, -4.4);
      scene.add(v3);
      for (const x of [-20, -8]) {
        const t = makeTower(3, 8, 3, {});
        t.position.set(x + 24, 0, -26);
        scene.add(t);
      }
      kit = { scene, camera: camAt(30, [8, 6.5, 28], [-3, 1.6, -2]) };
      break;
    }
    case "dusk": {
      const scene = nightScene(14, 50);
      lightRig(scene, {
        sunColor: 0xcfe4ff,
        sunI: 1.5,
        hemiI: 0.28,
        sky: 0x8aa0b0,
        ground: 0x0b0f11,
        pos: [-6, 10, 8],
        span: 18,
      });
      const key = new THREE.PointLight(C.lime, 40, 18, 2);
      key.position.set(2, 2.2, 5);
      scene.add(key);
      city(scene, 61, -12, 46, true);
      const hub = makeHub(16, 3.6, 5.6);
      hub.position.set(0, 0, -6);
      scene.add(hub);
      const road = makeRoad(80, 5, true);
      road.position.z = 1.2;
      scene.add(road);
      const v = makeVehicle();
      v.position.set(1.4, 0.04, 1.4);
      v.rotation.y = -0.2;
      scene.add(v);
      const d = makeDrone();
      d.scale.setScalar(1.2);
      d.position.set(-4.8, 6.4, 0);
      scene.add(d);
      kit = { scene, camera: camAt(28, [3, 3.6, 17], [0, 2.4, 0]) };
      break;
    }
    case "cta":
    default: {
      const scene = nightScene(16, 52);
      lightRig(scene, {
        sunColor: 0xdbe9ff,
        sunI: 2.0,
        hemiI: 0.34,
        sky: 0x9ab0bf,
        ground: 0x0b0f11,
        pos: [-8, 9, 7],
        span: 16,
      });
      const rim = new THREE.DirectionalLight(0xffffff, 1.4);
      rim.position.set(9, 5, -8);
      scene.add(rim);
      const road = makeRoad(80, 6, true);
      road.position.z = 0;
      scene.add(road);
      const v = makeVehicle();
      v.scale.setScalar(1.1);
      v.position.set(1.0, 0.04, 0.4);
      v.rotation.y = -0.34;
      scene.add(v);
      const d = makeDrone();
      d.scale.setScalar(1.4);
      d.position.set(2.4, 6.6, 0.8);
      d.rotation.y = 0.5;
      d.rotation.z = 0.05;
      scene.add(d);
      const r = makeRobot();
      r.scale.setScalar(1.25);
      r.position.set(6.6, 0.04, 4.0);
      r.rotation.y = -0.6;
      scene.add(r);
      city(scene, 90, -14, 46, true);
      kit = { scene, camera: camAt(32, [3.0, 4.6, 27], [2.2, 2.6, 0]) };
      break;
    }
  }
  applyEnvironment(kit.scene, renderer, dark ? 0.32 : 0.55);
  return kit;
}

export type { StillName };
