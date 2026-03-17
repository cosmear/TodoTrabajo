"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MiPerfil() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("inicio");

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
          // Set active tab based on account type
          setActiveTab(data.user?.tipo_cuenta === 'empresa' ? 'empresa' : 'inicio');
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

  const handleLogout = () => {
    localStorage.removeItem("tt_session");
    window.location.href = "/";
  };

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
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-[#0f1618] pt-24 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
           <div className="bg-surface-dark border border-slate-800 rounded-2xl p-6 sticky top-28 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background-dark text-xl font-bold flex-shrink-0 shadow-[0_0_15px_rgba(19,200,236,0.3)]">
                    {profile.user?.nombre_completo?.charAt(0).toUpperCase()}
                 </div>
                 <div className="overflow-hidden">
                    <h2 className="text-white font-bold truncate">{profile.user?.nombre_completo}</h2>
                    <p className="text-slate-400 text-xs truncate capitalize">{profile.user?.tipo_cuenta}</p>
                 </div>
              </div>

              <div className="space-y-2">
                 {profile.user?.tipo_cuenta === "candidato" ? (
                    <>
                       <button onClick={() => setActiveTab('inicio')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'inicio' ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-slate-800'}`}>
                          Inicio
                       </button>
                       <button onClick={() => setActiveTab('asistencia')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'asistencia' ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-slate-800'}`}>
                          Asistencia
                       </button>
                    </>
                 ) : (
                    <>
                       <button onClick={() => setActiveTab('empresa')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'empresa' ? 'bg-[#3b5acc]/20 text-[#5b83e8]' : 'text-slate-300 hover:bg-slate-800'}`}>
                          Empresa
                       </button>
                       <button onClick={() => setActiveTab('buscar_candidatos')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'buscar_candidatos' ? 'bg-[#3b5acc]/20 text-[#5b83e8]' : 'text-slate-300 hover:bg-slate-800'}`}>
                          Buscar Candidatos
                       </button>
                    </>
                 )}
                 <button className="w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-slate-300 hover:bg-slate-800">
                    Cambiar Contraseña
                 </button>
                 <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-red-400 hover:bg-red-500/10">
                    Salir
                 </button>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* TAB: CANDIDATO - INICIO */}
          {activeTab === 'inicio' && profile.user?.tipo_cuenta === 'candidato' && (
             <div>
                <div className="flex items-center gap-3 mb-6">
                   <h1 className="text-3xl font-extrabold text-white">Mis Postulaciones</h1>
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
                         <div className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-bold flex-shrink-0">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            {app.status}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          )}

          {/* TAB: EMPRESA */}
          {activeTab === 'empresa' && profile.user?.tipo_cuenta === 'empresa' && (
             <div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                   <h1 className="text-3xl font-extrabold text-white">Dashboard de tu Empresa</h1>
                   <Link href="/crear-postulacion" className="bg-[#5b83e8] hover:bg-[#4a6dc6] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(91,131,232,0.4)] flex items-center gap-2">
                      <span className="material-symbols-outlined">add_circle</span> CREAR EMPLEO
                   </Link>
                </div>

                {profile.companyJobs?.length === 0 ? (
                  <div className="bg-surface-dark border border-slate-800 p-10 rounded-2xl text-center text-slate-500">
                    Aún no tienes publicaciones activas. <br/><br/>
                    <Link href="/crear-postulacion" className="inline-block bg-[#5b83e8]/10 text-[#5b83e8] hover:bg-[#5b83e8]/20 font-bold py-2.5 px-6 rounded-lg transition-all mt-2">
                      Publicar tu primera búsqueda
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profile.companyJobs.map((job: any) => (
                      <div key={job.id} className="bg-surface-dark border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                         <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                            <div>
                               <h3 className="text-xl font-bold text-white mb-2">{job.posicion}</h3>
                               <div className="flex gap-4 text-xs text-slate-400">
                                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {job.provincia}, {job.pais}</span>
                                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> 
                                    {new Date(job.created_at).toLocaleDateString()}
                                  </span>
                               </div>
                            </div>
                            <div className="bg-[#3b5acc]/20 text-[#5b83e8] px-3 py-1 rounded-full text-xs font-bold border border-[#5b83e8]/30">
                               {job.applications?.length || 0} Postulantes
                            </div>
                         </div>
                         <div className="p-0">
                            {job.applications?.length === 0 ? (
                               <div className="p-6 text-sm text-slate-500 text-center">Nadie se ha postulado a esta posición aún.</div>
                            ) : (
                               <div className="divide-y divide-slate-800/50">
                                  {job.applications.map((app: any) => (
                                     <div key={app.application_id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                           <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                                              {app.nombre_completo.charAt(0).toUpperCase()}
                                           </div>
                                           <div>
                                              <p className="font-bold text-slate-200 text-sm">{app.nombre_completo}</p>
                                              <p className="text-slate-500 text-xs">{app.email}</p>
                                           </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                           <span className="text-xs text-slate-500">{new Date(app.created_at).toLocaleDateString()}</span>
                                           <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                                              {app.status}
                                           </span>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          )}

          {/* TAB: CANDIDATO - ASISTENCIA */}
          {activeTab === 'asistencia' && (
             <div className="bg-surface-dark border border-slate-800 p-10 rounded-2xl text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-4">support_agent</span>
                <p>Centro de asistencia en desarrollo...</p>
             </div>
          )}

          {/* TAB: EMPRESA - BUSCAR CANDIDATOS */}
          {activeTab === 'buscar_candidatos' && (
             <div className="bg-surface-dark border border-slate-800 p-10 rounded-2xl text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-4">search</span>
                <p>Módulo de búsqueda de candidatos en desarrollo...</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
