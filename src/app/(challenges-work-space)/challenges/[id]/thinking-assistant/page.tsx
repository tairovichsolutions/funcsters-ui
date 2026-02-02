import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NewThinkingAssistantScreen } from "@/screens/NewThinkingAssistantScreen";

const Page = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return redirect(`/challenges`);
  }

  // return <ThinkingAssistantScreen />;
  return <NewThinkingAssistantScreen />;
};

export default Page;
