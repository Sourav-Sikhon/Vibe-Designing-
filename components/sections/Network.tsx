"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "../ui";
import TitleBlock from "../TitleBlock";
import { DEMO_STATS, FEED, ROUTES, WAREHOUSES, pathD, type Layer, type Pt } from "@/lib/network-data";

const LAYERS: Array<{ id: Layer; label: string }> = [
  { id: "drone", label: "Drone" },
  { id: "robot", label: "Ground Robot" },
  { id: "vehicle", label: "Vehicle" },
  { id: "warehouse", label: "Warehouse" },
];

const DESTS: Pt[] = [[432, 432], [752, 352], [912, 352], [592, 592], [1072, 352], [272, 112], [912, 592], [1072, 112], [112, 272], [192, 432], [1152, 512], [592, 432]];

type Sel = { id: string; title: string; rows: Array<[string, string]> } | null;

function Shape({ layer, selected }: { layer: Layer; selected: boolean }) {
  const fill = selected ? "var(--lime)" : "var(--ink)";
  const stroke = selected ? "var(--ink)" : "var(--paper)";
  const common = { fill, stroke, strokeWidth: 2 };
  if (layer === "warehouse") return <rect x={-12} y={-12} width={24} height={24} {...common} />;
  if (layer === "drone") return <path d="M0 -13 L13 10 L-13 10 Z" {...common} strokeLinejoin="round" />;
  if (layer === "robot") return <path d="M0 -12 L12 0 L0 12 L-12 0 Z" {...common} />;
  return <circle r={11} {...common} />;
}

