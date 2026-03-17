"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  nombre_completo: string;
  email: string;
  tipo_cuenta: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("tt_session");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.tipoCuenta !== "admin") {
        router.push("/");
        return;
      }
      setIsAdmin(true);
      fetchUsers(token);
    } catch (e) {
      router.push("/");
    }
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setErrorMsg(data.error || "Error al cargar usuarios");
      }
    } catch (err) {
      setErrorMsg("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.")) return;
    
    const token = localStorage.getItem("tt_session");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(data.error || "Error al eliminar usuario");
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-[#0f1618] pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-surface-dark border border-slate-800 p-8 rounded-2xl shadow-2xl gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
            </div>
            <p className="text-slate-400">Gestiona los usuarios y las publicaciones del sistema.</p>
          </div>
          <Link
            href="/crear-postulacion"
            className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(19,200,236,0.3)] flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Crear Publicación de Empleo
          </Link>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="bg-surface-dark border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Usuarios Registrados ({users.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Cargando usuarios...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No hay usuarios registrados.</div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Nombre Completo</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Tipo de Cuenta</th>
                    <th className="px-6 py-4 font-medium">Fecha de Registro</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">#{user.id}</td>
                      <td className="px-6 py-4 font-medium text-white">{user.nombre_completo}</td>
                      <td className="px-6 py-4 text-slate-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          user.tipo_cuenta === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                          user.tipo_cuenta === 'empresa' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                          'bg-primary/10 border-primary/20 text-primary'
                        }`}>
                          {user.tipo_cuenta}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 inline-flex"
                          title="Eliminar usuario"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          Cerrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
