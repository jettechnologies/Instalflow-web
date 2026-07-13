import { apiService } from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import type {
  Product,
  ProductImage,
  Variant,
  InstallmentPlan,
  Category,
} from "@utils/types/response-type";

export const createCategory = (payload: {
  name: string;
  description?: string;
}) => {
  return apiService.post<Category>(ENDPOINTS.catalog.categories.base, payload);
};

type UpdateCategoryParams = {
  id: string;
  payload: {
    name?: string;
    description?: string;
  };
};

export const updateCategory = (params: UpdateCategoryParams) => {
  const { id, payload } = params;
  return apiService.patch<Category>(
    ENDPOINTS.catalog.categories.details(id),
    payload
  );
};

export const deleteCategory = (categoryId: string) => {
  return apiService.delete<any>(
    ENDPOINTS.catalog.categories.details(categoryId)
  );
};

export const createProduct = (payload: {
  name: string;
  description?: string;
  categoryId: string;
  commissionRate: number;
  status: string;
  price: number;
  stockQuantity: number;
  installmentPlans?: {
    durationMonths: number;
    interestPercentage: number;
    active?: boolean;
  }[];
}) => {
  return apiService.post<Product>(ENDPOINTS.catalog.products.base, payload);
};

export const updateProduct = (id: string, payload: any) => {
  return apiService.patch<Product>(
    ENDPOINTS.catalog.products.details(id),
    payload
  );
};

export const archiveProduct = (id: string) => {
  return apiService.delete<any>(ENDPOINTS.catalog.products.details(id));
};

export const uploadGalleryImages = (productId: string, formData: FormData) => {
  return apiService.post<ProductImage[]>(
    ENDPOINTS.catalog.gallery.base(productId),
    formData
  );
};

export const reorderGalleryImages = (
  productId: string,
  orderedIds: string[]
) => {
  return apiService.patch<ProductImage[]>(
    ENDPOINTS.catalog.gallery.reorder(productId),
    { orderedIds }
  );
};

export const setPrimaryImage = (productId: string, imageId: string) => {
  return apiService.patch<ProductImage[]>(
    ENDPOINTS.catalog.gallery.primary(productId, imageId)
  );
};

export const updateImageMetadata = (
  productId: string,
  imageId: string,
  payload: { altText?: string | null; sortOrder?: number }
) => {
  return apiService.patch<ProductImage>(
    ENDPOINTS.catalog.gallery.metadata(productId, imageId),
    payload
  );
};

export const removeGalleryImage = (productId: string, imageId: string) => {
  return apiService.delete<{ deleted: boolean; imageId: string }>(
    ENDPOINTS.catalog.gallery.metadata(productId, imageId)
  );
};

export const createVariant = (productId: string, payload: any) => {
  return apiService.post<Variant>(
    ENDPOINTS.catalog.variants.base(productId),
    payload
  );
};

export const bulkCreateVariants = (productId: string, variants: any[]) => {
  return apiService.post<{ count: number; variants: Variant[] }>(
    ENDPOINTS.catalog.variants.bulk(productId),
    { variants }
  );
};

export const updateVariant = (variantId: string, payload: any) => {
  return apiService.patch<Variant>(
    ENDPOINTS.catalog.variants.details(variantId),
    payload
  );
};

interface UpdateVariantStockProps {
  variantId: string;
  stockQuantity: number;
}

export const updateVariantStock = ({
  variantId,
  stockQuantity,
}: UpdateVariantStockProps) => {
  return apiService.patch<Variant>(
    ENDPOINTS.catalog.variants.stock(variantId),
    { stockQuantity }
  );
};

interface ToggleVariantStatusProps {
  variantId: string;
  isActive: boolean;
}

export const toggleVariantStatus = ({
  variantId,
  isActive,
}: ToggleVariantStatusProps) => {
  return apiService.patch<Variant>(
    ENDPOINTS.catalog.variants.status(variantId),
    { isActive }
  );
};

interface SetVariantImagesProps {
  variantId: string;
  imageIds: string[];
}

export const setVariantImages = ({
  variantId,
  imageIds,
}: SetVariantImagesProps) => {
  return apiService.put<Variant>(ENDPOINTS.catalog.variants.images(variantId), {
    imageIds,
  });
};

export const createInstallmentPlan = (
  productId: string,
  payload: {
    durationMonths: number;
    interestPercentage: number;
    active?: boolean;
  }
) => {
  return apiService.post<InstallmentPlan>(
    ENDPOINTS.catalog.installmentPlans.base(productId),
    payload
  );
};

export const updateInstallmentPlan = (
  planId: string,
  payload: {
    durationMonths?: number;
    interestPercentage?: number;
    active?: boolean;
  }
) => {
  return apiService.patch<any>(
    ENDPOINTS.catalog.installmentPlans.details(planId),
    payload
  );
};

export const toggleInstallmentPlanStatus = (
  planId: string,
  active: boolean
) => {
  return apiService.patch<any>(
    ENDPOINTS.catalog.installmentPlans.status(planId),
    { active }
  );
};
