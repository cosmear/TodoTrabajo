export default function Somos() {
  return (
    <>
      <section className="relative pt-40 pb-20 flex items-center overflow-hidden bg-background-dark min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-[#101f22] to-[#0c1314] -z-20"></div>
        <div className="max-w-7xl mx-auto px-6 w-full text-center relative z-10">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-200">
              Somos
            </span>{" "}
            Todo Trabajo
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Nuestra misión es conectar talentos de mandos medios, secretariado,
            personal de maestranza y administrativos con las mejores
            oportunidades, operando de manera exclusiva en toda la Argentina.
          </p>
        </div>
      </section>

      <section className="py-24 bg-surface-dark relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Nuestra Historia
            </h2>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Fundada en 2010, Todo Trabajo nació con la visión de transformar la
              manera en que empresas y profesionales de mandos medios se
              encuentran en Argentina. A lo largo de los años, hemos construido
              una plataforma innovadora que facilita este proceso.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Hoy somos líderes en el sector, conectando exclusivamente dentro del
              país a perfiles de secretariado, personal de maestranza y
              administrativos con las mejores empresas, siempre enfocados en la
              calidad humana y profesional.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background-dark p-6 rounded-xl border border-slate-800 text-center glow-border">
              <h3 className="text-4xl font-bold text-primary mb-2">+10k</h3>
              <p className="text-slate-400 text-sm">Contrataciones</p>
            </div>
            <div className="bg-background-dark p-6 rounded-xl border border-slate-800 text-center glow-border">
              <h3 className="text-4xl font-bold text-primary mb-2">15</h3>
              <p className="text-slate-400 text-sm">Años de Exp.</p>
            </div>
            <div className="bg-background-dark p-8 rounded-xl border border-slate-800 text-center col-span-2 glow-border">
              <h3 className="text-4xl font-bold text-primary mb-2">98%</h3>
              <p className="text-slate-400 text-sm">Satisfacción de Clientes</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
