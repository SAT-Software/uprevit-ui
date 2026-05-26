"use client";

import type { FC } from "react";
import type { Separator } from "fumadocs-core/page-tree";

export const SectionSpacer: FC<{ item: Separator }> = () => {
  return <div className="my-1" aria-hidden="true" />;
};
