import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * This is a setup for https://ui.shadcn.com/
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
