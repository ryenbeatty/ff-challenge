import type { BreadcrumbItem } from "@/components/shell/Breadcrumbs";
import { isMeetingDetailPath, isViewMeetingPath } from "@/lib/meetings/routes";

export const HOME_PATH = "/";
export const MEETINGS_PATH = "/meetings";

export type ShellRouteKind = "home" | "meetings" | "meetingDetail" | "other";

export type InlineSidebarVariant = "expanded" | "collapsed" | "hidden";

export function getShellRouteKind(pathname: string): ShellRouteKind {
  if (pathname === HOME_PATH) {
    return "home";
  }

  if (pathname === MEETINGS_PATH) {
    return "meetings";
  }

  if (isMeetingDetailPath(pathname)) {
    return "meetingDetail";
  }

  return "other";
}

export function isMeetingDetailRoute(pathname: string): boolean {
  return getShellRouteKind(pathname) === "meetingDetail";
}

export function isMeetingViewRoute(pathname: string): boolean {
  return isViewMeetingPath(pathname);
}

export function getInlineSidebarVariant(pathname: string): InlineSidebarVariant {
  const kind = getShellRouteKind(pathname);

  if (kind === "meetingDetail") {
    return "hidden";
  }

  if (kind === "meetings") {
    return "collapsed";
  }

  return "expanded";
}

export function getBreadcrumbItems(
  pathname: string,
  meetingTitle?: string,
): BreadcrumbItem[] {
  const kind = getShellRouteKind(pathname);

  if (kind === "home") {
    return [{ label: "Home" }];
  }

  if (kind === "meetings") {
    return [{ label: "Meetings" }];
  }

  if (kind === "meetingDetail") {
    return [
      { label: "Meetings", href: MEETINGS_PATH },
      { label: meetingTitle ?? "Meeting" },
    ];
  }

  return [{ label: "Meetings", href: MEETINGS_PATH }];
}
