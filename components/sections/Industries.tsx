"use client";

import { Arrow, Reveal, SceneStill } from "../ui";
import TitleBlock from "../TitleBlock";
import type { StillName } from "@/lib/three/scenes";

type Ind = { code: string; title: string; body: string; still: StillName; alt: string; w: number; h: number };

const IND: Record<string, Ind> = {
  retail: {
    code: "IN-EC",
    title: "E-commerce & Retail",
    body: "Automated order fulfillment and last-mile delivery.",
    still: "retail",
    alt: "A wall of stacked parcels with a ground courier robot beside it, representing automated retail fulfilment.",
    w: 1000,
    h: 1400,
  },
  health: {
    code: "IN-HM",
    title: "Healthcare & Medical Logistics",
    body: "Coordinated transportation of eligible medical supplies and time-sensitive packages under appropriate safety and regulatory requirements.",
    still: "health",
    alt: "A delivery drone carrying a white insulated crate in front of a low clinical building.",
    w: 1400,
    h: 900,
  },
  food: {
    code: "IN-FG",
    title: "Food & Grocery",
    body: "Intelligent local delivery and automated fulfillment.",
    still: "food",
    alt: "A ground courier robot carrying an insulated crate along a tree-lined pavement.",
    w: 1000,
    h: 1000,
  },
  enterprise: {
    code: "IN-EI",
    title: "Enterprise & Industrial",
    body: "Automated transportation between facilities and business locations.",
    still: "enterprise",
    alt: "An autonomous vehicle driving between two industrial buildings linked by an overhead bridge.",
    w: 1000,
    h: 1000,
  },
  city: {
    code: "IN-SC",
    title: "Smart Cities",
    body: "Connected autonomous delivery infrastructure for urban environments.",
    still: "city",
    alt: "A city skyline with autonomous vehicles on the street and delivery drones overhead.",
    w: 2100,
    h: 900,
  },
};

function Card({ d, delay = 0 }: { d: Ind; delay?: number }) {
  return (
    <Reveal delay={delay} className="tile group">
      <a href="#contact" className="block no-underline" aria-label={`${d.title}: discuss a partnership`}>
        <div className="tile-img relative">
          <SceneStill name={d.still} alt={d.alt} w={d.w} h={d.h} />
          <i className="reg tl" aria-hidden="true" />
          <i className="reg tr" aria-hidden="true" />
          <i className="reg bl" aria-hidden="true" />
          <i className="reg br" aria-hidden="true" />
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="max-w-[46ch]">
            <p className="mono muted mb-2.5">{d.code}</p>
            <h3 className="text-[clamp(1.25rem,1.8vw,1.625rem)] font-medium leading-tight" style={{ letterSpacing: "-0.02em" }}>
              {d.title}
            </h3>
            <p className="muted mt-2.5">{d.body}</p>
          </div>
          <span className="mt-8 hidden shrink-0 sm:block" aria-hidden="true"><Arrow /></span>
        </div>
      </a>
    </Reveal>
  );
}

export default function Industries() {
  return (
    <section id="industries" data-sheet="Industries" data-no="A-07" className="sheet" aria-labelledby="ind-title">
      <div className="wrap">
        <div className="grid12 gap-y-8">
          <Reveal className="col-span-12 lg:col-span-8">
            <h2 id="ind-title" className="h2 max-w-[13ch]">
              Built for the Way the World Moves.
            </h2>
          </Reveal>
        </div>

        <div className="grid12 mt-[clamp(48px,6vw,88px)] gap-y-[clamp(48px,5vw,80px)]">
          <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-1 lg:row-span-2">
            <Card d={IND.retail} />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <Card d={IND.health} delay={0.06} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Card d={IND.food} delay={0.06} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 lg:mt-[72px]">
            <Card d={IND.enterprise} delay={0.12} />
          </div>
          <div className="col-span-12">
            <Card d={IND.city} />
          </div>
        </div>

        <div className="mt-[clamp(48px,6vw,88px)] flex justify-end">
          <TitleBlock no="A-07" name="Industries" scale="1:100" />
        </div>
      </div>
    </section>
  );
}
