import { Suspense } from "react";
import { CustomLoading } from "@/components/ui/custom-loading";
import { ChallengesScreen } from "@/screens/ChallengesScreen";

export default function Page() {
  return (
    <Suspense fallback={<CustomLoading />}>
      <ChallengesScreen />
    </Suspense>
  );
}
