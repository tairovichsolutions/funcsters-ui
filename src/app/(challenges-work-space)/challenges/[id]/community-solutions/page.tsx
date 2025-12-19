import { CommunitySolutionsScreen } from "@/screens";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return redirect(`/challenges`);
  }

  return <CommunitySolutionsScreen />;
};

export default Page;
