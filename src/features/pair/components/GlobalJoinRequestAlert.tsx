/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Users } from "lucide-react";
import { useIncomingJoins, useMyActiveRequest } from "../hooks/usePairQueries";
import Link from "next/link";

export default function GlobalJoinRequestAlert() {
    const { data: myRequest } = useMyActiveRequest();
    const { data: joins = [] } = useIncomingJoins(myRequest?.id);
    const challengeHref = `/challenges/${myRequest?.challengeSlug}/detail?isSidebarOpen=true`;
    
    const [isVisible, setIsVisible] = useState(true);
    
    // 1. Create a ref to track the previous number of joins
    const prevJoinsLength = useRef(joins.length);

    // 2. Watch for changes in joins.length
    useEffect(() => {
        // If the new length is strictly greater than the old length, a new request arrived!
        if (joins.length > prevJoinsLength.current) {
            setIsVisible(true); // Bring the popup back
        }
        
        // Update the ref to the current length for the next time it changes
        prevJoinsLength.current = joins.length;
    }, [joins.length]);

    if (!isVisible) return null;

    return (
        <>
            {joins.length > 0 && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md bg-white dark:bg-[#232629] dark:border-0 rounded-2xl shadow-xl border border-gray-100 p-4 font-sans animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex gap-3">
                            {/* Avatar Group */}
                            <div className="flex -space-x-4">
                                <img
                                    src="https://i.pravatar.cc/100?img=11"
                                    alt="User 1"
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover z-10 relative"
                                />
                                {joins.length > 1 && (
                                    <img
                                        src="https://i.pravatar.cc/100?img=32"
                                        alt="User 2"
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover z-20 relative"
                                    />
                                )}
                                {joins.length > 2 && (
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 z-30 text-white flex items-center justify-center text-sm font-bold relative">
                                        {joins.length - 2}+
                                    </div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col pl-1 justify-center min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">New Join Request!</h3>
                                <p className="flex items-center text-sm text-gray-500 dark:text-[#999A9B] mt-0.5 w-full">
                                    <span className="shrink-0 whitespace-pre">
                                        <span className="text-blue-500  font-medium">
                                            {joins.length === 1 ? joins[0]?.joinerUsername : `${joins.length} developers`}
                                        </span>
                                        {" "}want to pair on{" "}
                                    </span>
                                    <span className="font-bold truncate dark:text-white">
                                        &rdquo;{myRequest?.challengeTitle}&rdquo;
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 mr-1 dark:text-white!   hover:text-gray-600 transition-colors mt-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="dark:hidden" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9.11704 10L3.93329 4.8175C3.87518 4.75939 3.82908 4.6904 3.79764 4.61448C3.76619 4.53855 3.75 4.45718 3.75 4.375C3.75 4.29282 3.76619 4.21144 3.79764 4.13552C3.82908 4.05959 3.87518 3.99061 3.93329 3.9325C3.9914 3.87439 4.06039 3.82829 4.13631 3.79684C4.21223 3.76539 4.29361 3.74921 4.37579 3.74921C4.45797 3.74921 4.53934 3.76539 4.61527 3.79684C4.69119 3.82829 4.76018 3.87439 4.81829 3.9325L10.0008 9.11625L15.1833 3.9325C15.3006 3.81514 15.4598 3.74921 15.6258 3.74921C15.7918 3.74921 15.9509 3.81514 16.0683 3.9325C16.1856 4.04985 16.2516 4.20903 16.2516 4.375C16.2516 4.54097 16.1856 4.70014 16.0683 4.8175L10.8845 10L16.0683 15.1825C16.1856 15.2999 16.2516 15.459 16.2516 15.625C16.2516 15.791 16.1856 15.9501 16.0683 16.0675C15.9509 16.1849 15.7918 16.2508 15.6258 16.2508C15.4598 16.2508 15.3006 16.1849 15.1833 16.0675L10.0008 10.8837L4.81829 16.0675C4.70093 16.1849 4.54176 16.2508 4.37579 16.2508C4.20982 16.2508 4.05065 16.1849 3.93329 16.0675C3.81593 15.9501 3.75 15.791 3.75 15.625C3.75 15.459 3.81593 15.2999 3.93329 15.1825L9.11704 10Z" fill="#4D4D4D" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="hidden dark:block" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9.11704 10L3.93329 4.8175C3.87518 4.75939 3.82908 4.6904 3.79764 4.61448C3.76619 4.53855 3.75 4.45718 3.75 4.375C3.75 4.29282 3.76619 4.21144 3.79764 4.13552C3.82908 4.05959 3.87518 3.99061 3.93329 3.9325C3.9914 3.87439 4.06039 3.82829 4.13631 3.79684C4.21223 3.76539 4.29361 3.74921 4.37579 3.74921C4.45797 3.74921 4.53934 3.76539 4.61527 3.79684C4.69119 3.82829 4.76018 3.87439 4.81829 3.9325L10.0008 9.11625L15.1833 3.9325C15.3006 3.81514 15.4598 3.74921 15.6258 3.74921C15.7918 3.74921 15.9509 3.81514 16.0683 3.9325C16.1856 4.04985 16.2516 4.20903 16.2516 4.375C16.2516 4.54097 16.1856 4.70014 16.0683 4.8175L10.8845 10L16.0683 15.1825C16.1856 15.2999 16.2516 15.459 16.2516 15.625C16.2516 15.791 16.1856 15.9501 16.0683 16.0675C15.9509 16.1849 15.7918 16.2508 15.6258 16.2508C15.4598 16.2508 15.3006 16.1849 15.1833 16.0675L10.0008 10.8837L4.81829 16.0675C4.70093 16.1849 4.54176 16.2508 4.37579 16.2508C4.20982 16.2508 4.05065 16.1849 3.93329 16.0675C3.81593 15.9501 3.75 15.791 3.75 15.625C3.75 15.459 3.81593 15.2999 3.93329 15.1825L9.11704 10Z" fill="#fff" />
                            </svg>
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="flex-1 bg-[#F1F4F9] dark:bg-[#E5EDF4] text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Ignore
                        </button>
                        <Link
                            href={challengeHref}
                            className="flex-1 bg-[#007BFF] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Users size={16} />
                            {joins.length > 1 ? `View ${joins.length} Requests` : "Manage Request"}
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}














// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { useState } from "react";
// import { X, Users } from "lucide-react";
// import { useIncomingJoins, useMyActiveRequest } from "../hooks/usePairQueries";
// import Link from "next/link";


// export default function GlobalJoinRequestAlert() {
//     const { data: myRequest } = useMyActiveRequest();

//     // Just pass the ID directly!
//     const { data: joins = [], } = useIncomingJoins(myRequest?.id);
//     const challengeHref = `/challenges/${myRequest?.challengeSlug}/detail`;
//     const [isVisible, setIsVisible] = useState(true);
//     console.log({ myRequest });
//     if (!isVisible) return null;

//     return (<>

//         {joins.length > 0 && (
//             <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md  bg-white rounded-2xl shadow-xl border border-gray-100 p-4 font-sans animate-in fade-in slide-in-from-top-4 duration-300">
//                 {/* <div className="bg-white">{JSON.stringify(joins)} </div> */}
//                 <div className="flex items-center  gap-2  justify-between">
//                     <div className="flex gap-3">
//                         {/* Avatar Group */}
//                         <div className="flex -space-x-4">
//                             <img
//                                 src="https://i.pravatar.cc/100?img=11"
//                                 alt="User 1"
//                                 className="w-10 h-10 rounded-full border-2 border-white object-cover z-10 relative"
//                             />
//                             <img
//                                 src="https://i.pravatar.cc/100?img=32"
//                                 alt="User 2"
//                                 className="w-10 h-10 rounded-full border-2 border-white object-cover z-20 relative"
//                             />
//                             {joins.length > 2 && (
//                                 <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 z-30 text-white flex items-center justify-center text-sm font-bold relative">
//                                     {joins.length - 2}+
//                                 </div>
//                             )}
//                         </div>

//                         {/* Text Content */}
//                         <div className="flex flex-col pl-1 justify-center min-w-0">
//                             <h3 className="font-bold text-gray-900 text-sm">New Join Request!</h3>

//                             {/* 1. Make the paragraph a flex container */}
//                             <p className="flex items-center text-sm text-gray-500 mt-0.5 w-full">

//                                 {/* 2. Wrap the prefix text in shrink-0 so it never gets cut off */}
//                                 <span className="shrink-0 whitespace-pre">
//                                     <span className="text-blue-500 font-medium">
//                                         {joins.length === 1 ? joins[0]?.joinerUsername : `${joins.length} developers`}
//                                     </span>
//                                     {" "}want to pair on{" "}
//                                 </span>

//                                 {/* 3. The title takes the remaining space and truncates */}
//                                 <span className="font-bold truncate">
//                                     &rdquo;{myRequest?.challengeTitle}&rdquo;
//                                 </span>

//                             </p>
//                         </div>
//                     </div>

//                     {/* Close Button */}
//                     <button
//                         onClick={() => setIsVisible(false)}
//                         className="text-gray-400 mr-1 hover:text-gray-600 transition-colors mt-1"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//                             <path d="M9.11704 10L3.93329 4.8175C3.87518 4.75939 3.82908 4.6904 3.79764 4.61448C3.76619 4.53855 3.75 4.45718 3.75 4.375C3.75 4.29282 3.76619 4.21144 3.79764 4.13552C3.82908 4.05959 3.87518 3.99061 3.93329 3.9325C3.9914 3.87439 4.06039 3.82829 4.13631 3.79684C4.21223 3.76539 4.29361 3.74921 4.37579 3.74921C4.45797 3.74921 4.53934 3.76539 4.61527 3.79684C4.69119 3.82829 4.76018 3.87439 4.81829 3.9325L10.0008 9.11625L15.1833 3.9325C15.3006 3.81514 15.4598 3.74921 15.6258 3.74921C15.7918 3.74921 15.9509 3.81514 16.0683 3.9325C16.1856 4.04985 16.2516 4.20903 16.2516 4.375C16.2516 4.54097 16.1856 4.70014 16.0683 4.8175L10.8845 10L16.0683 15.1825C16.1856 15.2999 16.2516 15.459 16.2516 15.625C16.2516 15.791 16.1856 15.9501 16.0683 16.0675C15.9509 16.1849 15.7918 16.2508 15.6258 16.2508C15.4598 16.2508 15.3006 16.1849 15.1833 16.0675L10.0008 10.8837L4.81829 16.0675C4.70093 16.1849 4.54176 16.2508 4.37579 16.2508C4.20982 16.2508 4.05065 16.1849 3.93329 16.0675C3.81593 15.9501 3.75 15.791 3.75 15.625C3.75 15.459 3.81593 15.2999 3.93329 15.1825L9.11704 10Z" fill="#4D4D4D" />
//                         </svg>
//                     </button>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 mt-5">
//                     <button
//                         onClick={() => setIsVisible(false)}
//                         className="flex-1 bg-[#F1F4F9] text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
//                     >
//                         Ignore
//                     </button>
//                     <Link
//                         href={challengeHref}
//                         className="flex-1 bg-[#007BFF] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
//                     >
//                         <Users size={16} />
//                         {joins.length > 1 ? `View ${joins.length} Requests` : "Manage Request"}
//                     </Link>
//                 </div>
//             </div>
//         )}
//     </>);
// }