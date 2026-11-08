import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/** Brand palette as THREE colours. */
export const C = {
  paper: 0xf8f9f7,
  ground: 0xeceee9,
  concrete: 0xe3e6e1,
  concreteDark: 0xcdd1cc,
  white: 0xf4f5f2,
  ink: 0x141719,
  graphite: 0x22292d,
  graphite2: 0x343d42,
  night: 0x101416,
  lime: 0xc7f36b,
  mute: 0x737b80,
  glass: 0x0e1214,
  sage: 0x9db39a,
  sage2: 0x7f9b7d,
  kraft: 0xd9d6cc,
};

export const mat = {
  paint: (c: number, rough = 0.38, metal = 0.1) =>
    new THREE.MeshPhysicalMaterial({
      color: c,
      roughness: rough,
      metalness: metal,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    }),
  matte: (c: number, rough = 0.85) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0 }),
  glass: () =>
    new THREE.MeshPhysicalMaterial({
      color: C.glass,
      roughness: 0.08,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    }),
  glow: (c = C.lime, i = 1.4) =>
    new THREE.MeshStandardMaterial({
      color: c,
      emissive: c,
      emissiveIntensity: i,
      roughness: 0.4,
    }),
};

function box(
  w: number,
  h: number,
  d: number,
  m: THREE.Material,
  r = 0.06,
  seg = 3,
): THREE.Mesh {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, seg, r) : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(g, m);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
export { box };

function put<T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T {
  o.position.set(x, y, z);
  return o;
}

/** Soft contact shadow blob that grounds an object on the floor. */
let blobTex: THREE.Texture | null = null;
export function blobShadow(w: number, d: number, opacity = 0.35): THREE.Mesh {
  if (!blobTex) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, "rgba(16,20,22,1)");
    grd.addColorStop(0.55, "rgba(16,20,22,0.45)");
    grd.addColorStop(1, "rgba(16,20,22,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    blobTex = new THREE.CanvasTexture(c);
    blobTex.colorSpace = THREE.SRGBColorSpace;
  }
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({
      map: blobTex,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.012;
  m.renderOrder = 1;
  return m;
}

/* ------------------------------------------------------------------ */
/* Autonomous electric delivery vehicle (length along +X, front = +X) */
export function makeVehicle(): THREE.Group {
  const g = new THREE.Group();
  const body = mat.paint(C.graphite, 0.3, 0.35);
  const white = mat.paint(C.white, 0.42, 0.02);
  const glass = mat.glass();
  const dark = mat.matte(C.ink, 0.6);

  // lower chassis / battery skirt
  g.add(put(box(4.7, 0.62, 2.02, body, 0.2), 0, 0.78, 0));
  // cargo module (white)
  g.add(put(box(2.65, 1.5, 2.0, white, 0.16), -0.95, 1.62, 0));
  // front cab (glass wrap)
  const cab = box(1.78, 1.02, 1.94, glass, 0.32);
  g.add(put(cab, 1.2, 1.4, 0));
  // sloped front fascia
  g.add(put(box(0.46, 0.62, 1.96, body, 0.18), 2.18, 0.96, 0));
  // roof of cab
  g.add(put(box(1.7, 0.12, 1.88, body, 0.06), 1.18, 1.97, 0));
  // lidar puck + ring
  const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.14, 28), body);
  lidar.castShadow = true;
  g.add(put(lidar, 1.45, 2.1, 0));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 8, 32), mat.glow(C.lime, 1.8));
  ring.rotation.x = Math.PI / 2;
  g.add(put(ring, 1.45, 2.14, 0));
  g.userData.lidar = ring;

  // lime light signature
  const front = box(0.05, 0.05, 1.7, mat.glow(C.lime, 2.2), 0.02, 1);
  g.add(put(front, 2.44, 1.05, 0));
  for (const s of [-1, 1]) {
    // side beltline in lime
    g.add(put(box(2.6, 0.035, 0.02, mat.glow(C.lime, 1.4), 0.01, 1), -0.95, 0.98, s * 1.012));
    // cargo door seams
    g.add(put(box(0.025, 1.38, 0.02, dark, 0.005, 1), -0.95, 1.62, s * 1.012));
    g.add(put(box(0.025, 1.38, 0.02, dark, 0.005, 1), -2.0, 1.62, s * 1.012));
    // door handle
    g.add(put(box(0.18, 0.03, 0.03, dark, 0.01, 1), -0.8, 1.55, s * 1.02));
    // side mirror camera
    g.add(put(box(0.14, 0.1, 0.1, body, 0.03), 1.75, 1.6, s * 1.02));
  }
  // rear light
  g.add(put(box(0.04, 0.05, 1.5, mat.glow(0xff5a4d, 0.8), 0.02, 1), -2.32, 1.1, 0));
  // wheels
  const wheels: THREE.Object3D[] = [];
  for (const wx of [-1.5, 1.45]) {
    for (const s of [-1, 1]) {
      const w = new THREE.Group();
      const tyre = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.46, 0.34, 36),
        mat.matte(C.night, 0.8),
      );
      tyre.rotation.x = Math.PI / 2;
      tyre.castShadow = true;
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.36, 24),
        mat.paint(C.graphite2, 0.3, 0.7),
      );
      hub.rotation.x = Math.PI / 2;
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.38, 16),
        mat.glow(C.lime, 0.8),
      );
      cap.rotation.x = Math.PI / 2;
      w.add(tyre, hub, cap);
      w.position.set(wx, 0.46, s * 0.92);
      g.add(w);
      wheels.push(w);
    }
  }
  g.userData.wheels = wheels;
  g.add(blobShadow(6.4, 3.6, 0.42));
  return g;
}

