import Image from "next/image";
import { cn } from "@/lib";
import { AnimateFade } from "@/components/ui/animate-fade";

type BentoCardProps = {
  imageSrc: string;
  imageAlt: string;
  direction?: "right" | "left" | "up" | "down";
  title: string;
  colSpan?: string;
  delay?: number;
  imageClassName?: string;
};

export const BentoCard = ({
  imageSrc,
  imageAlt,
  title,
  delay = 0.05,
  direction = "up",
  colSpan = "col-span-6",
  imageClassName,
}: BentoCardProps) => {
  return (
    <AnimateFade direction={direction} delay={delay} className={cn(colSpan)}>
      <div
        className={`relative w-full  group h-[300px] xl:h-[430px] 3xl:h-[630px]! bg-no-repeat bg-cover bg-[url('/images/Bento-bg.png')] rounded-2xl overflow-hidden `}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1200}
          height={800}
          className={cn(
            "w-full absolute bottom-0 top-7 sm:top-10 xl:top-16 left-7  sm:left-10 xl:left-16  object-contain transition-transform duration-500 ease-out  group-hover:scale-110 group-hover:rotate-3 ",
            imageClassName
          )}
        />

        <div className=" p-4 sm:p-5 md:p-7 xl:p-10 flex items-end bg-linear-to-t from-[#002646] to-transparent absolute -bottom-0.5 left-0 w-full md:h-80 3xl:h-[250px]!">
          <p className="text-white text-sm sm:text-lg md:text-xl 3xl:text-[36px]! pe-5 font-semibold mt-4">
            {title}
          </p>
        </div>
      </div>
    </AnimateFade>
  );
};
