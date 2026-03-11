export default function Servicios() {
  return (
    <>
      {/* Services Section */}
      <section className="pt-40 pb-24 relative bg-background-dark min-h-[70vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
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
    </>
  );
}
