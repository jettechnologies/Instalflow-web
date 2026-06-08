import { queryOptions } from "@tanstack/react-query";
import { apiService } from "@services/api-service";

export interface ItemVariantSchema {
  sku: string;
  size: string;
  color: string[];
  stockQuantity: number;
  price: number;
}

export interface SystemProductDef {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  commissionRate: number;
  variants: ItemVariantSchema[];
}

export const getMarketerCatalogQueryOptions = (targetPage: number) =>
  queryOptions({
    queryKey: ["partner-catalog-lookup", targetPage],
    queryFn: async () => {
      const response = await apiService.get<SystemProductDef[]>("/products", { 
        page: String(targetPage), 
        limit: "12" 
      });
      return response.data;
    },
  });
