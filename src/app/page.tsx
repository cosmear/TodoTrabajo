import Link from "next/link";
import pool from "@/lib/db";

type LatestJob = {
  id: number;
  user_id: number;
  empresa: string;
  posicion: string;
  provincia: string;
  pais: string;
  disponibilidad: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

async function getLatestJobs(): Promise<LatestJob[]> {
  let connection;

  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT id, user_id, empresa, posicion, provincia, pais, disponibilidad, created_at
       FROM job_postings
       WHERE is_active = 1 AND approval_status = 'approved'
       ORDER BY created_at DESC
       LIMIT 6`
    );

    return rows as LatestJob[];
  } catch {
    return [];
  } finally {
    connection?.release();
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export default async function Home() {
  const latestJobs = await getLatestJobs();

  return (
    <>
      <section className="relative min-h-screen pt-28 pb-20 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-[#101f22] to-[#0c1314] -z-20"></div>
        <div
          className="absolute inset-0 opacity-10 -z-10"
          style={{
            backgroundImage: "radial-gradient(#13c8ec 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 blur-[120px] rounded-full -z-10 translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Busquedas activas
            </div>
            <h1 className="font-accent text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
              Todo Trabajo
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-200">
                Tu futuro empieza hoy
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Plataforma enfocada en conectar empresas y candidatos con
              busquedas reales. Explora oportunidades nuevas, publica vacantes y
              hace visible tu perfil.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/buscar-empleo"
                className="bg-primary text-background-dark font-bold py-3.5 px-8 rounded-lg hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(19,200,236,0.4)] inline-block"
              >
                Buscar empleo
              </Link>
              <Link
                href="/buscar-talento"
                className="bg-transparent border border-slate-600 text-white font-bold py-3.5 px-8 rounded-lg hover:border-primary hover:text-primary transition-all inline-block"
              >
                Busco personal
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 pt-8 border-t border-slate-800/60">
              <div className="rounded-2xl border border-slate-800 bg-surface-dark/60 px-5 py-4">
                <p className="text-3xl font-bold text-white">{latestJobs.length}</p>
                <p className="text-sm text-slate-500">Busquedas nuevas en portada</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-surface-dark/60 px-5 py-4">
                <p className="text-3xl font-bold text-white">2</p>
                <p className="text-sm text-slate-500">Planes disponibles</p>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative z-10 w-full h-full rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl glow-border">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-20"></div>
              <div
                className="w-full h-full bg-cover bg-center scale-[1.02]"
                data-alt="Professional woman in business attire smiling in a modern office environment"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRx6AHlKQYnnx-PNQneiD1vZfKG61u3U-7BMJnos80sl6CQBsTBizDPf2fOZ6H-7NpX3PbyiPZP0uaVyghEOFMyI2uNIOOZsaS9eQuCT40CSPhzsUCl0v2PeUvTo0AivwhgD0S0aKILZVItVig84me4o8fTJPnQaJlMObQxMazLdH6rQyJ3jBLI3xI9_PhfTnQWfATs1nR-oUsi0-485-X9fapPH_4bX8etaV_0-WfmUlJuB0Z6uH8J30A_Lj6M70tLP2Xy2Y8NrM')",
                }}
              ></div>
            </div>
            <div className="absolute -bottom-8 -left-6 w-44 bg-surface-dark/95 border border-slate-700 rounded-2xl p-5 z-30 shadow-lg backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
                Plan premium
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Facilitar la busqueda de empleo y potenciar tu perfil para las
                empresas.
              </p>
            </div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-2xl z-0"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background-dark border-t border-slate-800/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-primary/80 mb-4">
                Ultimas 6 busquedas
              </p>
              <h2 className="font-accent text-3xl md:text-4xl font-bold text-white mb-4">
                Nuevas oportunidades publicadas por empresas
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Mostramos las busquedas mas recientes sin boton de postulacion
                directa para que la portada sea mas limpia y se enfoque en lo
                nuevo.
              </p>
            </div>
            <Link
              href="/buscar-empleo"
              className="inline-flex items-center justify-center border border-slate-700 text-white font-bold px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-all"
            >
              Ver todas las busquedas
            </Link>
          </div>

          {latestJobs.length > 0 ? (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <article
                  key={job.id}
                  className="group h-full rounded-[1.75rem] border border-slate-800 bg-surface-dark/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-500 mb-6">
                    <span>Publicada</span>
                    <span>{formatDate(job.created_at)}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {job.posicion}
                    </h3>
                    <Link
                      href={`/empresas/${job.user_id}`}
                      className="inline-flex text-primary font-bold hover:underline"
                    >
                      {job.empresa}
                    </Link>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Busqueda activa para {job.provincia}, {job.pais}. Modalidad:{" "}
                      {job.disponibilidad}.
                    </p>
                  </div>
                  <div className="mt-8 pt-5 border-t border-slate-800 flex items-center gap-5 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">
                        location_on
                      </span>
                      {job.provincia}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">
                        schedule
                      </span>
                      {job.disponibilidad}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-700 bg-surface-dark/40 px-8 py-14 text-center">
              <p className="text-2xl font-bold text-white mb-3">
                Todavia no hay busquedas nuevas para mostrar.
              </p>
              <p className="text-slate-400 mb-8">
                Cuando se publiquen ofertas activas, esta seccion va a mostrar
                automaticamente las 6 mas recientes.
              </p>
              <Link
                href="/crear-postulacion"
                className="inline-flex items-center justify-center bg-primary text-background-dark font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
              >
                Publicar una busqueda
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-surface-dark border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary/80 mb-4">
              Contacto
            </p>
            <h2 className="font-accent text-3xl font-bold text-white mb-4">
              Hablemos de tu proxima contratacion
            </h2>
            <p className="text-slate-400 mb-8">
              Dejanos tus datos y te ayudamos a encontrar talento o a ordenar tu
              proxima busqueda laboral.
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
                  Nombre completo
                </label>
                <input
                  className="w-full bg-surface-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  placeholder="Juan Perez"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Correo electronico
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
                  placeholder="Contanos en que te podemos ayudar"
                  rows={4}
                ></textarea>
              </div>
              <button
                className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:bg-primary/90 transition-all"
                type="button"
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
