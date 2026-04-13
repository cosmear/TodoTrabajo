"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/sidebars/AdminSidebar";

function approvalBadge(status: string) {
  if (status === "pending") {
    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  }

  return "bg-green-500/10 text-green-500 border border-green-500/20";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [openJobMenuId, setOpenJobMenuId] = useState<number | null>(null);
  const [menuDirection, setMenuDirection] = useState<"up" | "down">("down");
  const [jobMenuDirection, setJobMenuDirection] = useState<"up" | "down">("down");
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUserMenuToggle = (e: React.MouseEvent, userId: number) => {
    if (openMenuId === userId) { setOpenMenuId(null); return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuDirection(window.innerHeight - rect.bottom < 130 ? "up" : "down");
    setOpenMenuId(userId);
  };

  const handleJobMenuToggle = (e: React.MouseEvent, jobId: number) => {
    if (openJobMenuId === jobId) { setOpenJobMenuId(null); return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setJobMenuDirection(window.innerHeight - rect.bottom < 130 ? "up" : "down");
    setOpenJobMenuId(jobId);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpenMenuId(null);
    setOpenJobMenuId(null);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("tt_session");
    router.push("/");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const token = localStorage.getItem("tt_session");
      if (!token) {
        router.push("/");
        return;
      }

      const [statsRes, usersRes, jobsRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/jobs", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if ([statsRes, usersRes, jobsRes].some((response) => response.status === 403)) {
        setErrorMsg("Acceso denegado. No eres Administrador.");
        setLoading(false);
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const jobsData = await jobsRes.json();

      setStats(statsData.stats);
      setUsers(usersData.users || []);
      setJobs(jobsData.jobs || []);
    } catch (error) {
      console.error(error);
      if (!silent) setErrorMsg("Error de conexion");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateUserApproval = async (userId: number, approvalStatus: string) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, approval_status: approvalStatus } : u))
    );
    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, approval_status: approvalStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchData(true);
      showToast("No se pudo actualizar la aprobacion del perfil.");
    }
  };

  const toggleUserBan = async (userId: number, currentStatus: number) => {
    const nextStatus = !currentStatus;
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: nextStatus ? 1 : 0 } : u))
    );
    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, is_active: nextStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchData(true);
      showToast("No se pudo actualizar el estado del usuario.");
    }
  };

  const updateJobApproval = async (jobId: number, approvalStatus: string) => {
    // Optimistic update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, approval_status: approvalStatus } : j))
    );
    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jobId, approval_status: approvalStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchData(true);
      showToast("No se pudo actualizar la aprobacion de la oferta.");
    }
  };

  const toggleJobStatus = async (jobId: number, currentStatus: number) => {
    const nextStatus = !currentStatus;
    // Optimistic update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, is_active: nextStatus ? 1 : 0 } : j))
    );
    try {
      const token = localStorage.getItem("tt_session");
      const res = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jobId, is_active: nextStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchData(true);
      showToast("No se pudo actualizar la visibilidad de la oferta.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center text-primary">
        <span className="material-symbols-outlined animate-spin text-5xl">sync</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-surface-dark border border-red-500/20 p-8 rounded-2xl text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">
            gpp_bad
          </span>
          <h2 className="text-2xl font-bold text-white">{errorMsg}</h2>
          <button
            onClick={() => router.push("/")}
            className="mt-6 text-primary hover:underline font-bold"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-[#0f1618] pt-14 pb-20">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3.5 shadow-2xl text-sm font-bold ${
            toast.type === "error"
              ? "border-red-500/30 bg-slate-900 text-red-400"
              : "border-green-500/30 bg-slate-900 text-green-400"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          {toast.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start gap-8 px-4">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        <div className="flex-1">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold text-white mb-6">Vista general</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl">
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Candidatos
                  </p>
                  <p className="text-4xl font-extrabold text-white">{stats?.candidates || 0}</p>
                </div>
                <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl">
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Empresas
                  </p>
                  <p className="text-4xl font-extrabold text-white">{stats?.companies || 0}</p>
                </div>
                <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl">
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Puestos
                  </p>
                  <p className="text-4xl font-extrabold text-white">{stats?.jobs || 0}</p>
                </div>
                <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl">
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Postulaciones
                  </p>
                  <p className="text-4xl font-extrabold text-white">{stats?.applications || 0}</p>
                </div>
                <div className="bg-surface-dark border border-amber-500/20 p-6 rounded-2xl">
                  <p className="text-sm text-amber-400 font-bold uppercase tracking-wider">
                    Candidatos pendientes
                  </p>
                  <p className="text-4xl font-extrabold text-white">
                    {stats?.pendingCandidates || 0}
                  </p>
                </div>
                <div className="bg-surface-dark border border-amber-500/20 p-6 rounded-2xl">
                  <p className="text-sm text-amber-400 font-bold uppercase tracking-wider">
                    Puestos pendientes
                  </p>
                  <p className="text-4xl font-extrabold text-white">
                    {stats?.pendingJobs || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-6">
                Aprobacion de usuarios postulantes
              </h1>
              <div className="bg-surface-dark border border-slate-800 rounded-2xl shadow-lg">
                <div className="overflow-x-clip">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                    <tr>
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Aprobacion</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/20">
                        <td className="px-6 py-4 font-bold text-white">{user.nombre_completo}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4 capitalize">{user.tipo_cuenta}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${approvalBadge(
                              user.approval_status || "approved"
                            )}`}
                          >
                            {user.approval_status === "pending" ? "Pendiente" : "Aprobado"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.is_active ? (
                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/20">
                              Activo
                            </span>
                          ) : (
                            <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20">
                              Suspendido
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative flex justify-start">
                            {user.tipo_cuenta !== "admin" && (
                              <>
                                <button
                                  onClick={(e) => handleUserMenuToggle(e, user.id)}
                                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                                >
                                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                                {openMenuId === user.id && (
                                  <div className={`absolute right-0 z-20 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden ${menuDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"}`}>
                                    {user.tipo_cuenta === "candidato" && (
                                      <button
                                        onClick={() => {
                                          updateUserApproval(
                                            user.id,
                                            user.approval_status === "pending" ? "approved" : "pending"
                                          );
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-all"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-amber-400">
                                          {user.approval_status === "pending" ? "verified" : "hourglass_top"}
                                        </span>
                                        {user.approval_status === "pending" ? "Aprobar" : "Marcar pendiente"}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        toggleUserBan(user.id, user.is_active);
                                        setOpenMenuId(null);
                                      }}
                                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-all hover:bg-slate-800 ${
                                        user.is_active
                                          ? "text-red-400 hover:text-red-300"
                                          : "text-green-400 hover:text-green-300"
                                      }`}
                                    >
                                      <span className="material-symbols-outlined text-[16px]">
                                        {user.is_active ? "person_off" : "restart_alt"}
                                      </span>
                                      {user.is_active ? "Suspender" : "Reactivar"}
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-6">
                Aprobacion de puestos de trabajo
              </h1>
              <div className="bg-surface-dark border border-slate-800 rounded-2xl shadow-lg">
                <div className="overflow-x-clip">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                    <tr>
                      <th className="px-6 py-4">Posicion</th>
                      <th className="px-6 py-4">Empresa / Creador</th>
                      <th className="px-6 py-4">Aprobacion</th>
                      <th className="px-6 py-4">Estado publico</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-800/20">
                        <td className="px-6 py-4 font-bold text-white max-w-[220px] truncate">
                          {job.posicion}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-300">{job.empresa}</div>
                          <div className="text-[10px]">{job.publisher_email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${approvalBadge(
                              job.approval_status || "pending"
                            )}`}
                          >
                            {job.approval_status === "pending" ? "Pendiente" : "Aprobado"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {job.is_active ? (
                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/20">
                              Visible
                            </span>
                          ) : (
                            <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-xs font-bold border border-orange-500/20">
                              Oculto
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative flex justify-start">
                            <button
                              onClick={(e) => handleJobMenuToggle(e, job.id)}
                              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                            >
                              <span className="material-symbols-outlined text-[20px]">more_vert</span>
                            </button>
                            {openJobMenuId === job.id && (
                              <div className={`absolute right-0 z-20 w-52 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden ${jobMenuDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"}`}>
                                <button
                                  onClick={() => {
                                    updateJobApproval(
                                      job.id,
                                      job.approval_status === "pending" ? "approved" : "pending"
                                    );
                                    setOpenJobMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-all"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-amber-400">
                                    {job.approval_status === "pending" ? "verified" : "hourglass_top"}
                                  </span>
                                  {job.approval_status === "pending" ? "Aprobar" : "Marcar pendiente"}
                                </button>
                                <button
                                  onClick={() => {
                                    toggleJobStatus(job.id, job.is_active);
                                    setOpenJobMenuId(null);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-all hover:bg-slate-800 ${
                                    job.is_active
                                      ? "text-orange-400 hover:text-orange-300"
                                      : "text-green-400 hover:text-green-300"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    {job.is_active ? "visibility_off" : "visibility"}
                                  </span>
                                  {job.is_active ? "Ocultar" : "Restaurar"}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
