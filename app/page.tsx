import Topbar from "@/components/Topbar";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Habits from "@/components/Habits";
import Timeline from "@/components/Timeline";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
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
        <Habits />
        <CaseStudies />
        <Testimonials />
        <Why />
        <Timeline />
        <DiscoveryCTA />
        <FinalCTA />
        <FAQ />
        <ApplyForm />
      </main>
      <Footer />
    </>
  );
}