"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";

interface OrderConfirmModalProps {
    open: boolean;
    onClose: () => void;
}

const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({ open, onClose }) => {
    const items = useCartStore((state) => state.items);
    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const sendWhatsapp = () => {
        const phone = "5491173625098"; // sin + ni espacios

        const lines = items.map(
            (item) => `• ${item.quantity}× ${item.name} — $${(item.price * item.quantity).toLocaleString()}`
        );

        const message = [
            "Hola, quiero hacer el siguiente pedido:",
            "",
            ...lines,
            "",
            `Total: $${total.toLocaleString()}`
        ].join("\n");

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Resumen del pedido</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between border-b pb-2">
                            <p>
                                {item.quantity}× {item.name}
                            </p>
                            <p>${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}

                    <p className="text-xl font-bold text-center mt-4">
                        Total: ${total.toLocaleString()}
                    </p>

                    <div className="mt-6 p-4 bg-yellow-100 rounded-md text-center">
                        Al presionar el botón <strong>Confirmar</strong>, se enviará un WhatsApp al negocio para continuar con el pedido.
                    </div>

                    <Button className="w-full" onClick={sendWhatsapp}>Confirmar y enviar WhatsApp</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderConfirmModal;
