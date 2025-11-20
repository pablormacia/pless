"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ChangePriceModal({ open, setOpen, product, onSave }: any) {
  const [price, setPrice] = useState(product.price);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar precio</DialogTitle>
          <DialogDescription>
            Ingresá el nuevo precio para <strong>{product.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <input
          type="number"
          className="border w-full p-2 rounded mt-2"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <Button onClick={() => onSave(price)} className="w-full mt-4">
          Guardar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
