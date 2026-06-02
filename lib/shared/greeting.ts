/** Local-time greeting for the homepage hero (before noon vs noon onward). */
export function getTimeOfDayGreeting(date: Date = new Date()): "Good morning" | "Good afternoon" {
  return date.getHours() < 12 ? "Good morning" : "Good afternoon";
}
