"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import CartDrawer from "./CartDrawer";
import { useState, FC } from "react";

interface CartButtonProps {
  view: "grid" | "list";
}

const CartButton: FC<CartButtonProps> = ({ view }) => {
  const items = useCartStore((state) => state.items);
  const [open, setOpen] = useState(false);

  if (view !== "list") return null;

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{items.length}</span>
      </button>

      <CartDrawer open={open} onClose={setOpen} />
    </>
  );
};

export default CartButton;
