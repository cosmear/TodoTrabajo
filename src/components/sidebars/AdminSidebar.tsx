"use client";

type AdminSidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
};

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
}: AdminSidebarProps) {
  const tabClass = (tab: string) =>
    `w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${
      activeTab === tab
        ? "bg-primary/10 text-primary"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-surface-dark border border-slate-800 rounded-2xl p-6 shadow-2xl sticky top-28">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            admin_panel_settings
          </span>
          ADMIN
        </h2>

        <div className="space-y-2">
          <button onClick={() => onTabChange("overview")} className={tabClass("overview")}>
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Vista General
          </button>
          <button onClick={() => onTabChange("users")} className={tabClass("users")}>
            <span className="material-symbols-outlined text-[20px]">group</span>
            Aprobar Usuarios
          </button>
          <button onClick={() => onTabChange("jobs")} className={tabClass("jobs")}>
            <span className="material-symbols-outlined text-[20px]">work</span>
            Aprobar Puestos
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-red-500/80 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
