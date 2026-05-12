"use client";

import { usePathname, useRouter as useNextRouter, useSearchParams } from "next/navigation";

export { usePathname, useSearchParams };

export function useRouter() {
  const router = useNextRouter();
  return {
    push: (to: string) => router.push(to),
    replace: (to: string) => router.replace(to),
  };
}

export function navigate(to: string, options?: { replace?: boolean }) {
  if (typeof window === "undefined") return;

  if (options?.replace) {
    window.history.replaceState({}, "", to);
  } else {
    window.history.pushState({}, "", to);
  }
}