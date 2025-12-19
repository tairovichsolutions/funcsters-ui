import localFont from "next/font/local";

const NexaBold = localFont({
  src: [
    {
      path: "../../public/fonts/NexaBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Nexa-Trial-ExtraBold.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-nexaBold",
});
const IBMPlexMono = localFont({
  src: [
    {
      path: "../../public/fonts/IBMPlexMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexMono-Light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-IBMPlexMono",
});
const geistMagseva = localFont({
  src: [
    {
      path: "../../public/fonts/MagsevaDemo-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-magseva",
});
const geistSatoshiMedium = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--satoshi-medium",
});

export const localFontVars = [
  geistMagseva.variable,
  NexaBold.variable,
  IBMPlexMono.variable,
  geistSatoshiMedium.variable,
].join(" ");
