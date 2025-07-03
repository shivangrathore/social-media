import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralize(count: number, singular: string, plural?: string) {
  if (count === 1) {
    return `${count} ${singular}`;
  }
  return `${count} ${plural || singular + "s"}`;
}

export function getInitials(name: string, maxInitials = 2): string {
  const initials = name
    .split(" ")
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return initials;
}
