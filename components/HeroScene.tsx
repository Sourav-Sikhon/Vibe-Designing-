"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { applyEnvironment, buildHero, setupRenderer } from "@/lib/three/scenes";

type Callout = { key: "vehicle" | "drone" | "robot"; fig: string; label: string; dx: number; dy: number };

const CALLOUTS: Callout[] = [
  { key: "drone", fig: "FIG. 02", label: "Delivery drone", dx: 96, dy: -34 },
  { key: "vehicle", fig: "FIG. 01", label: "Autonomous vehicle", dx: 84, dy: -70 },
  { key: "robot", fig: "FIG. 03", label: "Ground courier", dx: 96, dy: 86 },
];

/**
 * Live Three.js hero: one coherent environment (hub, towers, guideway, road)
 * with the vehicle, drone and courier robot on three parallax layers.
 * Leader-line callouts are projected from 3D anchors every frame.
 */
export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = wrap.current;
    if (!canvas || !host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    setupRenderer(renderer);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 1024;
    const kit = buildHero({ mobile, mapSize: mobile ? 1024 : 2048 });
    applyEnvironment(kit.scene, renderer, 0.5);
    if (process.env.NODE_ENV !== "production") (window as unknown as { __kit: unknown }).__kit = { kit, renderer };

    const size = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      kit.camera.aspect = w / h;
      // keep the subject framed on narrow / tall viewports
      kit.camera.fov = w / h < 0.9 ? 44 : w / h < 1.5 ? 32 : 26;
      kit.camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(host);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    const tmp = new THREE.Vector3();
    const placeCallouts = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      CALLOUTS.forEach((c, i) => {
        const a = kit.anchors?.[c.key];
        const label = labelRefs.current[i];
        const line = lineRefs.current[i];
        const dot = dotRefs.current[i];
        if (!a || !label || !line || !dot) return;
        a.getWorldPosition(tmp);
        tmp.project(kit.camera);
        const x = (tmp.x * 0.5 + 0.5) * w;
        const y = (-tmp.y * 0.5 + 0.5) * h;
        const lx = x + c.dx;
        const ly = y + c.dy;
        dot.setAttribute("cx", String(x));
        dot.setAttribute("cy", String(y));
        line.setAttribute("x1", String(x));
        line.setAttribute("y1", String(y));
        line.setAttribute("x2", String(lx));
        line.setAttribute("y2", String(ly));
        const alignRight = c.dx < 0;
        label.style.transform = `translate(${alignRight ? lx - label.offsetWidth : lx}px, ${
          c.dy < 0 ? ly - label.offsetHeight : ly
        }px)`;
      });
    };

    let raf = 0;
    let visible = true;
    let running = false;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      const t = reduce ? 3 : (now - t0) / 1000;
      kit.update?.(t, pointer);
      renderer.render(kit.scene, kit.camera);
      placeCallouts();
      if (reduce) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    start();
    // first frame done → reveal
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
      },
      { threshold: 0 },
    );
    io.observe(host);
    const onVis = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVis);
    const onResizeStatic = () => {
      if (reduce) {
        kit.update?.(3, pointer);
        renderer.render(kit.scene, kit.camera);
        placeCallouts();
      }
    };
    window.addEventListener("resize", onResizeStatic);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResizeStatic);
      document.removeEventListener("visibilitychange", onVis);
      kit.scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden" aria-hidden={false}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Three-dimensional scene of an autonomous electric delivery vehicle on a city street, a delivery drone carrying a parcel overhead, and a compact ground courier robot on the pavement, in front of a logistics hub and towers."
        className="h-full w-full transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0, background: "var(--paper)" }}
      />
      {failed && (
        <div className="absolute inset-0 grid place-items-center text-center px-6 muted">
          <p className="max-w-[34ch]">3D scene unavailable in this browser. The AERONEX network continues below.</p>
        </div>
      )}
      <svg ref={svgRef} className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
        {CALLOUTS.map((c, i) => (
          <g key={c.key} style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s 0.6s" }}>
            <line
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              stroke="#141719"
              strokeWidth="1"
            />
            <circle
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              r="4"
              fill="#c7f36b"
              stroke="#141719"
              strokeWidth="1.2"
            />
          </g>
        ))}
      </svg>
      {CALLOUTS.map((c, i) => (
        <div
          key={c.key}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="mono pointer-events-none absolute left-0 top-0 hidden whitespace-nowrap lg:block"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s 0.6s", color: "var(--ink)" }}
        >
          <span style={{ color: "var(--mute-aa)" }}>{c.fig}</span>
          <span className="ml-2">{c.label}</span>
        </div>
      ))}
    </div>
  );
}