/* ------------------------------------------------------------------ */
/* Delivery drone with hanging parcel. Rotors spin about Y. */
export function makeDrone(withParcel = true): THREE.Group {
  const g = new THREE.Group();
  const white = mat.paint(C.white, 0.35, 0.05);
  const graphite = mat.paint(C.graphite, 0.35, 0.4);
  const body = box(1.0, 0.3, 1.0, white, 0.14);
  g.add(body);
  g.add(put(box(0.7, 0.14, 0.7, graphite, 0.06), 0, 0.2, 0));
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), mat.glow(C.lime, 2));
  g.add(put(eye, 0.52, 0.02, 0));
  const rotors: THREE.Object3D[] = [];
  for (const [sx, sz] of [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ] as const) {
    const L = 1.15;
    const arm = box(L, 0.07, 0.11, graphite, 0.03, 2);
    arm.position.set((sx * L) / 2 - 0.0, 0.02, (sz * L) / 2);
    arm.rotation.y = Math.atan2(-sz, sx);
    // position arm centre halfway along diagonal
    arm.position.set(sx * 0.58, 0.04, sz * 0.58);
    arm.scale.x = 1.0;
    g.add(arm);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.16, 20), graphite);
    motor.castShadow = true;
    motor.position.set(sx * 1.0, 0.1, sz * 1.0);
    g.add(motor);
    const rotor = new THREE.Group();
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 0.008, 40),
      new THREE.MeshBasicMaterial({ color: C.ink, transparent: true, opacity: 0.08, depthWrite: false }),
    );
    rotor.add(disc);
    for (let i = 0; i < 2; i++) {
      const blade = box(1.22, 0.012, 0.075, mat.matte(C.ink, 0.5), 0.02, 1);
      blade.rotation.y = i * Math.PI;
      blade.castShadow = false;
      rotor.add(blade);
    }
    rotor.position.set(sx * 1.0, 0.2, sz * 1.0);
    g.add(rotor);
    rotors.push(rotor);
  }
  // skids
  for (const s of [-1, 1]) {
    g.add(put(box(1.1, 0.04, 0.05, graphite, 0.015, 1), 0, -0.44, s * 0.38));
    for (const x of [-0.4, 0.4]) g.add(put(box(0.04, 0.3, 0.04, graphite, 0.01, 1), x, -0.28, s * 0.38));
  }
  if (withParcel) {
    const p = makeParcel(0.62, 0.46, 0.62);
    p.position.set(0, -0.72, 0);
    g.add(p);
    g.userData.parcel = p;
  }
  g.userData.rotors = rotors;
  return g;
}

