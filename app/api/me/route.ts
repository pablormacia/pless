import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
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

  // Obtener user
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ user: null });
  }

  // Buscar business_id del usuario
  const { data: userRow } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", authData.user.id)
    .single();

  if (!userRow) {
    return NextResponse.json({ user: null });
  }

  // Buscar negocio
  const { data: business } = await supabase
    .from("businesses")
    .select("name, slug")
    .eq("id", userRow.business_id)
    .single();

  return NextResponse.json({
    user: {
      email: authData.user.email,
      businessId: userRow.business_id,       // 👈 NUEVO
      businessName: business?.name ?? null,
      slug: business?.slug ?? null,
    },
  });
}
