"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

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
      setErrorMsg("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  const updateUserApproval = async (userId: number, approvalStatus: string) => {
    try {
      const token = localStorage.getItem("tt_session");
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, approval_status: approvalStatus }),
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleUserBan = async (userId: number, currentStatus: number) => {
    try {
      const token = localStorage.getItem("tt_session");
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, is_active: !currentStatus }),
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateJobApproval = async (jobId: number, approvalStatus: string) => {
    try {
      const token = localStorage.getItem("tt_session");
      await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, approval_status: approvalStatus }),
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleJobStatus = async (jobId: number, currentStatus: number) => {
    try {
      const token = localStorage.getItem("tt_session");
      await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, is_active: !currentStatus }),
      });
      fetchData();
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-[#0f1618] pt-24 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface-dark border border-slate-800 rounded-2xl p-6 shadow-2xl sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                admin_panel_settings
              </span>
              ADMIN
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${
                  activeTab === "overview"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Vista General
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${
                  activeTab === "users"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">group</span>
                Aprobar Usuarios
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${
                  activeTab === "jobs"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">work</span>
                Aprobar Puestos
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold text-white">Vista general</h1>
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
              <div className="bg-surface-dark border border-slate-800 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
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
                          <div className="flex flex-wrap gap-2">
                            {user.tipo_cuenta === "candidato" && (
                              <button
                                onClick={() =>
                                  updateUserApproval(
                                    user.id,
                                    user.approval_status === "pending" ? "approved" : "pending"
                                  )
                                }
                                className={`px-3 py-1 rounded text-xs font-bold border transition ${
                                  user.approval_status === "pending"
                                    ? "border-green-500/50 text-green-500 hover:bg-green-500/10"
                                    : "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                                }`}
                              >
                                {user.approval_status === "pending"
                                  ? "Aprobar"
                                  : "Marcar pendiente"}
                              </button>
                            )}
                            {user.tipo_cuenta !== "admin" && (
                              <button
                                onClick={() => toggleUserBan(user.id, user.is_active)}
                                className={`px-3 py-1 rounded text-xs font-bold border transition ${
                                  user.is_active
                                    ? "border-red-500/50 text-red-500 hover:bg-red-500/10"
                                    : "border-green-500/50 text-green-500 hover:bg-green-500/10"
                                }`}
                              >
                                {user.is_active ? "Suspender" : "Reactivar"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-6">
                Aprobacion de puestos de trabajo
              </h1>
              <div className="bg-surface-dark border border-slate-800 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
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
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                updateJobApproval(
                                  job.id,
                                  job.approval_status === "pending" ? "approved" : "pending"
                                )
                              }
                              className={`px-3 py-1 rounded text-xs font-bold border transition ${
                                job.approval_status === "pending"
                                  ? "border-green-500/50 text-green-500 hover:bg-green-500/10"
                                  : "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                              }`}
                            >
                              {job.approval_status === "pending"
                                ? "Aprobar"
                                : "Marcar pendiente"}
                            </button>
                            <button
                              onClick={() => toggleJobStatus(job.id, job.is_active)}
                              className={`px-3 py-1 rounded text-xs font-bold border transition ${
                                job.is_active
                                  ? "border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                                  : "border-green-500/50 text-green-500 hover:bg-green-500/10"
                              }`}
                            >
                              {job.is_active ? "Ocultar" : "Restaurar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
