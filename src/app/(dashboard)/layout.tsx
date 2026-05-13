
import { ReactNode } from "react";
import { DashboardHeader } from "@/containers/Dashboard/DashboardHeader";
import StickyPairAlertWrapper from "@/features/pair/components/StickyPairAlertWrapper";
import { GlobalPairAlertBanner } from "@/features/pair/components/GlobalPairAlertBanner";
import GlobalJoinRequestAlert from "@/features/pair/components/GlobalJoinRequestAlert";

interface LayoutProps {
  children: ReactNode;
}
export const metadata = {
  title: "Funcsters",
  description: "Solve challenges and earn XP 🚀",
  openGraph: {
    title: "🎉 I just solved a challenge!",
    description: "Earn XP on Funcsters and improve your skills 🚀",
    url: "https://funcsters-ui.vercel.app/challenges/palindrome-string/detail",
    siteName: "Funcsters",
    images: [
      {
        url: "https://funcsters-ui.vercel.app/_next/image?url=%2Fimages%2FlandingPage%2FHand%20coding-cuate%201%20(1).png&w=1920&q=75",
        width: 1200,
        height: 630,
      },
    ],
  },
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
     <div className="pb-7 bg-dashboard-background dark:bg-transparent">
       <div className="bg-white dark:bg-transparent"><DashboardHeader /></div>
     </div>
    
      <main className="flex-1 custom-scrollbar outline-none!  overflow-hidden w-full overflow-y-auto bg-dashboard-background">
         {/* <GlobalPairAlertBanner /> */}
         <GlobalJoinRequestAlert/>
        {children}
      </main>
    </div>
  );
};

export default Layout;
