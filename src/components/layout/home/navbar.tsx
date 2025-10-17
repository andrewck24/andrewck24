"use client";
import type { HomeLayoutProps } from "@/components/layout/home";
import { BaseLinkItem, type LinkItemType } from "@/components/layout/shared";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type {
  NavigationMenuContentProps,
  NavigationMenuTriggerProps,
} from "@radix-ui/react-navigation-menu";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "fumadocs-core/link";
import { useNav } from "fumadocs-ui/contexts/layout";
import { type ComponentProps, Fragment, useState } from "react";

const navItemVariants = cva(
  "text-fd-muted-foreground hover:text-fd-accent-foreground data-[active=true]:text-fd-primary inline-flex items-center gap-1 p-2 transition-colors [&_svg]:size-4"
);

export function Navbar(props: HomeLayoutProps & ComponentProps<"div">) {
  const [value, setValue] = useState("");
  const { isTransparent } = useNav();

  return (
    <NavigationMenu
      value={value}
      onValueChange={setValue}
      className="*:max-w-fd-container fixed top-(--fd-banner-height) right-(--removed-body-scroll-bar-size,0) left-0 z-40 flex justify-center"
    >
      <div
        id="nd-nav"
        {...props}
        className={cn(
          "mx-4 mt-4 w-full rounded-xl border border-transparent backdrop-blur-sm transition-colors lg:mx-12",
          (!isTransparent || value.length > 0) &&
            "bg-fd-background/60 border-border",
          props.className
        )}
      >
        <NavigationMenuList className="flex h-14 w-full items-center px-4">
          {props.children}
        </NavigationMenuList>
        <NavigationMenuViewport />
      </div>
    </NavigationMenu>
  );
}

export function NavbarLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  if (item.type === "custom") return <div {...props}>{item.children}</div>;

  if (item.type === "menu") {
    const children = item.items.map((child, j) => {
      if (child.type === "custom")
        return <Fragment key={j}>{child.children}</Fragment>;

      const {
        banner = child.icon ? (
          <div className="bg-fd-muted w-fit rounded-md border p-1 [&_svg]:size-4">
            {child.icon}
          </div>
        ) : null,
        ...rest
      } = child.menu ?? {};

      return (
        <NavbarMenuLink
          key={j}
          href={child.url}
          external={child.external}
          {...rest}
        >
          {rest.children ?? (
            <>
              {banner}
              <p className="text-[15px] font-medium">{child.text}</p>
              <p className="text-fd-muted-foreground text-sm empty:hidden">
                {child.description}
              </p>
            </>
          )}
        </NavbarMenuLink>
      );
    });

    return (
      <NavigationMenuItem>
        <NavbarMenuTrigger {...props}>
          {item.url ? (
            <Link href={item.url} external={item.external}>
              {item.text}
            </Link>
          ) : (
            item.text
          )}
        </NavbarMenuTrigger>
        <NavbarMenuContent>{children}</NavbarMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavbarLink
      {...props}
      item={item}
      variant={item.type}
      aria-label={item.type === "icon" ? item.label : undefined}
    >
      {item.type === "icon" ? item.icon : item.text}
    </NavbarLink>
  );
}

export function NavbarMenuContent(props: NavigationMenuContentProps) {
  return (
    <NavigationMenuContent
      {...props}
      className={cn(
        "grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3",
        props.className
      )}
    >
      {props.children}
    </NavigationMenuContent>
  );
}

export function NavbarMenuTrigger(props: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuTrigger
      {...props}
      className={cn(navItemVariants(), "rounded-md", props.className)}
    >
      {props.children}
    </NavigationMenuTrigger>
  );
}

export function NavbarMenuLink(props: LinkProps) {
  return (
    <NavigationMenuLink asChild>
      <Link
        {...props}
        className={cn(
          "bg-fd-card hover:bg-fd-accent/80 hover:text-fd-accent-foreground flex flex-col gap-2 rounded-lg border p-3 transition-colors",
          props.className
        )}
      >
        {props.children}
      </Link>
    </NavigationMenuLink>
  );
}

const linkVariants = cva("", {
  variants: {
    variant: {
      main: navItemVariants(),
      button: buttonVariants({
        variant: "secondary",
        className: "gap-1.5 [&_svg]:size-4",
      }),
      icon: buttonVariants({
        variant: "ghost",
        size: "icon",
      }),
    },
  },
  defaultVariants: {
    variant: "main",
  },
});

export function NavbarLink({
  item,
  variant,
  ...props
}: ComponentProps<typeof BaseLinkItem> & VariantProps<typeof linkVariants>) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <BaseLinkItem
          {...props}
          item={item}
          className={cn(linkVariants({ variant }), props.className)}
        >
          {props.children}
        </BaseLinkItem>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
