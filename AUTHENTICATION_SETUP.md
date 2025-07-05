# AWS Cognito Authentication Setup

This project has been configured with AWS Cognito authentication using `react-oidc-context`. Here's what has been implemented:

## Configuration

The authentication is configured in `lib/auth-config.ts` with the following settings:

- **Authority**: AWS Cognito User Pool endpoint
- **Client ID**: Your Cognito App Client ID
- **Redirect URI**: `/callback` (handles authentication redirects)
- **Scopes**: `phone openid email`

## Components Created

### 1. AuthProvider (`components/auth/auth-provider.tsx`)
Wraps the entire application with the OIDC authentication context.

### 2. AuthGuard (`components/auth/auth-guard.tsx`)
Protects routes by checking authentication status and redirecting unauthenticated users.

### 3. LoginButton (`components/auth/login-button.tsx`)
Handles the login flow on the home page.

### 4. LogoutButton (`components/auth/logout-button.tsx`)
Allows users to sign out from the app header.

### 5. useAuthContext Hook (`hooks/use-auth.ts`)
Provides easy access to authentication state and methods.

## Pages Created

### 1. Callback Page (`app/(auth)/callback/page.tsx`)
Handles authentication redirects and shows loading state.

### 2. Silent Renew Page (`public/silent-renew.html`)
Handles token refresh in the background.

## Integration Points

1. **Root Layout**: AuthProvider wraps the entire application
2. **App Layout**: AuthGuard protects all dashboard routes
3. **Home Page**: Uses LoginButton instead of direct navigation
4. **App Header**: NavUser component shows authenticated user info and logout button

## AWS Cognito Setup Requirements

To complete the setup, you need to configure your AWS Cognito User Pool:

1. **App Client Settings**:
   - Add `http://localhost:8080/callback` to Allowed Callback URLs
   - Add `http://localhost:8080` to Allowed Sign-out URLs
   - Add `http://localhost:8080/silent-renew.html` to Allowed OAuth Flows

2. **User Pool Domain**: Configure a custom domain or use the hosted UI

3. **Identity Providers**: Configure the identity providers you want to use (Google, Facebook, etc.)

## Environment Variables

Consider moving the Cognito configuration to environment variables:

```env
NEXT_PUBLIC_COGNITO_AUTHORITY=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_Apto08OIS
NEXT_PUBLIC_COGNITO_CLIENT_ID=2cc1kersdoftjpahrksh4k8tk2
```

Then update `lib/auth-config.ts` to use these environment variables.

## Usage

- Users visit the home page and click "Get Started"
- They are redirected to AWS Cognito for authentication
- After successful authentication, they are redirected to `/callback`
- The callback page processes the authentication and redirects to `/dashboard`
- All dashboard routes are protected by the AuthGuard
- Users can sign out using the logout button in the app header

## Security Features

- Automatic token refresh
- Session monitoring
- Route protection
- Secure redirect handling
- Error handling and user feedback 