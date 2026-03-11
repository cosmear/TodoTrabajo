import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background-dark pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center bg-primary rounded text-background-dark text-xs">
                <span className="material-symbols-outlined text-sm">work</span>
              </div>
              <h2 className="text-lg font-bold text-white">Todo Trabajo</h2>
            </div>
            <p className="text-slate-500 text-sm">
              Conectando profesionales con oportunidades desde 2010.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Candidatos</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/buscar-empleo"
                >
                  Buscar Empleo
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Crear CV
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Alertas de Empleo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Empresas</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/buscar-talento"
                >
                  Busco Personal
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/servicios"
                >
                  Capacitación
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  href="/servicios"
                >
                  Consultoría
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Términos
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="#">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © 2024 Todo Trabajo. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link
              className="text-slate-500 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">public</span>
            </Link>
            <Link
              className="text-slate-500 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">mail</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
