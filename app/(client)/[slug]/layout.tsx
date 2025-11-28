import { Toaster } from "@/components/ui/sonner";
import CartDrawer from "@/components/clients/CartDrawer";
import AdminClientTopBar from "@/components/admin/AdminClientTopBar";
import LoadUserClient from "@/components/clients/LoadUserClient";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <LoadUserClient /> 
      <AdminClientTopBar />
      {children}

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            width: "60%",
            maxWidth: "400px",
          },
        }}
      />

      <CartDrawer />
    </div>
  );
}
