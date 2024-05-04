"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@acme/ui/navigation-menu";

const Header = () => (
  <header className="flex items-center justify-between py-4">
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
    <div>
      <span className="h-10 w-10 rounded-full bg-slate-100" />
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
