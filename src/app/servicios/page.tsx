import Link from "next/link";

const plans = [
  {
    name: "Gratis",
    badge: "Base",
    icon: "bolt",
    description:
      "Publica tu perfil o tu busqueda y accede a la plataforma sin costo para empezar a conectar.",
    points: [
      "Acceso a las busquedas activas",
      "Perfil visible dentro de la plataforma",
      "Publicacion inicial para empresas y candidatos",
    ],
    cta: {
      href: "/registro-candidato",
      label: "Empezar gratis",
    },
  },
  {
    name: "Premium",
    badge: "Suscripcion paga",
    icon: "workspace_premium",
    description:
      "Facilitar la busqueda de empleo y potenciar tu perfil para las empresas.",
    points: [
      "Mayor visibilidad frente a empresas",
      "Impulso para destacar perfiles y publicaciones",
      "Prioridad en exposicion de oportunidades",
    ],
    cta: {
      href: "/contacto",
      label: "Quiero Premium",
    },
  },
];

export default function Servicios() {
  return (
    <section className="pt-40 pb-24 relative bg-background-dark min-h-[70vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-primary/80 mb-4">
            Servicios
          </p>
          <h1 className="font-accent text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Dos formas simples de usar Todo Trabajo
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Dejamos una propuesta clara: un plan gratis para empezar y una
            suscripcion paga para darle mas fuerza a tu presencia dentro de la
            plataforma.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="relative rounded-4xl border border-slate-800 bg-surface-dark p-8 md:p-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary mb-3">
                      {plan.badge}
                    </p>
                    <h2 className="font-accent text-3xl font-bold text-white mb-3">
                      {plan.name}
                    </h2>
                    <p className="text-slate-400 leading-relaxed max-w-xl">
                      {plan.description}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-background-dark border border-slate-700 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-3xl">
                      {plan.icon}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <span className="material-symbols-outlined text-primary text-lg">
                        check_circle
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.cta.href}
                  className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold transition-all ${
                    plan.name === "Premium"
                      ? "bg-primary text-background-dark hover:bg-primary/90"
                      : "border border-slate-700 text-white hover:border-primary hover:text-primary"
                  }`}
                >
                  {plan.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
