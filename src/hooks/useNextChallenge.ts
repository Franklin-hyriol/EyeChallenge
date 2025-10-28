"use client";

import { usePathname } from "next/navigation";
import tests from "@/data/tests";
import { useMemo } from "react";

export function useNextChallenge() {
  const pathname = usePathname();

  const nextTest = useMemo(() => {
    const availableTests = tests.filter((test) => !pathname.includes(test.link));
    if (availableTests.length === 0) {
      // Fallback if all tests are somehow filtered out, return to the main tests page
      return { link: "/tests" };
    }
    return availableTests[Math.floor(Math.random() * availableTests.length)];
  }, [pathname]);

  return nextTest;
}
