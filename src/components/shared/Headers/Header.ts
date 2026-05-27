/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

/** Align options (mobile-first) */
export type Align = "left" | "center" | "right";
export type Size = "sm" | "md" | "lg" | "xl";
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export interface SectionHeaderProps extends DivProps {
  eyebrow?: string;
  title: string | React.ReactNode;   // ✅ now accepts both string and JSX
  description?: string | React.ReactNode;
  as?: HeadingTag;

  /** Mobile-first alignment + md/lg overrides */
  align?: Align;
  alignMd?: Align;
  alignLg?: Align;

  size?: Size;
  id?: string;

  titleMaxWidthClass?: string;
  descMaxWidthClass?: string;
  eyebrowSrOnly?: boolean;

  eyebrowColor?: string;
  titleColor?: string;
  descriptionColor?: string;

  eyebrowGap?: string;
  descriptionGap?: string;

  /** Optional overrides */
  headingClassName?: string;
  eyebrowClassName?: string;
  descriptionClassName?: string;
}


/** Tailwind title sizes */
export const sizeMap: Record<Size, string> = {
  sm: "text-xl sm:text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
};




export function slugify(node: React.ReactNode): string {
  const text = extractText(node).trim();
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function extractText(n: React.ReactNode): string {
  if (n == null || typeof n === "boolean") return "";
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(extractText).join(" ");

  // Safely narrow React elements and read children
  if (React.isValidElement(n)) {
    const props = (n as React.ReactElement<any>).props as { children?: React.ReactNode };
    return extractText(props?.children);
  }

  return "";
}


/** Slugify string or ReactNode */
// export function slugify(node: React.ReactNode): string {
//   function extractText(n: React.ReactNode): string {
//     if (typeof n === "string" || typeof n === "number") return String(n);
//     if (Array.isArray(n)) return n.map(extractText).join(" ");
//     if (React.isValidElement(n)) return extractText(n.props?.children);
//     return "";
//   }
//   const text = extractText(node);
//   if (!text) return "";
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .trim()
//     .replace(/\s+/g, "-")
//     .slice(0, 80);
// }


/** Edge-safe deterministic fallback ID (djb2) */
export function generateStableId(input: string, prefix = "heading"): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
  const hash = (h >>> 0).toString(16).slice(0, 8);
  return `${prefix}-${hash}`;
}










// import * as React from "react";
// import crypto from "crypto";

// /** Align options (mobile-first) */
// export type Align = "left" | "center" | "right";
// export type Size = "sm" | "md" | "lg" | "xl";
// export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// /** Reusable props for the SectionHeader block */
// export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
//   eyebrow?: string;
//   title: string | React.ReactNode;
//   description?: string;

//   /** Heading tag, defaults to h2 */
//   as?: HeadingTag;

//   /** Mobile-first alignment (default "left") */
//   align?: Align;
//   /** Optional md breakpoint override */
//   alignMd?: Align;
//   /** Optional lg breakpoint override */
//   alignLg?: Align;

//   size?: Size;
//   id?: string;

//   /** Optional max-width controls */
//   titleMaxWidthClass?: string;
//   descMaxWidthClass?: string;
//   eyebrowSrOnly?: boolean;

//   /** Color utilities */
//   eyebrowColor?: string;
//   titleColor?: string;
//   descriptionColor?: string;

//   /** Spacing utilities */
//   eyebrowGap?: string;
//   descriptionGap?: string;
// }

// /** Tailwind text-size map for the title */
// export const sizeMap: Record<Size, string> = {
//   sm: "text-xl sm:text-2xl",
//   md: "text-2xl sm:text-3xl",
//   lg: "text-3xl sm:text-4xl",
//   xl: "text-4xl sm:text-5xl",
// };

// /** Single unified slugify that accepts string or ReactNode */
// export function slugify(node: React.ReactNode): string {
//   function extractText(n: React.ReactNode): string {
//     if (typeof n === "string" || typeof n === "number") return String(n);
//     if (Array.isArray(n)) return n.map(extractText).join(" ");
//     if (React.isValidElement(n)) return extractText(n.props?.children);
//     return "";
//   }
//   const text = extractText(node);
//   if (!text) return "";
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .trim()
//     .replace(/\s+/g, "-")
//     .slice(0, 80);
// }

// /** Server-safe deterministic fallback ID (stable across renders for same input) */
// export function generateStableId(input: string, prefix = "heading"): string {
//   const hash = crypto.createHash("sha1").update(input).digest("hex").slice(0, 8);
//   return `${prefix}-${hash}`;
// }
