"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      if (!token) return router.push("/");

      // Parallel fetch
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/jobs", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (statsRes.status === 403 || usersRes.status === 403) {
        setErrorMsg("Acceso denegado. No eres Administrador.");
        setLoading(false);
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const jobsData = await jobsRes.json();

      setStats(statsData.stats);
      setUsers(usersData.users);
      setJobs(jobsData.jobs);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserBan = async (userId: number, currentStatus: number) => {
    try {
      const token = localStorage.getItem("tt_session");
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, is_active: !currentStatus })
      });
      fetchData(); // Refresh list
    } catch (error) {
       console.error(error);
    }
  };

  const toggleJobStatus = async (jobId: number, currentStatus: number) => {
    try {
      const token = localStorage.getItem("tt_session");
      await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jobId, is_active: !currentStatus })
      });
      fetchData();
    } catch (error) {
       console.error(error);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 flex justify-center items-center text-primary"><span className="material-symbols-outlined animate-spin text-5xl">sync</span></div>;
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="bg-surface-dark border border-red-500/20 p-8 rounded-2xl text-center">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">gpp_bad</span>
            <h2 className="text-2xl font-bold text-white">{errorMsg}</h2>
            <button onClick={() => router.push("/")} className="mt-6 text-primary hover:underline font-bold">Volver al Inicio</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-[#0f1618] pt-24 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        
        {/* Admin Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
           <div className="bg-surface-dark border border-slate-800 rounded-2xl p-6 shadow-2xl sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">admin_panel_settings</span> ADMIN
              </h2>
              <div className="space-y-2">
                 <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-[20px]">dashboard</span> Vista General
                 </button>
                 <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-[20px]">group</span> Control Usuarios
                 </button>
                 <button onClick={() => setActiveTab('jobs')} className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === 'jobs' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-[20px]">work</span> Control Empleos
                 </button>
              </div>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
           {activeTab === 'overview' && (
              <div className="space-y-6">
                 <h1 className="text-3xl font-extrabold text-white">Estadísticas Principales</h1>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center">
                       <span className="material-symbols-outlined text-4xl text-primary mb-2">person</span>
                       <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Candidatos</p>
                       <p className="text-4xl font-extrabold text-white">{stats?.candidates || 0}</p>
                    </div>
                    <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center">
                       <span className="material-symbols-outlined text-4xl text-[#5b83e8] mb-2">business</span>
                       <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Empresas</p>
                       <p className="text-4xl font-extrabold text-white">{stats?.companies || 0}</p>
                    </div>
                    <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center">
                       <span className="material-symbols-outlined text-4xl text-green-500 mb-2">work</span>
                       <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Empleos Pub.</p>
                       <p className="text-4xl font-extrabold text-white">{stats?.jobs || 0}</p>
                    </div>
                    <div className="bg-surface-dark border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center">
                       <span className="material-symbols-outlined text-4xl text-purple-500 mb-2">assignment_turned_in</span>
                       <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Postulaciones</p>
                       <p className="text-4xl font-extrabold text-white">{stats?.applications || 0}</p>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'users' && (
              <div>
                 <h1 className="text-3xl font-extrabold text-white mb-6">Lista de Usuarios</h1>
                 <div className="bg-surface-dark border border-slate-800 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                       <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                          <tr>
                             <th className="px-6 py-4">Usuario</th>
                             <th className="px-6 py-4">Email</th>
                             <th className="px-6 py-4">Tipo</th>
                             <th className="px-6 py-4">Estado</th>
                             <th className="px-6 py-4">Acción</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800">
                          {users.map((u) => (
                             <tr key={u.id} className="hover:bg-slate-800/20">
                                <td className="px-6 py-4 font-bold text-white">{u.nombre_completo}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4 capitalize">{u.tipo_cuenta}</td>
                                <td className="px-6 py-4">
                                   {u.is_active ? 
                                      <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/20">Activo</span> : 
                                      <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20">Suspendido</span>
                                   }
                                </td>
                                <td className="px-6 py-4">
                                   {u.tipo_cuenta !== 'admin' && (
                                     <button 
                                        onClick={() => toggleUserBan(u.id, u.is_active)}
                                        className={`px-3 py-1 rounded text-xs font-bold border transition ${u.is_active ? 'border-red-500/50 text-red-500 hover:bg-red-500/10' : 'border-green-500/50 text-green-500 hover:bg-green-500/10'}`}
                                     >
                                        {u.is_active ? 'Suspender' : 'Reactivar'}
                                     </button>
                                   )}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {activeTab === 'jobs' && (
              <div>
                 <h1 className="text-3xl font-extrabold text-white mb-6">Lista de Empleos</h1>
                 <div className="bg-surface-dark border border-slate-800 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                       <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                          <tr>
                             <th className="px-6 py-4">Posición</th>
                             <th className="px-6 py-4">Empresa / Creador</th>
                             <th className="px-6 py-4">Estado Publico</th>
                             <th className="px-6 py-4">Acción</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800">
                          {jobs.map((j) => (
                             <tr key={j.id} className="hover:bg-slate-800/20">
                                <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{j.posicion}</td>
                                <td className="px-6 py-4">
                                   <div className="font-bold text-slate-300">{j.empresa}</div>
                                   <div className="text-[10px]">{j.publisher_email}</div>
                                </td>
                                <td className="px-6 py-4">
                                   {j.is_active ? 
                                      <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/20">Visible</span> : 
                                      <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-xs font-bold border border-orange-500/20">Oculto (Baja)</span>
                                   }
                                </td>
                                <td className="px-6 py-4">
                                     <button 
                                        onClick={() => toggleJobStatus(j.id, j.is_active)}
                                        className={`px-3 py-1 rounded text-xs font-bold border transition hidden-mobile ${j.is_active ? 'border-orange-500/50 text-orange-500 hover:bg-orange-500/10' : 'border-green-500/50 text-green-500 hover:bg-green-500/10'}`}
                                     >
                                        {j.is_active ? 'Ocultar Oferta' : 'Restaurar'}
                                     </button>
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
