import { createCookieOptions } from "@utils/misc";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

export interface StandardResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const ACCESS_TOKEN_KEY = "ifl_access_token";
const CSRF_TOKEN_KEY = "ifl_csrf_token";

const COOKIE_OPTIONS = createCookieOptions({ maxAge: 60 * 60 * 24 });

let _accessToken: string | null =
  (getCookie(ACCESS_TOKEN_KEY) as string) ?? null;
let _csrfToken: string | null = (getCookie(CSRF_TOKEN_KEY) as string) ?? null;

export const setAuthToken = (token: string | null) => {
  _accessToken = token;
  if (token) {
    setCookie(ACCESS_TOKEN_KEY, token, COOKIE_OPTIONS);
  } else {
    deleteCookie(ACCESS_TOKEN_KEY, { path: "/" });
  }
};

export const setCsrfToken = (token: string | null) => {
  _csrfToken = token;
  if (token) {
    setCookie(CSRF_TOKEN_KEY, token, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 3 * 1000,
    });
  } else {
    deleteCookie(CSRF_TOKEN_KEY, { path: "/" });
  }
};

export const getAuthToken = (): string | null =>
  _accessToken ?? (getCookie(ACCESS_TOKEN_KEY) as string | null) ?? null;

const BASE_URL =
  import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || "";

const ensureCsrfToken = async (): Promise<string | null> => {
  const fromCookie = getCookie(CSRF_TOKEN_KEY) as string | null;
  if (fromCookie) {
    _csrfToken = fromCookie;
    return fromCookie;
  }
  if (_csrfToken) return _csrfToken;

  try {
    const response = await fetch(`${BASE_URL}/csrf-token`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      const token: string | undefined = data.csrfToken ?? data.token;
      if (token) {
        setCsrfToken(token);
        return token;
      }
    }
  } catch (err) {
    console.warn(
      "[apiService] Could not retrieve csrf-token automatically",
      err
    );
  }
  return null;
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
  if (csrf) headers["x-csrf-token"] = csrf;
  return headers;
};

const extractErrorMessage = async (
  response: Response,
  fallback: string
): Promise<never> => {
  const text = await response.text();
  let message = fallback;
  try {
    const json = JSON.parse(text);
    message = json.message ?? message;
  } catch (_) {}
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
