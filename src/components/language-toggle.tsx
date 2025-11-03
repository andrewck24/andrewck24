"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Locale } from "@/types/article";
import { cn } from "@/lib/utils";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { type ButtonHTMLAttributes, type HTMLAttributes } from "react";

// 改名：LanguageSelectProps → LanguageToggleProps
export interface LanguageToggleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 可用的語言版本（必填）
   * 至少包含當前頁面的語言
   */
  availableLocales: Locale[]; // 改為 required
}

export function LanguageToggle({
  availableLocales,
  ...props
}: LanguageToggleProps): React.ReactElement {
  const context = useI18n();

  if (!context.locales) {
    throw new Error("Missing `<I18nProvider />`");
  }

  // availableLocales 是 required，直接過濾
  const displayLocales = context.locales.filter((item) =>
    availableLocales.includes(item.locale as Locale)
  );

  // 防禦性檢查：理論上不應該發生
  if (displayLocales.length === 0) {
    console.warn(
      `No matching locales found. availableLocales: ${availableLocales.join(", ")}`
    );
    return <div className="text-muted-foreground text-xs">無可用語言</div>;
  }

  // 只有一個語言時，顯示靜態文字（不需要切換器）
  if (displayLocales.length === 1) {
    return (
      <div
        className="text-muted-foreground text-sm"
        data-testid="language-toggle-single"
      >
        {displayLocales[0].name}
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        aria-label={context.text.chooseLanguage}
        className={cn(
          buttonVariants({ variant: "ghost", className: "size-9" }),
          props.className
        )}
        {...props}
      >
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="border-border flex flex-col overflow-hidden p-0">
        <p className="text-fd-muted-foreground mb-1 p-2 text-xs font-medium">
          {context.text.chooseLanguage}
        </p>
        {displayLocales.map((item) => (
          <button
            key={item.locale}
            type="button"
            className={cn(
              "p-2 text-start text-sm transition-colors",
              item.locale === context.locale
                ? "bg-fd-primary/10 text-fd-primary font-medium"
                : "hover:bg-fd-accent hover:text-fd-accent-foreground"
            )}
            onClick={() => {
              context.onChange?.(item.locale);
            }}
          >
            {item.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function LanguageToggleText(
  props: HTMLAttributes<HTMLSpanElement>
): React.ReactElement {
  const context = useI18n();
  const text = context.locales?.find(
    (item) => item.locale === context.locale
  )?.name;

  return <span {...props}>{text}</span>;
}
