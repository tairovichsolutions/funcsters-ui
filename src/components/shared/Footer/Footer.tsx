import Image from "next/image";
import Link from "next/link";

import { Assets } from "@/constants/assets";
import SecondaryContainer from "../container/SecondaryContainer";
import { Instagram } from "lucide-react";
type LinkItem = {
    name: string;
    href: string;
};

type SocialItem = {
    name: string;
    icon: string;
    href: string;
};

const footerLinks: LinkItem[] = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "Challenges", href: "#" },
    { name: "Process", href: "#" },
    { name: "FAQS", href: "#" },
];



const socialLinks: SocialItem[] = [
    { name: "facebook", icon: "/icons/facebook.svg", href: "#" },
    { name: "instagram", icon: "/icons/instagram.svg", href: "#" },
    { name: "linkedin", icon: "/icons/linkedin.svg", href: "#" },
    { name: "youtube", icon: "/icons/youtube.svg", href: "#" },
];
export default function Footer() {
    return (
        <footer className="w-full bg-[#f5f8fb]  border-t py-10  lg:py-15 border-[#AFAFAF]">
            <SecondaryContainer>
                <>
              
                    {/* Top Section */}
                    <div className="flex flex-col   items-center lg:flex-row lg:items-start lg:justify-between gap-10">


                        <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-4">

                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="65" viewBox="0 0 87 70" fill="none">
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
                                    className="w-max h-7 mb-1"
                                />

                                {/* <h2 className="text-[28px]  tracking-tight">
                                <span className="font-semibold">func</span>sters
                            </h2> */}
                            </div>

                            <p className="text-neutral-03 text-base leading-relaxed">
                                For the coder transforming slow progress into savage momentum
                            </p>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col items-center lg:items-end gap-6">

                            {/* Navigation */}
                            <nav className="flex flex-wrap items-center justify-center  gap-6 text-[15px] text-neutral-04">
                                {footerLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="hover:text-gray-700 transition"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Social Icons */}
                                  <div className="flex gap-4 bged-500">
                        {/* Facebook - Blue Background */}
                        <div className="bg-[#008CFF] p-3 flex justify-center items-center   px-4.5 rounded-xl text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="18" viewBox="0 0 9 18" fill="none">
                                <path d="M5.76096 17.2831H2.33431V8.76371H0V5.98997H2.33421V4.01626C2.33421 1.67741 3.36664 0 6.78403 0C7.50681 0 8.64154 0.145294 8.64154 0.145294V2.72086H7.4497C6.2353 2.72086 5.76115 3.08926 5.76115 4.10777V5.98997H8.59607L8.34362 8.76371H5.76106L5.76096 17.2831Z" fill="white" />
                            </svg>
                        </div>

                        {/* Others - Gray Background */}
                        <div className="bg-gray-200 p-3 rounded-xl text-black">
                            <Instagram size={24} />
                        </div>

                        <div className="bg-gray-200 p-3 rounded-xl text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <g clipPath="url(#clip0_61232_2221)">
                                    <path d="M15.9968 15.9995V15.9988H16.0008V10.1308C16.0008 7.26016 15.3828 5.04883 12.0268 5.04883C10.4135 5.04883 9.33082 5.93416 8.88882 6.7735H8.84216V5.31683H5.66016V15.9988H8.97349V10.7095C8.97349 9.31683 9.23749 7.97017 10.9622 7.97017C12.6615 7.97017 12.6868 9.5595 12.6868 10.7988V15.9995H15.9968Z" fill="#070707" />
                                    <path d="M0.263672 5.31738H3.58101V15.9994H0.263672V5.31738Z" fill="#070707" />
                                    <path d="M1.92133 0C0.860667 0 0 0.860667 0 1.92133C0 2.982 0.860667 3.86067 1.92133 3.86067C2.982 3.86067 3.84267 2.982 3.84267 1.92133C3.842 0.860667 2.98133 0 1.92133 0V0Z" fill="#070707" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_61232_2221">
                                        <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <div className="bg-gray-200 p-3 flex justify-center items-center rounded-xl text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 18 18" fill="none">
                                <path d="M9.02462 14.7252L5.47875 14.659C4.33065 14.636 3.17972 14.682 2.05418 14.4431C0.341899 14.0862 0.220601 12.336 0.0936605 10.868C-0.081235 8.80408 -0.0135335 6.70276 0.316511 4.65613C0.50269 3.5076 1.23612 2.82251 2.37012 2.74767C6.19808 2.47709 10.0514 2.50875 13.8709 2.63541C14.2743 2.64692 14.6805 2.71025 15.0783 2.78221C17.0416 3.13339 17.0896 5.1167 17.2165 6.78624C17.3434 8.47305 17.2898 10.1685 17.0472 11.8438C16.8526 13.2313 16.4802 14.3942 14.909 14.5064C12.94 14.6532 11.0162 14.7713 9.04154 14.7338C9.04154 14.7252 9.03026 14.7252 9.02462 14.7252ZM6.93997 11.2134C8.42377 10.3441 9.87935 9.48917 11.3547 8.62561C9.86806 7.7563 8.4153 6.90138 6.93997 6.03782V11.2134Z" fill="#070707" />
                            </svg>
                        </div>
                    </div>
                            {/* <div className="flex items-center gap-4">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:shadow-sm transition"
                                    >
                                        {/* <Image
                                        src={social.icon}
                                        alt={social.name}
                                        width={18} 
                                        height={18}
                                    /> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="18" viewBox="0 0 9 18" fill="none">
                                            <path d="M5.76096 17.2831H2.33431V8.76371H0V5.98997H2.33421V4.01626C2.33421 1.67741 3.36664 0 6.78403 0C7.50681 0 8.64154 0.145294 8.64154 0.145294V2.72086H7.4497C6.2353 2.72086 5.76115 3.08926 5.76115 4.10777V5.98997H8.59607L8.34362 8.76371H5.76106L5.76096 17.2831Z" fill="white" />
                                        </svg>
                                    </Link>
                                ))}
                            </div> */}

                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 mt-10 pt-3 text-center">
                        <p className="text-neutral-03 text-base">
                            © {new Date().getFullYear()} Funcsters . All rights reserved
                        </p>
                    </div>

                </>
            </SecondaryContainer>
        </footer>
    );
}