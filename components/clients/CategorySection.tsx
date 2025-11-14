"use client";

import { ProductCard } from "./ProductCard";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export function CategorySection({
  category,
  view,
  isOpen,
  onToggle,
}: {
  category: any;
  view: "grid" | "list";
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-lg">{category.name}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`transition-all duration-300 ${
            view === "grid"
              ? "grid grid-cols-2 gap-3 px-4 pb-4"
              : "flex flex-col px-4 pb-4"
          }`}
        >
          {category.products.map((p: any) => (
            <ProductCard key={p.id} product={p} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}
