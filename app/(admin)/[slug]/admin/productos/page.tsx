"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

import { CategoryCard } from "@/components/admin/CategoryCard";

import EditCategoryModal from "@/components/admin/modals/EditCategoryModal";
import DeleteCategoryModal from "@/components/admin/modals/DeleteCategoryModal";
import CategoryImageModal from "@/components/admin/modals/CategoryImageModal";
import NewCategoryModal from "@/components/admin/modals/NewCategoryModal";

import EditProductModal from "@/components/admin/modals/EditProductModal";
import DeleteProductModal from "@/components/admin/modals/DeleteProductModal";
import ProductImageModal from "@/components/admin/modals/ProductImageModal";

import { Product, Category } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";

const businessId = "c8e43f7a-331d-49bd-ac63-a88a2d69b600";

export default function AdminProductosPage() {
  // ──────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────

  const {
    categories,
    setCategories,
    loading,
    createCategory,
    deleteCategory: deleteCategoryService,
    updateCategoryName,
    updateCategoryImage,
  } = useCategories();

  const {
    updateProduct,
    deleteProduct: deleteProductService,
    updateProductPrice,
    updateProductAvailability,
    updateProductImage,
  } = useProducts();

  // ──────────────────────────────────────────
  // UI STATE
  // ──────────────────────────────────────────

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Category modals
  const [editCatModal, setEditCatModal] = useState(false);
  const [deleteCatModal, setDeleteCatModal] = useState(false);
  const [imageCatModal, setImageCatModal] = useState(false);
  const [newCategoryModal, setNewCategoryModal] = useState(false);

  // Product modals
  const [editProductModal, setEditProductModal] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const [productImageModal, setProductImageModal] = useState(false);

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [confirmDeleteCat, setConfirmDeleteCat] = useState("");
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState("");

  // ──────────────────────────────────────────
  // CATEGORY ACTIONS
  // ──────────────────────────────────────────

  const openEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setNewCategoryName(cat.name);
    setEditCatModal(true);
  };

  const saveCategoryNameHandler = async () => {
    if (!selectedCategory) return;

    try {
      await updateCategoryName(selectedCategory.id, newCategoryName);

      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id ? { ...c, name: newCategoryName } : c
        )
      );

      toast.success("Nombre actualizado");
      setEditCatModal(false);
    } catch {
      toast.error("Error al actualizar");
    }
  };

  const openDeleteCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setConfirmDeleteCat("");
    setDeleteCatModal(true);
  };

  const deleteCategoryHandler = async () => {
    if (!selectedCategory) return;
    if (confirmDeleteCat !== "Confirmar") return toast.error("Texto incorrecto");

    try {
      await deleteCategoryService(selectedCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      toast.success("Categoría eliminada");
      setDeleteCatModal(false);
    } catch {
      toast.error("Error al eliminar categoría");
    }
  };

  const openCategoryImage = (cat: Category) => {
    setSelectedCategory(cat);
    setImageCatModal(true);
  };

  const openNewCategory = () => {
    setNewCategoryName("");
    setNewCategoryModal(true);
  };

  const createCategoryHandler = async () => {
    if (!newCategoryName.trim())
      return toast.error("La categoría necesita un nombre");

    try {
      const data = await createCategory(newCategoryName);

      setCategories((prev) => [
        ...prev,
        {
          ...data,
          image_url: "/icons/food.svg",
          products: [],
        },
      ]);

      toast.success("Categoría creada");
      setNewCategoryModal(false);
    } catch {
      toast.error("Error al crear categoría");
    }
  };

  // ──────────────────────────────────────────
  // PRODUCT ACTIONS
  // ──────────────────────────────────────────

  const openEditProduct = (p: Product) => {
    setSelectedProduct(p);
    setEditProductModal(true);
  };

  const saveProductChanges = async () => {
    if (!selectedProduct) return;

    try {
      const { id, image_url, ...fields } = selectedProduct;
      await updateProduct(id, fields);

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          products: cat.products.map((p) =>
            p.id === id ? { ...p, ...fields } : p
          ),
        }))
      );

      toast.success("Producto actualizado");
      setEditProductModal(false);
    } catch {
      toast.error("Error al guardar producto");
    }
  };

  const openDeleteProduct = (p: Product) => {
    setSelectedProduct(p);
    setConfirmDeleteProduct("");
    setDeleteProductModal(true);
  };

  const deleteProductHandler = async () => {
    if (!selectedProduct) return;
    if (confirmDeleteProduct !== "Confirmar")
      return toast.error("Texto incorrecto");

    try {
      await deleteProductService(selectedProduct.id);

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          products: cat.products.filter((p) => p.id !== selectedProduct.id),
        }))
      );

      toast.success("Producto eliminado");
      setDeleteProductModal(false);
    } catch {
      toast.error("Error al eliminar producto");
    }
  };

  const toggleAvailable = async (product: Product, value: boolean) => {
    try {
      await updateProductAvailability(product.id, value);

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          products: cat.products.map((p) =>
            p.id === product.id ? { ...p, available: value } : p
          ),
        }))
      );
    } catch {
      toast.error("Error al actualizar");
    }
  };

  const openProductImage = (p: Product) => {
    setSelectedProduct(p);
    setProductImageModal(true);
  };

  const updatePrice = async (product: Product, newPrice: number) => {
    try {
      await updateProductPrice(product.id, newPrice);

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          products: cat.products.map((p) =>
            p.id === product.id ? { ...p, price: newPrice } : p
          ),
        }))
      );

      toast.success("Precio actualizado");
    } catch {
      toast.error("Error al actualizar precio");
    }
  };

  // ──────────────────────────────────────────

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Productos por categoría</h2>

      {/* ───────── ADD CATEGORY BUTTON ───────── */}
      <div className="flex justify-end mb-4">
        <Button onClick={openNewCategory}>+ Agregar categoría</Button>
      </div>

      {/* ───────── CATEGORY LIST ───────── */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isOpen={openCategory === cat.id}
            onToggle={() =>
              setOpenCategory((prev) => (prev === cat.id ? null : cat.id))
            }
            onEditCategory={() => openEditCategory(cat)}
            onChangeCategoryImage={() => openCategoryImage(cat)}
            onDeleteCategory={() => openDeleteCategory(cat)}
            onEditProduct={openEditProduct}
            onChangeProductImage={openProductImage}
            onToggleAvailable={toggleAvailable}
            onChangePrice={(p) => updatePrice(p, p.price)}
            onDeleteProduct={openDeleteProduct}
          />
        ))}
      </div>

      {/* ────────────────────────────────────────── */}
      {/* CATEGORY MODALS */}
      {/* ────────────────────────────────────────── */}

      <EditCategoryModal
        open={editCatModal}
        value={newCategoryName}
        setValue={setNewCategoryName}
        onSave={saveCategoryNameHandler}
        onClose={() => setEditCatModal(false)}
      />

      <DeleteCategoryModal
        open={deleteCatModal}
        categoryName={selectedCategory?.name ?? ""}
        confirmValue={confirmDeleteCat}
        setConfirmValue={setConfirmDeleteCat}
        onDelete={deleteCategoryHandler}
        onClose={() => setDeleteCatModal(false)}
      />

      <CategoryImageModal
        open={imageCatModal}
        category={selectedCategory}
        businessId={businessId}
        onUpload={async (url) => {
          try {
            const filename = url ? url.split("/").pop()! : null;

            await updateCategoryImage(selectedCategory!.id, filename);

            setCategories((prev) =>
              prev.map((c) =>
                c.id === selectedCategory!.id
                  ? {
                      ...c,
                      image_url: getImageUrl(
                        businessId,
                        "categories",
                        c.id,
                        filename
                      ),
                    }
                  : c
              )
            );

            setImageCatModal(false);
          } catch {
            toast.error("Error al actualizar imagen");
          }
        }}
        onClose={() => setImageCatModal(false)}
      />

      <NewCategoryModal
        open={newCategoryModal}
        value={newCategoryName}
        setValue={setNewCategoryName}
        onCreate={createCategoryHandler}
        onClose={() => setNewCategoryModal(false)}
      />

      {/* ────────────────────────────────────────── */}
      {/* PRODUCT MODALS */}
      {/* ────────────────────────────────────────── */}

      <EditProductModal
        open={editProductModal}
        product={selectedProduct as Product}
        setProduct={setSelectedProduct}
        onSave={saveProductChanges}
        onClose={() => setEditProductModal(false)}
      />

      <DeleteProductModal
        open={deleteProductModal}
        product={selectedProduct as Product}
        confirmValue={confirmDeleteProduct}
        setConfirmValue={setConfirmDeleteProduct}
        onDelete={deleteProductHandler}
        onClose={() => setDeleteProductModal(false)}
      />

      <ProductImageModal
        open={productImageModal}
        product={selectedProduct as Product}
        businessId={businessId}
        onUpload={async (url) => {
          try {
            const filename = url ? url.split("/").pop()! : null;

            await updateProductImage(selectedProduct!.id, filename);

            setCategories((prev) =>
              prev.map((c) => ({
                ...c,
                products: c.products.map((p) =>
                  p.id === selectedProduct!.id
                    ? {
                        ...p,
                        image_url: getImageUrl(
                          businessId,
                          "products",
                          p.id,
                          filename
                        ),
                      }
                    : p
                ),
              }))
            );

            setProductImageModal(false);
          } catch {
            toast.error("Error al actualizar imagen");
          }
        }}
        onClose={() => setProductImageModal(false)}
      />
    </div>
  );
}
