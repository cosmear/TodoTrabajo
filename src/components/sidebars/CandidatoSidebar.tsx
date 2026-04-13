"use client";

type CandidatoSidebarProps = {
  user: {
    nombre_completo?: string;
    tipo_cuenta?: string;
    approval_status?: string;
    ciudad?: string;
    pais?: string;
    descripcion?: string;
    [key: string]: any;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEditProfile: () => void;
  onLogout: () => void;
  wpUrl: string;
};

export default function CandidatoSidebar({
  user,
  activeTab,
  onTabChange,
  onEditProfile,
  onLogout,
  wpUrl,
}: CandidatoSidebarProps) {
  const tabClass = (tab: string) =>
    `w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${
      activeTab === tab
        ? "bg-primary/10 text-primary"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-surface-dark border border-slate-800 rounded-2xl p-6 sticky top-10 shadow-2xl">
        {/* Avatar + info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary shrink-0 rounded-full flex items-center justify-center text-background-dark text-xl font-bold shadow-[0_0_15px_rgba(19,200,236,0.3)]">
            {user?.nombre_completo?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-white font-bold truncate">{user?.nombre_completo}</h2>
            <p className="text-slate-400 text-xs truncate capitalize mb-1">{user?.tipo_cuenta}</p>
            <span
              className={`inline-flex px-2 py-1 rounded text-[10px] font-bold border ${
                user?.approval_status === "pending"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-green-500/10 text-green-500 border-green-500/20"
              }`}
            >
              {user?.approval_status === "pending" ? "Pendiente de aprobacion" : "Aprobado"}
            </span>
            {user?.ciudad && user?.pais && (
              <p className="text-slate-500 text-[10px] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[12px]">location_on</span>
                {user.ciudad}, {user.pais}
              </p>
            )}
          </div>
        </div>

        {/* Descripción */}
        {user?.descripcion && (
          <div className="mb-4 text-xs text-slate-400 border-l-2 border-slate-700 pl-3">
            <p className="line-clamp-3 italic">&ldquo;{user.descripcion}&rdquo;</p>
          </div>
        )}

        {/* Editar perfil */}
        <button
          onClick={onEditProfile}
          className="w-full mb-6 border border-slate-700 text-slate-300 hover:bg-slate-800 py-1.5 rounded-lg text-xs font-bold transition-all"
        >
          Editar Perfil
        </button>

        {/* Navegación */}
        <div className="space-y-2">
          <button onClick={() => onTabChange("inicio")} className={tabClass("inicio")}>
            <span className="material-symbols-outlined text-[20px]">person</span> Inicio
          </button>
          <button onClick={() => onTabChange("notificaciones")} className={tabClass("notificaciones")}>
            <span className="material-symbols-outlined text-[20px]">notifications</span> Notificaciones
          </button>
          <button onClick={() => onTabChange("suscripcion")} className={tabClass("suscripcion")}>
            <span className="material-symbols-outlined text-[20px]">card_membership</span> Suscripción
          </button>
          <a
            href={wpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span> Asistencia
          </a>
          <button onClick={() => onTabChange("cambiar_contrasena")} className={tabClass("cambiar_contrasena")}>
            <span className="material-symbols-outlined text-[20px]">lock</span> Cambiar Contraseña
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-red-500/80 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
