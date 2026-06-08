import React from "react";
import Link from "next/link";

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#DFE0E7] dark:border-gray-800 pt-4 pb-4 flex flex-col md:flex-row justify-between items-center text-sm text-[#8B909A] dark:text-gray-400">
      <div className="text-[#8B8B8B]">© {new Date().getFullYear()} Funcsters . All rights reserved</div>
      <div className="flex gap-6 mt-4 md:mt-0">
        <Link href="#" className="hover:text-[#018CFF] transition-colors text-[#008CFF]">
          Terms
        </Link>
        <Link href="#" className="hover:text-[#018CFF] transition-colors text-[#008CFF]">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-[#018CFF] transition-colors text-[#008CFF]">
          Code of Conduct
        </Link>
        <Link href="#" className="hover:text-[#018CFF] transition-colors text-[#008CFF]">
          About
        </Link>
        <Link href="#" className="hover:text-[#018CFF] transition-colors text-[#008CFF]">
          Contact
        </Link>
      </div>
    </footer>
  );
};
