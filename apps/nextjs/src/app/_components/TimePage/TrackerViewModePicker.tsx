"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Navigation from "../utils/Navigation";

const TrackerViewModePicker = () => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <Navigation
      items={[
        {
          href: "/time",
          label: "Day",
          active: pathname.includes("/days") || pathname === "/time",
        },
        {
          href: "/time/weeks",
          label: "Week",
          active: pathname.includes("/weeks"),
        },
      ]}
    />
  );
};

export default TrackerViewModePicker;
