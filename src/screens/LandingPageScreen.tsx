import { Hero } from "@/containers/LandingPage/Hero";
import { Navbar } from "@/containers/LandingPage/Navbar";
import { Footer } from "../containers/LandingPage/footer";
import { Faqs } from "@/containers/LandingPage/Faqs/Faqs";
import { Bento } from "@/containers/LandingPage/Bento/Bento";
import { KillerCoder } from "../containers/LandingPage/KillerCoder";
import { HowToJoin } from "@/containers/LandingPage/HowToJoin/HowToJoin";
import { Programinglanguages } from "@/containers/LandingPage/ProgrammingLanguages/programinglanguages";
import { WhyDevelopersChoose } from "@/containers/LandingPage/WhyDeveloperChoose/WhyDevelopersChoose";

export const LandingPageScreen = () => {
  return (
    <div className="w-full h-full text-white">
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
