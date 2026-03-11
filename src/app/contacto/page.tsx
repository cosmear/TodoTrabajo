export default function Contacto() {
  return (
    <>
      {/* Contact Section */}
      <section className="pt-40 pb-24 bg-surface-dark border-t border-slate-800 min-h-[70vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center w-full">
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
                  className="w-full bg-surface-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 outline-none"
                  placeholder="Juan Pérez"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Correo Electrónico
                </label>
                <input
                  className="w-full bg-surface-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 outline-none"
                  placeholder="juan@ejemplo.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Mensaje
                </label>
                <textarea
                  className="w-full bg-surface-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 outline-none"
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
