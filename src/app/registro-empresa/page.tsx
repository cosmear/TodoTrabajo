"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroEmpresa() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    telefono: "",
    email: "",
    pais: "",
    provincia: "",
    ciudad: "",
    direccion: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || "Ocurrió un error al enviar el formulario.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Hubo un problema de conexión.");
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
          <h2 className="text-3xl font-bold text-white mb-2">¡Empresa Registrada!</h2>
          <p className="text-slate-400 mb-8">
            Tu perfil como Empresa fue guardado con éxito. Ahora podrás empezar a subir búsquedas.
          </p>
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
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-[#0f1618] pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto bg-surface-dark border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
            Mi empresa
          </h1>
        </div>
        <p className="text-slate-400 text-center mb-8">
          Llena los datos requeridos para poder postularte a las búsquedas
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <input required name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>
            
            <div>
              <textarea required name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={4} placeholder="Descripción*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>

            <div>
              <input required name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Telefono*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>

            <div>
              <input type="email" required name="email" value={formData.email} onChange={handleInputChange} placeholder="Email*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>

            <div>
              <input required name="pais" value={formData.pais} onChange={handleInputChange} placeholder="Pais*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>

            <div>
              <input required name="provincia" value={formData.provincia} onChange={handleInputChange} placeholder="Provincia*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>

            <div>
              <input required name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>

            <div>
              <input required name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección*" className="w-full bg-background-dark border border-slate-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-background-dark font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(19,200,236,0.3)] text-lg ${
                loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
              }`}
            >
              {loading ? "Registrando..." : "Completar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
