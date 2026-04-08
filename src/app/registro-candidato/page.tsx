"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroCandidato() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Tu perfil como Busqueda de Trabajo fue guardado y quedo pendiente de aprobacion del administrador."
  );

  const [formData, setFormData] = useState({
    nombre_apellido: "",
    descripcion: "",
    fecha_nacimiento: "",
    telefono: "",
    pais: "",
    provincia: "",
    ciudad: "",
    direccion: "",
    areas_interes: "",
    disponibilidad: "",
    remuneracion_pretendida: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    tiktok: "",
  });

  const [positions, setPositions] = useState<string[]>([""]);
  const [companies, setCompanies] = useState<string[]>([""]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (index: number, value: string) => {
    const updated = [...positions];
    updated[index] = value;
    setPositions(updated);
  };

  const handleCompanyChange = (index: number, value: string) => {
    const updated = [...companies];
    updated[index] = value;
    setCompanies(updated);
  };

  const addPosition = () => setPositions([...positions, ""]);
  const addCompany = () => setCompanies([...companies, ""]);

  const removePosition = (index: number) => {
    const updated = [...positions];
    updated.splice(index, 1);
    setPositions(updated.length ? updated : [""]);
  };

  const removeCompany = (index: number) => {
    const updated = [...companies];
    updated.splice(index, 1);
    setCompanies(updated.length ? updated : [""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validPositions = positions.filter((p) => p.trim() !== "");
    const validCompanies = companies.filter((c) => c.trim() !== "");

    try {
      const token = localStorage.getItem("tt_session");
      const response = await fetch("/api/candidatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          remuneracion_pretendida: formData.remuneracion_pretendida
            ? parseFloat(formData.remuneracion_pretendida)
            : null,
          positions: validPositions,
          companies: validCompanies,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          data.approvalStatus === "approved"
            ? "Tu perfil como Busqueda de Trabajo fue guardado con exito."
            : "Tu perfil como Busqueda de Trabajo fue guardado y quedo pendiente de aprobacion del administrador."
        );
        setSuccess(true);
      } else {
        alert(data.error || "Ocurrio un error al enviar el formulario.");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un problema de conexion.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1618] px-6 pt-20">
        <div className="max-w-md w-full bg-surface-dark border border-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
            check_circle
          </span>
          <h2 className="text-3xl font-bold text-white mb-2">Perfil creado</h2>
          <p className="text-slate-400 mb-8">{successMessage}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background-dark to-[#0f1618] pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto bg-surface-dark border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center">
          Perfil de <span className="text-primary">Candidato</span>
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Completa tus datos para que las empresas puedan encontrarte.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nombre y Apellido*
              </label>
              <input
                required
                name="nombre_apellido"
                value={formData.nombre_apellido}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Descripcion*
              </label>
              <textarea
                required
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Fecha de nacimiento*
              </label>
              <input
                type="date"
                required
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Telefono*
              </label>
              <input
                required
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Pais
              </label>
              <input
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Provincia*
              </label>
              <input
                required
                name="provincia"
                value={formData.provincia}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Ciudad*
              </label>
              <input
                required
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Direccion*
              </label>
              <input
                required
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Areas de interes*
              </label>
              <input
                required
                name="areas_interes"
                value={formData.areas_interes}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Disponibilidad*
              </label>
              <input
                required
                name="disponibilidad"
                value={formData.disponibilidad}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
                placeholder="Ej: Full-time"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Remuneracion Pretendida
              </label>
              <input
                type="number"
                name="remuneracion_pretendida"
                value={formData.remuneracion_pretendida}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <h3 className="text-white font-bold mb-4 border-b border-slate-800 pb-2">
                Redes Sociales
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                LinkedIn*
              </label>
              <input
                required
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Twitter/X
              </label>
              <input
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Instagram
              </label>
              <input
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tiktok
              </label>
              <input
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
              />
            </div>
          </div>

          <div className="w-full border-t border-slate-800 my-8"></div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold">
                  Experiencia: Posiciones desarrolladas
                </h3>
              </div>
              <div className="space-y-3">
                {positions.map((pos, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      value={pos}
                      onChange={(e) => handlePositionChange(index, e.target.value)}
                      placeholder={`Posicion ${index + 1}`}
                      className="flex-1 bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
                    />
                    <button
                      type="button"
                      onClick={() => removePosition(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPosition}
                className="mt-4 w-full bg-[#3b5acc] hover:bg-[#345ac8] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span> Agregar Posiciones
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-8">
                <h3 className="text-white font-bold">Empresas Previas / De Interes</h3>
              </div>
              <div className="space-y-3">
                {companies.map((comp, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      value={comp}
                      onChange={(e) => handleCompanyChange(index, e.target.value)}
                      placeholder={`Empresa ${index + 1}`}
                      className="flex-1 bg-background-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompany(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCompany}
                className="mt-4 w-full bg-[#3b5acc] hover:bg-[#345ac8] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span> Agregar Empresas
              </button>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(19,200,236,0.3)] text-lg ${
                loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {loading ? "Enviando..." : "Crear Perfil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
