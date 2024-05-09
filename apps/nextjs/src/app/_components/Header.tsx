"use client";

import { ReactElement } from "react";
import { usePathname } from "next/navigation";

import Navigation from "./utils/Navigation";

const Header = ({ authButton }: { authButton: ReactElement }) => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex w-full items-center justify-between ">
        <Navigation
          items={[
            {
              href: "/time" as const,
              label: "Time",
              active: pathname.startsWith("/time"),
            },
            {
              href: "/expenses" as const,
              label: "Expenses",
              active: pathname.startsWith("/expenses"),
            },
          ]}
        />

        {authButton}
      </div>
    </header>
  );
};

export default Header;
