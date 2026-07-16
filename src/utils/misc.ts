import { format, isValid } from "date-fns";

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

export const DATE_FORMATS = {
  date: "dd MMM yyyy",
  date_time: "dd MMM yyyy, HH:mm",
  human_friendly: "PPP",
} as const;

export type DateFormatType = keyof typeof DATE_FORMATS;

export const formatDate = (
  date?: string | Date | null,
  type: DateFormatType = "date"
) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  return isValid(parsedDate) ? format(parsedDate, DATE_FORMATS[type]) : "-";
};

export const monthlyPayment = (
  principal: number,
  months: number,
  ratePct = 0
): number => {
  if (!months || months <= 0) return principal;
  const totalFinanced = principal * (1 + ratePct / 100);
  return Math.round(totalFinanced / months);
};

export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const USER_COOKIE_KEY = "ifl_user";
export const TOKEN_COOKIE_KEY = "ifl_access_token";
export const APPROVAL_STATUS = ["PENDING", "APPROVED", "REJECTED"] as const;
