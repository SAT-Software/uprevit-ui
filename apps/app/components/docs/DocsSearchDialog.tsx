"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from "fumadocs-ui/components/dialog/search";
import type { ComponentProps } from "react";
import { useAuth } from "react-oidc-context";

type DocsSearchDialogProps = Omit<
  ComponentProps<typeof SearchDialog>,
  "search" | "onSearchChange" | "isLoading" | "children"
>;

export function DocsSearchDialog(props: DocsSearchDialogProps) {
  const auth = useAuth();
  const accessToken = auth.user?.access_token;

  const { search, setSearch, query } = useDocsSearch(
    {
      client: {
        deps: [accessToken],
        async search(searchQuery) {
          const url = new URL("/api/search", window.location.origin);
          url.searchParams.set("query", searchQuery);

          const headers: HeadersInit = {};
          if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
          }

          const response = await fetch(url, { headers });
          if (!response.ok) {
            throw new Error(await response.text());
          }

          return response.json();
        },
      },
      delayMs: 100,
    },
    [accessToken],
  );

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== "empty" ? query.data : null}
        />
      </SearchDialogContent>
      <SearchDialogFooter />
    </SearchDialog>
  );
}
