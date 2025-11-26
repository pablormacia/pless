// /utils/getImageUrl.ts
export function getImageUrl(
  businessId: string,
  type: "categories" | "products",
  id: string,
  filename: string | null
) {
  if (!filename) return "/icons/food.svg";

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/${type}/${id}/${filename}`;
}
