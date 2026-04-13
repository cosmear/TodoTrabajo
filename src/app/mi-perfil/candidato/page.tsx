"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CandidatoSidebar from "@/components/sidebars/CandidatoSidebar";

export default function MiPerfilCandidato() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("inicio");

  // Edit Profile State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [editSaving, setEditSaving] = useState(false);

  // CV Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("tt_session");
      if (!token) { router.push("/"); return; }
      const res = await fetch("/api/perfil", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setProfile(data);
      } else {
        setErrorMsg(data.error || "Error cargando el perfil.");
        if (data.status === 401) { localStorage.removeItem("tt_session"); router.push("/"); }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Problema de red al cargar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleLogout = () => { localStorage.removeItem("tt_session"); window.location.href = "/"; };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/perfil/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      if (res.ok) { setShowEditModal(false); fetchProfile(); }
      else { alert("Error al guardar perfil"); }
    } catch (err) { console.error(err); }
    finally { setEditSaving(false); }
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) { alert("CV Subido exitosamente"); fetchProfile(); }
      else { alert(data.error || "Error al subir CV"); }
    } catch { alert("Error de conexión al subir CV"); }
    finally { setUploadingCv(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden."); return;
    }
    setPasswordSaving(true); setPasswordError(""); setPasswordSuccess("");
    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess("¡Contraseña actualizada exitosamente!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else { setPasswordError(data.error || "No se pudo cambiar la contraseña."); }
    } catch { setPasswordError("Error de red al conectar."); }
    finally { setPasswordSaving(false); }
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
          <button onClick={() => router.push("/")} className="w-full bg-primary text-background-dark font-bold py-3 rounded-xl hover:bg-primary/90">Volver al Home</button>
        </div>
      </div>
    );
  }

  const wpMessage = `Hola, acabo de presionar el botón de asistencia en la web-app de todo trabajo. mi nombre es: "${profile?.user?.nombre_completo || ''}", tengo perfil de: "candidato" y quiero asistencia con: `;
  const wpUrl = `https://wa.me/5491166554414?text=${encodeURIComponent(wpMessage)}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-background-dark to-[#0f1618] pt-10 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4">

        <CandidatoSidebar
          user={profile.user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEditProfile={() => { setEditData({ ...profile.user }); setShowEditModal(true); }}
          onLogout={handleLogout}
          wpUrl={wpUrl}
        />

        <div className="flex-1">

          {/* TAB: MIS POSTULACIONES */}
          {activeTab === "inicio" && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-3xl font-extrabold text-white">Mis Postulaciones</h1>
                <div className="flex items-center gap-3">
                  {profile.user?.cv_url && (
                    <a href={profile.user.cv_url} target="_blank" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">visibility</span> Ver Mi CV
                    </a>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleCvUpload} className="hidden" accept=".pdf,.doc,.docx" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingCv} className="bg-surface-dark border border-slate-700 hover:border-primary/50 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    {uploadingCv ? "Subiendo..." : "Subir CV (PDF/Word)"}
                  </button>
                  <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold py-2.5 px-4 rounded-lg transition-all border border-red-500/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              </div>

              {profile.user?.approval_status === "pending" && (
                <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl p-5">
                  Tu cuenta candidata esta pendiente de aprobacion del administrador. Mientras tanto puedes completar tu perfil, pero no podras postularte hasta que quede aprobada.
                </div>
              )}

              {profile.applications?.length === 0 ? (
                <div className="bg-surface-dark border border-slate-800 p-10 rounded-2xl text-center text-slate-500">
                  No tienes ninguna postulación activa por el momento.<br /><br />
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
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-bold shrink-0">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        {app.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: NOTIFICACIONES */}
          {activeTab === "notificaciones" && (
            <div className="bg-surface-dark border border-slate-800 p-10 rounded-2xl text-center text-slate-500 mt-4 md:mt-10">
              <span className="material-symbols-outlined text-4xl mb-4">notifications</span>
              <p>Módulo de notificaciones en desarrollo...</p>
            </div>
          )}

          {/* TAB: SUSCRIPCIÓN */}
          {activeTab === "suscripcion" && (
            <div className="bg-surface-dark border border-slate-800 p-10 rounded-2xl text-center text-slate-500 mt-4 md:mt-10">
              <span className="material-symbols-outlined text-4xl mb-4">card_membership</span>
              <p>Módulo de suscripción en desarrollo...</p>
            </div>
          )}

          {/* TAB: CAMBIAR CONTRASEÑA */}
          {activeTab === "cambiar_contrasena" && (
            <div className="max-w-md mx-auto pt-2 md:pt-6">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-extrabold text-white">Cambiar Contraseña</h1>
                <p className="text-slate-400 mt-2 text-xs font-medium">Usa tu contraseña actual para verificar y actualizarla.</p>
              </div>
              <div className="bg-surface-dark border border-slate-800 p-6 rounded-xl shadow-xl">
                <form onSubmit={submitChangePassword} className="space-y-4">
                  {passwordError && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center font-bold">{passwordError}</div>}
                  {passwordSuccess && <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg text-sm text-center font-bold">{passwordSuccess}</div>}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Contraseña Actual *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">key</span>
                      <input required type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full bg-background-dark border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 text-sm" placeholder="Escribe tu contraseña actual" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Nueva Contraseña *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">lock_reset</span>
                      <input minLength={6} required type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full bg-background-dark border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 text-sm" placeholder="Mínimo 6 caracteres" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Repetir Nueva Contraseña *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">lock</span>
                      <input minLength={6} required type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full bg-background-dark border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 text-sm" placeholder="Repite la nueva contraseña" />
                    </div>
                  </div>
                  <button type="submit" disabled={passwordSaving} className={`w-full mt-4 bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(19,200,236,0.3)] text-background-dark font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${passwordSaving ? "opacity-75 cursor-not-allowed" : ""}`}>
                    {passwordSaving ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : "Guardar Nueva Contraseña"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-surface-dark rounded-2xl border border-slate-800 shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 custom-scrollbar">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-1 rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Editar mi Información</h3>
            <form onSubmit={submitEditProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-1">Nombre Completo</label>
                  <input required type="text" name="nombre_completo" value={editData.nombre_completo || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-1">Sobre Mí (Descripción)</label>
                  <textarea required name="descripcion" rows={3} value={editData.descripcion || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Fecha de Nacimiento</label>
                  <input type="date" name="fecha_nacimiento" value={editData.fecha_nacimiento ? new Date(editData.fecha_nacimiento).toISOString().split("T")[0] : ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none scheme-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Teléfono (Ej: +54911223344)</label>
                  <input type="tel" name="telefono" value={editData.telefono || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">País</label>
                  <input type="text" name="pais" value={editData.pais || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Provincia/Estado</label>
                  <input type="text" name="provincia" value={editData.provincia || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Ciudad</label>
                  <input type="text" name="ciudad" value={editData.ciudad || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Dirección</label>
                  <input type="text" name="direccion" value={editData.direccion || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-1">Áreas de Interés</label>
                  <input type="text" name="areas_interes" value={editData.areas_interes || ""} onChange={handleEditChange} placeholder="Ej: Tecnología, Marketing, Ventas" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Disponibilidad</label>
                  <select name="disponibilidad" value={editData.disponibilidad || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Remuneración Pretendida (USD)</label>
                  <input type="number" name="remuneracion_pretendida" value={editData.remuneracion_pretendida || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div className="md:col-span-2 mt-4"><h4 className="text-white font-bold border-b border-slate-800 pb-2">Redes y Portafolio</h4></div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedin" value={editData.linkedin || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Twitter URL</label>
                  <input type="url" name="twitter" value={editData.twitter || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Instagram URL</label>
                  <input type="url" name="instagram" value={editData.instagram || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">TikTok / Portafolio</label>
                  <input type="url" name="tiktok" value={editData.tiktok || ""} onChange={handleEditChange} className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="sticky bottom-0 bg-surface-dark pt-4 border-t border-slate-800 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 font-bold text-slate-300 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={editSaving} className="bg-primary text-background-dark font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(19,200,236,0.3)]">
                  {editSaving ? <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span> Guardando</> : <><span className="material-symbols-outlined text-[20px]">save</span> Guardar Cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
