"use client";

import { useEffect, useRef, useState } from "react";
import { mulberry } from "@/lib/three/models";

type P = { x: number; y: number };
type Node = P & { id: string; kind: "hub" | "dest" };
type Mover = { path: P[]; len: number[]; total: number; t: number; speed: number; mode: "veh" | "drone" | "robot" };

const LIME = "#c7f36b";
const PAPER = "#f8f9f7";

/** Manhattan-style route: out along x then y, or y then x. */
function manhattan(a: P, b: P, flip: boolean): P[] {
  return flip ? [a, { x: a.x, y: b.y }, b] : [a, { x: b.x, y: a.y }, b];
}
function lens(path: P[]) {
  const l = [0];
  for (let i = 1; i < path.length; i++) l.push(l[i - 1] + Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y));
  return l;
}
function at(path: P[], l: number[], d: number): P {
  const total = l[l.length - 1];
  const t = Math.max(0, Math.min(total, d));
  for (let i = 1; i < path.length; i++) {
    if (t <= l[i]) {
      const k = (t - l[i - 1]) / (l[i] - l[i - 1] || 1);
      return { x: path[i - 1].x + (path[i].x - path[i - 1].x) * k, y: path[i - 1].y + (path[i].y - path[i - 1].y) * k };
    }
  }
  return path[path.length - 1];
}

const LOG = [
  "Order registered · destination resolved",
  "3 candidate routes scored",
  "Capacity check · fleet available",
  "Route selected · dispatch issued",
];

