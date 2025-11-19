import { Toaster } from "@/components/ui/sonner";
import CartDrawer from "@/components/clients/CartDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {children}
      <Toaster
        position="bottom-left"       // aparece desde la izquierda
        offset="32px"                // separación desde el borde (opcional)
        toastOptions={{
          style: {
            width: "60%",            // ocupa el 60% del ancho (aprox. mitad de pantalla)
            maxWidth: "400px",       // límite para que no quede gigante en desktop
          },
          
        }}
      />
      <CartDrawer />
      <h2>HOLA SOY OTRO LAYOUT</h2>
    </div>
  );
}