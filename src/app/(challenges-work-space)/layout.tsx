/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ChallengesSubNav,
  ChallengesWorkSpaceHeader,
} from "@/containers/ChallengesWorkSpace";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useMemo } from "react";
import { useChallengeById } from "@/queries/useChallengeById";
import { CodePlaygroundScreen } from "@/screens/CodePlaygroundScreen";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLanguageImplementations } from "@/context/languageImplementationsContext";
import { useMyCommunitySolutions } from "@/queries/useMyCommunitySolutions";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { id } = useParams();
  const { data } = useChallengeById(String(id));
  const {
    setLanguages,
    setXpCount,
    languageId,
    showSuccessModal,
    setShowSuccessModal,
  } = useLanguageImplementations();

  console.log("showSuccessModal", showSuccessModal);

  const { data: mySolutionData } = useMyCommunitySolutions(
    Number(id),
    languageId as number,
    true,
  );

  useEffect(() => {
    if (mySolutionData?.data?.solutionInfo === null) {
      setShowSuccessModal(true);
    } else {
      setShowSuccessModal(false);
    }
  }, [mySolutionData, setShowSuccessModal]);

  const list = useMemo(() => data?.data?.languageImplementations || [], [data]);

  const currentLangImpl = list?.find(
    (lang: any) => lang.languageId === languageId,
  );

  const completedCount = list?.filter(
    (impl: any) =>
      impl?.userProgress === "COMPLETED" && impl?.viewedSolution === false,
  ).length;

  let displayXp = data?.data?.xp ?? 0;
  for (let i = 0; i < completedCount; i++) {
    displayXp = Math.floor(displayXp / 2);
  }
  if (displayXp < 0) displayXp = 0;

  useEffect(() => {
    if (
      currentLangImpl?.viewedSolution === true &&
      currentLangImpl?.userProgress !== "COMPLETED"
    ) {
      setXpCount(0);
    }
    if (
      currentLangImpl?.viewedSolution === false &&
      currentLangImpl?.userProgress !== "COMPLETED"
    ) {
      setXpCount(displayXp);
    }
  }, [displayXp, currentLangImpl, setXpCount]);

  // useEffect(() => {
  //   if (list.length > 0) setLanguages(list);
  // }, [list, setLanguages]);

  useEffect(() => {
    if (list.length > 0) setLanguages(list.map((x: any) => ({ ...x })));
  }, [list, setLanguages]);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <ChallengesWorkSpaceHeader />

      <div className="flex-1 overflow-hidden py-4 px-12">
        <PanelGroup
          direction="horizontal"
          className="h-full w-full  gap-1.5"
        >
          <Panel minSize={40} defaultSize={50}>
            <div className="border border-border-soft flex h-full flex-col  rounded-[10px] overflow-hidden">
              <div className="px-4 flex justify-center items-center w-full h-16 border-b border-border-soft">
                <ChallengesSubNav />
              </div>
              <main
                className="flex-1 overflow-y-auto px-4 py-4 overflow-hidden custom-scrollbar"
                data-scroll-restoration-id="main"
              >
                {children}
              </main>
            </div>
          </Panel>

          <PanelResizeHandle className="h-full rounded- w-1.5 cursor-col-resize bg-transparent hover:bg-primary/40 data-resize-handle-active:bg-primary/60 transition-colors duration-150" />

          <Panel minSize={40} defaultSize={50}>
            <div className="overflow-hidden h-full w-full">
              <CodePlaygroundScreen />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default Layout;
