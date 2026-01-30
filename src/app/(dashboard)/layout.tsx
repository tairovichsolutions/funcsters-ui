"use client";
import { ReactNode } from "react";
import { DashboardHeader } from "@/containers/Dashboard/DashboardHeader";

interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 px-4 lg:px-12 custom-scrollbar outline-none!  overflow-hidden w-full overflow-y-auto bg-dashboard-background">
        {children}
      </main>
    </div>
  );
};

export default Layout;
