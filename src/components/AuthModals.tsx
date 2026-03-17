"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthModals() {
  const router = useRouter();
  const [registerType, setRegisterType] = useState("candidato");

  const handleRegisterNavigation = () => {
    // Escondemos el modal actual
    document.getElementById("register-modal")?.classList.add("hidden");
    
    // Redirigimos dependiendo del tipo de cuenta elegido
    if (registerType === "candidato") {
      router.push("/registro-candidato");
    } else {
      router.push("/registro-empresa"); 
    }
  };

  return (
    <>
      {/* Login Modal */}
      <div id="login-modal" className="fixed inset-0 z-[100] hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm transition-opacity"
          onClick={() =>
            document.getElementById("login-modal")?.classList.add("hidden")
          }
        ></div>

        {/* Modal Content */}
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="relative bg-surface-dark rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transform transition-all sm:max-w-md sm:w-full">
            {/* Close Button */}
            <button
              onClick={() =>
                document.getElementById("login-modal")?.classList.add("hidden")
              }
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="px-8 pt-10 pb-8">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                Bienvenido de nuevo
              </h3>
              <p className="text-slate-400 text-sm text-center mb-8">
                Ingresa a tu cuenta para continuar
              </p>

              <form className="space-y-5">
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 bg-background-dark border-slate-700 rounded text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-slate-400"
                    >
                      Recordarme
                    </label>
                  </div>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <button
                  type="button"
                  className="w-full bg-primary text-background-dark font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(19,200,236,0.3)] mt-6"
                >
                  Iniciar Sesión
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-400">
                ¿No tienes una cuenta?{" "}
                <button
                  onClick={() => {
                    document.getElementById("login-modal")?.classList.add("hidden");
                    document.getElementById("register-modal")?.classList.remove("hidden");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div id="register-modal" className="fixed inset-0 z-[100] hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm transition-opacity"
          onClick={() =>
            document.getElementById("register-modal")?.classList.add("hidden")
          }
        ></div>

        {/* Modal Content */}
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="relative bg-surface-dark rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transform transition-all sm:max-w-md sm:w-full">
            {/* Close Button */}
            <button
              onClick={() =>
                document.getElementById("register-modal")?.classList.add("hidden")
              }
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="px-8 pt-10 pb-8">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                Crear una cuenta
              </h3>
              <p className="text-slate-400 text-sm text-center mb-8">
                Únete a Todo Trabajo hoy mismo
              </p>

              <form className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Tipo de Cuenta
                  </label>
                  <select 
                    value={registerType}
                    onChange={(e) => setRegisterType(e.target.value)}
                    className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="candidato">
                      Soy Candidato (Quiero sumarme al canal)
                    </option>
                    <option value="empresa">Soy Empresa (Busco Personal)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleRegisterNavigation}
                  className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary/90 transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] mt-6"
                >
                  Registrarme
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => {
                    document.getElementById("register-modal")?.classList.add("hidden");
                    document.getElementById("login-modal")?.classList.remove("hidden");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Inicia Sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
