"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BuscarEmpleo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState<number | null>(null);

  const [modalities, setModalities] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("keyword", searchTerm);
      if (locationTerm) params.append("location", locationTerm);
      if (category) params.append("category", category);
      if (modalities.length > 0) params.append("modalities", modalities.join(","));

      const res = await fetch(`/api/postulaciones?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.postulaciones);
      }
    } catch (error) {
      console.error("Error cargando postulaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, modalities]);

  const handleSearchSubmit = () => {
    fetchJobs();
  };

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
      const data = await res.json();

      if (data.success) {
        alert("¡Aplicación enviada con éxito! Puedes verla en Mi Perfil");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Ocurrió un error en el servidor");
    } finally {
      setApplying(null);
    }
  };

  const toggleModality = (mod: string) => {
     setModalities(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]);
  };

  return (
    <>
      {/* Hero / Search Section */}
      <section className="pt-40 pb-20 bg-linear-to-b from-background-dark to-[#0f1618]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Encontrá tu próximo <span className="text-primary">desafío</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Especialistas en mandos medios, personal de maestranza y
            administrativos en toda la Argentina.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-surface-dark p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 bg-background-dark rounded-xl border border-slate-700">
              <span className="material-symbols-outlined text-slate-500">search</span>
              <input
                type="text"
                placeholder="Puesto, empresa o palabra clave"
                className="bg-transparent border-none text-white w-full py-3 focus:ring-0 placeholder:text-slate-600 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-64 flex items-center gap-3 px-4 bg-background-dark rounded-xl border border-slate-700">
              <span className="material-symbols-outlined text-slate-500">
                location_on
              </span>
              <input
                type="text"
                placeholder="Ubicación"
                className="bg-transparent border-none text-white w-full py-3 focus:ring-0 placeholder:text-slate-600 outline-none"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
              />
            </div>
            <button onClick={handleSearchSubmit} className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-8 rounded-xl transition-all">
              BUSCAR
            </button>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 bg-[#0f1618]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="text-white font-bold mb-4">Tipo de Trabajo</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalities.includes("Full-time")}
                    onChange={() => toggleModality("Full-time")}
                    className="w-4 h-4 rounded border-slate-700 bg-surface-dark text-primary focus:ring-primary"
                  />
                  Full-time
                </label>
                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalities.includes("Part-time")}
                    onChange={() => toggleModality("Part-time")}
                    className="w-4 h-4 rounded border-slate-700 bg-surface-dark text-primary focus:ring-primary"
                  />
                  Part-time
                </label>
                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalities.includes("Freelance")}
                    onChange={() => toggleModality("Freelance")}
                    className="w-4 h-4 rounded border-slate-700 bg-surface-dark text-primary focus:ring-primary"
                  />
                  Freelance
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Categoría</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === ""}
                    onChange={() => setCategory("")}
                    className="w-4 h-4 border-slate-700 text-primary focus:ring-primary bg-surface-dark"
                  />
                  Todas
                </label>
                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === "Administrativo"}
                    onChange={() => setCategory("Administrativo")}
                    className="w-4 h-4 border-slate-700 text-primary focus:ring-primary bg-surface-dark"
                  />
                  Administrativo
                </label>
                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === "Maestranza"}
                    onChange={() => setCategory("Maestranza")}
                    className="w-4 h-4 border-slate-700 text-primary focus:ring-primary bg-surface-dark"
                  />
                  Maestranza
                </label>
                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === "Tecnología"}
                    onChange={() => setCategory("Tecnología")}
                    className="w-4 h-4 border-slate-700 text-primary focus:ring-primary bg-surface-dark"
                  />
                  Tecnología
                </label>
              </div>
            </div>
          </aside>

          {/* Jobs Grid */}
          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="text-center py-12 text-slate-500">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">sync</span>
                <p>Cargando posiciones laborales...</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="job-card bg-surface-dark p-6 rounded-2xl border border-slate-800 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_10px_30px_-10px_rgba(19,200,236,0.2)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-background-dark rounded-xl flex items-center justify-center shrink-0 text-primary border border-slate-700">
                      <span className="material-symbols-outlined text-3xl">
                        work
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {job.posicion}
                      </h3>
                      <Link href={`/empresas/${job.user_id}`} className="inline-block text-primary font-bold text-sm mb-2 hover:underline">
                        {job.empresa}
                      </Link>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            location_on
                          </span>
                          {job.provincia}, {job.pais}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>
                          {job.disponibilidad}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            payments
                          </span>
                          A convenir
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApply(job.id)}
                    disabled={applying === job.id}
                    className={`bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg transition-all text-sm w-full md:w-auto ${
                      applying === job.id ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-background-dark"
                    }`}
                  >
                    {applying === job.id ? "Enviando..." : "Aplicar"}
                  </button>
                </div>
              ))
            )}
            {jobs.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No se encontraron empleos que coincidan con tu búsqueda.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
