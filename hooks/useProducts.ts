// /hooks/useProducts.ts
import {
  updateProduct,
  deleteProduct,
  updateProductPrice,
  updateProductAvailability,
  updateProductImage,
  createProduct
} from "@/services/products";

export function useProducts(businessId?: string) {
  return {
    updateProduct,
    deleteProduct,
    updateProductPrice,
    updateProductAvailability,
    updateProductImage,
    createProduct
  };
}
