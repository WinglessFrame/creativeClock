"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useTimeContext } from "./timeContext.client";

export default function NavigationEvents() {
  const pathname = usePathname();
  const { setSelectedDate } = useTimeContext();

  useEffect(() => {
    if (pathname !== "/time") {
      const newDate = new Date(pathname);

      setSelectedDate(newDate);
    }
  }, [pathname]);

  return null;
}
