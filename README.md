## Uprevit UI

## Getting Started

Install dependencies and run the development server:

```bash
bun install
bun run dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

```bash
cp .env.example .env.local
```

Primary variables:

- `NEXT_PUBLIC_APP_URL`: public base URL for this frontend; used to build the Cognito callback URL
- `NEXT_PUBLIC_CLIENT_ID`: Cognito app client ID
- `NEXT_PUBLIC_COGNITO_AUTHORITY`: Cognito user pool authority URL
- `NEXT_PUBLIC_COGNITO_DOMAIN`: Cognito hosted UI domain
- `NEXT_PUBLIC_LOGOUT_URI`: post-logout redirect URL; defaults to `NEXT_PUBLIC_APP_URL` if omitted
- `API_PROXY_TARGET`: server-side API proxy target for `/api/*`

Environment guidance:

- `local`: `NEXT_PUBLIC_APP_URL=http://localhost:8080` and `API_PROXY_TARGET=http://localhost:3000`
- `preview`: set `NEXT_PUBLIC_APP_URL` to the preview app URL and `API_PROXY_TARGET` to the staging backend
- `production`: set `NEXT_PUBLIC_APP_URL=https://app.uprevit.com` and `API_PROXY_TARGET` to the production backend

Notes:

- `NEXT_PUBLIC_REDIRECT_URI` and `NEXT_PUBLIC_API_PROXY_TARGET` are still supported as legacy fallback names during the transition, but new environments should use `NEXT_PUBLIC_APP_URL` and `API_PROXY_TARGET`.
- Keep real environment values in Amplify branch settings, not in git.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Changelog

For a detailed list of changes, updates, and improvements made to this project, please refer to our [CHANGELOG.md](./CHANGELOG.md) file.

## Deployment Notes

- `main` should be the production branch in Amplify
- `develop` can continue to back preview or staging deployments
- Configure branch-specific Amplify environment variables before cutting a release branch
