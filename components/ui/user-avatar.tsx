"use client";

import Image from "next/image";
import { useState } from "react";

import { getUserAvatarSrc, getUserAvatarSrcByName } from "@/lib/shared/user-avatars";
import { cn } from "@/lib/shared/utils";

const SIZE_CLASSES = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
} as const;

const SIZE_PX = {
  sm: 28,
  md: 36,
} as const;

export function getAvatarInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return "?";
  }

  return trimmed.charAt(0).toUpperCase();
}

type UserAvatarProps = {
  name: string;
  /** Explicit image URL; takes precedence over `email` / `ownerName` lookups. */
  src?: string | null;
  /** Resolves avatar from `lib/shared/user-avatars` when `src` is omitted. */
  email?: string;
  /** Resolves avatar by display name when `src` and `email` are omitted. */
  ownerName?: string;
  size?: keyof typeof SIZE_CLASSES;
  themeClass?: string;
  className?: string;
};

export function UserAvatar({
  name,
  src,
  email,
  ownerName,
  size = "sm",
  themeClass = "bg-slate-100 text-slate-700",
  className,
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedSrc =
    src ??
    (email ? getUserAvatarSrc(email) : null) ??
    (ownerName ? getUserAvatarSrcByName(ownerName) : null);
  const showImage = Boolean(resolvedSrc) && !imageFailed;
  const sizeClass = SIZE_CLASSES[size];
  const dimension = SIZE_PX[size];

  if (showImage && resolvedSrc) {
    return (
      <Image
        src={resolvedSrc}
        alt=""
        width={dimension}
        height={dimension}
        className={cn(
          "inline-block shrink-0 rounded-sm object-cover",
          sizeClass,
          className,
        )}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm font-medium",
        sizeClass,
        themeClass,
        className,
      )}
    >
      {getAvatarInitial(name)}
    </span>
  );
}
