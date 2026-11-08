"use client";

import { useEffect, useState } from "react";

const SHEETS = [
  { id: "top", no: "A-01", name: "Hero" },
  { id: "scale", no: "A-02", name: "Scale" },
  { id: "ecosystem", no: "A-03", name: "Ecosystem" },
  { id: "process", no: "A-04", name: "Process" },
  { id: "intelligence", no: "A-05", name: "Intelligence" },
  { id: "network", no: "A-06", name: "Network" },
  { id: "industries", no: "A-07", name: "Industries" },
  { id: "sustainability", no: "A-08", name: "Mobility" },
  { id: "technology", no: "A-09", name: "Technology" },
  { id: "vision", no: "A-10", name: "Vision" },
  { id: "contact", no: "A-11", name: "Contact" },
];

/** Sheet index: a ruled margin with one tick per sheet; the lime tick marks where "now" is. */
export default function SheetRail() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const els = SHEETS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const on = () => {
      const mid = window.innerHeight * 0.45;
      let idx = 0;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid) idx = i;
      });
      setActive(idx);
      setDark(els[idx]?.dataset.theme === "dark");
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const ink = dark ? "#f8f9f7" : "#141719";
  return (
    <nav aria-label="Sheet index" className="fixed right-3 top-1/2 z-[60] hidden -translate-y-1/2 min-[1380px]:block" style={{ color: ink, transition: "color .5s" }}>
      <ol className="flex flex-col items-end">
        {SHEETS.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-label={`Sheet ${s.no}: ${s.name}`} aria-current={active === i ? "location" : undefined} className="rail-tick group flex h-[22px] items-center justify-end gap-3 no-underline">
              <span className="mono pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" style={{ fontSize: 10 }}>
                {s.no} · {s.name}
              </span>
              <span
                aria-hidden="true"
                className="block h-px transition-all duration-500"
                style={{
                  width: active === i ? 28 : 12,
                  background: active === i ? "var(--lime)" : "currentColor",
                  opacity: active === i ? 1 : 0.45,
                  height: active === i ? 3 : 1,
                  outline: active === i ? `1px solid ${ink}` : undefined,
                }}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
