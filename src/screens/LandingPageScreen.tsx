import { Hero } from "@/containers/LandingPage/Hero";
import { Navbar } from "@/containers/LandingPage/Navbar";
import { Footer } from "../containers/LandingPage/footer";
import { Faqs } from "@/containers/LandingPage/Faqs/Faqs";
import { Bento } from "@/containers/LandingPage/Bento/Bento";
import { KillerCoder } from "../containers/LandingPage/KillerCoder";
import { HowToJoin } from "@/containers/LandingPage/HowToJoin/HowToJoin";
import { WhyDevelopersChoose } from "@/containers/LandingPage/WhyDeveloperChoose/WhyDevelopersChoose";
import { Programinglanguages } from "@/containers/LandingPage/ProgrammingLanguages/programinglanguages";

export const LandingPageScreen = () => {
  return (
    <div className="w-full h-full text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Bento />
      <Programinglanguages />
      <HowToJoin />
      <WhyDevelopersChoose />
      <Faqs />
      <KillerCoder />
      <Footer />
    </div>
  );
};
