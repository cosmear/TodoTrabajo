"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MiPerfil() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("inicio");

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ nombre_completo: "", telefono: "" });
  const [editSaving, setEditSaving] = useState(false);

  // CV Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("tt_session");
      if (!token) {
        router.push("/");
        return;
      }
      const res = await fetch("/api/perfil", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data);
        if (!activeTab || activeTab === "inicio") {
           setActiveTab(data.user?.tipo_cuenta === 'empresa' ? 'empresa' : 'inicio');
        }
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

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("tt_session");
    window.location.href = "/";
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/perfil/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchProfile();
      } else {
        alert("Error al guardar perfil");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditSaving(false);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    const formData = new FormData();
    formData.append("cv", file);

    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/upload-cv", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert("CV Subido exitosamente");
        fetchProfile();
      } else {
        alert(data.error || "Error al subir CV");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al subir CV");
    } finally {
      setUploadingCv(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-primary flex-shrink-0 rounded-full flex items-center justify-center text-background-dark text-xl font-bold shadow-[0_0_15px_rgba(19,200,236,0.3)]">
                    {profile.user?.nombre_completo?.charAt(0).toUpperCase()}
                 </div>
                 <div className="overflow-hidden">
                    <h2 className="text-white font-bold truncate">{profile.user?.nombre_completo}</h2>
                    <p className="text-slate-400 text-xs truncate capitalize mb-1">{profile.user?.tipo_cuenta}</p>
                    {profile.user?.ciudad && profile.user?.pais && (
                       <p className="text-slate-500 text-[10px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          {profile.user.ciudad}, {profile.user.pais}
                       </p>
                    )}
                 </div>
              </div>
              
              {profile.user?.descripcion && (
                 <div className="mb-4 text-xs text-slate-400 border-l-2 border-slate-700 pl-3">
                    <p className="line-clamp-3 italic">"{profile.user.descripcion}"</p>
                 </div>
              )}
              
              <button 
                onClick={() => {
                  setEditData({ ...profile.user });
                  setShowEditModal(true);
                }} 
                className="w-full mb-6 border border-slate-700 text-slate-300 hover:bg-slate-800 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Editar Perfil
              </button>

              <div className="space-y-2">
                 {profile.user?.tipo_cuenta === "candidato" ? (
                    <>
                       <button onClick={() => setActiveTab('inicio')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'inicio' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                          <span className="material-symbols-outlined text-[20px]">person</span> Inicio
                       </button>
                       <button onClick={() => setActiveTab('asistencia')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'asistencia' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                          <span className="material-symbols-outlined text-[20px]">support_agent</span> Asistencia
                       </button>
                    </>
                 ) : (
                    <>
                       <button onClick={() => setActiveTab('empresa')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'empresa' ? 'bg-[#3b5acc]/20 text-[#5b83e8]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                          <span className="material-symbols-outlined text-[20px]">business_center</span> Empresa
                       </button>
                       <button onClick={() => setActiveTab('buscar_candidatos')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'buscar_candidatos' ? 'bg-[#3b5acc]/20 text-[#5b83e8]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                          <span className="material-symbols-outlined text-[20px]">search</span> Buscar Candidatos
                       </button>
                    </>
                 )}
                 <button className="w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-slate-400 hover:bg-slate-800 hover:text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">lock</span> Cambiar Contraseña
                 </button>
                 <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-red-500/80 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">logout</span> Salir
                 </button>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* TAB: CANDIDATO - INICIO */}
          {activeTab === 'inicio' && profile.user?.tipo_cuenta === 'candidato' && (
             <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                   <h1 className="text-3xl font-extrabold text-white">Mis Postulaciones</h1>
                   
                   {/* Botón subir CV */}
                   <div className="flex items-center gap-3">
                      {profile.user?.cv_url && (
                        <a href={profile.user.cv_url} target="_blank" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                           <span className="material-symbols-outlined text-[16px]">visibility</span> Ver Mi CV
                        </a>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleCvUpload} className="hidden" accept=".pdf,.doc,.docx" />
                      <button onClick={() => fileInputRef.current?.click()} disabled={uploadingCv} className="bg-surface-dark border border-slate-700 hover:border-primary/50 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-2">
                         <span className="material-symbols-outlined text-[18px]">upload_file</span>
                         {uploadingCv ? 'Subiendo...' : 'Subir CV (PDF/Word)'}
                      </button>
                   </div>
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
                                     <div key={app.application_id} className="p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                                        
                                        <div className="flex items-center gap-4">
                                           <div className="w-10 h-10 bg-slate-700 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold">
                                              {app.nombre_completo.charAt(0).toUpperCase()}
                                           </div>
                                           <div>
                                              <p className="font-bold text-slate-200 text-sm">{app.nombre_completo}</p>
                                              <p className="text-slate-500 text-xs mb-1">{app.email}</p>
                                              
                                              {/* Actions for Company to contact Candidate */}
                                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                                 <a href={`mailto:${app.email}`} className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]">mail</span> Email
                                                 </a>
                                                 
                                                 {app.telefono && (
                                                    <a href={`https://wa.me/${app.telefono.replace(/\D/g,'')}?text=Hola ${app.nombre_completo}, te contactamos por tu postulacion a ${job.posicion} en TodoTrabajo.`} target="_blank" rel="noreferrer" className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                                       <span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp
                                                    </a>
                                                 )}

                                                 {app.cv_url && (
                                                    <a href={app.cv_url} target="_blank" rel="noreferrer" className="bg-[#5b83e8]/10 hover:bg-[#5b83e8]/20 border border-[#5b83e8]/20 text-[#5b83e8] text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                                       <span className="material-symbols-outlined text-[14px]">description</span> CV
                                                    </a>
                                                 )}
                                              </div>
                                           </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
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

      {/* Edit Profile Modal */}
      {showEditModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
            <div className="relative bg-surface-dark rounded-2xl border border-slate-800 shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 custom-scrollbar">
               <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-1 rounded-full">
                  <span className="material-symbols-outlined">close</span>
               </button>
               <h3 className="text-2xl font-bold text-white mb-6">Editar mi Información</h3>
               
               <form onSubmit={submitEditProfile} className="space-y-6">
                  {profile.user?.tipo_cuenta === 'candidato' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                           <label className="block text-sm text-slate-400 mb-1">Nombre Completo</label>
                           <input required type="text" name="nombre_completo" value={editData.nombre_completo || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm text-slate-400 mb-1">Sobre Mí (Descripción)</label>
                           <textarea required name="descripcion" rows={3} value={(editData as any).descripcion || ''} onChange={handleEditChange as any} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none resize-none"></textarea>
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Fecha de Nacimiento</label>
                           <input type="date" name="fecha_nacimiento" value={(editData as any).fecha_nacimiento ? new Date((editData as any).fecha_nacimiento).toISOString().split('T')[0] : ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none [color-scheme:dark]" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Teléfono (Ej: +54911223344)</label>
                           <input type="tel" name="telefono" value={editData.telefono || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        
                        {/* Ubicacion */}
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">País</label>
                           <input type="text" name="pais" value={(editData as any).pais || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Provincia/Estado</label>
                           <input type="text" name="provincia" value={(editData as any).provincia || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Ciudad</label>
                           <input type="text" name="ciudad" value={(editData as any).ciudad || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Dirección</label>
                           <input type="text" name="direccion" value={(editData as any).direccion || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>

                        {/* Profesional */}
                        <div className="md:col-span-2">
                           <label className="block text-sm text-slate-400 mb-1">Áreas de Interés</label>
                           <input type="text" name="areas_interes" value={(editData as any).areas_interes || ''} onChange={handleEditChange} placeholder="Ej: Tecnología, Marketing, Ventas" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Disponibilidad</label>
                           <select name="disponibilidad" value={(editData as any).disponibilidad || ''} onChange={handleEditChange as any} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none">
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Freelance">Freelance</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Remuneración Pretendida (USD)</label>
                           <input type="number" name="remuneracion_pretendida" value={(editData as any).remuneracion_pretendida || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>

                        {/* Redes */}
                        <div className="md:col-span-2 mt-4"><h4 className="text-white font-bold border-b border-slate-800 pb-2">Redes y Portafolio</h4></div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">LinkedIn URL</label>
                           <input type="url" name="linkedin" value={(editData as any).linkedin || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Twitter URL</label>
                           <input type="url" name="twitter" value={(editData as any).twitter || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Instagram URL</label>
                           <input type="url" name="instagram" value={(editData as any).instagram || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">TikTok / Portafolio</label>
                           <input type="url" name="tiktok" value={(editData as any).tiktok || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                     </div>
                  )}

                  {profile.user?.tipo_cuenta === 'empresa' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                           <label className="block text-sm text-slate-400 mb-1">Nombre de la Empresa</label>
                           <input required type="text" name="nombre" value={(editData as any).nombre || editData.nombre_completo || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm text-slate-400 mb-1">Email de Contacto Público</label>
                           <input required type="email" name="email" value={(editData as any).email || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm text-slate-400 mb-1">Descripción de la Empresa</label>
                           <textarea required name="descripcion" rows={4} value={(editData as any).descripcion || ''} onChange={handleEditChange as any} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none resize-none"></textarea>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-sm text-slate-400 mb-1">Teléfono (Ej: +54911223344)</label>
                           <input type="tel" name="telefono" value={editData.telefono || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        
                        {/* Ubicacion */}
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">País</label>
                           <input type="text" name="pais" value={(editData as any).pais || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Provincia/Estado</label>
                           <input type="text" name="provincia" value={(editData as any).provincia || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Ciudad</label>
                           <input type="text" name="ciudad" value={(editData as any).ciudad || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                           <label className="block text-sm text-slate-400 mb-1">Dirección Exacta</label>
                           <input type="text" name="direccion" value={(editData as any).direccion || ''} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                        </div>
                     </div>
                  )}

                  <div className="sticky bottom-0 bg-surface-dark pt-4 border-t border-slate-800 flex justify-end gap-3 mt-6">
                     <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 font-bold text-slate-300 hover:text-white transition-colors">Cancelar</button>
                     <button type="submit" disabled={editSaving} className="bg-primary text-background-dark font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(19,200,236,0.3)]">
                        {editSaving ? (
                           <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span> Guardando</>
                        ) : (
                           <><span className="material-symbols-outlined text-[20px]">save</span> Guardar Cambios</>
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
