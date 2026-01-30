import { cn } from "@/lib";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import React from "react";

interface DisplayAvatarProps {
  src?: string;
  className?: string;
  FallbackName?: string;
  FallbackClass?: string;
  AvatarImageClass?: string;
}

export const DisplayAvatar = React.memo(
  ({
    src,
    className,
    FallbackName,
    FallbackClass,
    AvatarImageClass,
  }: DisplayAvatarProps) => {
    return (
      <Avatar className={cn("size-9", className)}>
        <AvatarImage
          src={src}
          alt="profile_avatar"
          className={cn(AvatarImageClass)}
        />
        <AvatarFallback className={cn(" font-medium", FallbackClass)}>
          {FallbackName}
        </AvatarFallback>
      </Avatar>
    );
  }
);
