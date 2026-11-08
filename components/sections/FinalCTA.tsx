import { Arrow, Logo, Reveal, SceneStill } from "../ui";
import TitleBlock from "../TitleBlock";

const COLS = [
  { h: "Company", l: [["About Us", "#vision"], ["Our Vision", "#vision"], ["Careers", ""], ["Newsroom", ""]] },
  { h: "Solutions", l: [["E-commerce", "#industries"], ["Healthcare", "#industries"], ["Retail", "#industries"], ["Enterprise Logistics", "#industries"], ["Smart Cities", "#industries"]] },
  { h: "Technology", l: [["AI Intelligence", "#intelligence"], ["Autonomous Drones", "#ecosystem"], ["Robotic Couriers", "#ecosystem"], ["Autonomous Vehicles", "#ecosystem"], ["Smart Warehousing", "#ecosystem"]] },
  { h: "Resources", l: [["Insights", ""], ["Research", ""], ["Case Studies", ""], ["Contact", "#contact"]] },
] as const;

export default function FinalCTA() {
  return (
    <>
      <section id="contact" data-sheet="Contact" data-no="A-11" data-theme="dark" className="sheet sheet-dark on-night relative isolate overflow-hidden" aria-labelledby="cta-title">
        {/* vehicle + drone composition, right-weighted so the copy stays on clean night */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[78%]" aria-hidden={false}>
          <SceneStill name="cta" w={1500} h={1100} className="!h-full !w-full !rounded-none [&>img]:object-[70%_50%]" alt="An autonomous electric vehicle with lime light details beneath a delivery drone and a ground courier robot, on a dark street at night." />
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, var(--night) 0%, rgb(16 20 22 / 0.7) 28%, rgb(16 20 22 / 0) 52%), linear-gradient(0deg, var(--night) 0%, rgb(16 20 22 / 0) 22%)" }} />
        </div>
        <div className="wrap relative">
          <div className="grid12">
            <div className="col-span-12 py-[clamp(40px,7vw,120px)] lg:col-span-6">
              <Reveal>
                <h2 id="cta-title" className="h2 max-w-[12ch]">
                  Ready to Move Beyond Traditional Delivery?
                </h2>
                <p className="lead muted mt-7">
                  Connect your business to an intelligent delivery network built for the next generation of logistics.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a href="mailto:partners@aeronex.example" className="btn btn-primary">
                    Partner With Us <Arrow />
                  </a>
                  <a href="#technology" className="btn btn-ghost">
                    Explore Our Technology
                  </a>
                </div>
                <p className="mono mt-6" style={{ color: "var(--night-mute)" }}>Contact address is a placeholder until launch.</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" data-theme="dark" className="sheet-dark on-night relative" style={{ borderTop: "1px solid var(--hair-night)" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(56px,6vw,96px) 0" }}>
          <div className="grid12 gap-y-12">
            <div className="col-span-12 lg:col-span-4">
              <Logo onDark />
              <p className="muted mt-6 max-w-[30ch]">An intelligent delivery network for the autonomous era.</p>
            </div>
            {COLS.map((c) => (
              <nav key={c.h} aria-label={c.h} className="col-span-6 lg:col-span-2">
                <h3 className="mono mb-5" style={{ color: "var(--night-mute)" }}>{c.h}</h3>
                <ul className="space-y-1">
                  {c.l.map(([label, href]) => (
                    <li key={label}>
                      {href ? (
                        <a href={href} className="foot-link inline-flex min-h-[32px] items-center text-[0.9375rem] no-underline">
                          {label}
                        </a>
                      ) : (
                        <span className="foot-link inline-flex min-h-[32px] items-center text-[0.9375rem]" title="Page coming soon" style={{ opacity: 0.6 }}>
                          {label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-[clamp(48px,6vw,88px)] flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-8" style={{ borderTop: "1px solid var(--hair-night)" }}>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <Logo onDark className="scale-90 origin-left" />
              <p className="muted text-[0.875rem]">© 2026 AERONEX. All rights reserved.</p>
            </div>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.875rem]">
              {["Privacy Policy", "Terms of Service", "LinkedIn", "YouTube"].map((l) => (
                <li key={l}>
                  <span className="foot-link inline-flex min-h-[32px] items-center" title="Link coming soon" style={{ opacity: 0.6 }}>
                    {l}
                  </span>
                </li>
              ))}
            </ul>
            <TitleBlock no="A-12" name="Colophon" scale="NTS" />
          </div>
        </div>
        <style>{`
          .foot-link{color:var(--night-mute);transition:color .3s var(--ease-out)}
          .foot-link:hover{color:var(--paper)}
          .foot-link[aria-disabled="true"]{cursor:default}
        `}</style>
      </footer>
    </>
  );
}
