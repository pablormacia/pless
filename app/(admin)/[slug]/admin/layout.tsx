import AdminTopBar from "@/components/admin/AdminTopBar";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function AdminLayout({ children, params }: any) {
  // Next 16 → params es Promise
  const { slug: slugFromUrl } = await params;

  // Next 16 → cookies() es SINCRONO
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        }
      },
    }
  );

  // 1) Obtener usuario
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect("/login");

  // 2) Buscar business_id
  const { data: userRow } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", auth.user.id)
    .single();

  if (!userRow) redirect("/login");

  // 3) Buscar negocio
  const { data: business } = await supabase
    .from("businesses")
    .select("slug")
    .eq("id", userRow.business_id)
    .single();

  if (!business) redirect("/login");

  const userSlug = business.slug;

  // 4) Protección multi-tenant
  if (slugFromUrl !== userSlug) {
    redirect(`/${userSlug}/admin`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopBar />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { width: "60%", maxWidth: "400px" },
        }}
      />
      <main className="p-4">{children}</main>
    </div>
  );
}
