/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { X, Users } from "lucide-react";
import { useMyActiveRequest } from "../hooks/usePairQueries";
import Link from "next/link";


export default function GlobalJoinRequestAlert() {
    const { data: myRequest } = useMyActiveRequest();
    const challengeHref = `/challenges/${myRequest?.challengeSlug}/detail`;
    const [isVisible, setIsVisible] = useState(true);
    console.log({ myRequest });
    if (!isVisible) return null;

    return (
        // Positioning it fixed at the top-center of the screen
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 font-sans animate-in fade-in slide-in-from-top-4 duration-300">

            <div className="flex items-start justify-between">
                <div className="flex gap-3">

                    {/* Avatar Group */}
                    <div className="flex -space-x-4">
                        <img
                            src="https://i.pravatar.cc/100?img=11"
                            alt="User 1"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover z-10 relative"
                        />
                        <img
                            src="https://i.pravatar.cc/100?img=32"
                            alt="User 2"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover z-20 relative"
                        />
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 z-30 text-white flex items-center justify-center text-sm font-bold relative">
                            2+
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-gray-900 text-sm">New Join Request!</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            <span className="text-blue-500 font-medium">4 developers</span> want to pair on <span className="font-semibold text-gray-700">&rdquo;Looking f...</span>
                        </p>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors mt-1"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-5">
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-1 bg-[#F1F4F9] text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                    Ignore
                </button>
                <Link
                    href={challengeHref}
                    className="flex-1  bg-[#007BFF] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >

                    <Users size={16} />
                    View 2 Requests

                </Link>

            </div>
        </div>
    );
}