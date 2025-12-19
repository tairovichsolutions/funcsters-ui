/* eslint-disable @next/next/no-img-element */
import { SvgColor } from "@/components";
import { Assets } from "@/constants/assets";
import { TextFadeAnimation } from "@/components/ui/text-fade-animation";
import { AnimateFade } from "@/components/ui/animate-fade";

export const Footer = () => {
  const links = [
    { id: "facebook", href: "", icon: Assets.Svgs.Facebook },
    { id: "instagram", href: "", icon: Assets.Svgs.Instagram },
    { id: "youtube", href: "", icon: Assets.Svgs.Youtube },
    { id: "linkedin", href: "", icon: Assets.Svgs.Linkedin },
  ];

  return (
    <footer className=" pt-10  space-y-5 px-4 ">
      <div className=" flex justify-center text-center items-center flex-col gap-7">
        <TextFadeAnimation
          delay={0.2}
          direction="left"
          className=" flex items-center justify-center"
        >
          <img
            src={Assets.Svgs.SmallLogo}
            alt="small_logo"
            className=" opacity-60 md:h-32 h-24 object-contain "
          />
        </TextFadeAnimation>
        <TextFadeAnimation
          direction="left"
          delay={0.2}
          className="  leading-tight  section-heading-class"
        >
          For the coder transforming <br /> slow progress into savage momentum
        </TextFadeAnimation>

        <TextFadeAnimation
          delay={0.2}
          direction="left"
          className=" text-xl section-sub-heading-class"
        >
          Start Dominating In Tech Industry
        </TextFadeAnimation>
      </div>

      <div className=" md:px-16  relative flex justify-center items-center md:mt-10 mt-16">
        <img
          src={Assets.Svgs.FooterLogo}
          alt="footer_logo"
          className=" w-full "
        />
        <div className="absolute md:top-6 -top-10 md:right-16  flex gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="size-8 rounded-full  bg-[#838383] hover:bg-[#838383]/80 flex items-center justify-center"
            >
              <SvgColor src={link.icon} className="bg-black!  h-4 w-4" />
            </a>
          ))}
        </div>
        <div className=" bg-linear-to-b from-transparent to-black/10  backdrop-blur-sm md:h-14 w-full absolute bottom-0 right-0 leading-0"></div>
      </div>
    </footer>
  );
};
