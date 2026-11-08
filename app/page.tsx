import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import SheetRail from "@/components/SheetRail";
import Metrics from "@/components/sections/Metrics";
import Ecosystem from "@/components/sections/Ecosystem";
import Process from "@/components/sections/Process";
import Command from "@/components/sections/Command";
import Network from "@/components/sections/Network";
import Industries from "@/components/sections/Industries";
import Sustainability from "@/components/sections/Sustainability";
import TechSafety from "@/components/sections/TechSafety";
import Vision from "@/components/sections/Vision";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <SheetRail />
      <main id="main">
        <Hero />
        <Metrics />
        <Ecosystem />
        <Process />
        <Command />
        <Network />
        <Industries />
        <Sustainability />
        <TechSafety />
        <Vision />
      </main>
      <FinalCTA />
    </>
  );
}
