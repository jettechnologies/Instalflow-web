import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";
import { apiService, setAuthToken } from "@services/api-service";
import {
  createCookieOptions,
  TOKEN_COOKIE_KEY,
  USER_COOKIE_KEY,
} from "@utils/misc";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "COMPANY" | "ADMIN" | "MARKETER" | "CUSTOMER";
  forcePasswordChange?: boolean;
}

interface RefreshToken {
  accessToken: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ profile: UserProfile }>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const COOKIE_OPTIONS = createCookieOptions({ maxAge: 60 * 60 * 24 });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getCookie(TOKEN_COOKIE_KEY) as string | undefined;
        const storedUser = getCookie(USER_COOKIE_KEY) as string | undefined;

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            deleteCookie(USER_COOKIE_KEY, {
              path: "/",
            });
          }
        }

        if (storedToken) {
          setAuthToken(storedToken);
          setAccessTokenState(storedToken);
        } else if (storedUser) {
          await refreshToken();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ profile: UserProfile }> => {
    setIsLoading(true);
    try {
      const response = await apiService.post<{
        accessToken: string;
        user: UserProfile;
      }>("/auth/login", { email, password });

      const { accessToken: token, user: profile } = response.data;

      setAuthToken(token);
      setCookie(USER_COOKIE_KEY, JSON.stringify(profile), {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7,
      });

      setAccessTokenState(token);
      setUser(profile);
      return { profile };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiService.post<RefreshToken>("/auth/refresh");

      const { accessToken: token } = response.data;

      setAuthToken(token);
      setAccessTokenState(token);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication Error";

      if (message === "Refresh token required") {
        setAuthToken(null);

        deleteCookie(USER_COOKIE_KEY, {
          path: "/",
        });

        setAccessTokenState(null);
        setUser(null);

        window.location.href = "/login";
      }

      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (accessToken) {
        await apiService.post("/auth/logout").catch(() => {
          // Best-effort — clear locally even if server call fails
        });
      }
    } finally {
      setAuthToken(null);
      deleteCookie(USER_COOKIE_KEY, { path: "/" });
      setAccessTokenState(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
        refreshToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
