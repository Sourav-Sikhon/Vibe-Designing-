"use client";

import { Arrow, Reveal, SceneStill } from "../ui";
import TitleBlock from "../TitleBlock";
import type { StillName } from "@/lib/three/scenes";

type Tech = {
  id: string;
  code: string;
  title: string;
  body: string;
  still: StillName;
  alt: string;
  w: number;
  h: number;
};

const TECH: Record<"wh" | "dr" | "ro" | "av" | "im", Tech> = {
  wh: {
    id: "wh",
    code: "AX-WH",
    title: "AI-Powered Warehousing",
    body: "Intelligent inventory processing, package identification, automated sorting, and dispatch coordination.",
    still: "warehouse",
    alt: "Interior of an automated warehouse with shelving, a conveyor under a scanning gantry, and two ground robots moving parcels.",
    w: 1400,
    h: 1000,
  },
  dr: {
    id: "dr",
    code: "AX-DR",
    title: "Autonomous Drones",
    body: "Aerial transportation for lightweight and time-sensitive deliveries.",
    still: "drone",
    alt: "A delivery drone carrying a parcel above a logistics hub with a rooftop landing pad.",
    w: 1200,
    h: 900,
  },
  ro: {
    id: "ro",
    code: "AX-RC",
    title: "Robotic Couriers",
    body: "Intelligent ground robots designed for local and last-mile delivery.",
    still: "robot",
    alt: "A compact ground courier robot carrying a parcel along a pavement towards a building entrance.",
    w: 1200,
    h: 900,
  },
  av: {
    id: "av",
    code: "AX-AV",
    title: "Autonomous Vehicles",
    body: "Self-driving electric vehicles for citywide and regional transportation.",
    still: "vehicle",
    alt: "An autonomous electric delivery vehicle with a white cargo module and lidar sensor driving along a city street.",
    w: 1200,
    h: 900,
  },
  im: {
    id: "im",
    code: "AX-IM",
    title: "Intelligent Machines",
    body: "Automated sorting, scanning, loading, and package distribution systems.",
    still: "machines",
    alt: "An automated sorting line with scanning gantries, diverter conveyors and a loading arm.",
    w: 1400,
    h: 1000,
  },
};

function Tile({ t, large = false, delay = 0 }: { t: Tech; large?: boolean; delay?: number }) {
  return (
    <Reveal delay={delay} className="tile group">
      <a href="#technology" className="block no-underline" aria-label={`View technology: ${t.title}`}>
        <div className="tile-img relative">
          <SceneStill name={t.still} alt={t.alt} w={t.w} h={t.h} />
          {/* registration marks that draw in on hover */}
          <i className="reg tl" aria-hidden="true" />
          <i className="reg tr" aria-hidden="true" />
          <i className="reg bl" aria-hidden="true" />
          <i className="reg br" aria-hidden="true" />
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="max-w-[44ch]">
            <p className="mono muted mb-3">{t.code}</p>
            <h3 className={large ? "h3" : "text-[1.375rem] font-medium leading-tight"} style={{ letterSpacing: "-0.02em" }}>
              {t.title}
            </h3>
            <p className="muted mt-3">{t.body}</p>
          </div>
        </div>
        <span className="link-arrow mt-6">
          View Technology <Arrow />
        </span>
      </a>
    </Reveal>
  );
}

export default function Ecosystem() {
  return (
    <section id="ecosystem" data-sheet="Ecosystem" data-no="A-03" className="sheet" aria-labelledby="eco-title">
      <div className="wrap">
        <div className="grid12 gap-y-8">
          <Reveal className="col-span-12 lg:col-span-7">
            <h2 id="eco-title" className="h2 max-w-[11ch]">
              Every Machine Has a Mission.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="lead muted">
              From intelligent warehouses to the final doorstep, every part of our network works together as one
              coordinated system.
            </p>
          </Reveal>
        </div>

        {/* editorial grid: one large showcase, four supporting blocks at different scales */}
        <div className="grid12 mt-[clamp(56px,7vw,104px)] gap-y-[clamp(56px,6vw,96px)]">
          <div className="col-span-12 lg:col-span-7">
            <Tile t={TECH.wh} large />
          </div>
          <div className="col-span-12 grid gap-[clamp(56px,6vw,96px)] sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:pt-[72px]">
            <Tile t={TECH.dr} delay={0.08} />
            <Tile t={TECH.ro} delay={0.16} />
          </div>

          <div className="col-span-12 lg:col-span-5 lg:row-start-2 lg:mt-[56px]">
            <Tile t={TECH.av} />
          </div>
          <div className="col-span-12 lg:col-span-7 lg:row-start-2">
            <Tile t={TECH.im} large delay={0.08} />
          </div>
        </div>

        <div className="mt-[clamp(48px,6vw,88px)] flex justify-end">
          <TitleBlock no="A-03" name="Ecosystem" scale="1:50" />
        </div>
      </div>
    </section>
  );
}
