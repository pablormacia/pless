import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Proxy SIEMPRE corre en Node.js (no edge)
// No se permite runtime ni config

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Crear cliente Supabase SSR para Node.js runtime
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Protección manual de rutas
  if (pathname.startsWith("/admin") && !data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}
