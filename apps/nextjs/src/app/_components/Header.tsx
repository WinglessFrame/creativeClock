"use client";

import { ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@acme/ui/navigation-menu";

const Header = ({ authButton }: { authButton: ReactElement }) => (
  <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex w-full items-center justify-between ">
      <NavigationMenu>
        <NavigationMenuList>
          {[
            { href: "/time" as const, label: "Time" },
            { href: "/expenses" as const, label: "Expenses" },
          ].map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {authButton}
    </div>
  </header>
);

const NavItem = ({
  href,
  label,
}: {
  href: "/time" | "/expenses";
  label: string;
}) => {
  const pathname = usePathname();
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          active={pathname === href}
          className={navigationMenuTriggerStyle()}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};

export default Header;
