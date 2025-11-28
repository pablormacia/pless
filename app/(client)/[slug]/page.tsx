"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CartButton from "@/components/clients/CartButton";
import { CategorySection } from "@/components/clients/CategorySection";
import { createClient } from "@supabase/supabase-js";

export default function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // STATES
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [headerUrl, setHeaderUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [business, setBusiness] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [businessDisabled, setBusinessDisabled] = useState(false);

  // ─────────────────────────────────────────────
  // 1) Buscar negocio por slug
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function loadBusiness() {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name, enabled")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      if (data.enabled === false) {
        setBusinessDisabled(true);
        return;
      }

      setBusiness(data);
    }

    loadBusiness();
  }, [slug]);

  const businessId = business?.id;

  // ─────────────────────────────────────────────
  // 2) Cargar imagen de header (solo si business existe)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!businessId) return;

    async function loadImage() {
      const { data } = supabase.storage
        .from("businesses")
        .getPublicUrl(`${businessId}/header.webp`);

      setHeaderUrl(data.publicUrl);
    }

    loadImage();
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;

    const { data } = supabase.storage
      .from("businesses")
      .getPublicUrl(`${businessId}/logo.webp`);

    setLogoUrl(data.publicUrl);
  }, [businessId]);

  // ─────────────────────────────────────────────
  // 3) Cargar categorías + productos (solo si business existe)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!businessId) return;

    async function loadData() {
      setLoading(true);

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

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const cleaned = data.map((cat: any) => ({
        ...cat,
        image_url: cat.image_url
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/categories/${cat.id}/${cat.image_url}`
          : null,
        products: cat.products
          .filter((p: any) => p.available)
          .map((p: any) => ({
            ...p,
            image_url: p.image_url
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/products/${p.id}/${p.image_url}`
              : null,
          })),
      }));

      setCategories(cleaned);
      setLoading(false);
    }

    loadData();
  }, [businessId]);

  // ─────────────────────────────────────────────
  // 4) LOS RETURNS VAN ABAJO DE TODO
  // ─────────────────────────────────────────────

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-3">Negocio no encontrado</h1>
        <p className="mb-6 text-gray-600">
          El enlace que intentaste abrir no existe.
        </p>
        <Button onClick={() => router.push("/")}>Volver al inicio</Button>
      </div>
    );
  }

  if (businessDisabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-3">Comercio inactivo</h1>
        <p className="mb-6 text-gray-600">
          Este comercio no está habilitado actualmente.
        </p>
        <Button onClick={() => router.push("/")}>Volver al inicio</Button>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando negocio...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER PRINCIPAL
  // ─────────────────────────────────────────────

  return (
    <main>
      {/* HEADER */}
      <div className="relative h-48 w-full">
        {headerUrl && (
          <Image
            src={headerUrl}
            alt={business.name}
            fill
            className="object-cover brightness-75"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {logoUrl && (
            <Image
              src={logoUrl}
              width={45}
              height={45}
              alt="logo"
              className="m-1"
            />
          )}
          <h1 className="text-3xl font-bold drop-shadow-lg capitalize">
            {business.name}
          </h1>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg">Categorías</h2>

        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
          >
            <Grid className="h-4 w-4" /> Modo menú
          </Button>

          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" /> Modo pedido
          </Button>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Cargando menú...</p>
        ) : (
          categories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              view={view}
              isOpen={openCategory === cat.id}
              onToggle={() =>
                setOpenCategory(openCategory === cat.id ? null : cat.id)
              }
            />
          ))
        )}
      </div>

      {view === "list" && <CartButton view={view} />}
    </main>
  );
}
