import {
  apiService,
  LIMIT,
  type PaginatedData,
  type UrlParams,
} from "@services/api-service";
import { ENDPOINTS } from "@utils/endpoints";
import { queryOptions } from "@tanstack/react-query";
import type {
  Category,
  InstallmentPlan,
  Product,
  ProductImageDetail,
  SystemProductDef,
} from "@utils/types/response-type";

export const getMarketerCatalogQueryOptions = (targetPage: number) =>
  queryOptions({
    queryKey: ["partner-catalog-lookup", targetPage],
    queryFn: async () => {
      const response = await apiService.get<SystemProductDef[]>("/products", {
        page: String(targetPage),
        limit: LIMIT,
      });
      return response.data;
    },
  });

export const getProductDetails = (id: string) => {
  return apiService.get<Product>(ENDPOINTS.catalog.products.details(id));
};

export const getProductBySlug = (slug: string) => {
  return apiService.get<Product>(ENDPOINTS.catalog.products.bySlug(slug));
};

export const getProductGallery = (productId: string) => {
  return apiService.get<ProductImageDetail[]>(
    ENDPOINTS.catalog.gallery.base(productId)
  );
};

export const getProductInstallmentPlans = (productId: string) => {
  return apiService.get<InstallmentPlan[]>(
    ENDPOINTS.catalog.installmentPlans.base(productId)
  );
};

export const getCategories = () => {
  return apiService.get<Category[]>(ENDPOINTS.catalog.categories.base);
};

export const getAllProducts = (
  params: Partial<
    UrlParams & { category?: string; status?: string; search?: string }
  >
) => {
  const queryParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      queryParams[key] = String(val);
    }
  });

  if (queryParams.search) {
    return apiService.get<PaginatedData<"products", Product>>(
      ENDPOINTS.catalog.products.search,
      queryParams
    );
  }

  return apiService.get<PaginatedData<"products", Product>>(
    ENDPOINTS.catalog.products.base,
    queryParams
  );
};