/* ------------------------------------------------------------------ */
/* Compact ground courier robot. Front = +X. */
export function makeRobot(withParcel = true): THREE.Group {
  const g = new THREE.Group();
  const white = mat.paint(C.white, 0.4, 0.02);
  const graphite = mat.paint(C.graphite, 0.4, 0.3);
  g.add(put(box(1.3, 0.52, 0.92, graphite, 0.16), 0, 0.5, 0));
  g.add(put(box(1.18, 0.1, 0.84, white, 0.05), 0, 0.82, 0));
  // shell / lid
  g.add(put(box(1.08, 0.34, 0.8, white, 0.14), -0.05, 1.0, 0));
  // sensor mast
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 12), graphite);
  mast.castShadow = true;
  g.add(put(mast, -0.3, 1.45, 0));
  g.add(put(box(0.2, 0.12, 0.2, graphite, 0.04), -0.3, 1.76, 0));
  g.add(put(box(0.04, 0.05, 0.14, mat.glow(C.lime, 2), 0.01, 1), -0.19, 1.77, 0));
  // front light bar
  g.add(put(box(0.04, 0.06, 0.62, mat.glow(C.lime, 2.2), 0.015, 1), 0.66, 0.6, 0));
  // side seam
  for (const s of [-1, 1]) g.add(put(box(1.1, 0.025, 0.02, mat.glow(C.lime, 1.2), 0.008, 1), -0.05, 0.84, s * 0.41));
  const wheels: THREE.Object3D[] = [];
  for (const x of [-0.46, 0, 0.46]) {
    for (const s of [-1, 1]) {
      const w = new THREE.Group();
      const t = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.16, 24),
        mat.matte(C.night, 0.8),
      );
      t.rotation.x = Math.PI / 2;
      t.castShadow = true;
      const h = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.18, 16),
        mat.paint(C.graphite2, 0.3, 0.6),
      );
      h.rotation.x = Math.PI / 2;
      w.add(t, h);
      w.position.set(x, 0.2, s * 0.5);
      g.add(w);
      wheels.push(w);
    }
  }
  g.userData.wheels = wheels;
  if (withParcel) {
    const p = makeParcel(0.5, 0.3, 0.5);
    p.position.set(-0.05, 1.32, 0);
    p.rotation.y = 0.2;
    g.add(p);
  }
  g.add(blobShadow(2.6, 1.8, 0.4));
  return g;
}

export function makeParcel(w = 0.6, h = 0.4, d = 0.6, color = C.kraft): THREE.Group {
  const g = new THREE.Group();
  g.add(box(w, h, d, mat.matte(color, 0.7), 0.025, 2));
  const strap = mat.glow(C.lime, 0.9);
  g.add(put(box(w * 1.01, h * 1.01, d * 0.1, strap, 0.008, 1), 0, 0, 0));
  g.add(put(box(w * 0.1, h * 1.01, d * 1.01, strap, 0.008, 1), 0.0, 0, 0));
  return g;
}

/* ------------------------------------------------------------------ */
/* Architecture */
export function makeTower(w: number, h: number, d: number, opts: { floors?: number; glass?: boolean } = {}): THREE.Group {
  const g = new THREE.Group();
  const floors = opts.floors ?? Math.max(4, Math.round(h / 0.9));
  const core = box(w, h, d, mat.matte(opts.glass ? C.graphite : 0xd9ddd7, 0.6), 0.0);
  core.position.y = h / 2;
  g.add(core);
  // horizontal bands (slabs) via instancing
  const slab = new THREE.InstancedMesh(
    new THREE.BoxGeometry(w * 1.04, 0.07, d * 1.04),
    mat.matte(opts.glass ? C.concrete : C.concreteDark, 0.6),
    floors,
  );
  slab.castShadow = true;
  slab.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < floors; i++) {
    m4.setPosition(0, ((i + 1) / floors) * h - 0.03, 0);
    slab.setMatrixAt(i, m4);
  }
  g.add(slab);
  // glazing strips on front face
  const glazing = mat.paint(opts.glass ? 0x6b777d : 0x808c92, 0.25, 0.3);
  const glass = new THREE.InstancedMesh(
    new THREE.BoxGeometry(w * 0.92, (h / floors) * 0.42, 0.04),
    glazing,
    floors,
  );
  for (let i = 0; i < floors; i++) {
    m4.setPosition(0, (i + 0.5) * (h / floors), d / 2 + 0.005);
    glass.setMatrixAt(i, m4);
  }
  g.add(glass);
  const side = new THREE.InstancedMesh(
    new THREE.BoxGeometry(d * 0.92, (h / floors) * 0.42, 0.04),
    glazing,
    floors,
  );
  for (let i = 0; i < floors; i++) {
    m4.makeRotationY(Math.PI / 2);
    m4.setPosition(w / 2 + 0.005, (i + 0.5) * (h / floors), 0);
    side.setMatrixAt(i, m4);
  }
  g.add(side);
  g.add(put(box(w * 1.06, 0.12, d * 1.06, mat.matte(C.concreteDark, 0.6), 0.0), 0, h + 0.04, 0));
  return g;
}

