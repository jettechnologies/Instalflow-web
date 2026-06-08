export const createCookieOptions = ({
  maxAge = 60 * 60 * 24 * 7,
}: {
  maxAge?: number;
}) => ({
  maxAge,
  path: "/",
  sameSite: "lax" as const,
  secure: import.meta.env.VITE_NODE_ENV === "production",
});

export const USER_COOKIE_KEY = "ifl_user";
export const TOKEN_COOKIE_KEY = "ifl_access_token";
