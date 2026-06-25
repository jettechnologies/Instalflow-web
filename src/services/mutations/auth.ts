import { apiService, type StandardResponse } from "@services/api-service";

export interface LoginParams {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "COMPANY" | "ADMIN" | "MARKETER" | "CUSTOMER" | "SUPER_ADMIN";
  forcePasswordChange?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export const login = async (
  data: LoginParams
): Promise<StandardResponse<LoginResponse>> => {
  return apiService.post<LoginResponse>("/auth/login", data);
};

export const logout = async (): Promise<StandardResponse<void>> => {
  return apiService.post<void>("/auth/logout");
};

export const refreshToken = async (): Promise<
  StandardResponse<{ accessToken: string }>
> => {
  return apiService.post<{ accessToken: string }>("/auth/refresh");
};

export const changePassword = async (
  data: ChangePasswordParams
): Promise<StandardResponse<void>> => {
  return apiService.post<void>("/auth/change-password", data);
};

export const forgotPassword = async (
  email: string
): Promise<StandardResponse<void>> => {
  return apiService.post<void>("/auth/forgot-password", { email });
};

export const resetPassword = async (data: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<StandardResponse<void>> => {
  return apiService.post<void>("/auth/reset-password", data);
};

export const forcePasswordChange = async (data: {
  newPassword: string;
  confirmPassword: string;
}): Promise<StandardResponse<void>> => {
  return apiService.post<void>("/auth/force-password-change", data);
};
