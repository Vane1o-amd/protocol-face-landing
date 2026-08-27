import Topbar from "@/components/Topbar";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Habits from "@/components/Habits";
import Timeline from "@/components/Timeline";
import CaseStudies from "@/components/CaseStudies";
import Detail from "@/components/Detail";
import Why from "@/components/Why";
import FinalCTA from "@/components/FinalCTA";
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
        <Timeline />
        <CaseStudies />
        <Detail />
        <Why />
        <FinalCTA />
        <ApplyForm />
      </main>
      <Footer />
    </>
  );
}