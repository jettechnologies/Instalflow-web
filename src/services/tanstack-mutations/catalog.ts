import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import { QUERY_KEYS } from "@services/query-keys";
import {
  createProduct,
  updateProduct,
  archiveProduct,
  uploadGalleryImages,
  reorderGalleryImages,
  setPrimaryImage,
  removeGalleryImage,
  createVariant,
  bulkCreateVariants,
  updateVariant,
  updateVariantStock,
  toggleVariantStatus,
  setVariantImages,
  createInstallmentPlan,
  updateInstallmentPlan,
  toggleInstallmentPlanStatus,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../mutations/catalog";

export const useCreateCategory = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: createCategory,
    meta: {
      invalidatesQuery: QUERY_KEYS.categories.base(),
    },
    onSuccess: (data) => {
      openToast(data.message || "Category created successfully", "success");
    },
  });
};

export const useUpdateCategory = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: updateCategory,
    meta: {
      invalidatesQuery: QUERY_KEYS.categories.base(),
    },
    onSuccess: (data) => {
      openToast(data.message || "Category updated successfully", "success");
    },
  });
};

export const useDeleteCategory = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: deleteCategory,
    meta: {
      invalidatesQuery: QUERY_KEYS.categories.base(),
    },
    onSuccess: (data) => {
      openToast(data.message || "Category deleted successfully", "success");
    },
  });
};

export const useCreateProduct = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: createProduct,
    meta: {
      invalidatesQuery: QUERY_KEYS.products.base(),
    },
    onSuccess: (data) => {
      openToast(data.message || "Product created successfully", "success");
    },
  });
};

export const useUpdateProduct = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (payload: any) => updateProduct(productId, payload),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: (data) => {
      openToast(data.message || "Product updated successfully", "success");
    },
  });
};

export const useArchiveProduct = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: () => archiveProduct(productId),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.base(),
    },
    onSuccess: (data) => {
      openToast(data.message || "Product archived successfully", "success");
    },
  });
};

export const useUploadGalleryImages = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (formData: FormData) =>
      uploadGalleryImages(productId, formData),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.gallery(productId),
    },
    onSuccess: () => {
      openToast("Images uploaded successfully", "success");
    },
  });
};

export const useReorderGalleryImages = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      reorderGalleryImages(productId, orderedIds),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.gallery(productId),
    },
    onSuccess: () => {
      openToast("Gallery layout reordered", "success");
    },
  });
};

export const useSetPrimaryImage = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (imageId: string) => setPrimaryImage(productId, imageId),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.gallery(productId),
    },
    onSuccess: () => {
      openToast("Primary image updated", "success");
    },
  });
};

export const useRemoveGalleryImage = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (imageId: string) => removeGalleryImage(productId, imageId),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.gallery(productId),
    },
    onSuccess: () => {
      openToast("Gallery image removed", "success");
    },
  });
};

export const useCreateVariant = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (payload: any) => createVariant(productId, payload),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Variant created successfully", "success");
    },
  });
};

export const useBulkCreateVariants = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (variants: any[]) => bulkCreateVariants(productId, variants),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Variants bulk-created successfully", "success");
    },
  });
};

export const useUpdateVariant = (productId: string, variantId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (payload: any) => updateVariant(variantId, payload),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Variant specifications updated", "success");
    },
  });
};

export const useUpdateVariantStock = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: updateVariantStock,
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Variant stock level updated", "success");
    },
  });
};

export const useToggleVariantStatus = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: toggleVariantStatus,
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Variant visibility toggled", "success");
    },
  });
};

export const useSetVariantImages = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: setVariantImages,
    meta: {
      invalidatesQuery: QUERY_KEYS.products.base(),
    },
    onSuccess: () => {
      openToast("Variant image associations updated", "success");
    },
  });
};

export const useCreateInstallmentPlan = (productId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (payload: any) => createInstallmentPlan(productId, payload),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Installment plan attached successfully", "success");
    },
  });
};

export const useUpdateInstallmentPlan = (productId: string, planId: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (payload: any) => updateInstallmentPlan(planId, payload),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Installment plan updated", "success");
    },
  });
};

export const useToggleInstallmentPlanStatus = (
  productId: string,
  planId: string
) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: (active: boolean) =>
      toggleInstallmentPlanStatus(planId, active),
    meta: {
      invalidatesQuery: QUERY_KEYS.products.details(productId),
    },
    onSuccess: () => {
      openToast("Installment plan status toggled", "success");
    },
  });
};
