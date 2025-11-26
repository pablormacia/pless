// /hooks/useProducts.ts
import {
  updateProduct,
  deleteProduct,
  updateProductPrice,
  updateProductAvailability,
  updateProductImage,
} from "@/services/products";

export function useProducts() {
  return {
    updateProduct,
    deleteProduct,
    updateProductPrice,
    updateProductAvailability,
    updateProductImage,
  };
}
