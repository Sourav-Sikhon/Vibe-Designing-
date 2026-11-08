"use client";

import { CountUp, Reveal } from "../ui";
import TitleBlock from "../TitleBlock";

const METRICS = [
  { value: "24/7", count: null, label: "Autonomous Operations", tag: "Operating target" },
  { value: "99.9", count: 99.9, dec: 1, suffix: "%", label: "Target Network Reliability", tag: "Reliability target" },
  { value: "5", count: 5, label: "Integrated Delivery Technologies", tag: "Design scope" },
  { value: "100", count: 100, suffix: "%", label: "AI-Coordinated Operations", tag: "Design target" },
] as const;

export default function Metrics() {
  return (
    <section id="scale" data-sheet="Scale" data-no="A-02" className="sheet" aria-labelledby="scale-title">
      <div className="wrap">
        <div className="grid12 gap-y-8">
          <Reveal className="col-span-12 lg:col-span-8">
            <h2 id="scale-title" className="h2 max-w-[14ch]">
              One Network. Countless Possibilities.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="col-span-12 lg:col-span-4 lg:self-end">
            <p className="muted max-w-[34ch]">
              Five delivery technologies designed to run as one coordinated system. The figures below are illustrative
              brand targets, not verified operating results.
            </p>
          </Reveal>
        </div>

        {/* dimension line: the four measures hang from a ruled scale */}
        <div className="relative mt-[clamp(56px,7vw,104px)]">
          <svg className="block h-[18px] w-full" viewBox="0 0 1320 18" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="9" x2="1320" y2="9" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {Array.from({ length: 111 }).map((_, i) => (
              <line key={i} x1={i * 12} y1={i % 10 === 0 ? 0 : 5} x2={i * 12} y2={i % 10 === 0 ? 18 : 13} stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity={i % 10 === 0 ? 1 : 0.35} />
            ))}
          </svg>
          <ul className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {METRICS.map((m, i) => (
              <li key={m.label} className="relative pr-6 pt-8" style={{ borderLeft: i % 2 === 0 || true ? "1px solid var(--hair-strong)" : undefined, paddingLeft: "clamp(14px,1.6vw,24px)", marginTop: -1 }}>
                <Reveal delay={i * 0.1}>
                  <p className="font-medium leading-none" style={{ fontSize: "clamp(3.25rem, 6.6vw, 6rem)", letterSpacing: "-0.045em" }}>
                    {m.count === null ? (
                      <span className="tnum">{m.value}</span>
                    ) : (
                      <CountUp to={m.count} decimals={"dec" in m ? m.dec : 0} suffix={"suffix" in m ? m.suffix : ""} />
                    )}
                  </p>
                  <p className="mt-5 max-w-[20ch] text-[1.0625rem] font-medium leading-snug">{m.label}</p>
                  <p className="mono mt-3 inline-flex items-center gap-2" style={{ color: "var(--mute-aa)" }}>
                    <span aria-hidden="true" className="inline-block h-[7px] w-[7px] border" style={{ borderColor: "var(--ink)" }} />
                    {m.tag}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[clamp(48px,6vw,88px)] flex flex-wrap items-center justify-between gap-4">
          <p className="mono" style={{ color: "var(--mute-aa)" }}>
            Illustrative targets. Replace with measured data when available.
          </p>
          <TitleBlock no="A-02" name="Scale" scale="NTS" />
        </div>
      </div>
    </section>
  );
}
