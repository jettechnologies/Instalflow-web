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

export const ProductsSearch = Yup.object({
  page: Yup.string().optional(),
  limit: Yup.string().optional(),
  sortOrder: Yup.string().oneOf(["desc", "asc"]).optional(),
  category: Yup.string().optional(),
  status: Yup.string().oneOf(["DRAFT", "PUBLISHED", "SOLD_OUT", "ARCHIVED"]).optional(),
  search: Yup.string().optional(),
});

export type ProductsSearchType = Yup.InferType<typeof ProductsSearch>;

export const requestReasonSchema = Yup.object({
  reason: Yup.string().trim().optional(),
});

export type RequestReasonValues = Yup.InferType<typeof requestReasonSchema>;

export const reviewSchema = Yup.object({
  reviewReason: Yup.string()
    .trim()
    .when("$isRejection", {
      is: true,
      then: (s) => s.optional(),
      otherwise: (s) => s.strip(),
    }),
});

export type ReviewSchemaType = Yup.InferType<typeof reviewSchema>;
