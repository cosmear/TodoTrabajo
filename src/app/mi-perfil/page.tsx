"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MiPerfil() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("tt_session");
        
        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch("/api/perfil", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          setProfile(data);
        } else {
          setErrorMsg(data.error || "Error cargando el perfil.");
          if (data.status === 401) {
             localStorage.removeItem("tt_session");
             router.push("/");
          }
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Problema de red al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1618] flex items-center justify-center pt-20">
        <div className="text-center text-slate-400">
           <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4 block">sync</span>
           <p className="font-medium text-lg">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
     return (
        <div className="min-h-screen bg-[#0f1618] flex items-center justify-center pt-20">
          <div className="bg-surface-dark border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full">
             <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
             <h2 className="text-2xl text-white font-bold mb-2">Ups, algo falló</h2>
             <p className="text-slate-400 mb-6">{errorMsg}</p>
             <button onClick={() => router.push("/")} className="w-full bg-primary text-background-dark font-bold py-3 rounded-xl hover:bg-primary/90">
                Volver al Home
             </button>
          </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-[#0f1618] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-surface-dark border border-slate-800 p-8 rounded-3xl shadow-2xl mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-background-dark text-4xl font-bold flex-shrink-0 z-10 shadow-[0_0_20px_rgba(19,200,236,0.5)]">
            {profile.user?.nombre_completo?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left z-10">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {profile.user?.nombre_completo}
            </h1>
            <p className="text-slate-400 text-lg mb-1 flex items-center justify-center md:justify-start gap-2">
               <span className="material-symbols-outlined text-sm">mail</span>
               {profile.user?.email}
            </p>
            <div className="inline-block mt-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
               {profile.user?.tipo_cuenta}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {profile.user?.tipo_cuenta === "candidato" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
               <span className="material-symbols-outlined text-primary text-2xl">work_history</span>
               <h2 className="text-2xl font-bold text-white">Mis Postulaciones</h2>
            </div>

            {profile.applications?.length === 0 ? (
              <div className="bg-surface-dark border border-slate-800 p-10 rounded-2xl text-center text-slate-500">
                No tienes ninguna postulación activa por el momento. <br/><br/>
                <button onClick={() => router.push("/buscar-empleo")} className="bg-primary/10 text-primary hover:bg-primary/20 font-bold py-2.5 px-6 rounded-lg transition-all mt-2">
                  Ver ofertas de empleo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.applications.map((app: any) => (
                  <div key={app.id} className="bg-surface-dark border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-slate-700 transition-colors">
                     <div>
                        <h3 className="text-xl font-bold text-white mb-1">{app.posicion}</h3>
                        <p className="text-primary font-bold text-sm mb-2">{app.empresa}</p>
                        <div className="flex gap-4 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {app.provincia}, {app.pais}</span>
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> 
                             {new Date(app.created_at).toLocaleDateString()}
                           </span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        {app.status}
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
