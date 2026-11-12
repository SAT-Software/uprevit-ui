import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const blogMdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-12 mb-4 text-xl md:text-2xl font-semibold text-foreground"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 text-lg font-semibold text-foreground"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-5 text-base md:text-lg leading-relaxed text-muted-foreground"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-5 ml-5 list-disc space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground marker:text-foreground/40"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-5 ml-5 list-decimal space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground marker:text-foreground/40"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  a: ({ href = "", ...props }) => (
    <Link
      href={href}
      className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-dashed border-border" />,
};
