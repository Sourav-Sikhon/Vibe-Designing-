"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, Logo } from "./ui";

type Item = { label: string; href: string; desc?: string };

const SOLUTIONS: Item[] = [
  { label: "E-commerce & Retail", href: "#industries", desc: "Automated fulfilment and last-mile delivery" },
  { label: "Healthcare & Medical", href: "#industries", desc: "Coordinated logistics under safety and regulatory requirements" },
  { label: "Food & Grocery", href: "#industries", desc: "Intelligent local delivery and fulfilment" },
  { label: "Enterprise & Industrial", href: "#industries", desc: "Transport between facilities and business sites" },
  { label: "Smart Cities", href: "#industries", desc: "Connected autonomous delivery infrastructure" },
];
const TECHNOLOGY: Item[] = [
  { label: "AI Intelligence", href: "#intelligence", desc: "One intelligence orchestrating the fleet" },
  { label: "Autonomous Drones", href: "#ecosystem", desc: "Aerial transport for light, urgent parcels" },
  { label: "Robotic Couriers", href: "#ecosystem", desc: "Ground robots for local and last-mile delivery" },
  { label: "Autonomous Vehicles", href: "#ecosystem", desc: "Self-driving electric vehicles" },
  { label: "Smart Warehousing", href: "#ecosystem", desc: "Automated sorting, scanning and dispatch" },
];

const LINKS: Array<{ label: string; href: string; menu?: Item[] }> = [
  { label: "Solutions", href: "#industries", menu: SOLUTIONS },
  { label: "Technology", href: "#ecosystem", menu: TECHNOLOGY },
  { label: "Network", href: "#network" },
  { label: "Company", href: "#vision" },
  { label: "Insights", href: "#footer" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobile]);

  const hoverOpen = useCallback((k: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(k);
  }, []);
  const hoverClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color] duration-500"
        style={{
          height: "var(--nav-h)",
          background: mobile ? "var(--night)" : scrolled || open ? "rgb(248 249 247 / 0.96)" : "transparent",
          color: mobile ? "var(--paper)" : "var(--ink)",
          borderBottom: `1px solid ${mobile ? "var(--hair-night)" : scrolled || open ? "var(--hair)" : "transparent"}`,
          backdropFilter: scrolled && !mobile ? "saturate(1.1) blur(10px)" : undefined,
        }}
      >
        <div className="wrap flex h-full items-center justify-between">
          <a href="#top" aria-label="AERONEX home" className="shrink-0 no-underline">
            <Logo onDark={mobile} />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => l.menu && hoverOpen(l.label)}
                  onMouseLeave={() => l.menu && hoverClose()}
                >
                  {l.menu ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={open === l.label}
                        aria-haspopup="true"
                        onClick={() => setOpen(open === l.label ? null : l.label)}
                        className="nav-link flex min-h-[44px] items-center gap-2 px-4 text-[0.9375rem] font-medium"
                      >
                        {l.label}
                        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true" style={{ transform: open === l.label ? "rotate(180deg)" : undefined, transition: "transform .35s var(--ease-out)" }}>
                          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                      </button>
                      <div
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                        style={{
                          width: 420,
                          pointerEvents: open === l.label ? "auto" : "none",
                          visibility: open === l.label ? "visible" : "hidden",
                          opacity: open === l.label ? 1 : 0,
                          transform: `translateX(-50%) translateY(${open === l.label ? 0 : -8}px)`,
                          transition: "opacity .35s var(--ease-out), transform .35s var(--ease-out), visibility .35s",
                        }}
                      >
                        <ul className="border bg-[var(--paper)] p-2" style={{ borderColor: "var(--hair-strong)", borderRadius: "var(--radius)", boxShadow: "0 24px 48px -24px rgb(20 23 25 / 0.28)" }}>
                          {l.menu.map((m) => (
                            <li key={m.label}>
                              <a href={m.href} onClick={() => setOpen(null)} className="menu-item block rounded-[3px] px-4 py-3 no-underline">
                                <span className="block text-[0.9375rem] font-medium">{m.label}</span>
                                <span className="muted block text-[0.8125rem] leading-snug">{m.desc}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <a href={l.href} className="nav-link flex min-h-[44px] items-center px-4 text-[0.9375rem] font-medium no-underline">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="#network" className="nav-link flex min-h-[44px] items-center px-3 text-[0.9375rem] font-medium no-underline">
              Track Delivery
            </a>
            <a href="#contact" className="btn btn-primary" style={{ minHeight: 44 }}>
              Get in Touch <Arrow />
            </a>
          </div>

          <button
            type="button"
            className="grid h-12 w-12 place-items-center lg:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500" style={{ transform: mobile ? "translateY(6px) rotate(45deg)" : undefined }} />
              <span className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500" style={{ transform: mobile ? "translateY(-5px) rotate(-45deg)" : undefined }} />
            </span>
          </button>
        </div>
      </header>

      {/* full-screen mobile menu */}
      <div
        id="mobile-menu"
        className="on-night fixed inset-0 z-[90] overflow-y-auto lg:hidden"
        style={{
          background: "var(--night)",
          color: "var(--paper)",
          visibility: mobile ? "visible" : "hidden",
          opacity: mobile ? 1 : 0,
          clipPath: mobile ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path .7s var(--ease-out), opacity .4s, visibility .7s",
        }}
        aria-hidden={!mobile}
      >
        <div className="wrap flex min-h-full flex-col pb-10" style={{ paddingTop: "calc(var(--nav-h) + 12px)" }}>
          <ul>
            {LINKS.map((l) => (
              <li key={l.label} className="border-b" style={{ borderColor: "var(--hair-night)" }}>
                <a href={l.href} onClick={() => setMobile(false)} className="flex min-h-[64px] items-center justify-between text-[2rem] font-medium no-underline" style={{ letterSpacing: "-0.03em" }} tabIndex={mobile ? 0 : -1}>
                  {l.label}
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href="#contact" onClick={() => setMobile(false)} className="btn btn-primary on-night justify-center" tabIndex={mobile ? 0 : -1}>
              Get in Touch <Arrow />
            </a>
            <a href="#network" onClick={() => setMobile(false)} className="btn btn-ghost justify-center" style={{ borderColor: "var(--hair-night-strong)", color: "var(--paper)" }} tabIndex={mobile ? 0 : -1}>
              Track Delivery
            </a>
          </div>
          <p className="mono mt-auto pt-10" style={{ color: "var(--night-mute)" }}>
            AERONEX / Autonomous delivery network
          </p>
        </div>
      </div>

      <style>{`
        .nav-link{position:relative;color:var(--ink)}
        .nav-link::after{content:"";position:absolute;left:16px;right:16px;bottom:8px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease-out)}
        .nav-link:hover::after,.nav-link[aria-expanded="true"]::after{transform:scaleX(1)}
        .menu-item{transition:background-color .3s var(--ease-out)}
        .menu-item:hover,.menu-item:focus-visible{background:var(--paper-2)}
      `}</style>
    </>
  );
}
