export const apiProxyTarget =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_PROXY_TARGET ||
  (process.env.NODE_ENV === "development"
    ? "https://weh8ywxicg.execute-api.us-east-1.amazonaws.com/Prod"
    : undefined);
