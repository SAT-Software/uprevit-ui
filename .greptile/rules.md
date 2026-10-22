## Cross-repo changes with uprevit-backend

Features often ship as a pair of PRs, one here and one in `SAT-Software/uprevit-backend`. The backend copy you read as cross-repo context can lag behind the companion backend PR.

- Check the PR description for a companion PR (for example `Depends on SAT-Software/uprevit-backend#211`). If there is one, treat the backend changes it describes as part of this change.
- If the UI uses an endpoint, query parameter, request field or response field that the backend copy doesn't have, don't report it as a bug when a companion backend PR exists. Mention it once in the summary as "assumes the companion backend PR" instead.
- Report a missing or mismatched backend contract as an issue only when the description links no companion backend PR.
- Keep checking that the UI matches the backend contract for anything the companion PR doesn't touch.
