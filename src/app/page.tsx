export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { LandingPageScreen } from "@/screens/LandingPageScreen";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (token && userId) redirect("/challenges");

  return (
    <div className="scroll-smooth bg-black bg-[url('/images/landing-page-bg.png')] bg-cover font-magseva h-full w-full">
      <LandingPageScreen />
    </div>
  );
}
