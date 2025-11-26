"use client";

import { useEffect } from "react";
import ModalBase from "./ModalBase";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

type Props = {
  open: boolean;
  mode?: "edit" | "create"; // 👈 nuevo
  product: Product | null;
  setProduct: (p: Product) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function EditProductModal({
  open,
  mode = "edit",
  product,
  setProduct,
  onSave,
  onClose,
}: Props) {
  if (!open || !product) return null;

  const title = mode === "create" ? "Nuevo producto" : "Editar producto";

  // Si quisieras resetear algo cuando se abre el modal, lo podés hacer acá
  useEffect(() => {
    if (!open || !product) return;

    // Ejemplo: si estás creando un producto y tiene precio 0, lo podés dejar así.
    // Si después querés resetear otros campos al abrir, éste es el lugar.
  }, [open, product, mode]);

  const handleChange = (patch: Partial<Product>) => {
    setProduct({ ...product, ...patch });
  };

  // Para que el placeholder de precio se vea cuando creás:
  const priceValue =
    mode === "create" && product.price === 0
      ? ""
      : product.price ?? "";

  return (
    <ModalBase open={open} title={title} onClose={onClose}>
      <input
        type="text"
        value={product.name}
        onChange={(e) => handleChange({ name: e.target.value })}
        className="w-full border p-2 rounded"
        placeholder="Nombre"
      />

      <textarea
        value={product.description ?? ""}
        onChange={(e) => handleChange({ description: e.target.value })}
        className="w-full border p-2 rounded"
        placeholder="Descripción"
      />

      <input
        type="number"
        value={priceValue}
        onChange={(e) =>
          handleChange({
            price: e.target.value === "" ? 0 : Number(e.target.value),
          })
        }
        className="w-full border p-2 rounded"
        placeholder="Precio"
      />

      <div className="flex items-center gap-2">
        <span>Disponible:</span>
        <input
          type="checkbox"
          checked={product.available}
          onChange={(e) => handleChange({ available: e.target.checked })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onSave}>
          {mode === "create" ? "Crear" : "Guardar"}
        </Button>
      </div>
    </ModalBase>
  );
}
