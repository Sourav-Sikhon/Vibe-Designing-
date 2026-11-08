"use client";

import { useState } from "react";
import { Reveal } from "../ui";
import TitleBlock from "../TitleBlock";

const ITEMS = [
  { t: "AI fleet orchestration", d: "One coordination layer assigns work across every machine in the network." },
  { t: "Autonomous navigation", d: "Machines plan and follow safe paths through streets, sidewalks and airspace." },
  { t: "Computer vision and object recognition", d: "Cameras and sensors help machines recognise parcels, obstacles and destinations." },
  { t: "Intelligent route planning", d: "Routes weigh distance, capacity and delivery constraints together." },
  { t: "Real-time monitoring", d: "Every journey is observed, with status visible to operators as it happens." },
  { t: "Secure data infrastructure", d: "Operational and customer data is designed to be protected by default." },
  { t: "Human oversight and intervention", d: "People supervise the network and can step in at any point." },
  { t: "Regulatory and operational compliance", d: "Operations are designed around applicable safety and regulatory requirements in each market." },
];

const CX = 210;
const STEP = 56;
const BOTTOM = 470;

function Stack({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 420 560" className="block h-auto w-full" role="img" aria-label={`Exploded stack of eight layers, from AI fleet orchestration at the base to regulatory compliance at the top. Highlighted layer: ${ITEMS[active].t}.`}>
      {/* vertical reference axis */}
      <line x1={CX} y1={30} x2={CX} y2={BOTTOM + 40} stroke="var(--hair-strong)" strokeDasharray="2 5" />
      {ITEMS.map((it, i) => {
        const y = BOTTOM - i * STEP;
        const on = i === active;
        const lift = on ? -16 : 0;
        const pts = `${CX},${y - 50} ${CX + 150},${y} ${CX},${y + 50} ${CX - 150},${y}`;
        const side = `${CX - 150},${y} ${CX},${y + 50} ${CX},${y + 58} ${CX - 150},${y + 8}`;
        const side2 = `${CX + 150},${y} ${CX},${y + 50} ${CX},${y + 58} ${CX + 150},${y + 8}`;
        return (
          <g key={it.t} style={{ transform: `translateY(${lift}px)`, transition: "transform .6s var(--ease-out)" }}>
            <polygon points={side} fill={on ? "#9ec54b" : "var(--paper-2)"} stroke="var(--ink)" strokeWidth={1.2} style={{ transition: "fill .5s" }} />
            <polygon points={side2} fill={on ? "#b4dd5c" : "#e2e5e0"} stroke="var(--ink)" strokeWidth={1.2} style={{ transition: "fill .5s" }} />
            <polygon points={pts} fill={on ? "var(--lime)" : "var(--paper)"} stroke="var(--ink)" strokeWidth={1.2} style={{ transition: "fill .5s" }} />
            <rect x={CX - 14} y={y - 7} width={28} height={14} rx={1.5} fill="none" stroke="var(--ink)" strokeWidth={1.1} opacity={on ? 1 : 0.35} transform={`skewX(0)`} />
            <line x1={CX + 150} y1={y} x2={CX + 176} y2={y} stroke="var(--ink)" strokeWidth={1} opacity={on ? 1 : 0.4} />
            <text x={CX + 184} y={y + 4} style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em" }} fill={on ? "var(--ink)" : "var(--mute-aa)"}>
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function TechSafety() {
  const [active, setActive] = useState(0);
  return (
    <section id="technology" data-sheet="Technology" data-no="A-09" className="sheet" aria-labelledby="tech-title">
      <div className="wrap">
        <div className="grid12 gap-y-14">
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start">
            <Reveal>
              <h2 id="tech-title" className="h2 max-w-[11ch]">
                Built on Intelligence. Designed for Trust.
              </h2>
              <p className="muted mt-6 max-w-[38ch]">
                The technologies that move a package, and the principles that keep people in charge of the network. Layers are
                shown bottom to top, from orchestration to oversight and compliance.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mx-auto mt-10 max-w-[460px] lg:mx-0">
              <Stack active={active} />
            </Reveal>
          </div>

          <ol className="col-span-12 lg:col-span-6 lg:col-start-7">
            {ITEMS.map((it, i) => (
              <li key={it.t}>
                <button
                  type="button"
                  className="tech-row grid w-full grid-cols-[48px_1fr] gap-x-4 py-7 text-left"
                  style={{ borderTop: "1px solid var(--hair-strong)", borderBottom: i === ITEMS.length - 1 ? "1px solid var(--hair-strong)" : undefined }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={active === i ? "true" : undefined}
                >
                  <span className="mono pt-[6px]" style={{ color: active === i ? "var(--ink)" : "var(--mute-aa)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[clamp(1.25rem,1.9vw,1.75rem)] font-medium leading-tight" style={{ letterSpacing: "-0.02em" }}>
                      <span className="tech-title">{it.t}</span>
                    </span>
                    <span className="muted mt-2 block max-w-[46ch]">{it.d}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-[clamp(48px,6vw,88px)] flex flex-wrap items-center justify-between gap-4">
          <p className="mono" style={{ color: "var(--mute-aa)" }}>Design principles. No certifications are claimed.</p>
          <TitleBlock no="A-09" name="Technology" scale="NTS" />
        </div>
      </div>
      <style>{`
        .tech-title{background:linear-gradient(var(--lime),var(--lime)) 0 100%/0 .38em no-repeat;transition:background-size .6s var(--ease-out)}
        .tech-row[aria-current="true"] .tech-title{background-size:100% .38em}
      `}</style>
    </section>
  );
}
