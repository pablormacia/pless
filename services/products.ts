// /services/products.ts
import { supabase } from "@/lib/supabaseClient";

const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";

export async function updateProduct(id: string, fields: any) {
  const { error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;
}

export async function updateProductPrice(id: string, price: number) {
  return updateProduct(id, { price });
}

export async function updateProductAvailability(id: string, available: boolean) {
  return updateProduct(id, { available });
}

export async function updateProductImage(id: string, filename: string | null) {
  return updateProduct(id, { image_url: filename });
}
