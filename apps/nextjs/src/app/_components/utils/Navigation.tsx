import Link from "next/link";

import { cn } from "@acme/ui";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@acme/ui/navigation-menu";

const Navigation = ({
  items,
}: {
  items: { href: string; label: string; active: boolean }[];
}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const NavItem = ({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) => {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          active={active}
          className={cn(
            navigationMenuTriggerStyle(),
            active && "pointer-events-none",
          )}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};

export default Navigation;
