import * as THREE from "three";
import { buildStill, setupRenderer, type StillName } from "./scenes";

/**
 * Renders the authored 3D scenes once into images using a single shared
 * offscreen WebGL context, so the page ships only one live canvas (the hero)
 * plus cheap <img> elements, instead of a context per section.
 */
let renderer: THREE.WebGLRenderer | null = null;
let chain: Promise<unknown> = Promise.resolve();
const cache = new Map<string, Promise<string>>();

function getRenderer() {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    setupRenderer(renderer);
  }
  return renderer;
}

function render(name: StillName, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const r = getRenderer();
      r.setPixelRatio(1);
      r.setSize(w, h, false);
      const kit = buildStill(name, r);
      kit.camera.aspect = w / h;
      kit.camera.updateProjectionMatrix();
      r.render(kit.scene, kit.camera);
      r.domElement.toBlob(
        (blob) => {
          // free GPU resources of this scene
          kit.scene.traverse((o) => {
            const m = o as THREE.Mesh;
            if (m.geometry) m.geometry.dispose();
          });
          if (!blob) return reject(new Error("blob"));
          resolve(URL.createObjectURL(blob));
        },
        "image/webp",
        0.92,
      );
    } catch (e) {
      reject(e);
    }
  });
}

export function renderStill(name: StillName, w = 1400, h = 1000): Promise<string> {
  const key = `${name}:${w}x${h}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const p = new Promise<string>((resolve, reject) => {
    chain = chain.then(
      () =>
        new Promise<void>((done) => {
          // yield a frame between renders so the page stays responsive
          requestAnimationFrame(() => {
            render(name, w, h).then(resolve, reject).finally(() => done());
          });
        }),
    );
  });
  cache.set(key, p);
  return p;
}
