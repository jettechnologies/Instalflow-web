import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@services/query-keys";
import {
  getProductDetails,
  getProductGallery,
  getProductInstallmentPlans,
  getCategories,
  getAllProducts,
} from "../queries/catalog";

export const getAllProductsQueryOptions = (params: any) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.all(params),
    queryFn: async () => {
      const response = await getAllProducts(params);
      return response.data;
    },
  });

export const getProductDetailsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.products.details(id),
    queryFn: async () => {
      const response = await getProductDetails(id);
      return response.data;
    },
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
