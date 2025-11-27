// /services/products.ts
import { supabase } from "@/lib/supabaseClient";

//const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";

export async function updateProduct(id: string, fields: any,businessId: string) {
  const { error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;
}

export async function deleteProduct(id: string,businessId: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;
}

export async function updateProductPrice(id: string, price: number,businessId: string) {
  return updateProduct(id, { price },businessId);
}

export async function updateProductAvailability(id: string, available: boolean,businessId: string) {
  return updateProduct(id, { available },businessId);
}

export async function updateProductImage(id: string, filename: string | null,businessId: string) {
  return updateProduct(id, { image_url: filename },businessId);
}

export async function createProduct(fields: {
  name: string;
  description?: string | null;
  price: number;
  available: boolean;
  category_id: string;
},
businessId: string) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...fields,
      image_url: null,
      business_id: businessId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

