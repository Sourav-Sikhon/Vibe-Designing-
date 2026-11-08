import { Reveal, SceneStill } from "../ui";
import TitleBlock from "../TitleBlock";

const AREAS = [
  { t: "Electric-first transportation", d: "Vehicles, robots and drones are specified around electric power from the start." },
  { t: "Intelligent route optimization", d: "Routing that looks for shorter, smoother journeys across the whole fleet at once." },
  { t: "Automated operational efficiency", d: "Automation in hubs and handoffs aims to remove unnecessary handling and idle movement." },
];

export default function Sustainability() {
  return (
    <section id="sustainability" data-sheet="Sustainability" data-no="A-08" className="sheet" aria-labelledby="sus-title" style={{ background: "var(--paper-2)" }}>
      <div className="wrap">
        <div className="grid12 gap-y-8">
          <Reveal className="col-span-12 lg:col-span-7">
            <h2 id="sus-title" className="h2 max-w-[13ch]">
              Smarter Deliveries. A Lighter Footprint.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="lead muted">
              We are building a delivery infrastructure designed to make transportation more intelligent, efficient, and
              environmentally conscious.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-[clamp(48px,6vw,88px)]">
          <SceneStill
            name="green"
            w={2100}
            h={900}
            alt="Autonomous electric vehicles on a street beside a park with trees, and a solar-roofed charging bay in a modern urban setting."
          />
        </Reveal>

        <ul className="mt-[clamp(32px,4vw,56px)] grid gap-x-10 gap-y-10 md:grid-cols-3">
          {AREAS.map((a, i) => (
            <Reveal as="li" key={a.t} delay={i * 0.08} className="rule-t pt-6">
              <h3 className="text-[1.375rem] font-medium leading-tight" style={{ letterSpacing: "-0.02em" }}>
                {a.t}
              </h3>
              <p className="muted mt-3 max-w-[34ch]">{a.d}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-[clamp(40px,5vw,72px)] flex flex-wrap items-center justify-between gap-4">
          <p className="mono" style={{ color: "var(--mute-aa)" }}>Focus areas describe design intent. No environmental impact figures are claimed.</p>
          <TitleBlock no="A-08" name="Mobility" scale="NTS" />
        </div>
      </div>
    </section>
  );
}
