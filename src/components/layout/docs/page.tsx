import {
  type BreadcrumbProps,
  type FooterProps,
  PageBreadcrumb,
  PageFooter,
  PageLastUpdate,
  PageTOC,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverTrigger,
} from "@/components/layout/docs/page-client";
import { TOCItems, TOCProvider, TOCScrollArea } from "@/components/ui/toc";
import ClerkTOCItems from "@/components/ui/toc-clerk";
import { cn } from "@/lib/utils";
import type { AnchorProviderProps } from "fumadocs-core/toc";
import { I18nLabel } from "fumadocs-ui/contexts/i18n";
import { Text } from "lucide-react";
import { type ComponentProps } from "react";

export function PageTOCTitle(props: ComponentProps<"h2">) {
  return (
    <h3
      {...props}
      className={cn(
        "text-fd-muted-foreground inline-flex items-center gap-1.5 text-sm",
        props.className
      )}
    >
      <Text className="size-4" />
      <I18nLabel label="toc" />
    </h3>
  );
}

export function PageTOCItems({
  variant = "normal",
  ...props
}: ComponentProps<"div"> & { variant?: "clerk" | "normal" }) {
  return (
    <TOCScrollArea {...props}>
      {variant === "clerk" ? <ClerkTOCItems /> : <TOCItems />}
    </TOCScrollArea>
  );
}

export function PageTOCPopoverItems({
  variant = "normal",
  ...props
}: ComponentProps<"div"> & { variant?: "clerk" | "normal" }) {
  return (
    <TOCScrollArea {...props}>
      {variant === "clerk" ? <ClerkTOCItems /> : <TOCItems />}
    </TOCScrollArea>
  );
}

export function PageArticle(props: ComponentProps<"article">) {
  return (
    <article
      {...props}
      className={cn(
        "flex w-full min-w-0 flex-col gap-4 px-4 pt-8 md:mx-auto md:px-6",
        props.className
      )}
    >
      {props.children}
    </article>
  );
}

export interface RootProps extends ComponentProps<"div"> {
  toc?: Omit<AnchorProviderProps, "children"> | false;
}

export function PageRoot({ toc = false, children, ...props }: RootProps) {
  const content = (
    <div
      id="nd-page"
      {...props}
      className={cn(
        "mx-auto flex w-full max-w-(--fd-page-width) flex-1 pe-(--fd-toc-width) pt-(--fd-tocnav-height)",
        props.className
      )}
    >
      {children}
    </div>
  );

  if (toc) return <TOCProvider {...toc}>{content}</TOCProvider>;
  return content;
}

export {
  PageBreadcrumb,
  PageFooter,
  PageLastUpdate,
  PageTOC,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverTrigger,
  type BreadcrumbProps,
  type FooterProps,
};
