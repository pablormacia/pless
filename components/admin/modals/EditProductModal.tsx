"use client";

import ModalBase from "./ModalBase";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

type Props = {
  open: boolean;
  product: Product;
  setProduct: (p: Product) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function EditProductModal({
  open,
  product,
  setProduct,
  onSave,
  onClose,
}: Props) {
  if (!product) return null;

  return (
    <ModalBase open={open} title="Editar producto" onClose={onClose}>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <textarea
        value={product.description ?? ""}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: Number(e.target.value) })
        }
        className="w-full border p-2 rounded"
      />

      <div className="flex items-center gap-2">
        <span>Disponible:</span>
        <input
          type="checkbox"
          checked={product.available}
          onChange={(e) =>
            setProduct({ ...product, available: e.target.checked })
          }
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onSave}>Guardar</Button>
      </div>
    </ModalBase>
  );
}
