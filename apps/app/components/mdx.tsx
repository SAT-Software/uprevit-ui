import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { DocsVideo } from "@/components/docs/DocsVideo";
import {
  DocsChangelogGroup,
  DocsChangelogRelease,
} from "@/components/docs/DocsChangelog";
import { DocsChangelogReleases } from "@/components/docs/DocsChangelogReleases";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    DocsVideo,
    DocsChangelogReleases,
    DocsChangelogRelease,
    DocsChangelogGroup,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
