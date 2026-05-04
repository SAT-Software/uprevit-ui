# Uprevit UI

Uprevit is a medical device labeling documentation platform. This repository contains the frontend monorepo for the authenticated product app and the marketing site.

## Monorepo Structure

```text
.
├── apps/
│   ├── app/         # Product application for authenticated users
│   └── marketing/   # Marketing website
├── packages/
│   └── ui/          # Shared UI components, hooks, and utilities
├── amplify.yml      # Monorepo build config for AWS Amplify
├── turbo.json       # Turborepo task configuration
└── package.json     # Root workspace scripts
```

## Applications

- `apps/app`: Next.js product app deployed to `app.uprevit.com`
- `apps/marketing`: Next.js marketing site for `uprevit.com`
- `packages/ui`: shared UI package consumed by both apps

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Bun workspaces
- Turborepo
- AWS Amplify Hosting
- AWS Cognito for authentication
- Backend API hosted separately and consumed through `/api/*` proxying in the product app

## Prerequisites

- Bun `1.3.11`
- A local or deployed backend for the product app API
- Cognito app client and user pool configuration for authenticated product app flows

## Getting Started

Install dependencies from the repository root:

```bash
bun install
```

Create the local environment file for the product app:

```bash
cp apps/app/.env.example apps/app/.env.local
```

Run the product app locally:

```bash
bun run dev:app
```

Open `http://localhost:8080`.

Run the marketing app locally:

```bash
bun run dev:marketing
```

Open `http://localhost:3001`.

If you want Turborepo to run active dev tasks together, use:

```bash
bun run dev
```

## Development Commands

Run these commands from the repository root.

```bash
bun run dev
bun run dev:app
bun run dev:marketing

bun run build
bun run build:app
bun run build:marketing

bun run lint
bun run lint:app
bun run lint:marketing

bun run check-types
bun run check-types:app
bun run check-types:marketing
```

Useful app-specific start commands:

```bash
bun run start:app
bun run start:marketing
```

## Environment Variables

### Product App

The product app reads its environment from `apps/app/.env.local` in local development.

- `NEXT_PUBLIC_APP_URL`: public base URL of the product app
- `NEXT_PUBLIC_CLIENT_ID`: Cognito app client ID
- `NEXT_PUBLIC_COGNITO_AUTHORITY`: Cognito user pool authority URL
- `NEXT_PUBLIC_COGNITO_DOMAIN`: Cognito hosted UI domain
- `NEXT_PUBLIC_LOGOUT_URI`: post-logout redirect URL
- `API_PROXY_TARGET`: backend base URL used by the `/api/*` rewrite proxy

Example local values are provided in `apps/app/.env.example`.

Typical environment mapping:

- local: `NEXT_PUBLIC_APP_URL=http://localhost:8080` and `API_PROXY_TARGET=https://<API-GATEWAY-ID>.execute-api.<AWS-REGION>.amazonaws.com/Prod`
- preview/staging: preview frontend URL and staging backend URL
- production: `NEXT_PUBLIC_APP_URL=https://app.uprevit.com` and production backend URL

Notes:

- The product app builds the Cognito callback URL as `${NEXT_PUBLIC_APP_URL}/auth/callback`.
- `API_PROXY_TARGET` should point at the backend base URL, not a frontend route.
- Keep real deployed values in Amplify branch environment settings, not in git.

### Marketing App

The marketing app currently does not require runtime environment variables. If that changes, use `apps/marketing/.env.local` and mirror placeholders in `apps/marketing/.env.example`.

## Local Backend Integration

The product app proxies `/api/*` requests to the backend using `API_PROXY_TARGET`.

For local development, the default expectation is:

- frontend: `http://localhost:8080`
- backend: `https://<API-GATEWAY-ID>.execute-api.<AWS-REGION>.amazonaws.com/Prod`

If your backend runs elsewhere, update `apps/app/.env.local` accordingly.

## Deployment

This repo uses the root `amplify.yml` to support monorepo builds in AWS Amplify.

Amplify app roots:

- `apps/app`
- `apps/marketing`

For each Amplify app, set:

- `AMPLIFY_MONOREPO_APP_ROOT=apps/app` for the product app
- `AMPLIFY_MONOREPO_APP_ROOT=apps/marketing` for the marketing app

Recommended branch mapping:

- `main`: production
- `release/x.y.z`: staging or preview
- `develop`: development

Production domain target:

- product app: `app.uprevit.com`
- marketing site: `uprevit.com`

Make sure Cognito callback and logout URLs match the deployed product app domain exactly.

## Release Process

This repository follows a Gitflow-style release workflow.

Typical flow:

1. Feature branches merge into `develop`.
2. When preparing a release, cut `release/x.y.z` from `develop`.
3. Only release fixes go into the release branch.
4. Merge `release/x.y.z` into `main` for production deployment.
5. Tag the deployed `main` commit as `vx.y.z`.
6. Merge `main` back into `develop` after the release.

For the first production release, `v0.1.0` is the correct semantic version.

## Changelog

Release history is tracked in [CHANGELOG.md](./CHANGELOG.md).
