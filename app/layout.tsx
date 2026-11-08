import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "AERONEX — Autonomous AI Delivery Network",
  description:
    "AERONEX is building an intelligent delivery network where AI, drones, robotic couriers, autonomous vehicles and automated warehouses work together as one coordinated system.",
  openGraph: {
    title: "AERONEX — Delivery, Reimagined for the Autonomous Era",
    description:
      "An intelligent delivery network where AI, robotics, drones, and autonomous vehicles work together to move anything, anywhere, smarter.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f9f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
