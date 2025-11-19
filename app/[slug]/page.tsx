"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CategorySection } from "@/components/clients/CategorySection";
import { Grid, List } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import CartButton from "@/components/clients/CartButton";


export default function ClientPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";


  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadImage() {
      const { data } = supabase.storage
        .from("businesses")
        .getPublicUrl(`${businessId}/header_pless_resto_demo.webp`);

      setImageUrl(data.publicUrl);
    }

    loadImage();
  }, []);

  useEffect(() => {
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
        console.error("Error:", error);
        setLoading(false);
        return;
      }

      // Filtrar productos disponibles (ya vienen dentro de cada categoría)
      const cleaned = data.map(cat => ({
        ...cat,
        image_url: cat.image_url
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/categories/${cat.id}/${cat.image_url}`
          : null,
        products: cat.products
          .filter(p => p.available)
          .map(p => ({
            ...p,
            image_url: p.image_url
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/products/${p.id}/${p.image_url}`
              : null
          }))
      }));

      setCategories(cleaned);
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <main>
      {/* Header */}
      <div className="relative h-48 w-full">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Pless Restó Demo"
            fill
            className="object-cover brightness-75"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center text-white">

          <Image
            src='/pless_logo_grays.png'
            alt="Pless Restó Demo"
            width={45}
            height={45}
            className="object-cover brightness-75 m-1"
            priority
          />
          <h1 className="text-3xl font-bold drop-shadow-lg capitalize">
            Pless Restó Demo
          </h1>
        </div>
      </div>

      {/* Controles */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg">Categorías</h2>

        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
            className="flex items-center gap-1"
          >
            <Grid className="h-4 w-4" />
            <span>Modo menú</span>
          </Button>

          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
            className="flex items-center gap-1"
          >
            <List className="h-4 w-4" />
            <span>Modo pedido</span>
          </Button>
        </div>
      </div>

      {/* Categorías */}
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
