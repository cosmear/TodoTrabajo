import Link from "next/link";

export default function CanalDifusion() {
  return (
    <>
      {/* Hero Canal de Difusión */}
      <section className="relative bg-background-light pt-40 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center z-20 relative animate-fade-in-up">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 floating">
            <span className="material-symbols-outlined text-5xl text-primary">
              campaign
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Sumate a nuestro canal de difusión
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 font-medium max-w-3xl mx-auto leading-relaxed">
            Recibí las mejores oportunidades laborales directamente en tu celular.
            Unirte es rápido, directo y con un valor sumamente accesible.
          </p>
          <Link
            href="https://whatsapp.com"
            target="_blank"
            className="inline-flex items-center gap-3 bg-green-500 text-white text-xl font-bold py-5 px-12 rounded-2xl hover:bg-green-600 transition-all shadow-[0_0_40px_rgba(34,197,94,0.5)] transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-3xl">forum</span>
            UNIRME AHORA POR WHATSAPP
          </Link>
          <p className="mt-6 text-sm text-slate-500 font-medium">
            Únete a cientos de profesionales que ya consiguieron trabajo.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-24 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué unirte a nuestro canal?
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Diseñamos una experiencia libre de fricciones para que encuentres tu
              próximo trabajo ideal con la menor fricción posible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in-up delay-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">
                Notificaciones Rápidas
              </h4>
              <p className="text-slate-600">
                Enterate antes que nadie. Recibí alertas instantáneas de nuevas
                vacantes, sin tener que entrar a buscar todos los días.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <span className="material-symbols-outlined text-3xl">
                  savings
                </span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">
                Valor Accesible
              </h4>
              <p className="text-slate-600">
                No cobramos comisiones abusivas por conseguir empleo. Solo abonas
                un valor muy bajo para poder cubrir los costos del servidor y
                seguir buscando oportunidades para todos de forma transparente.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in-up delay-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <span className="material-symbols-outlined text-3xl">
                  verified_user
                </span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">
                Ofertas Verificadas
              </h4>
              <p className="text-slate-600">
                Filtramos y verificamos cada oportunidad antes de enviarla,
                garantizando que sean empleos reales y de calidad de empresas
                confiables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-24 bg-background-light relative border-t border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Text */}
            <div className="md:w-1/2 animate-fade-in-up">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Un proceso simple <br />
                de 3 pasos
              </h3>

              <div className="space-y-10 mt-12">
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-primary text-background-dark rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-[0_0_20px_rgba(19,200,236,0.5)] group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">
                      Hacé clic en &quot;Unirme&quot;
                    </h4>
                    <p className="text-slate-600 text-lg">
                      Hacé clic en los botones para unirte al canal y se abrirá
                      WhatsApp en tu teléfono celular o tu computadora
                      automáticamente.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-primary text-background-dark rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-[0_0_20px_rgba(19,200,236,0.5)] group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">
                      Confirmá tu suscripción
                    </h4>
                    <p className="text-slate-600 text-lg">
                      Ingresá al canal de WhatsApp. Es completamente privado, tu
                      información y foto estarán seguras entre tú y los
                      administradores.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-primary text-background-dark rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-[0_0_20px_rgba(19,200,236,0.5)] group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">
                      Postulate activamente
                    </h4>
                    <p className="text-slate-600 text-lg">
                      Navegá los avisos entrantes en tiempo real. Cuando un
                      puesto resuene contigo y con tu experiencia, ¡postuláte
                      sin vueltas!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Image/Graphic */}
            <div className="md:w-1/2 relative animate-fade-in-up delay-[400ms]">
              {/* Phone Container with Hover Rotation */}
              <div className="relative max-w-[320px] mx-auto floating transform -rotate-3 hover:rotate-0 transition-transform duration-700 ease-out z-10 cursor-pointer group">
                {/* Blobs / Glows around phone */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-green-500/30 rounded-[3rem] blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Phone Frame Metallic Edge */}
                <div className="bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-[3rem] p-1.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-600 relative">
                  {/* Side Buttons */}
                  <div className="absolute top-32 -left-1.5 w-1.5 h-12 bg-slate-700 rounded-l-md shadow-inner"></div>
                  <div className="absolute top-48 -left-1.5 w-1.5 h-12 bg-slate-700 rounded-l-md shadow-inner"></div>
                  <div className="absolute top-32 -right-1.5 w-1.5 h-16 bg-slate-800 rounded-r-md shadow-inner"></div>

                  {/* Screen */}
                  <div className="bg-[#efeae2] rounded-[2.5rem] h-[600px] w-full overflow-hidden flex flex-col relative shadow-[inset_0_0_15px_rgba(0,0,0,0.2)]">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-2.5 w-full flex justify-center z-20">
                      <div className="w-24 h-7 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
                        {/* Sensors/Camera */}
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-900/50 flex items-center justify-center shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]">
                          <div className="w-1 h-1 rounded-full bg-white/40 blur-[0.5px]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Background Chat Pattern (WhatsApp style) */}
                    <div
                      className="absolute inset-0 opacity-[0.05] z-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(#008069 1px, transparent 1px)",
                        backgroundSize: "15px 15px",
                      }}
                    ></div>

                    {/* WhatsApp Header */}
                    <div className="bg-[#008069] pt-14 pb-3 px-4 flex items-center gap-3 shadow-md relative z-10 text-white">
                      <span className="material-symbols-outlined text-white/90">
                        arrow_back
                      </span>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#008069] font-bold text-xl relative shrink-0 shadow-sm">
                        <span className="material-symbols-outlined">work</span>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-[2px] border-[#008069] rounded-full"></div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h5 className="font-bold text-base leading-tight truncate">
                          Todo Trabajo
                        </h5>
                        <p className="text-[11px] text-white/80 font-medium">
                          Canal • 15.2k seguidores
                        </p>
                      </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-hidden relative z-10 flex flex-col pt-6">
                      {/* Date Badge */}
                      <div className="flex justify-center mb-2">
                        <span className="bg-white/80 backdrop-blur text-slate-500 text-[11px] font-medium py-1 px-3 rounded-xl shadow-sm border border-black/5">
                          Hoy
                        </span>
                      </div>

                      {/* Message 1 */}
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-[92%] relative">
                        {/* Tail */}
                        <div className="absolute top-0 -left-2 w-0 h-0 border-t-[0px] border-t-transparent border-r-[12px] border-r-white border-b-[16px] border-b-transparent drop-shadow-sm"></div>

                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="material-symbols-outlined text-[#008069] text-[15px]">
                            campaign
                          </span>
                          <p className="text-[13px] text-[#008069] font-bold">
                            Nueva Vacante
                          </p>
                        </div>
                        <p className="text-[14px] text-slate-800 mb-0 font-bold leading-snug">
                          Administrativo CABA
                        </p>
                        <p className="text-[13px] text-slate-600 mb-2 leading-relaxed">
                          Empresa multinacional busca personal para centro
                          porteño. L a V horario flexible.
                        </p>

                        {/* Interactive Button */}
                        <div className="mt-2 bg-[#f0f2f5] hover:bg-[#e0e2e5] transition-colors rounded-xl p-2 text-center text-[#008069] border border-[#008069]/10 cursor-pointer">
                          <p className="text-[12px] font-bold">
                            Ver oferta completa
                          </p>
                        </div>

                        <div className="flex justify-end mt-1">
                          <span className="text-[10px] text-slate-400">
                            09:41
                          </span>
                        </div>
                      </div>

                      {/* Message 2 */}
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-[92%] relative opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
                        {/* Tail */}
                        <div className="absolute top-0 -left-2 w-0 h-0 border-t-[0px] border-t-transparent border-r-[12px] border-r-white border-b-[16px] border-b-transparent drop-shadow-sm"></div>

                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="material-symbols-outlined text-[#008069] text-[15px]">
                            campaign
                          </span>
                          <p className="text-[13px] text-[#008069] font-bold">
                            Nueva Vacante
                          </p>
                        </div>
                        <p className="text-[14px] text-slate-800 mb-0 font-bold leading-snug">
                          Desarrollador React SSR
                        </p>
                        <p className="text-[13px] text-slate-600 mb-2 leading-relaxed">
                          Se busca dev semi-senior. 100% remoto, pago mensual en
                          USD.
                        </p>

                        {/* Interactive Button */}
                        <div className="mt-2 bg-[#f0f2f5] hover:bg-[#e0e2e5] transition-colors rounded-xl p-2 text-center text-[#008069] border border-[#008069]/10 cursor-pointer">
                          <p className="text-[12px] font-bold">
                            Postularme ahora
                          </p>
                        </div>

                        <div className="flex justify-end mt-1">
                          <span className="text-[10px] text-slate-400">
                            10:15
                          </span>
                        </div>
                      </div>

                      {/* Input Bar (footer of the phone) */}
                      <div className="absolute bottom-0 left-0 w-full bg-[#f0f2f5] px-2 py-2 flex items-center gap-2 border-t border-black/5 z-20">
                        <span className="material-symbols-outlined text-slate-500 text-xl pl-2 cursor-not-allowed">
                          add
                        </span>
                        <div className="flex-1 bg-white rounded-full py-2 px-4 shadow-sm border border-slate-200">
                          <p className="text-[12px] text-slate-400 truncate">
                            Solo los admins pueden enviar mensajes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            ¿Qué estás esperando?
          </h3>
          <p className="text-xl text-slate-300 mb-10 font-medium">
            Tu próximo gran proyecto laboral podría llegar en el próximo mensaje
            que recibas hoy.
          </p>
          <Link
            href="https://whatsapp.com"
            target="_blank"
            className="inline-flex items-center gap-3 bg-green-500 text-white text-xl font-bold py-5 px-12 rounded-2xl hover:bg-green-600 transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)] transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-3xl">forum</span>
            UNIRME AHORA AL CANAL
          </Link>
        </div>
      </section>
    </>
  );
}
