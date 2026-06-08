/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  SectionHeaderProps,
  slugify,
  sizeMap,
  generateStableId,

  Size,
} from "./Header";




export type Align = 'left' | 'center' | 'right';

const TOKENS = {
  base: { left: 'text-left', center: 'text-center', right: 'text-right' } as const,
  md: { left: 'md:text-left', center: 'md:text-center', right: 'md:text-right' } as const,
  lg: { left: 'lg:text-left', center: 'lg:text-center', right: 'lg:text-right' } as const,
};

export function getAlignClasses(
  align: Align = 'left',
  alignMd?: Align,
  alignLg?: Align
): {
  wrapperAlignCls: string;
  alignHeadingCls: string;
  eyebrowAlignCls: string;
  descAlign: string;
} {
  const parts = [
    TOKENS.base[align],
    alignMd ? TOKENS.md[alignMd] : '',
    alignLg ? TOKENS.lg[alignLg] : '',
  ].filter(Boolean);

  const cls = parts.join(' ').trim();

  return {
    wrapperAlignCls: cls,
    alignHeadingCls: cls,
    eyebrowAlignCls: cls,
    descAlign: cls,
  };
}


import { ReactElement } from "react";

import {
  ReactNode,
  isValidElement,
  Children,
  cloneElement,
} from "react";
import { cn } from "@/lib";

type TitleInput = string | ReactNode;

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "keygen",
  "link", "meta", "param", "source", "track", "wbr"
]);

const isPureWhitespace = (s: string) => /^\s+$/.test(s);



function processChildren(node: ReactNode): ReactNode {
  const flat = Children.toArray(node); // flattens fragments safely

  return flat
    .map((child) => {
      if (typeof child === "string") {
        // remove pure whitespace nodes, trim others
        return isPureWhitespace(child) ? null : child.trim();
      }

      if (isValidElement(child)) {
        const type = child.type as any;
        if (typeof type === "string" && VOID_TAGS.has(type)) {
          return child; // void element, keep as-is
        }

        // 1. Cast props to explicitly include 'children'
        const props = child.props as { children?: ReactNode };

        // 2. Pass the correctly typed children to processChildren
        const processed = processChildren(props.children);

        // 3. Cast child to ReactElement<any> to prevent cloneElement type conflicts
        return cloneElement(child as ReactElement<any>, { children: processed });
      }

      return child;
    })
    .filter(Boolean); // remove nulls
}
// function processChildren(node: ReactNode): ReactNode {
//   const flat = Children.toArray(node); // flattens fragments safely

//   return flat
//     .map((child) => {
//       if (typeof child === "string") {
//         // remove pure whitespace nodes, trim others
//         return isPureWhitespace(child) ? null : child.trim();
//       }

//       if (isValidElement(child)) {
//         const type = child.type as any;
//         if (typeof type === "string" && VOID_TAGS.has(type)) {
//           return child; // void element, keep as-is
//         }
//         const processed = processChildren(child.props?.children );
//         return cloneElement(child, { children: processed });
//       }

//       return child;
//     })
//     .filter(Boolean); // remove nulls
// }


// (Assuming TitleInput and processChildren are defined)

export function formatTitle(title: TitleInput): ReactNode {
  if (typeof title === "string") {
    return title.trim();
  }

  if (isValidElement(title)) {
    // 1. Cast props to include children and allow rest destructuring
    const props = title.props as { children?: ReactNode;[key: string]: any };

    const processedChildren = processChildren(props.children);

    if (title.type === "div") {
      // 2. Destructure from our properly typed props
      const { children, ...rest } = props;

      return React.createElement("span", rest, processedChildren);
    }

    // 3. Cast title to ReactElement<any> for cloneElement
    return cloneElement(title as ReactElement<any>, { children: processedChildren });
  }

  return null;
}

// export function formatTitle(title: TitleInput): ReactNode {
//   if (typeof title === "string") {
//     return title.trim();
//   }

