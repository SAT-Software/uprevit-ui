# AGENTS.md

This guide provides instructions and conventions for agents operating in the uprevit-ui repository.

## Project Overview

Uprevit is a medical device labeling documentation application with a hierarchical structure:

- **Workspaces** → Organizations
- **Departments** → Grouped within workspaces
- **Projects** → Grouped within departments
- **Products** → Core entity, created within projects

Frontend: Next.js 16 with TypeScript, Tailwind CSS, shadcn/ui
Backend: AWS Lambda (SAM), API Gateway, Cognito, MongoDB, TypeScript

## Build, Lint, and Test Commands

```bash
# Development server (runs on port 8080)
bun run dev

# Build for production
bun run build

# Lint codebase
bun run lint
```

## Project Structure

- **`app/`**: Next.js app router, layouts, pages, and API routes
- **`components/`**: Reusable UI components (`common/` and `ui/` subdirectories)
- **`features/`**: Feature-specific components organized by domain
- **`hooks/`**: Custom React hooks for data fetching and state management
- **`lib/`**: Shared utilities, providers, and configuration
- **`types/`**: TypeScript interfaces and types
- **`utils/`**: Utility functions (e.g., `isAdmin.ts`, `cn.ts`)

## Code Style Guidelines

### TypeScript

- Strict mode enabled in tsconfig.json
- Use explicit interfaces for API types (see `types/` directory)
- Avoid `any` and always think, ask or look for to add proper types
- Use optional properties with `?` for nullable fields

### Naming Conventions

- **Components**: PascalCase for React components, camelCase for file names
- **Hooks**: Prefix with `use`, camelCase (e.g., `useGetUser`, `useUpdateWorkspace`)
- **Utilities**: camelCase (e.g., `cn`, `isAdminProfile`)
- **Types/Interfaces**: PascalCase with descriptive names
- **Constants**: SCREAMING_SNAKE_CASE for global constants

### React Patterns

- Use "use client" directive for all the components
- Use named exports for components and hooks
- Destructure props with explicit typing
- Handle loading/error states explicitly in components
- Use react-hook-form for forms with proper schema validation

### Error Handling

- Use `toast.error()` for user-facing error messages
- Throw descriptive errors in async functions
- Handle API errors with try/catch in hooks and components
- Example hook error handling:

```typescript
onError: (error) => {
  console.error(error.message || "Failed to update workspace");
  toast.error("Failed to update workspace");
};
```

### UI Components

- Use shadcn/ui components (configured in components.json, style: "new-york")
- Prefix custom components with the function (e.g., `ArchiveProductDialog`)
- Use Tailwind CSS with `cn()` utility for conditional classes
- Icons from react-icons (prefer Pi prefix for Phosphor icons)

### Authentication

- Use `react-oidc-context` for auth (useAuth hook)
- Check admin status via `cognito:groups` in user profile whenever needed
- Use `isAdminProfile()` utility from `@/utils/isAdmin`
- Always handle unauthenticated states

### Backend Communication

- API routes under `/api/` directory
- Use React Query (TanStack Query v5) for data fetching/mutation
- Pass access token in Authorization header (Bearer token)
- Always include AbortSignal for request cancellation
- Example hook pattern:

```typescript
export function useUpdateWorkspace() {
  const auth = useAuth();
  return useMutation({
    mutationFn: async (data: Workspace) => {
      const token = auth.user?.access_token;
      if (!token) throw new Error("Not authenticated");
      // API call with signal and token
    },
    onSuccess: () => {
      toast.success("Success message");
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
    },
  });
}
```

## Backend Repository

Located at `/Users/amit/Developer/Startup/uprevit-backend`:

- Uses AWS SAM for local testing: `npm run start:local`
- API endpoints return structured responses with `ResponseWrapper`
- Backend enforces admin role via `authenticateWithRole(event, 'admin')`
- Admin status checked via `cognito:groups` in JWT token

## Key Utilities

- **`@/lib/utils`**: Contains `cn()` for Tailwind class merging
- **`@/utils/isAdmin`**: Contains `isAdminProfile()` for admin role checks
- **`@/components/ui`**: shadcn/ui component library
