"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "../ui";
import TitleBlock from "../TitleBlock";

const STEPS = [
  { t: "Order Received", d: "An order enters the AERONEX network and is automatically registered." },
  { t: "AI Processing", d: "AI analyzes package information, destination, delivery constraints, and available fleet capacity." },
  { t: "Intelligent Dispatch", d: "The system coordinates warehouse machines, drones, robots, and vehicles to assign the delivery journey." },
  { t: "Autonomous Transportation", d: "The selected delivery machines transport the package through coordinated logistics infrastructure." },
  { t: "Smart Delivery", d: "The package reaches its destination and the customer receives an automated delivery confirmation." },
];

const XS = [130, 395, 660, 925, 1190];
const BASE = 290;

/* ---- line-drawn station glyphs; origin = station centre on the baseline ---- */
const INK = "var(--ink)";
function Glyph({ i, active }: { i: number; active: boolean }) {
  const s = active ? INK : "var(--mute)";
  const p = { stroke: s, strokeWidth: 1.6, fill: "none", style: { transition: "stroke .5s var(--ease-out)" } } as const;
  switch (i) {
    case 0: // order terminal
      return (
        <g>
          <rect x={-46} y={-118} width={92} height={96} rx={3} {...p} />
          <line x1={-30} y1={-96} x2={14} y2={-96} {...p} />
          <line x1={-30} y1={-80} x2={30} y2={-80} {...p} />
          <line x1={-30} y1={-64} x2={6} y2={-64} {...p} />
          <rect x={-30} y={-48} width={60} height={16} rx={2} fill={active ? "var(--lime)" : "none"} stroke={s} strokeWidth={1.6} style={{ transition: "fill .5s" }} />
          <line x1={-22} y1={-22} x2={-22} y2={0} {...p} />
          <line x1={22} y1={-22} x2={22} y2={0} {...p} />
        </g>
      );
    case 1: // AI chip
      return (
        <g>
          <rect x={-44} y={-124} width={88} height={88} rx={3} {...p} />
          <rect x={-22} y={-102} width={44} height={44} rx={2} fill={active ? "var(--lime)" : "none"} stroke={s} strokeWidth={1.6} style={{ transition: "fill .5s" }} />
          {[-28, -10, 8, 26].map((o) => (
            <g key={o}>
              <line x1={o} y1={-124} x2={o} y2={-136} {...p} />
              <line x1={o} y1={-36} x2={o} y2={-24} {...p} />
              <line x1={-44} y1={-124 + 14 + (o + 28) * 0.9} x2={-56} y2={-124 + 14 + (o + 28) * 0.9} {...p} />
              <line x1={44} y1={-124 + 14 + (o + 28) * 0.9} x2={56} y2={-124 + 14 + (o + 28) * 0.9} {...p} />
            </g>
          ))}
          <line x1={0} y1={-24} x2={0} y2={0} {...p} />
        </g>
      );
    case 2: // warehouse dispatching to three machines
      return (
        <g>
          <path d="M-62 -2 V-64 L0 -88 L62 -64 V-2" {...p} />
          {[-36, 0, 36].map((x) => (
            <rect key={x} x={x - 12} y={-38} width={24} height={36} {...p} />
          ))}
          <path d="M-36 -92 L-52 -124 M0 -92 L0 -124 M36 -92 L52 -124" {...p} strokeDasharray="3 4" />
          <circle cx={-52} cy={-132} r={7} {...p} />
          <path d="M-6 -131 L6 -131 L0 -142 Z" {...p} />
          <rect x={45} y={-139} width={14} height={14} {...p} fill={active ? "var(--lime)" : "none"} />
        </g>
      );
    case 3: // vehicle + drone
      return (
        <g>
          <rect x={-60} y={-52} width={74} height={36} rx={4} {...p} />
          <path d="M14 -52 H38 L58 -34 V-16 H14 Z" {...p} />
          <circle cx={-34} cy={-12} r={11} {...p} fill="var(--paper)" />
          <circle cx={38} cy={-12} r={11} {...p} fill="var(--paper)" />
          <circle cx={26} cy={-60} r={3} fill={active ? "var(--lime)" : "none"} stroke={s} strokeWidth={1.6} />
          <g transform="translate(-6,-112)">
            <rect x={-12} y={-4} width={24} height={9} rx={2} {...p} />
            <line x1={-34} y1={-8} x2={34} y2={-8} {...p} />
            <line x1={-30} y1={-4} x2={-16} y2={-4} {...p} />
            <line x1={16} y1={-4} x2={30} y2={-4} {...p} />
            <line x1={0} y1={5} x2={0} y2={20} {...p} />
            <rect x={-9} y={20} width={18} height={14} {...p} fill={active ? "var(--lime)" : "none"} />
          </g>
        </g>
      );
    default: // doorstep: door, robot, confirmation
      return (
        <g>
          <rect x={-58} y={-110} width={50} height={110} {...p} />
          <circle cx={-18} cy={-52} r={2.4} fill={s} />
          <rect x={6} y={-30} width={46} height={20} rx={5} {...p} />
          <rect x={14} y={-40} width={30} height={10} rx={2} {...p} />
          <circle cx={16} cy={-6} r={6} {...p} fill="var(--paper)" />
          <circle cx={42} cy={-6} r={6} {...p} fill="var(--paper)" />
          <circle cx={36} cy={-96} r={15} fill={active ? "var(--lime)" : "none"} stroke={s} strokeWidth={1.6} style={{ transition: "fill .5s" }} />
          <path d="M29 -96 l5 5 l9 -10" {...p} />
        </g>
      );
  }
}

