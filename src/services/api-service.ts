import { createCookieOptions } from "@utils/misc";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";
import { localStorageHelper } from "@utils/helpers";

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

const BASE_URL =
  import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || "";

const CSRF_FALLBACK_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CSRF_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const CSRF_STORAGE_KEY = "ifl_csrf_state";

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

interface CsrfTokenState {
  token: string;
  expiresAt: number;
}

interface CsrfTokenState {
  token: string;
  expiresAt: number; // epoch ms
}

// Hydrate from localStorage on module init so a reload doesn't force an
// unnecessary refetch while the cookie is still valid.
let csrfState: CsrfTokenState | null =
  localStorageHelper.get<CsrfTokenState>(CSRF_STORAGE_KEY);

let csrfFetchPromise: Promise<string | null> | null = null;

const isCsrfTokenValid = (
  state: CsrfTokenState | null
): state is CsrfTokenState =>
  state !== null && Date.now() < state.expiresAt - CSRF_REFRESH_BUFFER_MS;

const persistCsrfState = (state: CsrfTokenState | null): void => {
  csrfState = state;
  if (state) {
    localStorageHelper.set(CSRF_STORAGE_KEY, state);
  } else {
    localStorageHelper.remove(CSRF_STORAGE_KEY);
  }
};

const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/csrf-token`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      persistCsrfState(null);
      return null;
    }

    const body = await response.json();

    const token: string | undefined = body?.data?.csrfToken;
    const expiresIn: number | undefined = body?.data?.expiresIn;

    if (!token) {
      persistCsrfState(null);
      return null;
    }

    persistCsrfState({
      token,
      expiresAt: Date.now() + (expiresIn ?? CSRF_FALLBACK_MAX_AGE_MS),
    });

    return token;
  } catch (err) {
    console.warn("[apiService] CSRF fetch failed", err);
    persistCsrfState(null);
    return null;
  }
};

const ensureCsrfToken = async (): Promise<string | null> => {
  if (isCsrfTokenValid(csrfState)) {
    return csrfState.token;
  }

  if (!csrfFetchPromise) {
    csrfFetchPromise = fetchCsrfToken().finally(() => {
      csrfFetchPromise = null;
    });
  }

  return csrfFetchPromise;
};

export const invalidateCsrfToken = (): void => {
  persistCsrfState(null);
};

// const ensureCsrfToken = async (): Promise<string | null> => {
//   try {
//     const response = await fetch(`${BASE_URL}/csrf-token`, {
//       method: "GET",
//       credentials: "include",
//     });
//     if (!response.ok) return null;
//     const data = await response.json();
//     const token = data.csrfToken;

//     if (token) {
//       console.log(token);
//       return token;
//     }

//     return null;
//   } catch (err) {
//     console.warn("[apiService] CSRF fetch failed", err);
//     return null;
//   }
// };

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

const unauthorizedMessages = new Set([
  "Session has been revoked or expired. Please login again.",
  "jwt expired",
]);

const extractErrorMessage = async (
  response: Response,
  fallback: string
): Promise<never> => {
  let message = fallback;

  const csrfErrorMessages = new Set([
    "Invalid CSRF token",
    "CSRF token expired",
  ]);

  try {
    const data = await response.clone().json();

    message = data?.message ?? fallback;

    if (response.status === 401 && unauthorizedMessages.has(message)) {
      await handleUnauthorized();

      throw new Error(
        message || "Your session has expired. Please login again."
      );
    }

    if (response.status === 403 && csrfErrorMessages.has(message)) {
      invalidateCsrfToken();
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
    params?: Record<string, any>
  ): Promise<StandardResponse<T>> => {
    let finalUrl = url;
    if (params) {
      const queryParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          queryParams[key] = String(val);
        }
      });
      const qs = new URLSearchParams(queryParams).toString();
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

  put: async <T>(
    url: string,
    body?: any,
    config?: { headers?: Record<string, string> }
  ): Promise<StandardResponse<T>> => {
    const isFormData = body instanceof FormData;
    const mutationHeaders = await buildMutationHeaders();
    if (isFormData) delete mutationHeaders["Content-Type"];

    const finalHeaders = { ...mutationHeaders, ...(config?.headers ?? {}) };

    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      credentials: "include",
      headers: finalHeaders,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      await extractErrorMessage(
        response,
        `PUT ${url} failed: ${response.statusText}`
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