export default function Network() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState<Record<Layer, boolean>>({ drone: true, robot: true, vehicle: true, warehouse: true });
  const [sel, setSel] = useState<Sel>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [feed, setFeed] = useState<Array<{ t: string; m: string }>>([]);

  const stamp = (i: number) => {
    const s = 14 * 3600 + 32 * 60 + i * 7;
    const h = Math.floor(s / 3600) % 24;
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
  };

  useEffect(() => {
    let n = 5;
    setFeed(Array.from({ length: 5 }, (_, i) => ({ t: stamp(5 - i), m: FEED[(5 - i) % FEED.length] })));
    if (reduce) return;
    const iv = setInterval(() => {
      n += 1;
      setFeed((f) => [{ t: stamp(n * 3), m: FEED[n % FEED.length] }, ...f].slice(0, 5));
    }, 3200);
    return () => clearInterval(iv);
  }, [reduce]);

  const blocks = useMemo(() => {
    const out: Array<{ x: number; y: number; park: boolean }> = [];
    for (let i = 0; i < 14; i++)
      for (let j = 0; j < 8; j++) out.push({ x: 40 + i * 80, y: 40 + j * 80, park: (i * 7 + j * 3) % 11 === 0 });
    return out;
  }, []);

  const select = (id: string, title: string, rows: Array<[string, string]>) => {
    setSelId(id);
    setSel({ id, title, rows });
  };
  const toggle = (l: Layer) => {
    setOn((s) => {
      const nxt = { ...s, [l]: !s[l] };
      return nxt;
    });
    setSel((s) => (s && ((s.id.startsWith("W") && l === "warehouse") || (s.id.startsWith("V") && l === "vehicle") || (s.id.startsWith("D") && l === "drone") || (s.id.startsWith("R") && l === "robot")) ? null : s));
  };

  return (
    <section id="network" data-sheet="Network" data-no="A-06" className="sheet" aria-labelledby="net-title">
      <div className="wrap">
        <div className="grid12 gap-y-8">
          <Reveal className="col-span-12 lg:col-span-7">
            <h2 id="net-title" className="h2 max-w-[12ch]">
              See the Network in Motion.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="muted">
              A demonstration of how AERONEX hubs, vehicles, drones and ground robots appear on one live map. Every value on
              this map is sample data.
            </p>
          </Reveal>
        </div>

        {/* layer controls */}
        <div className="mt-[clamp(40px,5vw,72px)] flex flex-wrap items-center gap-2" role="group" aria-label="Map layers">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={on[l.id]}
              onClick={() => toggle(l.id)}
              className="mono inline-flex min-h-[44px] items-center gap-3 border px-4 transition-colors duration-300"
              style={{
                borderRadius: "var(--radius)",
                border: on[l.id] ? "1px solid var(--ink)" : "1px dashed var(--hair-strong)",
                background: on[l.id] ? "var(--lime)" : "transparent",
                color: on[l.id] ? "var(--ink)" : "var(--mute-aa)",
              }}
            >
              <svg width="14" height="14" viewBox="-14 -14 28 28" aria-hidden="true">
                {l.id === "warehouse" ? (
                  <rect x={-10} y={-10} width={20} height={20} fill={on[l.id] ? "var(--ink)" : "none"} stroke="currentColor" strokeWidth={2.5} />
                ) : l.id === "drone" ? (
                  <path d="M0 -11 L11 9 L-11 9 Z" fill={on[l.id] ? "var(--ink)" : "none"} stroke="currentColor" strokeWidth={2.5} />
                ) : l.id === "robot" ? (
                  <path d="M0 -11 L11 0 L0 11 L-11 0 Z" fill={on[l.id] ? "var(--ink)" : "none"} stroke="currentColor" strokeWidth={2.5} />
                ) : (
                  <circle r={10} fill={on[l.id] ? "var(--ink)" : "none"} stroke="currentColor" strokeWidth={2.5} />
                )}
              </svg>
              {l.label}
              <span className="ml-1 text-[0.625rem]" aria-hidden="true">{on[l.id] ? "ON" : "OFF"}</span>
              <span className="sr-only">{on[l.id] ? "(shown)" : "(hidden)"}</span>
            </button>
          ))}
        </div>

        <div className="grid12 mt-4 items-stretch gap-y-6">
          <div className="relative col-span-12 overflow-hidden border lg:col-span-9" style={{ borderColor: "var(--hair-strong)", borderRadius: "var(--radius)", background: "var(--paper-2)" }}>
            <svg viewBox="0 0 1200 700" className="block h-auto w-full" role="group" aria-label="Interactive network map with sample data. Markers are buttons that reveal details.">
              {/* city */}
              <path d="M-20 560 C 220 470, 380 640, 600 560 S 980 380, 1220 440" fill="none" stroke="#dfe7ea" strokeWidth={46} />
              {blocks.map((b, i) => (
                <rect key={i} x={b.x} y={b.y} width={64} height={64} rx={2} fill={b.park ? "#e1eadc" : "#f8f9f7"} stroke="rgb(20 23 25 / 0.07)" />
              ))}

              {/* routes */}
              {ROUTES.filter((r) => on[r.layer]).map((r) => (
                <g key={r.id}>
                  <path d={pathD(r.path)} fill="none" stroke="var(--ink)" strokeWidth={r.layer === "vehicle" ? 3 : 2} strokeLinejoin="round" strokeDasharray={r.layer === "drone" ? "2 9" : r.layer === "robot" ? "1 6" : undefined} strokeLinecap="round" opacity={selId === r.id || !selId ? 0.9 : 0.35} />
                  <path d={pathD(r.path)} fill="none" stroke="var(--lime)" strokeWidth={r.layer === "vehicle" ? 3 : 2} strokeLinecap="round" className={reduce ? undefined : "flow-line"} opacity={selId === r.id ? 1 : 0} />
                  {!reduce && (
                    <circle r={4.5} fill="var(--lime)" stroke="var(--ink)" strokeWidth={1.6}>
                      <animateMotion dur={`${r.dur}s`} repeatCount="indefinite" path={pathD(r.path)} />
                    </circle>
                  )}
                </g>
              ))}

              {/* destinations */}
              {DESTS.map((d, i) => (
                <g key={i} aria-hidden="true">
                  <circle cx={d[0]} cy={d[1]} r={7} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.6} />
                  <circle cx={d[0]} cy={d[1]} r={2.2} fill="var(--ink)" />
                </g>
              ))}

              {/* markers */}
              {on.warehouse &&
                WAREHOUSES.map((w) => (
                  <g
                    key={w.id}
                    className="mk"
                    transform={`translate(${w.at[0]} ${w.at[1]})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${w.name}. ${w.load}. Sample data.`}
                    aria-pressed={selId === w.id}
                    onClick={() => select(w.id, w.name, [["Type", "Warehouse hub"], ["Activity", w.load], ["Data", "Sample"]])}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select(w.id, w.name, [["Type", "Warehouse hub"], ["Activity", w.load], ["Data", "Sample"]]))}
                  >
                    <circle className="mk-ring" r={24} fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="3 3" />
                    <Shape layer="warehouse" selected={selId === w.id} />
                    <text y={-20} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }} fill="var(--ink)">{w.id}</text>
                  </g>
                ))}
              {ROUTES.filter((r) => on[r.layer]).map((r) => {
                const rows: Array<[string, string]> = [["Status", r.status], ["Sample ETA", r.eta], ["Payload", r.payload], ["Origin", `Hub ${r.from}`]];
                const title = `${r.layer === "vehicle" ? "Vehicle" : r.layer === "drone" ? "Drone" : "Ground robot"} ${r.id}`;
                return (
                  <g
                    key={r.id}
                    className="mk"
                    transform={`translate(${r.marker[0]} ${r.marker[1]})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${title}. ${r.status}. Sample ETA ${r.eta}. Sample data.`}
                    aria-pressed={selId === r.id}
                    onClick={() => select(r.id, title, rows)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select(r.id, title, rows))}
                  >
                    <circle className="mk-ring" r={22} fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="3 3" />
                    <Shape layer={r.layer} selected={selId === r.id} />
                  </g>
                );
              })}
            </svg>

            {/* floating information panel */}
            <aside className="absolute left-3 top-3 border bg-[var(--paper)] sm:left-5 sm:top-5" style={{ borderColor: "var(--hair-strong)", borderRadius: "var(--radius)" }} aria-label="Network summary, demonstration values">
              <dl className="grid grid-cols-2 sm:block">
                {DEMO_STATS.map((s) => (
                  <div key={s.k} className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-4 sm:py-2.5" style={{ borderTop: "1px solid var(--hair)" }}>
                    <dt className="mono" style={{ color: "var(--mute-aa)" }}>{s.k}</dt>
                    <dd className="mono tnum flex items-center gap-2" style={{ color: "var(--ink)" }}>
                      {s.k === "Network status" && <span className="dot" aria-hidden="true" />}
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mono px-3 py-2 sm:px-4" style={{ borderTop: "1px solid var(--hair)", color: "var(--mute-aa)" }}>
                Demonstration values
              </p>
            </aside>
          </div>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-3">
            {/* selected marker */}
            <div className="border" style={{ borderColor: "var(--hair-strong)", borderRadius: "var(--radius)" }} aria-live="polite">
              <p className="mono px-4 py-3" style={{ borderBottom: "1px solid var(--hair)", color: "var(--mute-aa)" }}>Marker details · sample</p>
              {sel ? (
                <div className="px-4 py-4">
                  <p className="text-[1.125rem] font-medium leading-tight" style={{ letterSpacing: "-0.01em" }}>{sel.title}</p>
                  <dl className="mt-3">
                    {sel.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 py-1.5 text-[0.9375rem]" style={{ borderTop: "1px solid var(--hair)" }}>
                        <dt className="muted">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="muted px-4 py-4 text-[0.9375rem]">Select a marker on the map to see its details.</p>
              )}
            </div>

            {/* activity feed */}
            <div className="flex-1 border" style={{ borderColor: "var(--hair-strong)", borderRadius: "var(--radius)" }}>
              <p className="mono flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--hair)", color: "var(--mute-aa)" }}>
                <span>Activity · sample</span>
                <span className="flex items-center gap-2"><span className="dot" aria-hidden="true" />Simulated</span>
              </p>
              <ol role="log" aria-live="off" aria-label="Sample delivery events">
                {feed.map((f, i) => (
                  <li key={f.t + f.m} className="px-4 py-3 text-[0.9375rem] leading-snug" style={{ borderTop: i ? "1px solid var(--hair)" : undefined, opacity: 1 - i * 0.14 }}>
                    <span className="mono tnum block" style={{ color: "var(--mute-aa)" }}>{f.t}</span>
                    {f.m}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(40px,5vw,72px)] flex flex-wrap items-center justify-between gap-4">
          <p className="mono" style={{ color: "var(--mute-aa)" }}>Demonstration only. Not connected to real vehicles or fleet systems.</p>
          <TitleBlock no="A-06" name="Network" scale="1:5000" />
        </div>
      </div>
      <style>{`
        .mk{cursor:pointer;outline:none}
        .mk-ring{opacity:0;transition:opacity .3s var(--ease-out)}
        .mk:hover .mk-ring,.mk:focus-visible .mk-ring{opacity:1}
        .mk:focus-visible .mk-ring{stroke-width:2.5}
      `}</style>
    </section>
  );
}