//   if (isValidElement(title)) {
//     const processedChildren = processChildren(title.props?.children);

//     if (title.type === "div") {
//       const { children, ...rest } = title.props || {};
//       return React.createElement("span", { ...rest }, processedChildren);
//     }

//     return cloneElement(title, { children: processedChildren });
//   }

//   return null;
// }

export default function PrimaryHeader({
  eyebrow,
  title,
  description,
  as = "h1",
  align = "left",
  alignMd,
  alignLg,
  size = "xl",
  id,
  titleMaxWidthClass,
  descMaxWidthClass,
  eyebrowSrOnly = false,
  className = "",
  eyebrowColor = "bg-[#e8ebed]",
  titleColor = "text-[#070707]",
  descriptionColor = "text-slate-blue-700",
  eyebrowGap = "mb-3",
  descriptionGap = "mt-5",
  headingClassName,
  eyebrowClassName = "bg-[#e8ebed]",
  descriptionClassName,


  ...rest
}: SectionHeaderProps) {

  const computedSlug = slugify(title);
  const hashInput = computedSlug || (typeof title === "string" ? title : "section");
  const headingId = id ?? (computedSlug || generateStableId(hashInput));


  const safeSize: Size = (["sm", "md", "lg", "xl"] as const).includes(size) ? size : "lg";

  const { wrapperAlignCls, alignHeadingCls, eyebrowAlignCls, descAlign } =
    getAlignClasses(align, alignMd, alignLg);

  const Heading = as

  return (
    <div className={cn("w-full space-y-4", wrapperAlignCls, className)} {...rest}>
      {eyebrow && (
        <div className={cn(
          eyebrowGap,
          "inline-flex items-center gap-1 px-4 py-2 rounded-full  text-sm",
          eyebrowColor,
          eyebrowSrOnly && "sr-only",
          eyebrowAlignCls,
          eyebrowClassName
        )}>
          <span className=" py-1 text-xs  text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clipPath="url(#clip0_61232_7733)">
                <path
                  d="M5.25 7.5V16.5"
                  stroke="#0B213A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.25 4.41L10.5 7.5H14.8725C15.1054 7.5 15.335 7.55422 15.5433 7.65836C15.7516 7.7625 15.9328 7.91371 16.0725 8.1C16.2122 8.28629 16.3066 8.50256 16.3483 8.73167C16.39 8.96078 16.3777 9.19645 16.3125 9.42L14.565 15.42C14.4741 15.7316 14.2846 16.0053 14.025 16.2C13.7654 16.3947 13.4496 16.5 13.125 16.5H3C2.60218 16.5 2.22064 16.342 1.93934 16.0607C1.65804 15.7794 1.5 15.3978 1.5 15V9C1.5 8.60218 1.65804 8.22064 1.93934 7.93934C2.22064 7.65804 2.60218 7.5 3 7.5H5.07C5.34906 7.49985 5.62255 7.42186 5.85972 7.27479C6.09688 7.12772 6.28832 6.91741 6.4125 6.6675L9 1.5C9.35368 1.50438 9.7018 1.58863 10.0184 1.74645C10.3349 1.90427 10.6117 2.13158 10.8281 2.4114C11.0444 2.69122 11.1947 3.01632 11.2678 3.3624C11.3409 3.70848 11.3348 4.0666 11.25 4.41Z"
                  stroke="#0B213A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_61232_7733">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          <span className=" text-gray-600 uppercase  text-sm">
            {eyebrow}
          </span>
        </div>
      )}

      <Heading
        id={headingId}

        className={cn(
          "font-bold! leading-tight text-neutral-04!",
          titleColor,
          sizeMap[safeSize],
          alignHeadingCls,
          titleMaxWidthClass,
          headingClassName,


        )}
      >
        {formatTitle(title)}
      </Heading>

      {description && (
        <p
          className={cn(
            descriptionGap,
            "text-sm sm:text-base",
            descriptionColor,
            descAlign,
            descMaxWidthClass,
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}