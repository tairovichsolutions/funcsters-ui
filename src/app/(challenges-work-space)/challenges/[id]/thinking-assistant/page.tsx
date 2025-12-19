import { redirect } from "next/navigation";
import { ThinkingAssistantScreen } from "@/screens/ThinkingAssistantScreen";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return redirect(`/challenges`);
  }

  return <ThinkingAssistantScreen />;
};

export default Page;