/** Long low logistics hub with dock doors, vertical fins, roof landing pad. */
export function makeHub(w = 14, h = 3.4, d = 5.2, pad = true): THREE.Group {
  const g = new THREE.Group();
  const shell = box(w, h, d, mat.matte(0xd3d8d2, 0.7), 0);
  shell.position.y = h / 2;
  g.add(shell);
  // fins across front
  const n = Math.floor(w / 0.55);
  const fins = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.1, h - 2.2, 0.26),
    mat.matte(C.concrete, 0.55),
    n,
  );
  fins.castShadow = true;
  fins.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    m4.setPosition(-w / 2 + 0.3 + i * ((w - 0.6) / (n - 1)), 2.2 + (h - 2.2) / 2, d / 2 + 0.13);
    fins.setMatrixAt(i, m4);
  }
  g.add(fins);
  // dock doors
  const doors = Math.max(2, Math.floor(w / 3.6));
  for (let i = 0; i < doors; i++) {
    const x = -w / 2 + (w / doors) * (i + 0.5);
    g.add(put(box(2.1, 1.7, 0.05, mat.paint(C.graphite2, 0.3, 0.3), 0.0), x, 0.95, d / 2 + 0.005));
    g.add(put(box(2.1, 0.05, 0.06, mat.glow(C.lime, 1.4), 0, 1), x, 1.84, d / 2 + 0.03));
  }
  // roof parapet
  g.add(put(box(w + 0.2, 0.18, d + 0.2, mat.matte(C.concreteDark, 0.6), 0), 0, h + 0.09, 0));
  if (pad) {
    const padM = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.1, 48),
      mat.matte(C.graphite, 0.7),
    );
    padM.receiveShadow = true;
    padM.castShadow = true;
    g.add(put(padM, w * 0.3, h + 0.23, 0));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.035, 8, 56), mat.glow(C.lime, 1.4));
    ring.rotation.x = Math.PI / 2;
    g.add(put(ring, w * 0.3, h + 0.3, 0));
  }
  return g;
}

/** Rounded canopy tree, calm sage palette. */
export function makeTree(h = 2.4, seed = 1): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, h * 0.5, 8), mat.matte(0x5b5348, 0.9));
  trunk.position.y = h * 0.25;
  trunk.castShadow = true;
  g.add(trunk);
  const c1 = mat.matte(seed % 2 ? C.sage : C.sage2, 0.95);
  const blobs: Array<[number, number, number, number]> = [
    [0, h * 0.68, 0, h * 0.34],
    [h * 0.16, h * 0.55, h * 0.06, h * 0.24],
    [-h * 0.14, h * 0.6, -h * 0.08, h * 0.26],
  ];
  const rn = mulberry(seed * 977 + 13);
  for (const [x, y, z, r] of blobs) {
    // irregular canopy: jitter the vertices so it reads as foliage, not a sphere
    const geo = new THREE.IcosahedronGeometry(r, 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const k = 1 + (rn() - 0.5) * 0.28;
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k * 0.86, pos.getZ(i) * k);
    }
    geo.computeVertexNormals();
    const s = new THREE.Mesh(geo, c1);
    s.position.set(x, y, z);
    s.castShadow = true;
    s.receiveShadow = true;
    g.add(s);
  }
  g.add(blobShadow(h * 0.9, h * 0.9, 0.22));
  return g;
}

export function makeShelf(len = 6, levels = 4, seed = 3): THREE.Group {
  const g = new THREE.Group();
  const frame = mat.paint(C.graphite, 0.5, 0.3);
  const H = levels * 0.95 + 0.2;
  for (const x of [-len / 2, len / 2]) {
    for (const z of [-0.45, 0.45]) g.add(put(box(0.08, H, 0.08, frame, 0.01, 1), x, H / 2, z));
  }
  const rnd = mulberry(seed);
  for (let l = 0; l < levels; l++) {
    const y = 0.15 + l * 0.95;
    g.add(put(box(len + 0.1, 0.06, 1.0, frame, 0.01, 1), 0, y, 0));
    let x = -len / 2 + 0.35;
    while (x < len / 2 - 0.3) {
      const w = 0.35 + rnd() * 0.45;
      const hh = 0.35 + rnd() * 0.4;
      if (rnd() > 0.12) {
        const p = box(w, hh, 0.7 + rnd() * 0.15, mat.matte(C.kraft, 0.7), 0.02, 1);
        p.position.set(x + w / 2, y + 0.03 + hh / 2, 0);
        g.add(p);
        if (rnd() > 0.7) g.add(put(box(w * 1.01, 0.05, 0.78, mat.glow(C.lime, 0.9), 0.005, 1), x + w / 2, y + 0.03 + hh / 2, 0));
      }
      x += w + 0.08;
    }
  }
  return g;
}

