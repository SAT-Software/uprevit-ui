export const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_Apto08OIS",
  client_id: "2cc1kersdoftjpahrksh4k8tk2",
  redirect_uri: typeof window !== "undefined" 
    ? `${window.location.origin}/callback` 
    : "http://localhost:8080/callback",
  response_type: "code",
  scope: "phone openid email",
  // Additional configuration for better security and UX
  post_logout_redirect_uri: typeof window !== "undefined" 
    ? window.location.origin 
    : "http://localhost:8080",
  silent_redirect_uri: typeof window !== "undefined" 
    ? `${window.location.origin}/silent-renew.html` 
    : "http://localhost:8080/silent-renew.html",
  automaticSilentRenew: true,
  monitorSession: true,
  loadUserInfo: true,
}; 