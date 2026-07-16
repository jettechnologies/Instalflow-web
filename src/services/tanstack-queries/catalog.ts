import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
import {
  getProductDetails,
  getProductGallery,
  getProductInstallmentPlans,
  getCategories,
  getAllProducts,
  getProductBySlug,
} from "../queries/catalog";

export const getAllProductsQueryOptions = (params: any) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.all(params),
    queryFn: async () => {
      const response = await getAllProducts(params);
      return response.data;
    },
  });

export const getProductDetailsQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.details(productId),
    queryFn: async () => {
      const response = await getProductDetails(productId);
      return response.data;
    },
    enabled: Boolean(productId),
  });

export const getProductBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.bySlug(slug),
    queryFn: async () => {
      const response = await getProductBySlug(slug);
      return response.data;
    },
    enabled: Boolean(slug),
  });

export const getProductGalleryQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.gallery(productId),
    queryFn: async () => {
      const response = await getProductGallery(productId);
      return response.data;
    },
  });

export const getProductInstallmentPlansQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.installmentPlans(productId),
    queryFn: async () => {
      const response = await getProductInstallmentPlans(productId);
      return response.data;
    },
  });

export const getCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categories.all(),
    queryFn: async () => {
      const response = await getCategories();
      return response.data || [];
    },
  });
