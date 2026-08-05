export function getAutoScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") {
    return "auto";
  }

  return "instant";
}
