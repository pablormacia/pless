"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Pencil, DollarSign, ChevronDown, ChevronRight, MoreVertical, Trash } from "lucide-react";
import { ChangePriceModal } from "@/components/admin/ChangePriceModal";
import { toast } from "sonner";
import { Product, Category } from "@/types";
import ImageUploader from "@/components/admin/ImageUploader";
import { CategoryCard } from "@/components/admin/CategoryCard";

export default function AdminProductosPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [openCategory, setOpenCategory] = useState<number | null>(null);

    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageCategory, setImageCategory] = useState<Category | null>(null);
    const [productImageModalOpen, setProductImageModalOpen] = useState(false);
    const [imageProduct, setImageProduct] = useState<Product | null>(null);
    const [editProductModalOpen, setEditProductModalOpen] = useState(false);
    const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState("");

    const [deleteProductConfirmText, setDeleteProductConfirmText] = useState("");

    const createCategory = async () => {
        if (!newCatName.trim()) {
            toast.error("La categoría necesita un nombre");
            return;
        }

        const { data, error } = await supabase
            .from("categories")
            .insert({
                business_id: businessId,
                name: newCatName,
                sort_order: categories.length + 1,
                image_url: null
            })
            .select()
            .single();

        if (error) {
            toast.error("Error al crear categoría");
            return;
        }

        // La agregamos al estado
        setCategories(prev => [
            ...prev,
            {
                ...data,
                image_url: "/icons/food.svg",
                products: [],
            }
        ]);

        setAddCategoryModalOpen(false);
        setNewCatName("");

        toast.success("Categoría creada");
    };

    // Abrir modal de edición
    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setEditProductModalOpen(true);
    };

    // Guardar cambios de producto
    const saveProductChanges = async (updatedProduct: Partial<Product>) => {
        if (!selectedProduct) return;

        // 💡 Sacamos image_url para no tocarla
        const { image_url, id, ...rest } = updatedProduct;

        // Si por alguna razón rest está vacío, no hacemos nada
        if (Object.keys(rest).length === 0) {
            setEditProductModalOpen(false);
            return;
        }

        const { error } = await supabase
            .from("products")
            .update(rest)
            .eq("id", selectedProduct.id)
            .eq("business_id", businessId);

        if (error) {
            toast.error("Error al guardar cambios");
            console.log(error);
            return;
        }

        setCategories((prev) =>
            prev.map((cat) => ({
                ...cat,
                products: cat.products.map((p) =>
                    p.id === selectedProduct.id
                        ? { ...p, ...rest } // 👈 acá también sin image_url
                        : p
                ),
            }))
        );

        toast.success("Producto actualizado");
        setEditProductModalOpen(false);
    };


    // Abrir modal de eliminación
    const openDeleteProduct = (product: Product) => {
        setSelectedProduct(product);
        setDeleteProductConfirmText("");
        setDeleteProductModalOpen(true);
    };

    // Eliminar producto
    const deleteProduct = async () => {
        if (!selectedProduct) return;
        if (deleteProductConfirmText !== "Confirmar") {
            toast.error("Debes escribir Confirmar exactamente");
            return;
        }

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", selectedProduct.id)
            .eq("business_id", businessId);

        if (error) {
            toast.error("Error al eliminar producto");
            return;
        }

        setCategories((prev) =>
            prev.map((cat) => ({
                ...cat,
                products: cat.products.filter((p) => p.id !== selectedProduct.id),
            }))
        );

        toast.success("Producto eliminado");
        setDeleteProductModalOpen(false);
    };

    const openProductImageModal = (p: Product) => {
        setImageProduct(p);
        setProductImageModalOpen(true);
    };

    const openImageModal = (cat: Category) => {
        setImageCategory(cat);
        setImageModalOpen(true);
    };

    const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";

    const toggleCategory = (id: number) => {
        setOpenCategory((prev) => (prev === id ? null : id));
    };

    const openEditCategory = (cat: Category) => {
        setSelectedCategory(cat);
        setNewCategoryName(cat.name);
        setEditModalOpen(true);
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
                    : "/icons/food.svg",
                products: cat.products.map((p) => ({
                    ...p,
                    image_url: p.image_url
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/businesses/${businessId}/products/${p.id}/${p.image_url}`
                        : "/icons/food.svg",
                })),
            }));

            setCategories(cleaned);
            setLoading(false);
        };

        loadData();
    }, []);

    const toggleAvailable = async (product: Product, value: boolean) => {
        console.log(value)
        const { error } = await supabase
            .from("products")
            .update({ available: !!value })
            .eq("id", product.id)
            .eq("business_id", businessId);

        if (error) {
            toast.error("Error al actualizar");
            console.log(error);
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
            .eq("id", selectedProduct.id)
            .eq("business_id", businessId);

        if (error) {
            toast.error("Error al guardar el precio");
            console.log(error);
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

    const saveCategoryName = async () => {
        if (!selectedCategory) return;

        const { error } = await supabase
            .from("categories")
            .update({ name: newCategoryName })
            .eq("id", selectedCategory.id)
            .eq("business_id", businessId);

        if (error) {
            toast.error("Error al actualizar categoría");
            return;
        }

        setCategories(prev =>
            prev.map(c => c.id === selectedCategory.id ? { ...c, name: newCategoryName } : c)
        );

        toast.success("Nombre actualizado");
        setEditModalOpen(false);
    };

    const openDeleteCategory = (cat: Category) => {
        setSelectedCategory(cat);
        setDeleteConfirmText("");
        setDeleteModalOpen(true);
    };

    const deleteCategory = async () => {
        if (!selectedCategory) return;
        if (deleteConfirmText !== "Confirmar") {
            toast.error("Debes escribir Confirmar exactamente");
            return;
        }

        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", selectedCategory.id)
            .eq("business_id", businessId);

        if (error) {
            toast.error("Error al eliminar categoría");
            return;
        }

        setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
        toast.success("Categoría eliminada");
        setDeleteModalOpen(false);
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

            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl w-80 space-y-4 shadow">
                        <h3 className="text-lg font-semibold">Editar categoría</h3>

                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full border p-2 rounded"
                        />

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={saveCategoryName}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow space-y-4">
                        <h3 className="text-lg font-semibold text-red-600">
                            Eliminar categoría
                        </h3>

                        <p>
                            Vas a eliminar una categoría y <b>todos sus productos asociados</b>.
                            Para continuar escribí <b>“Confirmar”</b>.
                        </p>

                        <input
                            className="w-full border p-2 rounded"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Escribí Confirmar"
                        />

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={deleteConfirmText !== "Confirmar"}
                                onClick={deleteCategory}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}



            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <Button onClick={() => setAddCategoryModalOpen(true)}>
                        + Agregar categoría
                    </Button>
                </div>
                {categories.map((cat) => (
                    <CategoryCard
                        key={cat.id}
                        category={cat}
                        isOpen={openCategory === cat.id}
                        onToggle={() => toggleCategory(cat.id)}
                        onEditCategory={() => openEditCategory(cat)}
                        onChangeCategoryImage={() => openImageModal(cat)}
                        onDeleteCategory={() => openDeleteCategory(cat)}
                        onEditProduct={openEditModal}
                        onChangeProductImage={openProductImageModal}
                        onToggleAvailable={toggleAvailable}
                        onChangePrice={openPriceModal}
                        onDeleteProduct={openDeleteProduct}
                    />
                ))}
            </div>

            {imageModalOpen && imageCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl w-80 space-y-4 shadow">
                        <h3 className="text-lg font-semibold">Cambiar foto de categoría</h3>

                        <ImageUploader
                            currentUrl={imageCategory.image_url}
                            bucket="categories"
                            folderId={imageCategory.id}
                            businessId={businessId}
                            onUploaded={async (newUrl) => {
                                try {
                                    if (newUrl) {
                                        const filename = newUrl.split("/").pop();
                                        console.log(filename, imageCategory.id)
                                        // Encontrar categoría correcta
                                        const catId = imageCategory.id;

                                        const { error } = await supabase
                                            .from("categories")
                                            .update({ image_url: filename })
                                            .eq("id", catId)
                                            .eq("business_id", businessId);

                                        if (error) console.log(error);

                                        // Actualizo estado React con la URL completa
                                        setCategories(prev =>
                                            prev.map(c =>
                                                c.id === catId ? { ...c, image_url: newUrl } : c
                                            )
                                        );
                                    } else {
                                        const catId = imageCategory.id;

                                        const { error } = await supabase
                                            .from("categories")
                                            .update({ image_url: null })
                                            .eq("id", catId)
                                            .eq("business_id", businessId);

                                        if (error) throw error;

                                        setCategories(prev =>
                                            prev.map(c =>
                                                c.id === catId ? { ...c, image_url: null } : c
                                            )
                                        );
                                    }

                                    setImageModalOpen(false);
                                } catch (err) {
                                    console.error("Error al actualizar la categoría:", err);
                                    toast.error("Error al actualizar la categoría");
                                }
                            }}

                        />



                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => setImageModalOpen(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {productImageModalOpen && imageProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl w-80 space-y-4 shadow">
                        <h3 className="text-lg font-semibold">Cambiar foto del producto</h3>

                        <ImageUploader
                            currentUrl={imageProduct.image_url}
                            bucket="products"
                            folderId={imageProduct.id}
                            businessId={businessId}
                            onUploaded={async (newUrl) => {
                                try {
                                    if (newUrl) {
                                        // Asegurar que la URL cambie siempre (evita cache de Next.js)
                                        const versionedUrl = `${newUrl}?v=${Date.now()}`;

                                        const filename = newUrl.split("/").pop();
                                        const { error } = await supabase
                                            .from("products")
                                            .update({ image_url: filename })
                                            .eq("id", imageProduct.id)
                                            .eq("business_id", businessId);

                                        if (error) throw error;

                                        // Actualizar estado con la versión nueva
                                        setCategories(prev =>
                                            prev.map(cat => ({
                                                ...cat,
                                                products: cat.products.map(p =>
                                                    p.id === imageProduct.id
                                                        ? { ...p, image_url: versionedUrl }
                                                        : p
                                                )
                                            }))
                                        );

                                    } else {
                                        // ELIMINAR → guardar null en DB
                                        const { error } = await supabase
                                            .from("products")
                                            .update({ image_url: null })
                                            .eq("id", imageProduct.id)
                                            .eq("business_id", businessId);

                                        if (error) throw error;

                                        // En el estado también lo dejamos null (NO un placeholder)
                                        setCategories(prev =>
                                            prev.map(cat => ({
                                                ...cat,
                                                products: cat.products.map(p =>
                                                    p.id === imageProduct.id
                                                        ? { ...p, image_url: null }
                                                        : p
                                                )
                                            }))
                                        );
                                    }

                                    setProductImageModalOpen(false);

                                } catch (err) {
                                    console.error(err);
                                    toast.error("Error al actualizar el producto");
                                }
                            }}

                        />


                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => setProductImageModalOpen(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {editProductModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl w-96 space-y-4 shadow">
                        <h3 className="text-lg font-semibold">Editar producto</h3>
                        <input
                            type="text"
                            value={selectedProduct.name}
                            onChange={(e) =>
                                setSelectedProduct((p) => p && { ...p, name: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                            placeholder="Nombre"
                        />
                        <textarea
                            value={selectedProduct.description ?? ""}
                            onChange={(e) =>
                                setSelectedProduct((p) => p && { ...p, description: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                            placeholder="Descripción"
                        />
                        <input
                            type="number"
                            value={selectedProduct.price}
                            onChange={(e) =>
                                setSelectedProduct((p) => p && { ...p, price: Number(e.target.value) })
                            }
                            className="w-full border p-2 rounded"
                            placeholder="Precio"
                        />
                        <div className="flex items-center gap-2">
                            <span>Disponible:</span>
                            <Switch
                                checked={selectedProduct.available}
                                onCheckedChange={(v) =>
                                    setSelectedProduct((p) => p && { ...p, available: !!v })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditProductModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={() => saveProductChanges(selectedProduct)}>Guardar</Button>
                        </div>
                    </div>
                </div>
            )}
            {deleteProductModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow space-y-4">
                        <h3 className="text-lg font-semibold text-red-600">Eliminar producto</h3>
                        <p>
                            Vas a eliminar el producto <b>{selectedProduct.name}</b>. Para continuar
                            escribí <b>“Confirmar”</b>.
                        </p>
                        <input
                            className="w-full border p-2 rounded"
                            value={deleteProductConfirmText}
                            onChange={(e) => setDeleteProductConfirmText(e.target.value)}
                            placeholder="Escribí Confirmar"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteProductModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={deleteProductConfirmText !== "Confirmar"}
                                onClick={deleteProduct}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {addCategoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl w-96 space-y-4 shadow">
                        <h3 className="text-lg font-semibold">Nueva categoría</h3>

                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Nombre"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                        />


                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setAddCategoryModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={createCategory}>Crear</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
