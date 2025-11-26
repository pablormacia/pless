// /services/categories.ts
import { supabase } from "@/lib/supabaseClient";
import { Category, Product } from "@/types";

const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      sort_order,
      image_url,
      products (
        id,
        name,
        description,
        price,
        image_url,
        available
      )
    `)
    .eq("business_id", businessId)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data as Category[];
}

export async function createCategory(name: string) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      business_id: businessId,
      name,
      sort_order: 9999,
      image_url: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategoryName(id: string, name: string) {
  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;
}

export async function updateCategoryImage(id: string, filename: string | null) {
  const { error } = await supabase
    .from("categories")
    .update({ image_url: filename })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;
}

export const deleteCategoryImage = async (categoryId: string) => {
  const basePath = `${businessId}/categories/${categoryId}`;

  const { data: files, error } = await supabase.storage
    .from("businesses")
    .list(basePath);

  if (error) {
    console.error("Error listing category files:", error);
    return;
  }

  if (files && files.length > 0) {
    const paths = files.map((file) => `${basePath}/${file.name}`);

    const { error: deleteErr } = await supabase.storage
      .from("businesses")
      .remove(paths);

    if (deleteErr) {
      console.error("Error removing category files:", deleteErr);
    }
  }
};

export const deleteProductsOfCategory = async (products: Product[]) => {
  for (const p of products) {
    const basePath = `${businessId}/products/${p.id}`;

    const { data: files } = await supabase.storage
      .from("businesses")
      .list(basePath);

    if (files && files.length > 0) {
      const paths = files.map((file) => `${basePath}/${file.name}`);
      await supabase.storage.from("businesses").remove(paths);
    }
  }
};

