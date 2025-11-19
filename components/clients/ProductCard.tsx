"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Utensils } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cart";

export function ProductCard({
  product,
  view,
}: {
  product: any;
  view: "grid" | "list";
}) {
  const add = useCartStore((state) => state.addItem);

  const hasImage =
    product.image && product.image !== "" && product.image !== "/nothing.jpg";

  const handleAdd = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };

    add(item);
  };

  return (
    <div
      className={`rounded-xl border p-3 shadow-sm bg-white hover:shadow-md transition
      ${view === "list" ? "flex items-center gap-3" : ""}`}
    >
      {/* Imagen o ícono */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
        {hasImage ? (
          <Image
            src={product.image}
            width={80}
            height={80}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <Utensils className="w-10 h-10 text-gray-400" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>

        {product.description && (
          <p className="text-sm text-gray-500">{product.description}</p>
        )}

        <p className="font-semibold mt-1">
          ${product.price.toLocaleString()}
        </p>
      </div>

      {/* Botón solo en vista lista */}
      {view === "list" && (
        <Button size="sm" variant="outline" className="ml-auto" onClick={handleAdd}>
          Agregar
        </Button>
      )}
    </div>
  );
}
