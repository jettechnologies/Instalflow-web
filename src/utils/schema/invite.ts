import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long.")
    .required("Full name is required."),
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .required("Password is required."),
  referredByCode: Yup.string()
    .matches(/^IFL-REF-/, "Referral code must start with IFL-REF-.")
    .required("Referral code is required."),
});

export type RegisterFormValues = Yup.InferType<typeof registerSchema>;

export const kycSchema = Yup.object({
  variantId: Yup.string().required("Select a variant."),
  installmentPlanId: Yup.string().required("Select an installment plan."),
  idType: Yup.string()
    .oneOf(["NIN", "BVN", "PASSPORT"], "Select a valid ID type.")
    .required("ID type is required."),
  idNumber: Yup.string().when("idType", {
    is: "PASSPORT",
    then: (s) => s.min(6, "Min 6 characters.").required("Required."),
    otherwise: (s) =>
      s.matches(/^\d{11}$/, "Must be 11 digits.").required("Required."),
  }),
});

export type KycFormValues = Yup.InferType<typeof kycSchema>;

const optionalString = Yup.string()
  .transform((value) => (value === "" ? undefined : value))
  .optional();

export const InviteSearchSchema = Yup.object({
  ref: optionalString,
  product: optionalString,
  variant: optionalString,
  installmentPlan: optionalString,
});

export type InviteSearchType = Yup.InferType<typeof InviteSearchSchema>;
