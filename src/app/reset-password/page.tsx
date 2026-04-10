"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
       setErrorMsg("No se proporcionó un token válido en la URL.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
       setErrorMsg("Las contraseñas no coinciden.");
       return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 3000); // Redirect to login after 3s
      } else {
        setErrorMsg(data.error);
      }
    } catch (err) {
      setErrorMsg("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
     return (
        <div className="text-center p-8">
           <span className="material-symbols-outlined text-4xl text-red-500 mb-4 block">error</span>
           <h2 className="text-xl font-bold text-white mb-2">Enlace Inválido</h2>
           <p className="text-slate-400 mb-6 font-medium">No cuentas con un token seguro para restablecer la contraseña.</p>
           <Link href="/" className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-8 rounded-xl transition">Volver al Inicio</Link>
        </div>
     );
  }

  if (success) {
     return (
        <div className="text-center p-8">
           <span className="material-symbols-outlined text-5xl text-green-500 mb-4 block">check_circle</span>
           <h2 className="text-2xl font-extrabold text-white mb-2">¡Contraseña Actualizada!</h2>
           <p className="text-slate-400 mb-6 font-medium">Tu contraseña ha sido restablecida exitosamente. Redirigiendo al inicio de sesión...</p>
           <button onClick={() => router.push("/")} className="bg-primary text-background-dark font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors">Entrar Ahora</button>
        </div>
     );
  }

  return (
    <div className="px-8 py-6">
       <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#5b83e8]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#5b83e8]">
             <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Crear Nueva Contraseña</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Ingresa tu nueva contraseña para acceder a la plataforma.</p>
       </div>

       <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm text-center font-bold px-2">{errorMsg}</div>}
          
          <div>
             <label className="block text-sm text-slate-400 mb-2 font-medium">Nueva Contraseña</label>
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">lock</span>
                <input 
                   type="password" 
                   required
                   minLength={6}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-background-dark border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
             </div>
          </div>
          <div>
             <label className="block text-sm text-slate-400 mb-2 font-medium">Confirmar Contraseña</label>
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">lock</span>
                <input 
                   type="password" 
                   required
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="w-full bg-background-dark border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
             </div>
          </div>

          <button 
             type="submit" 
             disabled={loading}
             className={`w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(19,200,236,0.3)] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
             {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Guardar y Entrar'}
          </button>
       </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-linear-to-b from-background-dark to-[#0f1618] flex items-center justify-center p-4">
       <div className="max-w-md w-full bg-surface-dark border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-[#5b83e8]"></div>
          <Suspense fallback={<div className="p-12 text-center text-primary"><span className="material-symbols-outlined animate-spin text-5xl">sync</span></div>}>
             <ResetPasswordForm />
          </Suspense>
       </div>
    </div>
  );
}
