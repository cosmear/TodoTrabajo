"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MiPerfilRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("tt_session");
    if (!token) {
      router.replace("/");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const tipoCuenta = payload.tipoCuenta || payload.tipo_cuenta;
      if (tipoCuenta === "empresa") {
        router.replace("/mi-perfil/empresa");
      } else {
        router.replace("/mi-perfil/candidato");
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f1618] flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-5xl text-primary">sync</span>
    </div>
  );
}
