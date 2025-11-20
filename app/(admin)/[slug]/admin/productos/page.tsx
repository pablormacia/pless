"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, DollarSign, ChevronDown, ChevronRight } from "lucide-react";
import { ChangePriceModal } from "@/components/admin/ChangePriceModal";
import { toast } from "sonner";
import { Product, Category } from "@/types";

export default function AdminProductosPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [openCategory, setOpenCategory] = useState<number | null>(null);

    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";

    const toggleCategory = (id: number) => {
        setOpenCategory((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const loadData = async () => {
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
                toast.error("Error al cargar categorías");
                setLoading(false);
                return;
            }

            const cleaned: Category[] = data.map((cat) => ({
                ...cat,
                image_url: cat.image_url
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/categories/${cat.id}/${cat.image_url}`
                    : "/placeholder.png",
                products: cat.products.map((p) => ({
                    ...p,
                    image_url: p.image_url
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/products/${p.id}/${p.image_url}`
                        : "/placeholder.png",
                })),
            }));

            setCategories(cleaned);
            setLoading(false);
        };

        loadData();
    }, []);

    const toggleAvailable = async (product: Product, value: boolean) => {
        const { error } = await supabase
            .from("products")
            .update({ available: value })
            .eq("id", product.id);

        if (error) {
            toast.error("Error al actualizar");
            return;
        }

        setCategories((prev) =>
            prev.map((cat) => ({
                ...cat,
                products: cat.products.map((p) =>
                    p.id === product.id ? { ...p, available: value } : p
                ),
            }))
        );

        toast.success(`Producto ${value ? "habilitado" : "deshabilitado"}`);
    };

    const openPriceModal = (product: Product) => {
        setSelectedProduct(product);
        setPriceModalOpen(true);
    };

    const savePrice = async (newPrice: number) => {
        if (!selectedProduct) return;

        const { error } = await supabase
            .from("products")
            .update({ price: newPrice })
            .eq("id", selectedProduct.id);

        if (error) {
            toast.error("Error al guardar el precio");
            return;
        }

        setCategories((prev) =>
            prev.map((cat) => ({
                ...cat,
                products: cat.products.map((p) =>
                    p.id === selectedProduct.id ? { ...p, price: newPrice } : p
                ),
            }))
        );

        toast.success("Precio actualizado");
        setPriceModalOpen(false);
    };

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Productos por categoría</h2>

            {selectedProduct && (
                <ChangePriceModal
                    open={priceModalOpen}
                    setOpen={setPriceModalOpen}
                    product={selectedProduct}
                    onSave={savePrice}
                />
            )}

            <div className="space-y-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="border rounded-lg bg-white shadow-sm">
                        {/* Encabezado clickeable */}
                        <button
                            onClick={() => toggleCategory(cat.id)}
                            className="w-full flex items-center justify-between p-3 gap-3"
                        >
                            <div className="flex items-center gap-3">

                                {/* Imagen categoría cuadrada */}
                                <Image
                                    src={cat.image_url ?? "/placeholder.png"}
                                    width={40}
                                    height={40}
                                    className="rounded-lg object-cover border aspect-square"
                                    alt={cat.name}
                                />

                                <h3 className="text-lg font-semibold">{cat.name}</h3>
                            </div>

                            {openCategory === cat.id ? (
                                <ChevronDown className="h-5 w-5" />
                            ) : (
                                <ChevronRight className="h-5 w-5" />
                            )}
                        </button>

                        {/* Contenido expandible */}
                        {openCategory === cat.id && (
                            <div className="p-3 space-y-3 border-t">
                                {cat.products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="p-3 bg-gray-50 rounded-lg shadow-sm flex gap-3 items-center"
                                    >
                                        {/* Imagen producto cuadrada */}
                                        <Image
                                            src={product.image_url ?? "/placeholder.png"}
                                            width={60}
                                            height={60}
                                            className="rounded-lg object-cover border aspect-square"
                                            alt={product.name}
                                        />

                                        <div className="flex-1">
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-sm text-gray-600">${product.price}</p>

                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs">Disponible:</span>
                                                <Switch
                                                    checked={product.available}
                                                    onCheckedChange={(v) => toggleAvailable(product, v)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    (window.location.href = `/admin/productos/${product.id}/edit`)
                                                }
                                            >
                                                <Pencil size={18} />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => openPriceModal(product)}
                                            >
                                                <DollarSign size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
