"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Home } from "lucide-react";

import type { SidebarVariant } from "@/components/app-shell/AppShellProvider";
import { SHELL_HEADER_HEIGHT_CLASS } from "@/components/app-shell/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type LeftSidebarProps = {
  displayVariant: Extract<SidebarVariant, "collapsed" | "expanded">;
};

function SidebarBrand({ isCollapsed }: { isCollapsed: boolean }) {
  const brand = (
    <Link
      href="/"
      className={cn(
        "block font-semibold tracking-tight text-violet-600 transition hover:text-violet-700",
        isCollapsed ? "text-center text-sm leading-none" : "text-base",
      )}
    >
      {isCollapsed ? (
        <span aria-label="fireflies.fun">ff</span>
      ) : (
        "fireflies.fun"
      )}
    </Link>
  );

  if (!isCollapsed) {
    return brand;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{brand}</TooltipTrigger>
      <TooltipContent side="right">fireflies.fun</TooltipContent>
    </Tooltip>
  );
}

type SidebarNavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  showTooltip: boolean;
  isCollapsed: boolean;
};

function SidebarNavItem({
  href,
  label,
  icon: Icon,
  isActive,
  showTooltip,
  isCollapsed,
}: SidebarNavItemProps) {
  const link = (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-10 items-center rounded-md text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900",
        isCollapsed ? "justify-center px-0" : "gap-2.5 px-3",
        isActive && "bg-slate-100 text-slate-900",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {isCollapsed ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </Link>
  );

  if (!showTooltip) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export default function LeftSidebar({ displayVariant }: LeftSidebarProps) {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isCollapsed = displayVariant === "collapsed";

  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className={cn(
          "flex shrink-0 items-center px-3",
          SHELL_HEADER_HEIGHT_CLASS,
          isCollapsed && "justify-center",
        )}
      >
        <SidebarBrand isCollapsed={isCollapsed} />
      </div>
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto p-3"
      >
        <SidebarNavItem
          href="/"
          label="Home"
          icon={Home}
          isActive={isHomeActive}
          isCollapsed={isCollapsed}
          showTooltip={isCollapsed}
        />
      </nav>
    </div>
  );
}
