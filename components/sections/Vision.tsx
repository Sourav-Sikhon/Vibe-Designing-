import { Arrow, Reveal, SceneStill } from "../ui";
import TitleBlock from "../TitleBlock";

const PRINCIPLES = [
  { t: "Mission", d: "To automate the complete delivery lifecycle so that moving anything, anywhere, is smarter and more reliable." },
  { t: "Long-term vision", d: "A connected autonomous delivery infrastructure that cities, businesses and communities can rely on." },
  { t: "Innovation philosophy", d: "Build the whole system, not isolated machines. Every technology is designed to hand off to the next." },
  { t: "Responsible automation", d: "People stay in the loop. We design for human oversight, safety, and the regulations of every place we operate." },
];

export default function Vision() {
  return (
    <section id="vision" data-sheet="Vision" data-no="A-10" className="sheet" aria-labelledby="vision-title">
      <div className="wrap">
        <Reveal>
          <h2 id="vision-title" className="h2 max-w-[19ch]" style={{ fontSize: "clamp(2.25rem, 5.4vw, 5rem)" }}>
            The Future of Delivery Isn&apos;t Human or Machine. It&apos;s Intelligent Collaboration.
          </h2>
        </Reveal>

        <Reveal className="mt-[clamp(48px,6vw,88px)]">
          <SceneStill
            name="dusk"
            w={2100}
            h={900}
            alt="At dusk, an autonomous vehicle with lit lime accents on a dark street beside a logistics hub, with a delivery drone overhead and towers behind."
          />
        </Reveal>

        <div className="grid12 mt-[clamp(48px,6vw,88px)] gap-y-12">
          <Reveal className="col-span-12 lg:col-span-5">
            <p className="text-[clamp(1.25rem,1.9vw,1.75rem)] leading-[1.4]" style={{ letterSpacing: "-0.015em" }}>
              AERONEX is developing a connected autonomous delivery infrastructure: warehouses that sort themselves, machines
              that hand packages to one another, and one intelligence that keeps the whole journey moving.
            </p>
            <p className="muted mt-6 max-w-[46ch]">
              We believe the best logistics systems pair machine precision with human judgement.
            </p>
            <a href="#contact" className="btn btn-primary mt-10">
              Discover AERONEX <Arrow />
            </a>
          </Reveal>

          <dl className="col-span-12 lg:col-span-6 lg:col-start-7">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06} className="rule-t grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[190px_1fr]">
                <dt className="text-[1.0625rem] font-medium">{p.t}</dt>
                <dd className="muted">{p.d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="mt-[clamp(48px,6vw,88px)] flex justify-end">
          <TitleBlock no="A-10" name="Vision" scale="NTS" />
        </div>
      </div>
    </section>
  );
}
