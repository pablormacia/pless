// /hooks/useCategories.ts
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategoryImage,
  updateCategoryName,
} from "@/services/categories";
import { Category } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";

const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getCategories();

      const processed = data.map(cat => ({
        ...cat,
        image_url: getImageUrl(businessId, "categories", cat.id, cat.image_url),
        products: cat.products.map(p => ({
          ...p,
          image_url: getImageUrl(businessId, "products", p.id, p.image_url),
        })),
      }));

      setCategories(processed);
    } finally {
      setLoading(false);
    }
  }

  return {
    categories,
    setCategories,
    loading,
    refresh: load,
    createCategory,
    deleteCategory,
    updateCategoryName,
    updateCategoryImage,
  };
}
