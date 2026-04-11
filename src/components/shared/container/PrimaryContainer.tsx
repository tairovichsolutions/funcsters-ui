/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX } from "react";

type ContainerProps = {
  children: React.ReactNode;
  id?: string;
  as?: keyof JSX.IntrinsicElements;
  ariaLabel?: string;
  ariaLabelledBy?: string; 
  className?: string;
} & React.AriaAttributes;

const LANDMARKS = new Set(["main", "nav", "header", "footer", "aside"]);

export default function PrimaryContainer({
  children,
  id,
  as: Tag = "section",
  ariaLabel,
  ariaLabelledBy,
  className,
  ...rest
}: ContainerProps) {
  const tagName = String(Tag);
  const rawLabelledBy = (rest as any)["aria-labelledby"] as string | undefined;
  const hasName = Boolean(ariaLabel || ariaLabelledBy || rawLabelledBy);
  const role = !LANDMARKS.has(tagName) && hasName ? "region" : undefined;

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy ?? rawLabelledBy}
      aria-label={ariaLabelledBy || rawLabelledBy ? undefined : ariaLabel}
      role={role}
      className={`container mx-auto! px-2 small:px-3  ${className ?? ""}`}
      {...rest}   
    >
      {children}
    </Tag>
  );
}
