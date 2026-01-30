import { redirect } from "next/navigation";
import { ThinkingAssistantScreen } from "@/screens/ThinkingAssistantScreen";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return redirect(`/challenges`);
  }

  return <ThinkingAssistantScreen />;
};

export default Page;
