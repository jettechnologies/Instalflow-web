import * as Yup from "yup";
import { ONBOARDING_VIEWS, RESET_PASSWORD_VIEWS } from "@utils/types";

export const OnboardingSearchSchema = Yup.object({
  view: Yup.string()
    .oneOf(ONBOARDING_VIEWS)
    .optional()
    .default("onboarding-step1"),
});

export const PasswordSchema = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(30, "Password cannot exceed 15 characters")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/']/,
    "Password must contain at least one special character"
  )
  .matches(/^\S+$/, "Password cannot contain spaces");

export type OnboardingSearchType = Yup.InferType<typeof OnboardingSearchSchema>;

export const Step1Schema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, "Company name must be at least 2 characters.")
    .required("Company name is required."),
  adminName: Yup.string()
    .min(2, "Full name must be at least 2 characters.")
    .required("Administrator full name is required."),
  email: Yup.string()
    .email("Invalid email format — check RFC 5322 compliance.")
    .required("Corporate email address is required."),
  password: PasswordSchema,
});

export type Step1SchemaType = Yup.InferType<typeof Step1Schema>;

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email.").required("Email is required."),
  password: PasswordSchema,
});

export type LoginSchemaType = Yup.InferType<typeof LoginSchema>;

export const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address.")
    .required("Email address is required."),
});

export type ForgotPasswordSchemaType = Yup.InferType<
  typeof ForgotPasswordSchema
>;

export const ResetPasswordSearchSchema = Yup.object({
  reset_password_view: Yup.string()
    .oneOf(RESET_PASSWORD_VIEWS)
    .optional()
    .default("view_otp"),
});

export const ResetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("New password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match.")
    .required("Please confirm your new password."),
});

export type ResetPasswordSchemaType = Yup.InferType<typeof ResetPasswordSchema>;

export const ForcePasswordSchema = Yup.object({
  newPassword: PasswordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match.")
    .required("Please confirm your new password."),
});

export type ForcePasswordSchemaType = Yup.InferType<typeof ForcePasswordSchema>;
