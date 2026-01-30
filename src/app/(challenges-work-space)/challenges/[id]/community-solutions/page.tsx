import { CommunitySolutionsScreen } from "@/screens";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return redirect(`/challenges`);
  }

  return <CommunitySolutionsScreen />;
};

export default Page;
