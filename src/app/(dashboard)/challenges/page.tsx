import { CustomLoading } from "@/components/ui/custom-loading";
import ChallengesScreenV2 from "@/screens/ChallengesScreenV2";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<CustomLoading />}>
      <ChallengesScreenV2 />
      {/* <ChallengesScreen /> */}
    </Suspense>
  );
}