function Package({ x }: { x: number }) {
  // isometric parcel with lime strap
  return (
    <g transform={`translate(${x},${BASE - 18})`}>
      <path d="M0 -20 L22 -9 L0 2 L-22 -9 Z" fill="var(--paper)" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M-22 -9 L0 2 V28 L-22 17 Z" fill="var(--graphite)" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M22 -9 L0 2 V28 L22 17 Z" fill="#4a5459" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M-11 -14.5 L11 -3.5" stroke="var(--lime)" strokeWidth={3} />
    </g>
  );
}

function useMedia(q: string, initial = false) {
  const [m, setM] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}

function Track({ p }: { p: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const x = useTransform(p, [0, 1], [XS[0], XS[4]]);
  const w = useTransform(p, [0, 1], [0, XS[4] - XS[0]]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(4, Math.max(0, Math.round(v * 4)))));
  return (
    <svg viewBox="0 0 1320 340" className="block w-full" role="img" aria-label={`Delivery journey: step ${active + 1} of 5, ${STEPS[active].t}`}>
      <line x1={XS[0]} y1={BASE} x2={XS[4]} y2={BASE} stroke="var(--hair-strong)" strokeWidth={1} />
      {Array.from({ length: 89 }).map((_, i) => (
        <line key={i} x1={XS[0] + i * 12} y1={BASE} x2={XS[0] + i * 12} y2={BASE + (i % 22 === 0 ? 14 : 6)} stroke="var(--hair-strong)" />
      ))}
      <motion.rect x={XS[0]} y={BASE - 1.5} height={3} width={w} fill="var(--ink)" />
      <motion.rect x={XS[0]} y={BASE - 1.5} height={3} width={w} fill="var(--lime)" style={{ mixBlendMode: "normal" }} transform="translate(0,-3)" />
      {XS.map((sx, i) => (
        <g key={i} transform={`translate(${sx},${BASE})`}>
          <Glyph i={i} active={active === i} />
          <rect x={-5} y={-5} width={10} height={10} fill={active >= i ? "var(--lime)" : "var(--paper)"} stroke="var(--ink)" strokeWidth={1.5} style={{ transition: "fill .4s" }} />
        </g>
      ))}
      <motion.g style={{ x }}>
        <Package x={0} />
      </motion.g>
      {XS.map((sx, i) => (
        <text key={i} x={sx} y={BASE + 48} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }} fill={active === i ? "var(--ink)" : "var(--mute-aa)"}>
          {`Step 0${i + 1}`}
        </text>
      ))}
    </svg>
  );
}

function Interactive() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(4, Math.max(0, Math.round(v * 4)))));

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (i / 4) * range + 2, behavior: "smooth" });
  };

  return (
    <div ref={ref} style={{ height: "430vh" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden" style={{ paddingTop: "var(--nav-h)" }}>
        <div className="wrap w-full">
          <h2 id="process-title" className="h2 max-w-[18ch]" style={{ fontSize: "clamp(2rem, 3.8vw, 3.5rem)" }}>
            From Order to Doorstep. Fully Orchestrated.
          </h2>
          <div className="mt-6">
            <Track p={scrollYProgress} />
          </div>
          <div className="grid12 mt-5 items-start gap-y-6">
            <div className="col-span-12 lg:col-span-6" aria-live="polite">
              <p className="mono muted">Step {active + 1} of 5</p>
              <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.05]" style={{ letterSpacing: "-0.03em" }}>
                {STEPS[active].t}
              </h3>
              <p className="muted mt-4 max-w-[48ch]">{STEPS[active].d}</p>
            </div>
            <ol className="col-span-12 flex gap-2 lg:col-span-5 lg:col-start-8 lg:justify-end" aria-label="Jump to step">
              {STEPS.map((s, i) => (
                <li key={s.t}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={active === i ? "step" : undefined}
                    aria-label={`Step ${i + 1}: ${s.t}`}
                    className="mono grid h-12 w-12 place-items-center border transition-colors duration-300"
                    style={{
                      borderColor: active === i ? "var(--ink)" : "var(--hair-strong)",
                      background: active === i ? "var(--lime)" : "transparent",
                      borderRadius: "var(--radius)",
                      color: "var(--ink)",
                    }}
                  >
                    0{i + 1}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Static() {
  return (
    <div className="wrap">
      <h2 id="process-title" className="h2 max-w-[18ch]">
        From Order to Doorstep. Fully Orchestrated.
      </h2>
      <ol className="mt-12">
        {STEPS.map((s, i) => (
          <li key={s.t} className="grid items-center gap-x-8 gap-y-3 border-t py-8 sm:grid-cols-[170px_1fr]" style={{ borderColor: "var(--hair-strong)" }}>
            <svg viewBox="-80 -150 160 170" className="h-[110px] w-[130px]" aria-hidden="true">
              <Glyph i={i} active />
            </svg>
            <div>
              <p className="mono muted">Step 0{i + 1}</p>
              <h3 className="mt-2 text-[1.5rem] font-medium leading-tight" style={{ letterSpacing: "-0.02em" }}>{s.t}</h3>
              <p className="muted mt-2 max-w-[48ch]">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Process() {
  const reduce = useReducedMotion();
  const wide = useMedia("(min-width: 900px) and (min-height: 620px)");
  const interactive = wide && !reduce;
  return (
    <section id="process" data-sheet="Process" data-no="A-04" className="relative" aria-labelledby="process-title" style={{ background: "var(--paper-2)" }}>
      {interactive ? (
        <Interactive />
      ) : (
        <div style={{ paddingBlock: "var(--section-y)" }}>
          <Static />
        </div>
      )}
      <div className="wrap pb-10">
        <div className="flex justify-end">
          <TitleBlock no="A-04" name="Process" scale="Plan" />
        </div>
      </div>
      <Reveal>
        <span className="sr-only">End of process sheet</span>
      </Reveal>
    </section>
  );
}
