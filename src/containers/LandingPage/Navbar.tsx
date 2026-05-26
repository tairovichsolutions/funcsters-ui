"use client";

import React, { useEffect, useState } from "react";
import { Assets } from "@/constants/assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components";
import { cn } from "@/lib";
import AnimatedBorderButton from "@/components/AnimatedButton";
import { Menu } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "CHALLENGES", href: "/challenges" },
];

type NavMode = "top" | "floating";

export const Navbar = () => {
  const pathname = usePathname();
  const [mode, setMode] = useState<NavMode>("top");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 40) {
        setMode("top");
      } else {
        setMode("floating");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "Challenges", link: "/challenges" },
    { id: 3, title: "Login", link: "/challenges?auth=login" },
    { id: 4, title: "Sign Up", link: "/challenges?auth=signUp" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50  justify-center pointer-events-none bg-transparent">
      <div
        className={cn(
          "w-full pointer-events-auto transform transition-all duration-300 ",
          mode === "top" && "mt-0 px-0 translate-y-0 opacity-100",
          mode === "floating" &&
          "mt-3 px-4 md:px-24 2xl:px-32 translate-y-0 opacity-100"
        )}  
      >
        <nav
          className={cn(
            "flex items-center justify-between transform transition-all duration-300 backdrop-blur-xl",
            mode === "top"
              ? "md:px-28  2xl:px-32 px-3 py-5 2xl:py-7 border-b border-white/30 rounded-none bg-black/20"
              : "md:px-10 px-5 py-3 2xl:py-5 border rounded-full border-white/20 bg-black/80 shadow-[0_0_30px_rgba(0,0,0,0.6)]"
          )}
        >
          <div>
            <Image
              src={Assets.Svgs.NewLogo}
              height={10}
              width={180}
              alt="new_logo"
            />
          </div>

          <div className="lg:flex hidden gap-10">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <AnimatedBorderButton active={pathname === item.href}>
                  {item.label}
                </AnimatedBorderButton>
              </Link>
            ))}
          </div>

          <div className="lg:flex hidden gap-5">
            <Button
              onClick={() => router.push("/challenges?auth=login")}
              variant="outline"
              className="h-8 border bg-transparent! border-white text-white text-sm leading-none hover:bg-white! hover:text-black rounded-md px-4 "
            >
              Log in
            </Button>
            <Button
              onClick={() => router.push("/challenges?auth=signUp")}
              className="h-8 bg-white text-black text-sm leading-none hover:bg-white/90 rounded-md px-4"
            >
              Sign Up
            </Button>
          </div>
          <div className="lg:hidden flex ">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="cursor-pointer">
                <Menu size={28} color="#ffffff" />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="mr-3 w-44 p-0! rounded-xl! bg-black bg-[url('/images/landing-page-bg.png')] bg-cover  border-white/20!"
              >
                <div className=" ">
                  {navLinks.map((link) => (
                    <div
                      key={link.id}
                      onClick={(e) => {
                        e.stopPropagation(),
                          router.push(link.link),
                          setOpen(false)
                      }}
                      className="p-3 font-imbMono text-sm border-dashed border-b border-white/20! last:border-b-0 text-white cursor-pointer"
                    >
                      <h1>{link.title}</h1>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </nav>
      </div>
    </header>
  );
};
