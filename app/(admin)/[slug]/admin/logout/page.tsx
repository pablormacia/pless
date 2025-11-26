"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await supabase.auth.signOut();
      router.push("/login");
    };

    doLogout();
  }, [router]);

  return <p className="p-4">Cerrando sesión...</p>;
}