export default function CommandMap() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [decision, setDecision] = useState<{ stage: number; best: string; scores: number[] }>({ stage: 3, best: "B", scores: [62, 91, 74] });

  useEffect(() => {
    const canvas = cv.current!;
    const host = wrap.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rnd = mulberry(42);

    // normalised world 0..1000 x 0..560
    const W = 1000;
    const H = 560;
    const hubs: Node[] = [
      { id: "H1", kind: "hub", x: 150, y: 150 },
      { id: "H2", kind: "hub", x: 470, y: 90 },
      { id: "H3", kind: "hub", x: 820, y: 170 },
      { id: "H4", kind: "hub", x: 260, y: 430 },
      { id: "H5", kind: "hub", x: 640, y: 440 },
    ];
    const dests: Node[] = Array.from({ length: 22 }, (_, i) => ({
      id: "D" + i,
      kind: "dest" as const,
      x: 70 + rnd() * 860,
      y: 50 + rnd() * 460,
    }));
    // snap to a 20px street grid for the map
    [...hubs, ...dests].forEach((n) => {
      n.x = Math.round(n.x / 20) * 20;
      n.y = Math.round(n.y / 20) * 20;
    });

    const movers: Mover[] = [];
    const modes: Mover["mode"][] = ["veh", "veh", "drone", "robot", "veh", "drone"];
    for (let i = 0; i < 16; i++) {
      const h = hubs[i % hubs.length];
      // nearest-ish destination for variety
      const d = dests[(i * 5 + 3) % dests.length];
      const mode = modes[i % modes.length];
      const path = mode === "drone" ? [h, d] : manhattan(h, d, i % 2 === 0);
      const l = lens(path);
      movers.push({ path, len: l, total: l[l.length - 1], t: rnd(), speed: mode === "drone" ? 0.045 : mode === "robot" ? 0.025 : 0.034, mode });
    }

    let size = { w: 0, h: 0, k: 1, ox: 0, oy: 0 };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = host.clientWidth;
      const h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const k = Math.min(w / W, h / H);
      size = { w, h, k, ox: (w - W * k) / 2, oy: (h - H * k) / 2 };
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(host);

    const X = (x: number) => size.ox + x * size.k;
    const Y = (y: number) => size.oy + y * size.k;

    // AI decision state machine
    let dec = { start: 0, dest: dests[4], cands: [] as P[][], scores: [62, 91, 74], best: 1, stage: 3, phase: 0 };
    const planDecision = (now: number, n: number) => {
      const dest = dests[(n * 7 + 2) % dests.length];
      const hub = hubs.reduce((a, b) => (Math.hypot(a.x - dest.x, a.y - dest.y) < Math.hypot(b.x - dest.x, b.y - dest.y) ? a : b));
      const alt = hubs[(hubs.indexOf(hub) + 2) % hubs.length];
      dec = {
        start: now,
        dest,
        cands: [manhattan(hub, dest, true), manhattan(hub, dest, false), [alt, { x: (alt.x + dest.x) / 2, y: alt.y }, { x: (alt.x + dest.x) / 2, y: dest.y }, dest]],
        scores: [58 + ((n * 13) % 20), 86 + ((n * 5) % 10), 66 + ((n * 7) % 14)],
        best: 1,
        stage: 0,
        phase: n,
      };
    };
    planDecision(0, 1);
    let lastStage = -1;

    const draw = (tSec: number) => {
      const { w, h } = size;
      ctx.clearRect(0, 0, w, h);
      // city blocks
      ctx.fillStyle = "rgba(248,249,247,0.05)";
      for (let bx = 0; bx < W; bx += 100) {
        for (let by = 0; by < H; by += 100) {
          if (((bx / 100) * 7 + (by / 100) * 3) % 11 === 0) continue; // open space
          ctx.fillRect(X(bx + 14), Y(by + 14), 72 * size.k, 72 * size.k);
        }
      }
      // street grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(248,249,247,0.055)";
      ctx.beginPath();
      for (let x = 0; x <= W; x += 20) {
        ctx.moveTo(X(x), Y(0));
        ctx.lineTo(X(x), Y(H));
      }
      for (let y = 0; y <= H; y += 20) {
        ctx.moveTo(X(0), Y(y));
        ctx.lineTo(X(W), Y(y));
      }
      ctx.stroke();
      ctx.strokeStyle = "rgba(248,249,247,0.12)";
      ctx.beginPath();
      for (let x = 0; x <= W; x += 100) {
        ctx.moveTo(X(x), Y(0));
        ctx.lineTo(X(x), Y(H));
      }
      for (let y = 0; y <= H; y += 100) {
        ctx.moveTo(X(0), Y(y));
        ctx.lineTo(X(W), Y(y));
      }
      ctx.stroke();

      // all routes, faint
      ctx.lineWidth = 1.5;
      for (const m of movers) {
        ctx.strokeStyle = m.mode === "drone" ? "rgba(248,249,247,0.4)" : "rgba(248,249,247,0.3)";
        ctx.setLineDash(m.mode === "drone" ? [4, 6] : m.mode === "robot" ? [1, 5] : []);
        ctx.beginPath();
        m.path.forEach((p, i) => (i ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))));
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // destinations
      for (const d of dests) {
        ctx.strokeStyle = "rgba(248,249,247,0.45)";
        ctx.beginPath();
        ctx.arc(X(d.x), Y(d.y), 3 * size.k + 1.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // AI decision: candidates, scoring, selection
      const e = tSec - dec.start;
      const stage = reduce ? 3 : e < 1.2 ? 0 : e < 2.6 ? 1 : e < 3.4 ? 2 : 3;
      if (stage !== lastStage) {
        lastStage = stage;
        setDecision({ stage, best: "B", scores: dec.scores });
      }
      if (!reduce && e > 7.2) planDecision(tSec, dec.phase + 1);
      const labels = ["A", "B", "C"];
      dec.cands.forEach((c, i) => {
        const chosen = stage >= 3 && i === dec.best;
        if (stage === 0 && i > 0) return;
        ctx.lineWidth = chosen ? 3 : 1.6;
        ctx.strokeStyle = chosen ? LIME : "rgba(248,249,247,0.5)";
        ctx.setLineDash(chosen ? [] : [6, 6]);
        if (stage === 3 && !chosen) ctx.globalAlpha = 0.28;
        ctx.beginPath();
        c.forEach((p, k) => (k ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))));
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
        if (stage >= 1) {
          const mid = at(c, lens(c), lens(c)[lens(c).length - 1] * (0.35 + i * 0.12));
          ctx.fillStyle = chosen ? LIME : "rgba(16,20,22,0.92)";
          ctx.strokeStyle = chosen ? LIME : "rgba(248,249,247,0.5)";
          ctx.lineWidth = 1;
          const bx = X(mid.x) - 17;
          const by = Y(mid.y) - 10;
          ctx.fillRect(bx, by, 34, 20);
          ctx.strokeRect(bx + 0.5, by + 0.5, 33, 19);
          ctx.fillStyle = chosen ? "#101416" : PAPER;
          ctx.font = '500 11px "Geist Mono", ui-monospace, monospace';
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${labels[i]} ${dec.scores[i]}`, X(mid.x), Y(mid.y) + 0.5);
        }
      });
      // decision ring at destination
      const ring = reduce ? 0 : (e * 0.7) % 1;
      ctx.strokeStyle = LIME;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = reduce ? 0.6 : 1 - ring;
      ctx.beginPath();
      ctx.arc(X(dec.dest.x), Y(dec.dest.y), (6 + ring * 20) * size.k + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = LIME;
      ctx.beginPath();
      ctx.arc(X(dec.dest.x), Y(dec.dest.y), 4, 0, Math.PI * 2);
      ctx.fill();

      // movers
      for (const m of movers) {
        const d = ((m.t + tSec * m.speed) % 1) * m.total;
        const p = at(m.path, m.len, d);
        const px = X(p.x);
        const py = Y(p.y);
        // short trail
        const back = at(m.path, m.len, Math.max(0, d - 34));
        ctx.strokeStyle = LIME;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(X(back.x), Y(back.y));
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = PAPER;
        ctx.strokeStyle = "#101416";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (m.mode === "veh") ctx.rect(px - 4.5, py - 4.5, 9, 9);
        else if (m.mode === "drone") {
          ctx.moveTo(px, py - 6);
          ctx.lineTo(px + 6, py + 5);
          ctx.lineTo(px - 6, py + 5);
          ctx.closePath();
        } else {
          ctx.moveTo(px, py - 5.5);
          ctx.lineTo(px + 5.5, py);
          ctx.lineTo(px, py + 5.5);
          ctx.lineTo(px - 5.5, py);
          ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();
      }

      // hubs
      for (const hb of hubs) {
        const hx = X(hb.x);
        const hy = Y(hb.y);
        ctx.fillStyle = "#101416";
        ctx.strokeStyle = PAPER;
        ctx.lineWidth = 1.5;
        ctx.fillRect(hx - 9, hy - 9, 18, 18);
        ctx.strokeRect(hx - 9, hy - 9, 18, 18);
        ctx.fillStyle = LIME;
        ctx.fillRect(hx - 3, hy - 3, 6, 6);
        ctx.fillStyle = "rgba(248,249,247,0.75)";
        ctx.font = '500 10px "Geist Mono", ui-monospace, monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(hb.id, hx + 14, hy - 10);
        if (!reduce) {
          const r = ((tSec * 0.4 + hubs.indexOf(hb) * 0.23) % 1);
          ctx.strokeStyle = "rgba(199,243,107," + (0.35 * (1 - r)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(hx, hy, 12 + r * 30, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    let raf = 0;
    let visible = true;
    let running = false;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      draw((now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    draw(0);
    start();
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="grid12 items-stretch gap-y-6">
      <div ref={wrap} className="relative col-span-12 h-[min(62vw,620px)] min-h-[340px] overflow-hidden border lg:col-span-9" style={{ borderColor: "var(--hair-night-strong)", borderRadius: "var(--radius)", background: "rgb(248 249 247 / 0.015)" }}>
        <canvas
          ref={cv}
          role="img"
          aria-label="Stylised logistics network map in motion: five hubs, delivery destinations and moving vehicles, drones and robots. Three candidate routes for a new order are scored and the highest-scoring route is selected."
        />
        <div className="mono pointer-events-none absolute left-4 top-4" style={{ color: "var(--night-mute)" }}>
          Sheet A-05 / Orchestration plan · sample data
        </div>
        <ul className="mono pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-x-5 gap-y-1" style={{ color: "var(--night-mute)" }}>
          <li className="flex items-center gap-2"><span className="inline-block h-[9px] w-[9px] border" style={{ borderColor: PAPER, background: PAPER }} />Vehicle</li>
          <li className="flex items-center gap-2"><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0L10 9H0Z" fill={PAPER} /></svg>Drone</li>
          <li className="flex items-center gap-2"><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0L10 5L5 10L0 5Z" fill={PAPER} /></svg>Robot</li>
          <li className="flex items-center gap-2"><span className="inline-block h-[9px] w-[9px]" style={{ background: LIME }} />Selected route</li>
        </ul>
      </div>

      {/* AI decision log: the decision made legible */}
      <aside className="col-span-12 border lg:col-span-3" style={{ borderColor: "var(--hair-night-strong)", borderRadius: "var(--radius)" }} aria-label="AI decision log, sample">
        <div className="mono px-4 py-3" style={{ borderBottom: "1px solid var(--hair-night)", color: "var(--night-mute)" }}>
          Decision log · sample
        </div>
        <ol className="px-4 py-4" aria-live="off">
          {LOG.map((l, i) => (
            <li key={l} className="flex gap-3 py-2.5 text-[0.9375rem] leading-snug" style={{ opacity: decision.stage >= i ? 1 : 0.32, transition: "opacity .5s" }}>
              <span aria-hidden="true" className="mt-[7px] inline-block h-[7px] w-[7px] shrink-0 border" style={{ borderColor: PAPER, background: decision.stage >= i ? LIME : "transparent" }} />
              <span>{l}</span>
            </li>
          ))}
        </ol>
        <div className="mono px-4 py-3" style={{ borderTop: "1px solid var(--hair-night)", color: "var(--night-mute)" }}>
          Scores A {decision.scores[0]} · B {decision.scores[1]} · C {decision.scores[2]}
        </div>
      </aside>
    </div>
  );
}
