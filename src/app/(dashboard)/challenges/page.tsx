import PrimaryContainer from "@/components/shared/container/PrimaryContainer";
import { CustomLoading } from "@/components/ui/custom-loading";
import ChallengesScreenV2 from "@/screens/ChallengesScreenV2";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<CustomLoading />}>
              <PrimaryContainer className="xl:px-0">
                  <ChallengesScreenV2 />          
              </PrimaryContainer>
      {/* <ChallengesScreen /> */}
    </Suspense>
  );
}
