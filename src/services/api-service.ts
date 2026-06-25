import { createCookieOptions } from "@utils/misc";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

export interface StandardResponse<T> {
  data: T;
  status: number;
  message?: string;
}
export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedData<K extends string, T> = {
  [P in K]: T[];
} & {
  pagination: Pagination;
};

export type UrlParams = {
  page: string;
  limit: string;
  sortOrder: "desc" | "asc";
};

const ACCESS_TOKEN_KEY = "ifl_access_token";

const COOKIE_OPTIONS = createCookieOptions({ maxAge: 60 * 60 * 24 });

export const LIMIT = "10";

let _accessToken: string | null =
  (getCookie(ACCESS_TOKEN_KEY) as string) ?? null;

export const setAuthToken = (token: string | null) => {
  _accessToken = token;
  if (token) {
    setCookie(ACCESS_TOKEN_KEY, token, COOKIE_OPTIONS);
  } else {
    deleteCookie(ACCESS_TOKEN_KEY, { path: "/" });
  }
};

export const getAuthToken = (): string | null =>
  _accessToken ?? (getCookie(ACCESS_TOKEN_KEY) as string | null) ?? null;

const BASE_URL =
  import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || "";

const ensureCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/csrf-token`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) return null;
    const data = await response.json();
    const token = data.csrfToken;

    if (token) {
      return token;
    }

    return null;
  } catch (err) {
    console.warn("[apiService] CSRF fetch failed", err);
    return null;
  }
};

const buildHeaders = (
  extra?: Record<string, string>
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return { ...headers, ...extra };
};

const buildMutationHeaders = async (
  extra?: Record<string, string>
): Promise<Record<string, string>> => {
  const headers = buildHeaders(extra);

  const csrf = await ensureCsrfToken();

  if (csrf) {
    headers["x-csrf-token"] = csrf;
  }

  return headers;
};

// const extractErrorMessage = async (
//   response: Response,
//   fallback: string
// ): Promise<never> => {
//   const text = await response.text();
//   let message = fallback;
//   try {
//     const json = JSON.parse(text);
//     message = json.message ?? message;
//   } catch (_) {}
//   throw new Error(message);
// };

const handleUnauthorized = async () => {
  try {
    setAuthToken(null);

    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    if (window.location.pathname !== "/login") {
      const redirect = encodeURIComponent(
        window.location.pathname + window.location.search
      );

      window.location.replace(`/login?redirect=${redirect}`);
    }
  }
};

const extractErrorMessage = async (
  response: Response,
  fallback: string
): Promise<never> => {
  let message = fallback;

  try {
    const data = await response.clone().json();

    message = data?.message ?? fallback;

    if (
      response.status === 401 &&
      message === "Session has been revoked or expired. Please login again."
    ) {
      await handleUnauthorized();

      throw new Error(
        message || "Your session has expired. Please login again."
      );
    }
  } catch (err) {
    if (response.status === 401) {
      await handleUnauthorized();

      throw new Error("Your session has expired. Please login again.");
    }

    try {
      const text = await response.text();
      const data = JSON.parse(text);

      message = data?.message ?? fallback;
    } catch {
      message = fallback;
    }
  }

  throw new Error(message);
};

export const apiService = {
  get: async <T>(
    url: string,
    params?: Record<string, string>
  ): Promise<StandardResponse<T>> => {
    let finalUrl = url;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      if (qs) finalUrl += `?${qs}`;
    }

    const response = await fetch(`${BASE_URL}${finalUrl}`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      await extractErrorMessage(
        response,
        `GET ${url} failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  },

  post: async <T>(
    url: string,
    body?: any,
    config?: { headers?: Record<string, string> }
  ): Promise<StandardResponse<T>> => {
    const isFormData = body instanceof FormData;
    const mutationHeaders = await buildMutationHeaders(
      isFormData ? {} : undefined
    );

    // For multipart/form-data let the browser set the Content-Type boundary automatically
    if (isFormData) delete mutationHeaders["Content-Type"];

    // Merge any caller-provided headers (e.g. Authorization override for onboarding token)
    const finalHeaders = { ...mutationHeaders, ...(config?.headers ?? {}) };

    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      credentials: "include",
      headers: finalHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      await extractErrorMessage(
        response,
        `POST ${url} failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  },

  patch: async <T>(
    url: string,
    body?: any,
    config?: { headers?: Record<string, string> }
  ): Promise<StandardResponse<T>> => {
    const isFormData = body instanceof FormData;
    const mutationHeaders = await buildMutationHeaders();
    if (isFormData) delete mutationHeaders["Content-Type"];

    const finalHeaders = { ...mutationHeaders, ...(config?.headers ?? {}) };

    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PATCH",
      credentials: "include",
      headers: finalHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      await extractErrorMessage(
        response,
        `PATCH ${url} failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  },

  delete: async <T>(
    url: string,
    config?: { headers?: Record<string, string> }
  ): Promise<StandardResponse<T>> => {
    const mutationHeaders = await buildMutationHeaders(config?.headers);

    const response = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      credentials: "include",
      headers: mutationHeaders,
    });

    if (!response.ok) {
      await extractErrorMessage(
        response,
        `DELETE ${url} failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  },
};
