export const dynamic = "force-dynamic";
export const revalidate = 0;
import NavbarSecondary from '@/containers/LandingPage/NavbarSecondary';
import Footer from '@/components/shared/Footer/Footer';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Landing from "./landing/page";
const navItems = [
  { name: "Home", href: "/" },
  { name: "Challenges", href: "/challenges" },
];
export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (token && userId) redirect("/challenges");

  return (
    <div className="scroll-smooth bg-black bg-[url('/images/landing-page-bg.png')] bg-cover font-magseva h-full w-full">
      <NavbarSecondary navItems={navItems} />
      <Landing />
      <Footer />
      {/* <LandingPageScreen /> */}
    </div>
  );
}
