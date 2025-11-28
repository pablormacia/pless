"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export default function LoadUserClient() {
  const setUserData = useUserStore((s) => s.setUserData);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();

      if (data.user) {
        setUserData({
          email: data.user.email,
          businessId: data.user.businessId,
          businessName: data.user.businessName,
          slug: data.user.slug,
        });
      }
    }
    load();
  }, []);

  return null; // No renderiza nada
}
