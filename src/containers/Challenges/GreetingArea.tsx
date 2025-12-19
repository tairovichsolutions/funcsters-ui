import React from "react";

interface GreetingAreaType {
  username: string;
  profileLoading?: boolean;
}
export const GreetingArea = React.memo(({ username }: GreetingAreaType) => {
  return (
    <div>
      <h2
        style={{ fontWeight: "900" }}
        className="dark:text-white text-black  font-nexaBold text-xl sm:text-2xl  md::text-3xl  lg:text-4xl"
      >
        Good Morning, {username}! 👋
      </h2>
      <p className="dark:text-white text-black/60 font-normal text-sm md:text-[15px] mt-2">
        Ready to tackle today’s coding challenges?
      </p>
    </div>
  );
});
