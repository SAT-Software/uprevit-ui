# AGENTS.md

This guide provides instructions and conventions for agents operating in the uprevit-ui repository.

- Use PNPM not npm or npx
- Use git flow for branching strategis
- While creating file and folders look at the similar exsisting ones on how we write thier name and where do we place them
- Use shadcn/ui components
- Prefix custom components with the function (e.g., `ArchiveProductDialog`)
- Use Tailwind CSS with `cn()` utility for conditional classes as needed
- Icons from `@hugeicons/core-free-icons` via the shared `Icon` wrapper (`@uprevit/ui/components/common/Icon`)
- Backend repo os this project is located at `../uprevit-backend`:

## TODOs

- **Dashboard activity stats historical attribution (backend):** `src/utils/dashboardActivityStats.ts` currently attributes product activity to the product's *current* department/project and drops archived products from those counts. For true 30-day history, denormalize parent IDs onto audit events at write time (or read historical parents from audit scope) so archive/move does not rewrite earlier activity. Deferred from release `0.6.0` (Greptile PR #161).
