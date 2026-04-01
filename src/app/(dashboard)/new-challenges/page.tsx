import { Suspense } from "react";
import { CustomLoading } from "@/components/ui/custom-loading";
import { ChallengesScreen } from "@/screens/ChallengesScreen";
import ChallengesScreenV2 from "@/screens/ChallengesScreenV2";
import PrimaryContainer from "@/components/shared/container/PrimaryContainer";

export default function Page() {
    return (
        <Suspense fallback={<CustomLoading />}>
            <PrimaryContainer>
                <ChallengesScreenV2 />
            </PrimaryContainer>
        </Suspense>
    );
}
