import AdminTopBar from "@/components/admin/AdminTopBar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopBar />
      <Toaster
        position="bottom-center"              
        toastOptions={{
          style: {
            width: "60%",            
            maxWidth: "400px", 
          },
          
        }}
      />
      <main className="p-4">{children}</main>
    </div>
  );
}
