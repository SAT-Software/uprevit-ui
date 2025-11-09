"use client";

import { useAuth } from "react-oidc-context";

export function ButtonLogin() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        Hello, {auth.user?.profile.email}!
        <button onClick={() => auth.removeUser()}>Log Out</button>
      </div>
    );
  }

  return <button onClick={() => auth.signinRedirect()}>Log In</button>;
}
