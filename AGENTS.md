# AGENTS.md

This guide provides instructions and conventions for agents operating in the uprevit-ui repository.

- Use PNPM not npm or npx
- Use git flow for branching strategis
- While creating file and folders look at the similar exsisting ones on how we write thier name and where do we place them
- Use shadcn/ui components
- Prefix custom components with the function (e.g., `ArchiveProductDialog`)
- Icons from `@hugeicons/core-free-icons` via the shared `Icon` wrapper (`@uprevit/ui/components/common/Icon`)
- Backend repo of this project is located at `../uprevit-backend`, if anything needs to be updated there, just use this location and make the changes
- Use Conventional Commit messages for commits, such as `feat: add editor toolbar` or `fix: preserve selection after insertion`.
- Don't use phase wording inside PRs, branch names or commits, Phases and steps are part of internal emend development plan
- PR title should be a concise, human-readable summary of the change in one line, without any reference to issue numbers or commit hashes.
- PR description sould also be simple bullet points on what is done in it. Apart from this bullet points only more thing can be added which is which issue it closes if there is one. Don't add any bloated information.
- Create github issue which will be closed by the PR that you are creating, and follow the same guidelines as PRs.
- Add as much metadata information you can add for the PR and issue like type, labels, Develpment etc.
- Don't write unnecessary comments in code
- `workflow-plan/` holds local-only planning files. It is deliberately not in `.gitignore` so it stays searchable, but never commit or push it. Stage by path, not `git add -A` / `git add .`.



- Work on both repos in the same session (UI here, backend in `../uprevit-backend`), on the phase's branch in each repo.
- Write clean, simple code: least code for the most functionality, reuse existing helpers/components, no overengineering.
- Never commit or push until the user explicitly says so.
- Before handing back, run all checks and fix every issue:
  - UI: `pnpm lint:app`, `pnpm --filter @uprevit/app check-types`, `pnpm build:app`
  - Backend: `npm --prefix src run lint`, `npm --prefix src run type-check`
  - Self code review of the full diff in both repos.
- The local UI calls the dev API, so deploy backend changes to the dev stack first (see `../uprevit-backend/AGENTS.md`).
- If port 8080 is taken (e.g. by Tailscale), start the app bound to localhost from `apps/app`: `pnpm exec next dev -p 8080 -H localhost` (the login redirect expects `localhost:8080`).
- Browser-test every changed flow in the running app, then verify the changes work as intended.
  - Log in yourself with the test accounts on dev: `amittambulkar104@gmail.com` (workspace admin) and `amittambulkar96@gmail.com` (plain member, "Amit Test Member", same workspace). Choose the email one-time code option, then ask the user for the code every time you need it.
  - Wait on `/auth/callback` until the app redirects to the dashboard; navigating away earlier drops the session.
- Data migration scripts: always `--dry-run` first, check the counts/output, then do the real run on the dev environment only.
- app is pre-customer, so back-and-forth is fine, but do it properly.

## TODOs

- **Dashboard activity stats historical attribution (backend):** `src/utils/dashboardActivityStats.ts` currently attributes product activity to the product's *current* department/project and drops archived products from those counts. For true 30-day history, denormalize parent IDs onto audit events at write time (or read historical parents from audit scope) so archive/move does not rewrite earlier activity. Deferred from release `0.6.0` (Greptile PR #161).
- **Analytics totals beyond 100 products (UI):** `app/(app)/analytics/page.tsx` computes Draft, Released, Overdue and the charts from the first 100 products (the list API maximum). Total Products and Archived use the API `totalCount`. For accurate workspace-wide numbers, add a server-side analytics aggregate (or page through all products).
