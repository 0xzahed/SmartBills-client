// Use proxy in development, direct URL in production
export const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://utility-bil-management-server-lovat.vercel.app";
