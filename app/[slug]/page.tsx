"use client";

import { useState, useEffect} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CategorySection } from "@/components/clients/CategorySection";
import { Grid, List } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import mock from "@/data/mock.json";


export default function ClientPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);


    const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadImage() {
      const { data } = supabase.storage
        .from("businesses")
        .getPublicUrl("c8e43f7a-331d-49bd-ac63-a88a2d69b600/header_pless_resto_demo.webp");

      setImageUrl(data.publicUrl);
    }

    loadImage();
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
            size="icon"
            onClick={() => setView("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categorías */}
      <div className="p-4 space-y-4">
        {mock.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            view={view}
            isOpen={openCategory === cat.id}
            onToggle={() =>
              setOpenCategory(openCategory === cat.id ? null : cat.id)
            }
          />
        ))}
      </div>
    </main>
  );
}
