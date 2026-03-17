"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthModals() {
  const router = useRouter();
  
  // Registration State
  const [registerType, setRegisterType] = useState("candidato");
  const [regData, setRegData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // Login State
  const [logData, setLogData] = useState({
    email: "",
    password: "",
  });
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState("");

  // Handler for dynamic input changes
  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };
  
  const handleLogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogData({ ...logData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");

    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...regData, tipoCuenta: registerType })
      });
      const data = await resp.json();

      if (data.success) {
        // Guarda Token de sesion (en un caso real de prod iría a localStorage o cookies)
        localStorage.setItem("tt_session", data.token);

        // Escondemos el modal actual
        document.getElementById("register-modal")?.classList.add("hidden");
        
        // Redirigimos dependiendo del tipo de cuenta elegido
        // if (registerType === "candidato") {
        //   router.push("/registro-candidato");
        // } else {
        //   router.push("/registro-empresa"); 
        // }
        // NEW REQUIREMENT: Redirect all to /mi-perfil
        router.push("/mi-perfil");
      } else {
        setRegError(data.error);
      }
    } catch (err) {
      setRegError("Error de conexión");
    } finally {
      setRegLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogLoading(true);
    setLogError("");

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData)
      });
      const data = await resp.json();

      if (data.success) {
        localStorage.setItem("tt_session", data.token);
        document.getElementById("login-modal")?.classList.add("hidden");
        // Refrescamos la pagina o ruteamos a mi-perfil
        window.location.reload(); 
      } else {
        setLogError(data.error);
      }
    } catch (err) {
      setLogError("Error de conexión");
    } finally {
      setLogLoading(false);
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

              {logError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                  {logError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    required
                    name="email"
                    value={logData.email}
                    onChange={handleLogChange}
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
                    required
                    name="password"
                    value={logData.password}
                    onChange={handleLogChange}
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
                  type="submit"
                  disabled={logLoading}
                  className={`w-full text-background-dark font-bold py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(19,200,236,0.3)] mt-6 ${logLoading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}`}
                >
                  {logLoading ? "Cargando..." : "Iniciar Sesión"}
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
              
              {regError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    required
                    name="nombreCompleto"
                    value={regData.nombreCompleto}
                    onChange={handleRegChange}
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
                    required
                    name="email"
                    value={regData.email}
                    onChange={handleRegChange}
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
                    required
                    name="password"
                    value={regData.password}
                    onChange={handleRegChange}
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
                  type="submit"
                  disabled={regLoading}
                  className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] mt-6 ${regLoading ? "bg-secondary/50 cursor-not-allowed" : "bg-secondary hover:bg-secondary/90"}`}
                >
                  {regLoading ? "Cargando..." : "Registrarme"}
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
