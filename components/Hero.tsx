"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Arrow } from "./ui";
import TitleBlock from "./TitleBlock";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const f = () => setT(new Date().toISOString().slice(11, 19));
    f();
    const i = setInterval(f, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="tnum">{t} UTC</span>;
}

const STATUS = [
  { k: "Network status", v: "Operational" },
  { k: "AI fleet", v: "Active" },
  { k: "Delivery network", v: "Connected" },
];

function StatusPanel() {
  return (
    <div className="w-full border bg-[var(--paper)]" style={{ borderColor: "var(--hair-strong)", borderRadius: "var(--radius)" }}>
      <div className="mono flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--hair)", color: "var(--mute-aa)" }}>
        <span>Live status · demo</span>
        <Clock />
      </div>
      <dl>
        {STATUS.map((s) => (
          <div key={s.k} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--hair)" }}>
            <dt className="mono" style={{ color: "var(--mute-aa)" }}>{s.k}</dt>
            <dd className="mono flex items-center gap-2" style={{ color: "var(--ink)" }}>
              <span className="dot" aria-hidden="true" />
              {s.v}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mono px-4 py-2.5" style={{ color: "var(--mute-aa)" }}>
        Demonstration data. Not a live feed.
      </p>
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="top" data-sheet="Hero" className="sheet relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden !p-0" aria-labelledby="hero-title">
      {/* scene: full-bleed on desktop, a cinematic band above the copy on phones */}
      <div className="absolute inset-0 max-lg:bottom-auto max-lg:h-[60svh]">
        <HeroScene />
      </div>
      {/* legibility scrim for the headline column */}
      <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0" />

      <div className="wrap relative z-10 pb-[clamp(28px,4.5vw,64px)] pt-[calc(var(--nav-h)+40px)] max-lg:pt-[52svh]">
        <div className="grid12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <motion.h1 id="hero-title" className="display max-w-[11ch] lg:max-w-[12ch]" {...rise(0)}>
              Delivery, Reimagined for the Autonomous&nbsp;Era.
            </motion.h1>
            <motion.p className="lead muted mt-7" style={{ maxWidth: "40ch" }} {...rise(1)}>
              An intelligent delivery network where AI, robotics, drones, and autonomous vehicles work together to move
              anything, anywhere, smarter.
            </motion.p>
            <motion.div className="mt-9 flex flex-wrap gap-3" {...rise(2)}>
              <a href="#network" className="btn btn-primary">
                Explore Our Network <Arrow />
              </a>
              <a href="#process" className="btn btn-ghost">
                See How It Works
              </a>
            </motion.div>
          </div>

          {/* network status: in flow on phones, floating top-right on desktop */}
          <motion.aside
            aria-label="Network status, demonstration data"
            className="col-span-12 lg:hidden"
            {...rise(3)}
          >
            <StatusPanel />
          </motion.aside>
        </div>

        {/* drawing-set furniture: column references A-L on the 12-col grid, sheet block bottom right */}
        <div className="mt-12 hidden md:block" aria-hidden="true">
          <ol className="grid12">
            {"ABCDEFGHIJKL".split("").map((c) => (
              <li key={c} className="mono pl-2" style={{ borderLeft: "1px solid var(--hair-strong)", color: "var(--mute-aa)", lineHeight: "18px", height: 18 }}>
                {c}
              </li>
            ))}
          </ol>
          <div className="mt-4 flex justify-end">
            <TitleBlock no="A-01" name="Hero" scale="NTS" />
          </div>
        </div>
      </div>

      <motion.aside
        aria-label="Network status, demonstration data"
        className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+20px)] z-10 hidden lg:block"
        {...rise(3)}
      >
        <div className="wrap flex justify-end">
          <div className="pointer-events-auto w-[320px]">
            <StatusPanel />
          </div>
        </div>
      </motion.aside>
    </section>
  );
}
