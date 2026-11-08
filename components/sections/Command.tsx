import { Reveal } from "../ui";
import CommandMap from "../CommandMap";
import TitleBlock from "../TitleBlock";

const CAPS = [
  { t: "Intelligent Routing", d: "Selects efficient delivery routes based on available network information." },
  { t: "Fleet Coordination", d: "Coordinates different autonomous delivery machines." },
  { t: "Predictive Operations", d: "Anticipates potential network disruptions and capacity requirements." },
  { t: "Real-Time Intelligence", d: "Monitors delivery progress and operational performance." },
];

export default function Command() {
  return (
    <section id="intelligence" data-sheet="Intelligence" data-no="A-05" data-theme="dark" className="sheet sheet-dark on-night" aria-labelledby="ai-title">
      <div className="wrap">
        <div className="grid12 gap-y-8">
          <Reveal className="col-span-12 lg:col-span-7">
            <h2 id="ai-title" className="h2 max-w-[12ch]">
              One Intelligence. An Entire Fleet.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="lead muted">
              Our AI orchestrates thousands of decisions across the delivery network, connecting machines, routes,
              inventory, and destinations in real time.
            </p>
          </Reveal>
        </div>

        <div className="mt-[clamp(48px,6vw,88px)]">
          <CommandMap />
        </div>

        <ul className="mt-[clamp(40px,5vw,72px)] grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {CAPS.map((c, i) => (
            <Reveal as="li" key={c.t} delay={i * 0.08} className="rule-t pt-6">
              <h3 className="text-[1.25rem] font-medium leading-tight" style={{ letterSpacing: "-0.02em" }}>
                {c.t}
              </h3>
              <p className="muted mt-3 max-w-[30ch]">{c.d}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-[clamp(48px,6vw,88px)] flex justify-end">
          <TitleBlock no="A-05" name="Intelligence" scale="NTS" />
        </div>
      </div>
    </section>
  );
}
