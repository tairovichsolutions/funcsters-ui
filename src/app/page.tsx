import { redirect } from "next/navigation";
import { LandingPageScreen } from "@/screens/LandingPageScreen";
import { getUser } from "@/actions/user.action";

export default async function Home() {
  const { authenticated } = await getUser();

  if (authenticated) {
    redirect("/challenges");
  }

  return (
    <div className="scroll-smooth bg-black bg-[url('/images/landing-page-bg.png')] bg-cover font-magseva h-full w-full">
      <LandingPageScreen />
    </div>
  );
}
