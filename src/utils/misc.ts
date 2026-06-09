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

export const formatCurrency = (
  value: number,
  currency = "NGN",
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }
) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    ...options,
  }).format(value);

export const USER_COOKIE_KEY = "ifl_user";
export const TOKEN_COOKIE_KEY = "ifl_access_token";
