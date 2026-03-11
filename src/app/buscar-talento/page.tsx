import Link from "next/link";

export default function BuscarTalento() {
  return (
    <>
      {/* Hero Buscar Talento */}
      <section className="relative bg-background-light pt-40 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center z-20 relative animate-fade-in-up">
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 floating">
            <span className="material-symbols-outlined text-5xl text-secondary">
              handshake
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            El talento que tu empresa necesita, <br />{" "}
            <span className="text-secondary">sin complicaciones</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 font-medium max-w-3xl mx-auto leading-relaxed">
            Nos encargamos de todo el proceso de búsqueda y preselección para que
            encuentres al trabajador ideal para tu posición de forma rápida y
            efectiva.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 bg-secondary text-white text-xl font-bold py-5 px-12 rounded-2xl hover:bg-secondary/90 transition-all shadow-[0_0_40px_rgba(255,107,0,0.4)] transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-3xl">mail</span>
            INICIAR BÚSQUEDA AHORA
          </Link>
          <p className="mt-8 text-sm text-slate-500 font-medium">
            Asesoramiento especializado y presupuestos adaptados a las necesidades
            de tu empresa.
          </p>
        </div>
      </section>

      {/* Beneficios para Empresas */}
      <section className="py-24 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué delegar tu búsqueda en nosotros?
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Optimizamos tus recursos para que puedas enfocarte en lo que mejor
              hacés: hacer crecer tu propio negocio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in-up delay-100 group">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">
                  schedule
                </span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">
                Ahorro de Tiempo
              </h4>
              <p className="text-slate-600">
                Revisar cientos de currículums consume horas valiosas. Nosotros
                filtramos y te presentamos solo a los candidatos que realmente
                cumplen con el perfil buscado.
              </p>
            </div>
            {/* Beneficio 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in-up delay-200 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">
                  psychology
                </span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">
                Evaluación Experta
              </h4>
              <p className="text-slate-600">
                Nuestro equipo de recursos humanos analiza no solo habilidades
                técnicas, sino también competencias y encaje cultural dentro de
                tu empresa.
              </p>
            </div>
            {/* Beneficio 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in-up delay-300 group">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">
                  travel_explore
                </span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">
                Base de Datos Activa
              </h4>
              <p className="text-slate-600">
                Accedé a la red pasiva y activa de miles de profesionales en
                nuestras comunidades de WhatsApp y base de datos interna a lo
                largo del país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Selección */}
      <section className="py-24 bg-background-light relative border-t border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24 animate-fade-in-up">
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              ¿Cómo trabajamos?
            </h3>
            <p className="text-slate-600 text-xl font-medium">
              Un proceso transparente y ágil diseñado de principio a fin.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative mt-10">
            {/* Límite de conexión visual */}
            <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-1 bg-slate-200 z-0 border-dashed border-b-2"></div>

            {/* Step 1 */}
            <div className="relative z-10 text-center animate-fade-in-up delay-100 group">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-xl mx-auto mb-6 relative group-hover:-translate-y-2 transition-transform">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold border-2 border-white text-sm shadow">
                  1
                </span>
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-secondary transition-colors">
                  description
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Relevamiento</h4>
              <p className="text-sm text-slate-600 px-4">
                Nos reunimos para entender las responsabilidades y beneficios de
                tu vacante a ocupar.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 text-center animate-fade-in-up delay-200 group">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-xl mx-auto mb-6 relative group-hover:-translate-y-2 transition-transform">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold border-2 border-white text-sm shadow">
                  2
                </span>
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-secondary transition-colors">
                  search
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Búsqueda</h4>
              <p className="text-sm text-slate-600 px-4">
                Activamos la búsqueda en nuestros canales de difusión masivos y
                base de talentos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 text-center animate-fade-in-up delay-300 group">
              <div
                className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-secondary shadow-xl mx-auto mb-6 relative group-hover:-translate-y-2 transition-transform floating"
                style={{ animationDelay: "1s" }}
              >
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold border-2 border-white text-sm shadow">
                  3
                </span>
                <span className="material-symbols-outlined text-4xl text-secondary">
                  people
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Entrevistas
              </h4>
              <p className="text-sm text-slate-600 px-4">
                Nosotros realizamos un filtrado manual inicial y la entrevista
                de preselección general.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 text-center animate-fade-in-up delay-400 group">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-xl mx-auto mb-6 relative group-hover:-translate-y-2 transition-transform">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold border-2 border-white text-sm shadow">
                  4
                </span>
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-secondary transition-colors">
                  done_all
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Presentación
              </h4>
              <p className="text-sm text-slate-600 px-4">
                Te presentamos una terna depurada listos para tu entrevista
                final y contratación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Empresa */}
      <section className="py-24 bg-slate-900 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-secondary/20 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            Listos para armar tu equipo
          </h3>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
            Dejanos tus datos de contacto y un especialista comercial y de
            recursos humanos se comunicará a la brevedad para asesorarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-3 bg-secondary text-white text-lg font-bold py-5 px-10 rounded-2xl hover:bg-secondary/90 transition-all shadow-[0_0_30px_rgba(255,107,0,0.5)] transform hover:scale-105"
            >
              <span className="material-symbols-outlined">mail</span>
              CONTACTAR AHORA
            </Link>
            <Link
              href="https://whatsapp.com"
              target="_blank"
              className="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md text-white border border-white/20 text-lg font-bold py-5 px-10 rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105"
            >
              <span className="material-symbols-outlined">chat</span>
              CHATEAR CON ASESOR
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
