"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AccountType = "candidato" | "empresa" | "admin" | null;

type NavLink = {
  href: string;
  label: string;
};

const publicLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/somos", label: "Somos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

const privateLinksByType: Record<Exclude<AccountType, null>, NavLink[]> = {
  candidato: [{ href: "/buscar-empleo", label: "Buscar empleo" }],
  empresa: [{ href: "/buscar-talento", label: "Busco personal" }],
  admin: [{ href: "/admin", label: "Panel admin" }],
};

function getAccountType(): AccountType {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("tt_session") : null;

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.tipoCuenta ?? null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>(null);

  useEffect(() => {
    const syncSession = () => {
      setAccountType(getAccountType());
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("tt-session-changed", syncSession as EventListener);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(
        "tt-session-changed",
        syncSession as EventListener
      );
    };
  }, [pathname]);

  const isLogged = accountType !== null;
  
  const hideOnPaths = ["/mi-perfil", "/admin"];
  if (isLogged && hideOnPaths.some((p) => pathname.startsWith(p))) {
    return null;
  }

  // Siempre mostramos los mismos links públicos "Inicio, Somos, Servicios, Contacto"
  const currentLinks = publicLinks;

  const linkClassName = (href: string) =>
    `text-sm font-semibold transition-colors ${
      pathname === href ? "text-primary" : "text-slate-300 hover:text-primary"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("tt_session");
    window.dispatchEvent(new Event("tt-session-changed"));
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 glass-nav">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-background-dark">
              <span className="material-symbols-outlined">work</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Todo Trabajo
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {currentLinks.map((link) => (
              <Link
                key={link.href}
                className={linkClassName(link.href)}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isLogged ? (
              <>
                <Link
                  href={accountType === "admin" ? "/admin" : "/mi-perfil"}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-sm font-bold py-2.5 px-5 rounded-lg transition-all"
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold py-2.5 px-5 rounded-lg transition-all border border-red-500/20"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    document
                      .getElementById("login-modal")
                      ?.classList.remove("hidden")
                  }
                  className="text-sm font-bold text-slate-300 hover:text-primary transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("register-modal")
                      ?.classList.remove("hidden")
                  }
                  className="bg-secondary hover:bg-secondary/90 text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                >
                  Registrarme
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex md:hidden items-center gap-5 overflow-x-auto pb-1">
          {currentLinks.map((link) => (
            <Link
              key={link.href}
              className={`${linkClassName(link.href)} whitespace-nowrap`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
