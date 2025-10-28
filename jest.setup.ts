import "@testing-library/jest-dom";
import { ImageProps } from "next/image";
import React from "react";
import { z } from "zod";

// Mock fumadocs-mdx/config
jest.mock("fumadocs-mdx/config", () => ({
  frontmatterSchema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(200),
    icon: z.string().optional(),
    full: z.boolean().optional(),
    _openapi: z.any().optional(),
  }),
}));

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
      loading: priority ? "eager" : "lazy", // Set loading based on priority
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
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    return React.createElement("a", { href, ...rest }, children);
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

// Mock React ViewTransition (API in React 19)
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    ViewTransition: ({
      children,
    }: {
      children: React.ReactNode;
      name?: string;
    }) => {
      return originalReact.createElement(originalReact.Fragment, {}, children);
    },
  };
});
