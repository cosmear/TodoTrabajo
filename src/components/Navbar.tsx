"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-background-dark">
            <span className="material-symbols-outlined">work</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Todo Trabajo
          </h1>
        </Link>
        {/* Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            className="text-sm font-medium text-slate-300 hover:text-primary transition-colors"
            href="/"
          >
            Inicio
          </Link>
          <Link
            className="text-sm font-medium text-slate-300 hover:text-primary transition-colors"
            href="/somos"
          >
            Somos
          </Link>
          <Link
            className="text-sm font-medium text-slate-300 hover:text-primary transition-colors"
            href="/buscar-empleo"
          >
            Buscar Empleo
          </Link>
          <Link
            className="text-sm font-medium text-slate-300 hover:text-primary transition-colors"
            href="/buscar-talento"
          >
            Busco Personal
          </Link>
          <Link
            className="text-sm font-medium text-slate-300 hover:text-primary transition-colors"
            href="/servicios"
          >
            Servicios
          </Link>
          <Link
            className="text-sm font-medium text-slate-300 hover:text-primary transition-colors"
            href="/contacto"
          >
            Contacto
          </Link>
        </div>
        {/* CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              document.getElementById("login-modal")?.classList.remove("hidden")
            }
            className="text-sm font-bold text-slate-300 hover:text-primary transition-colors"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() =>
              document
                .getElementById("register-modal")
                ?.classList.remove("hidden")
            }
            className="bg-secondary hover:bg-secondary/90 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(255,107,0,0.4)]"
          >
            Registrarme
          </button>
        </div>
      </div>
    </nav>
  );
}
