"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Utensils, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";


export function ProductCard({
  product,
  view,
}: {
  product: any;
  view: "grid" | "list";
}) {
  const add = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  // Cantidad
  const [quantity, setQuantity] = useState(1);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [pendingQuantity, setPendingQuantity] = useState(1);

  const openCart = useCartStore((state) => state.openCart);

  const increase = () => quantity < 20 && setQuantity(quantity + 1);
  const decrease = () => quantity > 1 && setQuantity(quantity - 1);

  const haptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20); // vibración corta
    }
  };

  const hasImage =
    product.image && product.image !== "" && product.image !== "/nothing.jpg";

  const handleAdd = () => {
    const exists = items.find((i) => i.id === product.id);

    if (exists) {
      setPendingQuantity(quantity);
      setShowModal(true);
      return;
    }

    add({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });

    toast("Producto agregado al carrito!", {
  duration: 800,
});
    haptic();
    animateButton();
    openCart();
  };

  const confirmAdd = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: pendingQuantity,
    });

    toast("Cantidad actualizada!", {
  duration: 800,
});
    haptic();
    animateButton();
    setShowModal(false);
    openCart();
  };

  // Animación del botón
  const [animate, setAnimate] = useState(false);

  const animateButton = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
  };

  return (
    <>
      {/* CARD */}
      <div
        className={`rounded-xl border p-3 shadow-sm bg-white hover:shadow-md transition
        ${view === "list" ? "flex items-center gap-3" : ""}`}
      >
        {/* Imagen */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
          {hasImage ? (
            <Image
              src={product.image}
              width={80}
              height={80}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <Utensils className="w-10 h-10 text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-medium">{product.name}</h3>

          {product.description && (
            <p className="text-sm text-gray-500">{product.description}</p>
          )}

          <p className="font-semibold mt-1">
            ${product.price.toLocaleString()}
          </p>

          {/* Contador */}
          <div className="flex items-center gap-2 mt-2">
            <Button size="icon" variant="outline" onClick={decrease} className="h-8 w-8">
              <Minus size={16} />
            </Button>

            <span className="w-8 text-center">{quantity}</span>

            <Button size="icon" variant="outline" onClick={increase} className="h-8 w-8">
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Botón agregar */}
        {view === "list" && (
          <Button
            size="sm"
            variant="outline"
            className={`ml-auto ${animate ? "button-tap" : ""}`}
            onClick={handleAdd}
          >
            Agregar
          </Button>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Producto ya en el carrito</DialogTitle>
            <DialogDescription>
              El producto ya está agregado.
              Si continuás, sumarás <strong>{pendingQuantity}</strong> unidad(es)
              adicional(es).
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>

            <Button onClick={confirmAdd}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
