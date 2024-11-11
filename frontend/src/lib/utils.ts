import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobile() {
  // Check if the browser supports the window.matchMedia method
  if (window.matchMedia) {
    // Create a media condition that targets mobile devices
    const mobileQuery = window.matchMedia(
      "(max-width: 767px), (pointer: coarse)",
    );

    // Return the matches property of the MediaQueryList object
    return mobileQuery.matches;
  }

  // Fallback for browsers that don't support matchMedia
  return window.innerWidth <= 767 || "ontouchstart" in window;
}
