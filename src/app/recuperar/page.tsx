"use client";
import { useState } from "react";
import Link from "next/link";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Ocurrió un error.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-background-dark to-[#0f1618] flex items-center justify-center p-4">
       <div className="max-w-md w-full bg-surface-dark border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#5b83e8]"></div>
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <span className="material-symbols-outlined text-3xl">key</span>
             </div>
             <h1 className="text-2xl font-extrabold text-white">Recuperar Contraseña</h1>
             <p className="text-slate-400 mt-2 text-sm">Ingresa el correo de tu cuenta y te enviaremos instrucciones.</p>
          </div>

          {success ? (
             <div className="text-center space-y-6">
                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl">
                   <span className="material-symbols-outlined block text-3xl mb-2">mark_email_read</span>
                   Si el correo está registrado, recibirás un enlace de recuperación en los próximos minutos. Revisa también tu carpeta de Spam.
                </div>
                <Link href="/" className="inline-block bg-slate-800 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-700 transition">Volver al inicio</Link>
             </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center font-bold">{errorMsg}</div>}
                
                <div>
                   <label className="block text-sm text-slate-400 mb-2 font-medium">Correo Electrónico</label>
                   <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">mail</span>
                      <input 
                         type="email" 
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="Ingresa tu correo"
                         className="w-full bg-background-dark border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                   </div>
                </div>

                <button 
                   type="submit" 
                   disabled={loading}
                   className={`w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(19,200,236,0.3)] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                   {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Enviar Correo'}
                </button>
             </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
             ¿La recordaste? <Link href="/" className="text-primary hover:underline font-bold">Inicia sesión</Link>
          </div>
       </div>
    </div>
  );
}
