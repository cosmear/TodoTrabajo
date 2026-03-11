import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen pt-28 pb-20 flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-[#101f22] to-[#0c1314] -z-20"></div>
        <div
          className="absolute inset-0 opacity-10 -z-10"
          style={{
            backgroundImage: "radial-gradient(#13c8ec 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 blur-[120px] rounded-full -z-10 transform translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Nueva Plataforma 2024
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
              Todo Trabajo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-200">
                Tu Futuro Aquí
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Plataforma exclusiva para Argentina, especializada en trabajos de
              mandos medios: secretariado, personal de maestranza y
              administrativos. Encuentra tu próximo desafío profesional o el
              candidato ideal para tu empresa.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/buscar-empleo"
                className="bg-primary text-background-dark font-bold py-3.5 px-8 rounded-lg hover:bg-primary/90 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(19,200,236,0.4)] inline-block"
              >
                Buscar Empleo
              </Link>
              <Link
                href="/buscar-talento"
                className="bg-transparent border border-slate-600 text-white font-bold py-3.5 px-8 rounded-lg hover:border-primary hover:text-primary transition-all inline-block"
              >
                Busco Personal
              </Link>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-slate-800/50 mt-8">
              <div>
                <p className="text-3xl font-bold text-white">2.5k+</p>
                <p className="text-sm text-slate-500">Empleos Activos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">800+</p>
                <p className="text-sm text-slate-500">Empresas</p>
              </div>
            </div>
          </div>
          
          {/* Right Column: Image */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl glow-border">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-20"></div>
              <div
                className="w-full h-full bg-cover bg-center"
                data-alt="Professional woman in business attire smiling in a modern office environment"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRx6AHlKQYnnx-PNQneiD1vZfKG61u3U-7BMJnos80sl6CQBsTBizDPf2fOZ6H-7NpX3PbyiPZP0uaVyghEOFMyI2uNIOOZsaS9eQuCT40CSPhzsUCl0v2PeUvTo0AivwhgD0S0aKILZVItVig84me4o8fTJPnQaJlMObQxMazLdH6rQyJ3jBLI3xI9_PhfTnQWfATs1nR-oUsi0-485-X9fapPH_4bX8etaV_0-WfmUlJuB0Z6uH8J30A_Lj6M70tLP2Xy2Y8NrM')",
                }}
              ></div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-surface-dark border border-slate-700 rounded-xl flex items-center justify-center z-30 shadow-lg">
              <span className="material-symbols-outlined text-4xl text-primary">
                rocket_launch
              </span>
            </div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-2xl z-0"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Soluciones integrales diseñadas para potenciar el crecimiento
              profesional y empresarial.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-surface-dark p-8 rounded-2xl border border-slate-800 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-3xl"></div>
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-2xl">
                  person_search
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reclutamiento</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Identificamos y seleccionamos el talento que mejor se adapta a la
                cultura y necesidades técnicas de tu organización.
              </p>
            </div>
            {/* Card 2 */}
            <div className="group relative bg-surface-dark p-8 rounded-2xl border border-slate-800 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-3xl"></div>
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Capacitación</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Programas de formación continua para desarrollar habilidades
                blandas y técnicas en equipos de alto rendimiento.
              </p>
            </div>
            {/* Card 3 */}
            <div className="group relative bg-surface-dark p-8 rounded-2xl border border-slate-800 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-3xl"></div>
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-2xl">
                  corporate_fare
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Consultoría</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Asesoría experta en gestión de recursos humanos, clima laboral y
                estrategias de retención de talento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background-dark relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-surface-dark border border-slate-800 p-8 rounded-xl shadow-lg relative glow-border">
              <div className="flex text-yellow-400 mb-4">
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
              </div>
              <p className="text-slate-300 mb-6 italic">
                "Gracias a Todo Trabajo encontré el puesto de gerente que tanto
                buscaba en menos de dos semanas."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-slate-700 rounded-full bg-cover bg-center"
                  data-alt="Portrait of a smiling man"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8wGldJELwg6OhNlcTPHL41xWXlKCT5NdU18INko324nKOFWY_aGkLJhHzs4AmpALvuZkMZ1xKcGv752gY0O_lywPLEh5Xe8q2UFp8azaBL9ffXI4L8pp_tlPnU1zuFSfjCk9Yq4IGOgMqky-anQf_ZDA7_h44Q1i69_sozQytxsmqAsH3rsfbSe1rpGP1wUgDnCHajPetlPN3HDEPcWIA8Dksly0aN3f0FBBrBrQMt8ppZfzMkdFWXB95iFyi80hzx1WxHU17v9M')",
                  }}
                ></div>
                <div>
                  <h4 className="text-white font-bold text-sm">Carlos Mendez</h4>
                  <p className="text-slate-500 text-xs">Gerente de Ventas</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-surface-dark border border-slate-800 p-8 rounded-xl shadow-lg relative glow-border">
              <div className="flex text-yellow-400 mb-4">
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
              </div>
              <p className="text-slate-300 mb-6 italic">
                "La plataforma es intuitiva y las ofertas son reales y de calidad.
                Totalmente recomendada."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-slate-700 rounded-full bg-cover bg-center"
                  data-alt="Portrait of a smiling woman"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3uEctsAkVKzgM1lAM2cmn6VXiQb5eQw8hhrpnXQPNQhLirLFyDSgH4mUx0X4jBTY3zDtfidB4Veunreoi_I_Z4_SA-CwT2QyQSCA-I-TrAFdf-CnZwVsJVVNnwS0mFAOocFdq2rrYteQWVj_MBvay-y-HTFqej75vEUIJ0nfWui8v4zyBOYsiTPGDFuDL-SkxS23w7FxbYLBlWCIxw9b3EEXwpBtHR8Qc_cxiCPBzyXqSRM4CO1R2T76J7UlWjujz6kfo4xBmZgg')",
                  }}
                ></div>
                <div>
                  <h4 className="text-white font-bold text-sm">Ana Gómez</h4>
                  <p className="text-slate-500 text-xs">Desarrolladora Web</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-surface-dark border border-slate-800 p-8 rounded-xl shadow-lg relative glow-border">
              <div className="flex text-yellow-400 mb-4">
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">star</span>
                <span className="material-symbols-outlined fill-current">
                  star_half
                </span>
              </div>
              <p className="text-slate-300 mb-6 italic">
                "Como empresa, hemos reducido nuestros tiempos de contratación a la
                mitad."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-slate-700 rounded-full bg-cover bg-center"
                  data-alt="Portrait of a business executive"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmGguwojFHHIbmAy8fMppCtz6_7n6YNSpWt3lLVKw2J_9rnFKquDoq2yMhVQB_mdtdona8g7yYJFQoelf5ZfcmWYq4J-19GzljlDVMo1i0LldTTtuRPhnAc_o1NXaG_pW5parrvJuZY2bcd0KwsXBA6eTIqgZTiYrgArniGLbLyUuCuA-3Ejfl331kX6qgDTtjlq10iGRNYDG3q8E2YrtRPfqH9Rk0lBQPJj2Dj_H8L0vySju_-d5T4tZYlTsfPacbs_iqJzmvKv8')",
                  }}
                ></div>
                <div>
                  <h4 className="text-white font-bold text-sm">Roberto Díaz</h4>
                  <p className="text-slate-500 text-xs">Director RRHH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-surface-dark border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Contáctanos</h2>
            <p className="text-slate-400 mb-8">
              Déjanos tus datos y nos pondremos en contacto contigo para ayudarte
              a encontrar lo que buscas.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <span>contacto@todotrabajo.com</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <span>+54 11 4321-5678</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <span>Calle Principal 123, CABA</span>
              </div>
            </div>
          </div>
          <form className="bg-background-dark p-8 rounded-2xl border border-slate-800 shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Nombre Completo
                </label>
                <input
                  className="w-full bg-surface-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  placeholder="Juan Pérez"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Correo Electrónico
                </label>
                <input
                  className="w-full bg-surface-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  placeholder="juan@ejemplo.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Mensaje
                </label>
                <textarea
                  className="w-full bg-surface-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  placeholder="¿En qué podemos ayudarte?"
                  rows={4}
                ></textarea>
              </div>
              <button
                className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:bg-primary/90 transition-all"
                type="button"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