export function makeConveyor(len = 8, seed = 7): THREE.Group {
  const g = new THREE.Group();
  g.add(put(box(len, 0.5, 1.0, mat.paint(C.graphite, 0.5, 0.3), 0.04), 0, 0.5, 0));
  g.add(put(box(len - 0.1, 0.06, 0.82, mat.matte(C.ink, 0.7), 0.01, 1), 0, 0.78, 0));
  for (const s of [-1, 1]) g.add(put(box(len, 0.1, 0.05, mat.glow(C.lime, 1.0), 0.01, 1), 0, 0.82, s * 0.5));
  for (const x of [-len / 2 + 0.4, len / 2 - 0.4]) {
    for (const z of [-0.38, 0.38]) g.add(put(box(0.1, 0.25, 0.1, mat.paint(C.graphite, 0.5, 0.3), 0.01, 1), x, 0.12, z));
  }
  const rnd = mulberry(seed);
  let x = -len / 2 + 0.7;
  while (x < len / 2 - 0.7) {
    const p = makeParcel(0.5 + rnd() * 0.3, 0.3 + rnd() * 0.25, 0.5 + rnd() * 0.2);
    p.position.set(x, 0.81 + 0.2, (rnd() - 0.5) * 0.12);
    p.rotation.y = (rnd() - 0.5) * 0.25;
    g.add(p);
    x += 1.2 + rnd() * 0.8;
  }
  return g;
}

/** Scanning gantry: an arch with a lime scan plane. */
export function makeGantry(w = 1.8, h = 1.9): THREE.Group {
  const g = new THREE.Group();
  const m = mat.paint(C.graphite, 0.35, 0.4);
  for (const z of [-w / 2, w / 2]) g.add(put(box(0.14, h, 0.14, m, 0.04), 0, h / 2, z));
  g.add(put(box(0.2, 0.22, w + 0.3, m, 0.05), 0, h, 0));
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(w - 0.1, h - 0.15),
    new THREE.MeshBasicMaterial({
      color: C.lime,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  plane.rotation.y = Math.PI / 2;
  plane.position.set(0, h / 2 - 0.05, 0);
  g.add(plane);
  g.add(put(box(0.04, h - 0.1, w - 0.1, mat.glow(C.lime, 1.5), 0.0, 1), 0, h / 2 - 0.05, 0).clone());
  g.children[g.children.length - 1].scale.set(1, 0.01, 1);
  g.userData.plane = plane;
  return g;
}

export function makeLamp(h = 3.2): THREE.Group {
  const g = new THREE.Group();
  const m = mat.paint(C.graphite, 0.4, 0.4);
  g.add(put(box(0.06, h, 0.06, m, 0.01, 1), 0, h / 2, 0));
  g.add(put(box(0.5, 0.05, 0.12, m, 0.02, 1), 0.2, h, 0));
  g.add(put(box(0.3, 0.02, 0.08, mat.glow(0xffffff, 1.2), 0, 1), 0.28, h - 0.04, 0));
  return g;
}

export function makeCrate(w = 0.9, h = 0.55, d = 0.6, accent = C.lime): THREE.Group {
  const g = new THREE.Group();
  g.add(box(w, h, d, mat.paint(C.white, 0.5, 0), 0.05));
  g.add(put(box(w * 1.02, 0.07, d * 1.02, mat.paint(C.graphite, 0.4, 0.2), 0.02, 1), 0, h * 0.18, 0));
  g.add(put(box(0.16, 0.16, 0.02, mat.glow(accent, 1.2), 0.005, 1), w * 0.28, h * 0.05, d / 2 + 0.01));
  return g;
}

/* ------------------------------------------------------------------ */
export function makeGround(size = 140, color = C.ground): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0 }),
  );
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
  return m;
}

/** Flat road slab with dashed lane markings along X at z=0. */
export function makeRoad(len = 60, width = 5.4, dark = false): THREE.Group {
  const g = new THREE.Group();
  const slab = box(len, 0.06, width, mat.matte(dark ? C.graphite : C.concreteDark, 0.9), 0);
  slab.position.y = 0.03;
  slab.castShadow = false;
  g.add(slab);
  const dash = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1.0, 0.012, 0.07),
    mat.matte(dark ? 0x7a848a : C.paper, 0.7),
    Math.floor(len / 2.2),
  );
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < Math.floor(len / 2.2); i++) {
    m4.setPosition(-len / 2 + 1.1 + i * 2.2, 0.07, 0);
    dash.setMatrixAt(i, m4);
  }
  g.add(dash);
  for (const s of [-1, 1]) {
    const kerb = box(len, 0.1, 0.16, mat.matte(C.concrete, 0.8), 0);
    kerb.position.set(0, 0.07, s * (width / 2 + 0.08));
    g.add(kerb);
  }
  return g;
}

/* ------------------------------------------------------------------ */
export function mulberry(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
