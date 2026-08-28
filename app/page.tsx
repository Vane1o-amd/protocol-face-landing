import Topbar from "@/components/Topbar";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
// VideoShowcase hidden until Roman provides /public/videos/showcase.mp4 — controls fully functional, just uncomment import + <VideoShowcase />
import Habits from "@/components/Habits";
import Timeline from "@/components/Timeline";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import Detail from "@/components/Detail";
import Why from "@/components/Why";
import DiscoveryCTA from "@/components/DiscoveryCTA";
import FinalCTA from "@/components/FinalCTA";
import FAQ from "@/components/FAQ";
import ApplyForm from "@/components/ApplyForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Topbar />
      <main>
        <Hero />
        <Process />
        {/* TODO: uncomment when Roman provides /public/videos/showcase.mp4 — controls fully functional, section just hidden <VideoShowcase /> */}
        <Habits />
        <Timeline />
        <CaseStudies />
        <Testimonials />
        <Detail />
        <Why />
        <DiscoveryCTA />
        <FinalCTA />
        <FAQ />
        <ApplyForm />
      </main>
      <Footer />
    </>
  );
}