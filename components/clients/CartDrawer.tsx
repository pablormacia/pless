"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart";
import { FC } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

const CartDrawer: FC<CartDrawerProps> = ({ open, onClose }) => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[350px]">
        <SheetHeader>
          <SheetTitle>Carrito</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Carrito vacío</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="border rounded-md px-3 py-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm"
                >
                  Quitar
                </button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
