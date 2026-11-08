"use client";

import { motion, useReducedMotion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { renderStill } from "@/lib/three/stills";
import type { StillName } from "@/lib/three/scenes";

/* ---------------- logo ---------------- */
export function LogoMark({ size = 30, onDark = false }: { size?: number; onDark?: boolean }) {
  const ink = onDark ? "#f8f9f7" : "#141719";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* two route lines converging on a single node: one intelligence, many machines */}
      <path d="M3 28 L16 5 L29 28" stroke={ink} strokeWidth="2.4" strokeLinejoin="miter" />
      <path d="M9.4 19.5 H22.6" stroke={ink} strokeWidth="2.4" />
      <circle cx="16" cy="5" r="3.6" fill="#c7f36b" stroke={ink} strokeWidth="1.8" />
    </svg>
  );
}

export function Logo({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark onDark={onDark} />
      <span
        className="text-[1.125rem] font-semibold leading-none"
        style={{ letterSpacing: "0.2em", color: onDark ? "#f8f9f7" : "#141719" }}
      >
        AERONEX
      </span>
    </span>
  );
}

/* ---------------- icons ---------------- */
export function Arrow({ size = 16, dir = "right" }: { size?: number; dir?: "right" | "up-right" | "down" }) {
  const rot = dir === "up-right" ? -45 : dir === "down" ? 90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------------- reveal ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/* ---------------- count up ---------------- */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  // the settled value is the default (no-JS, reduced motion, print); the count-up replays it from 0 on view
  const [v, setV] = useState(to);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (reduce) return;
    setV(0);
    setArmed(true);
  }, [reduce]);
  useEffect(() => {
    if (!inView || reduce || !armed) return;
    const c = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => setV(n),
    });
    return () => c.stop();
  }, [inView, to, reduce, armed]);
  const final = `${prefix}${to.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  return (
    <span ref={ref} className={`tnum ${className}`}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">
        {prefix}
        {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </span>
    </span>
  );
}

/* ---------------- 3D still ---------------- */
export function SceneStill({
  name,
  alt,
  w = 1400,
  h = 1000,
  className = "",
  priority = false,
}: {
  name: StillName;
  alt: string;
  w?: number;
  h?: number;
  className?: string;
  priority?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    const go = () => {
      renderStill(name, w, h).then(
        (u) => !cancelled && setSrc(u),
        () => !cancelled && setErr(true),
      );
    };
    if (priority) {
      go();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          go();
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [name, w, h, priority]);

  return (
    <div
      ref={host}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${w} / ${h}`, background: "var(--paper-2)", borderRadius: "var(--radius)" }}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={w}
          height={h}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ animation: "fade-in 0.9s var(--ease-out) both" }}
        />
      )}
      {!src && (
        <span className="sr-only">{err ? "Image unavailable: " + alt : "Loading image: " + alt}</span>
      )}
    </div>
  );
}
