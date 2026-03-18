"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PerfilEmpresa() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [applying, setApplying] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/empresas/${id}`);
        const parsedData = await res.json();
        if (parsedData.success) {
          setData(parsedData);
        } else {
          setErrorMsg(parsedData.error);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Error de red");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  const handleApply = async (jobId: number) => {
    const token = localStorage.getItem("tt_session");
    if (!token) {
      alert("Debes iniciar sesión como candidato para aplicar a un trabajo");
      document.getElementById("login-modal")?.classList.remove("hidden");
      return;
    }

    setApplying(jobId);
    try {
      const res = await fetch("/api/postulaciones/aplicar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });
      const result = await res.json();

      if (result.success) {
        alert("¡Aplicación enviada con éxito! Puedes verla en Mi Perfil");
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Ocurrió un error en el servidor");
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
     return <div className="min-h-screen pt-20 flex justify-center items-center text-primary"><span className="material-symbols-outlined animate-spin text-5xl">sync</span></div>;
  }

  if (errorMsg || !data) {
     return (
       <div className="min-h-screen pt-40 px-6 text-center text-white flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">business_off</span>
          <h1 className="text-3xl font-bold mb-4">Empresa no encontrada</h1>
          <p className="text-slate-400 mb-8">{errorMsg}</p>
          <button onClick={() => router.push("/buscar-empleo")} className="bg-primary/20 text-primary hover:bg-primary/30 font-bold py-3 px-8 rounded-xl transition-all">Ver otros empleos</button>
       </div>
     );
  }

  const { company, jobs } = data;

  return (
    <div className="min-h-screen bg-[#0f1618] pt-24 pb-20">
       {/* Hero Cover */}
       <div className="bg-surface-dark border-b border-slate-800">
           <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-3xl flex items-center justify-center text-background-dark font-extrabold text-4xl shadow-[0_0_30px_rgba(19,200,236,0.2)]">
                 {company.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                 <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{company.nombre}</h1>
                 <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                    {company.ciudad && company.pais && (
                       <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_on</span> {company.ciudad}, {company.pais}</span>
                    )}
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">mail</span> {company.email}</span>
                 </div>
              </div>
           </div>
       </div>

       <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
          
          {/* About Section */}
          <div className="md:w-1/3 space-y-8">
             <div className="bg-surface-dark rounded-2xl p-6 border border-slate-800">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary">info</span> Sobre la Empresa
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                   {company.descripcion || "Esta empresa no ha añadido una descripción."}
                </p>
             </div>
             
             {company.direccion && (
                <div className="bg-surface-dark rounded-2xl p-6 border border-slate-800">
                   <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">map</span> Ubicación
                   </h3>
                   <p className="text-slate-400 text-sm">{company.direccion}</p>
                   <p className="text-slate-500 text-xs mt-1">{company.ciudad}, {company.provincia}</p>
                </div>
             )}
          </div>

          {/* Jobs List */}
          <div className="flex-1 space-y-6">
             <h2 className="text-2xl font-extrabold text-white mb-6">Empleos Activos ({jobs.length})</h2>
             
             {jobs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                   Esta empresa no tiene ofertas de empleo activas en este momento.
                </div>
             ) : (
                jobs.map((job: any) => (
                   <div key={job.id} className="bg-surface-dark p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary/50 transition-colors shadow-lg">
                      <div>
                         <h3 className="text-xl font-bold text-white mb-2">{job.posicion}</h3>
                         <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                               <span className="material-symbols-outlined text-[14px]">location_on</span>
                               {job.provincia}, {job.pais}
                            </span>
                            <span className="flex items-center gap-1.5">
                               <span className="material-symbols-outlined text-[14px]">schedule</span>
                               {job.disponibilidad}
                            </span>
                         </div>
                      </div>
                      <button 
                         onClick={() => handleApply(job.id)}
                         disabled={applying === job.id}
                         className={`text-sm font-bold py-2.5 px-6 rounded-lg transition-all border w-full md:w-auto ${applying === job.id ? 'bg-primary border-primary text-background-dark opacity-50 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-background-dark'}`}
                      >
                         {applying === job.id ? "Enviando..." : "Postularme"}
                      </button>
                   </div>
                ))
             )}
          </div>
       </div>
    </div>
  );
}
