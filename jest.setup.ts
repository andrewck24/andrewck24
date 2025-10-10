import "@testing-library/jest-dom";
import { ImageProps } from "next/image";
import React from "react";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...rest }: ImageProps) => {
    // Filter out special props from next/image
    const { fill, priority, quality, sizes, ...imgProps } = rest;
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement("img", {
      src: typeof src === "string" ? src : "",
      alt: alt ?? "",
      width,
      height,
      ...imgProps,
    });
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return React.createElement("a", { href }, children);
  },
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
