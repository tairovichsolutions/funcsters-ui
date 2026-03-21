"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SecondaryContainer from "@/components/shared/container/SecondaryContainer";
import { Assets } from "@/constants/assets";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  href: string;
};

type NavbarProps = {
  navItems: NavItem[];
};

export default function Navbar({ navItems }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 text-neutral-04 w-full border-b border-gray-200 bg-white">
      <SecondaryContainer>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">

            <svg xmlns="http://www.w3.org/2000/svg" width="37" height="30" viewBox="0 0 87 70" fill="none">
              <path d="M85.1307 36.3035C85.7535 36.9262 85.7535 37.9359 85.1307 38.5586L62.2528 61.4363C61.9538 61.7354 61.5482 61.9034 61.1253 61.9034H52.3508C52.3375 61.9034 52.3247 61.8981 52.3153 61.8887L60.9972 53.2068C61.4159 52.7881 61.6511 52.2203 61.6511 51.6283V45.93C61.6511 43.6774 59.825 41.8513 57.5723 41.8513H52.9498V35.144H57.5723C63.5013 35.144 68.3126 39.9279 68.3576 45.8462L76.7876 37.4311L52.6632 13.3213H61.4878C61.9107 13.3213 62.3163 13.4893 62.6154 13.7883L85.1307 36.3035Z" fill="#008CFF" />
              <path d="M76.7875 37.4316L79.8692 31.0869L81.8632 33.081L76.7875 37.4316Z" fill="#036EC7" />
              <path d="M1.62468 36.8858C0.727436 35.9886 0.727436 34.5338 1.62468 33.6366L34.5886 0.672928C35.0195 0.242058 35.6038 0 36.2132 0H48.856C48.8752 0 48.8936 0.00761414 48.9071 0.0211716L36.3977 12.5306C35.7945 13.1338 35.4556 13.9519 35.4556 14.805V23.0154C35.4556 26.2611 38.0868 28.8923 41.3325 28.8923H47.9929V38.5565H41.3325C32.7897 38.5565 25.8573 31.6636 25.7925 23.1361L13.6459 35.2612L48.4059 70H35.6908C35.0815 70 34.4971 69.7579 34.0662 69.3271L1.62468 36.8858Z" fill="#070707" />
              <path d="M13.6478 35.2586L9.20754 44.4004L6.33441 41.5273L13.6478 35.2586Z" fill="#373737" />
            </svg>
            <Image
              src={Assets.Images.logo.funcstersTextLogo}
              alt="funcsters"
              width={200}
              height={200}
              className="w-max h-5 mb-1"
            />

          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-base">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative pb-1 ${isActive ? "text-blue-base" : "hover:text-gray-700 text-neutral-05"
                    }`}
                >
                  {item.name}

                  {isActive && (
                    <span className="absolute left-0 -bottom-[7px] h-0.5 w-full bg-blue-base"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[14px] hover:text-neutral-05 lg:text-base text-neutral-04"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="bg-[#008CFF] text-white text-base lg:text-lg px-4 py-1.5 rounded-md hover:bg-blue-600 transition"
            >
              Sign Up
            </Link>
          </div>
          {/* <div className="hidden md:flex items-center gap-4">
  <Link
    href="/login"
    className="border border-blue-600 text-blue-600 text-[14px] px-4 py-1.5 rounded-md 
               hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 
               transition-all duration-200 ease-in-out"
  >
    Log in
  </Link>

  <Link
    href="/signup"
    className="bg-[#008CFF] text-white text-[14px] px-4 py-1.5 rounded-md 
               hover:bg-blue-700 hover:shadow-md 
               transition-all duration-200 ease-in-out"
  >
    Sign Up
  </Link>
</div> */}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-neutral-04 "
          >
            {open ? (
              // Cross (X) icon when open
              <div className="border border-blue-500 p-1 rounded-sm">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className=" rounded-sm mx-auto"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </div>
            ) : (
              // Hamburger menu when closed
              <div className="border border-blue-500 p-1 rounded-sm">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t text-center border-gray-200 bg-white px-6 py-4 space-y-4">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`block py-1 transition ${isActive
                    ? "text-blue-600 font-medium"
                    : "text-gray-700 hover:text-black"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className=" ">
              <Link
                href="/login"
                className="border w-full block text-center my-2 border-blue-600 bg-blue-50 text-blue-600 rounded-md px-4 py-1.5 
               hover:bg-blue-100 hover:border-blue-700 hover:text-blue-700 
               hover:scale-105 active:scale-95 
               transition-all duration-200 ease-in-out"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="bg-blue-600 w-full block text-center my-2 text-white px-4 py-1.5 rounded-md 
               hover:bg-blue-700 hover:shadow-lg hover:scale-105 
               active:scale-95 
               transition-all duration-200 ease-in-out"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </SecondaryContainer>
    </header>
  );
}