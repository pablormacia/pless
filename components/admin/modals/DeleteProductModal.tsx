"use client";

import ModalBase from "./ModalBase";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

type Props = {
  open: boolean;
  product: Product;
  confirmValue: string;
  setConfirmValue: (v: string) => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function DeleteProductModal({
  open,
  product,
  confirmValue,
  setConfirmValue,
  onDelete,
  onClose,
}: Props) {
  if (!product) return null;

  return (
    <ModalBase open={open} title="Eliminar producto" onClose={onClose}>
      <p>
        Vas a eliminar <b>{product.name}</b>. Escribí <b>Confirmar</b> para
        continuar.
      </p>

      <input
        className="w-full border p-2 rounded"
        placeholder="Confirmar"
        value={confirmValue}
        onChange={(e) => setConfirmValue(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="destructive"
          disabled={confirmValue !== "Confirmar"}
          onClick={onDelete}
        >
          Eliminar
        </Button>
      </div>
    </ModalBase>
  );
}
