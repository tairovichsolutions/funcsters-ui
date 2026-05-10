export const dynamic = "force-dynamic";
export const revalidate = 0;

import PrimarySlider from "@/components/shared/slider/PrimarySlider";
import SkillSlider from "@/components/shared/slider/SkillSlider";
import { Assets } from "@/constants/assets";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FaqsSection from "./FaqsSection";
import Hero from "./Hero";
import HeroArc from "./HeroArk";
import LearnFasterSection from "./LearnFasterSection";
import MasterYourLogicSection from "./MasterYourLogicSection";
import TestimonialSlider from "./TestimonialSection";
import ThinkingAssistantPage from "./ThinkingAssistantSection";
import TurnYourCodingSection from "./TurnYourCodingSection";

export default async function Landing() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const loggedIn = cookieStore.get("loggedIn")?.value;

  // if (token && loggedIn) redirect("/challenges");
  const logos = Assets.Images.sponsoredIcons || [];
  const tutorItems = logos.map((path, index) => ({
    src: path,
    alt: `Tutor ${index + 1}` // optional alt text
  }));
  const damiarray = [...tutorItems, ...tutorItems]



  return (
    <div className="scroll-smooth bg-[#f5f8fb]  bg-cover  h-full w-full">
     
      <Hero />
      <div className="md:py-10 relative max-w-480 bg-white mx-auto">
        <p className="text-center ttext-neutral-04 font-light
         text-sm md:text-base mb-6">
          Join developers from top tech companies who practice on Functers.
        </p>
        <div className="absolute left-0 top-0 bottom-0 w-48  bg-gradient-to-r from-[#f8f9fb] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-[#f8f9fb] to-transparent z-10 pointer-events-none"></div>

        <PrimarySlider speed={50000} tutors={damiarray} variant="none" isMarquee pauseOnHover={false} zoomOnHover={false}
          //  breakpoints={{
          //   0:    { slidesPerView: 2.5, slidesOffsetBefore: 20, slidesOffsetAfter: 20 },
          //   480:  { slidesPerView: 3.5, slidesOffsetBefore: 20, slidesOffsetAfter: 20 },
          //   640:  { slidesPerView: 4.5, slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
          //   768:  { slidesPerView: 5.5, slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
          //   1024: { slidesPerView: 6.5, slidesOffsetBefore: 28, slidesOffsetAfter: 28 },
          //   1280: { slidesPerView: 8.5, slidesOffsetBefore: 32, slidesOffsetAfter: 32 },
          //   1536: { slidesPerView: 9.5, slidesOffsetBefore: 36, slidesOffsetAfter: 36 },
          // }}
          breakpoints={{ 0: { slidesPerView: 2.2 }, 480: { slidesPerView: 3.5 }, 640: { slidesPerView: 4.5 }, 768: { slidesPerView: 5.5 }, 1024: { slidesPerView: 6.5 }, 1280: { slidesPerView: 8.5 }, 1536: { slidesPerView: 9.5 }, }}
        />
      </div>
      <LearnFasterSection />
      <ThinkingAssistantPage />
          <SkillSlider
        autoplay={true}
        loop={true}
        
      />
      <MasterYourLogicSection />
      <TestimonialSlider />
      <TurnYourCodingSection />
      <FaqsSection />
      <HeroArc />

      {/* <LogoSlider/> */}

   

      {/* <div className="w-full border-t border-dashed bg-white border-gray-300 py-4"></div> */}
    
    </div>
  );
}
