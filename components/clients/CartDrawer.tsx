"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ArrowLeft, Trash } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { toast } from "sonner";

const CartDrawer = () => {
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);

    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent side="right" className="w-[350px] flex flex-col">
                <SheetHeader>
                    <SheetTitle>Carrito</SheetTitle>
                </SheetHeader>

                <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
                    {items.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">
                            Carrito vacío
                        </p>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-md px-3 py-2 flex items-center justify-between"
                            >
                                {item.image && (
                                    <div className="w-8 h-8 mr-1 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="font-medium leading-tight">{item.name}</p>
                                    <p className="text-sm text-gray-500 leading-tight">
                                        ${item.price.toLocaleString()}
                                    </p>
                                </div>

                                {/* Contador */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        disabled={item.quantity === 1}
                                        onClick={() =>
                                            item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)
                                        }
                                    >
                                        <Minus size={16} />
                                    </Button>

                                    <span className="w-6 text-center">
                                        {item.quantity}
                                    </span>

                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity + 1)
                                        }
                                    >
                                        <Plus size={16} />
                                    </Button>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 ml-2 flex items-center"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <SheetFooter className="border-t pt-4">
                    <div className="w-full space-y-3">
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={closeCart}
                        >
                            <ArrowLeft size={16} />
                            Seguir comprando
                        </Button>
                        <p className="text-lg font-semibold text-center">
                            Total: ${total.toLocaleString()}
                        </p>

                        <Button className="w-full" onClick={() => toast("Bazinga!")}>
                            Confirmar pedido
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
