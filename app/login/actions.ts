"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // 1) Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;

  // 2) Buscar business_id del usuario
  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("enabled, business_id")
    .eq("id", user.id)
    .single();

  if (userError) {
    return { error: "No se pudo cargar tu perfil" };
  }

  if (!userRow.enabled) {
    await supabase.auth.signOut();
    return { error: "Usuario deshabilitado" };
  }

  // 3) Buscar el slug del negocio
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("slug")
    .eq("id", userRow.business_id)
    .single();

  if (businessError) {
    return { error: "No se encontró el negocio asociado" };
  }

  // 4) Todo ok. Devolvemos el slug.
  return { success: true, slug: business.slug };
}
