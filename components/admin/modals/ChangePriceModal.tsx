"use client";

import { useState, useEffect } from "react";
import ModalBase from "./ModalBase";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: Product;
  onSave: (newPrice: number) => void;
};

export default function ChangePriceModal({
  open,
  setOpen,
  product,
  onSave,
}: Props) {
  const [price, setPrice] = useState(product.price);

  // 👇 RESETEA EL PRECIO CUANDO SE ABRE EL MODAL
  useEffect(() => {
    if (open) {
      setPrice(product.price);
    }
  }, [open, product]);

  return (
    <ModalBase open={open} onClose={() => setOpen(false)} title="Cambiar precio">
      <input
        type="number"
        className="w-full border p-2 rounded"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(price)}>Guardar</Button>
      </div>
    </ModalBase>
  );
}
