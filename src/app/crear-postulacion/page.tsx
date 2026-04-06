"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearPostulacion() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    "La busqueda de empleo fue guardada y quedo pendiente de aprobacion del administrador."
  );

  const [formData, setFormData] = useState({
    empresa: "",
    posicion: "",
    requisitos: "",
    areas: "",
    disponibilidad: "",
    contacto: "",
    pais: "",
    provincia: "",
    areas_interes: "",
    zona: "",
    direccion: "",
    visible_suscripcion: false,
    requiere_salario: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (name: string) => {
    setFormData({ ...formData, [name]: !formData[name as keyof typeof formData] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("tt_session");
      const response = await fetch("/api/postulaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          data.approvalStatus === "pending"
            ? "La busqueda de empleo fue guardada y quedo pendiente de aprobacion del administrador."
            : "La busqueda de empleo fue guardada con exito."
        );
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Ocurrio un error al crear la postulacion.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Hubo un problema de conexion.");
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
          <h2 className="text-3xl font-bold text-white mb-2">Postulacion creada</h2>
          <p className="text-slate-400 mb-8">{successMessage}</p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                empresa: "",
                posicion: "",
                requisitos: "",
                areas: "",
                disponibilidad: "",
                contacto: "",
                pais: "",
                provincia: "",
                areas_interes: "",
                zona: "",
                direccion: "",
                visible_suscripcion: false,
                requiere_salario: false,
              });
            }}
            className="w-full py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all mb-4"
          >
            Crear otra postulacion
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
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
          <div className="w-8 h-8 rounded-full bg-[#5b83e8] flex-shrink-0"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#5b83e8]">
            Crear postulacion
          </h1>
        </div>
        <p className="text-slate-400 text-center mb-8">
          Llena los datos requeridos para la busqueda de empleados
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                required
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                placeholder="Empresa*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="posicion"
                value={formData.posicion}
                onChange={handleInputChange}
                placeholder="Posicion*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                name="requisitos"
                value={formData.requisitos}
                onChange={handleInputChange}
                placeholder="Requisitos"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="areas"
                value={formData.areas}
                onChange={handleInputChange}
                placeholder="Areas*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="disponibilidad"
                value={formData.disponibilidad}
                onChange={handleInputChange}
                placeholder="Disponibilidad*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="contacto"
                value={formData.contacto}
                onChange={handleInputChange}
                placeholder="Email, link o telefono de contacto*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                placeholder="Pais*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="provincia"
                value={formData.provincia}
                onChange={handleInputChange}
                placeholder="Provincia*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="areas_interes"
                value={formData.areas_interes}
                onChange={handleInputChange}
                placeholder="Areas de interes*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="zona"
                value={formData.zona}
                onChange={handleInputChange}
                placeholder="Zona*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div>
              <input
                required
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Direccion*"
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5b83e8]"
              />
            </div>

            <div className="pt-4 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.visible_suscripcion ? "bg-[#5b83e8]" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      formData.visible_suscripcion ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.visible_suscripcion}
                  onChange={() => handleToggle("visible_suscripcion")}
                />
                <span className="text-slate-800 group-hover:text-white transition-colors">
                  Visible para usuarios con subscripcion
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.requiere_salario ? "bg-[#5b83e8]" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      formData.requiere_salario ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.requiere_salario}
                  onChange={() => handleToggle("requiere_salario")}
                />
                <span className="text-slate-800 group-hover:text-white transition-colors">
                  Requiere salario pretendido
                </span>
              </label>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(91,131,232,0.3)] text-lg ${
                loading ? "bg-[#5b83e8]/50 cursor-not-allowed" : "bg-[#5b83e8] hover:bg-[#4a6dc6]"
              }`}
            >
              {loading ? "Creando postulacion..." : "Publicar Busqueda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
