import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const blogMdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-10 mb-4 scroll-mt-20 font-sans text-[20px] font-medium leading-[26px] tracking-[-0.025em] text-foreground sm:text-[26px] sm:leading-[32px]"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 scroll-mt-20 font-sans text-[18px] font-medium leading-[24px] tracking-[-0.02em] text-foreground sm:text-[20px] sm:leading-[26px]"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-5 font-ui text-[15px] leading-[24px] text-fg-secondary sm:text-[16px] sm:leading-[27px]"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-5 ml-5 list-disc space-y-2.5 font-ui text-[15px] leading-[24px] text-fg-secondary marker:text-faint-foreground sm:text-[16px] sm:leading-[27px]"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-5 ml-5 list-decimal space-y-2.5 font-ui text-[15px] leading-[24px] text-fg-secondary marker:text-faint-foreground sm:text-[16px] sm:leading-[27px]"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  a: ({ href = "", ...props }) => (
    <Link
      href={href}
      className="font-medium text-foreground underline decoration-primary-300 underline-offset-4 transition-colors hover:decoration-primary dark:decoration-primary-text/50 dark:hover:decoration-primary-text"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-separator" />,
};
