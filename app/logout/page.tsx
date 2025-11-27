"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    // Cambia completamente la URL del navegador (FULL redirect)
    window.location.href = "/api/logout";
  }, []);

  return <p className="p-4">Cerrando sesión...</p>;
}
