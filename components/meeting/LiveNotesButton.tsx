"use client";

import Link from "next/link";

import { AnimatedEllipsis } from "@/components/ui/animated-ellipsis";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shared/utils";

type LiveNotesButtonProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function LiveNotesButton({
  href,
  onClick,
  className,
  disabled,
}: LiveNotesButtonProps) {
  const label = (
    <>
      <AnimatedEllipsis size="sm" />
      Live notes
    </>
  );

  if (href) {
    return (
      <Button
        variant="outline"
        size="sm"
        asChild
        className={cn(className)}
        disabled={disabled}
      >
        <Link href={href}>{label}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(className)}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
