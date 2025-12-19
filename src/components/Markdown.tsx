"use client";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

type Props = { markdown: string; className?: string };

export function Markdown({ markdown, className }: Props) {
  return (
    <div
      className={className ?? "prose prose-zinc max-w-none dark:prose-invert"}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeHighlight,
        ]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
