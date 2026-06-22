import * as Yup from "yup";

export const createMarketerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Marketer name must be at least 2 characters.")
    .max(100, "Marketer name cannot exceed 100 characters.")
    .required("Marketer name is required."),

  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long.")
    .required("Email address is required."),
});

export const OverviewSearch = Yup.object({
  page: Yup.string().optional(),
  limit: Yup.string().optional(),
  sortOrder: Yup.string().oneOf(["desc", "asc"]).optional(),
});

export type OverviewSearchType = Yup.InferType<typeof OverviewSearch>;
