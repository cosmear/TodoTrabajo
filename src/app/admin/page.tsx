"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminTab = "overview" | "users" | "jobs";

type AdminStats = {
  candidates: number;
  companies: number;
  jobs: number;
  applications: number;
  pendingCandidates: number;
  pendingJobs: number;
};

type AdminUser = {
  id: number;
  nombre_completo: string;
  email: string;
  tipo_cuenta: "candidato" | "empresa" | "admin";
  is_active: number;
  approval_status: "pending" | "approved" | null;
  created_at: string;
};

type AdminJob = {
  id: number;
  posicion: string;
  empresa: string;
  is_active: number;
  approval_status: "pending" | "approved" | null;
  created_at: string;
  publisher_email: string;
};

type Notice = {
  tone: "success" | "error";
  message: string;
};

type ApprovalTone = "pending" | "approved" | "neutral";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

function getApprovalMeta(tone: ApprovalTone) {
  if (tone === "pending") {
    return {
      label: "Pendiente",
      icon: "hourglass_top",
      className: "border border-amber-500/20 bg-amber-500/10 text-amber-300",
    };
  }

  if (tone === "approved") {
    return {
      label: "Aprobado",
      icon: "verified",
      className: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    };
  }

  return {
    label: "Sin revision",
    icon: "inventory_2",
    className: "border border-slate-700 bg-slate-800/80 text-slate-300",
  };
}

function getVisibilityMeta(isActive: boolean, activeLabel: string, inactiveLabel: string) {
  if (isActive) {
    return {
      label: activeLabel,
      icon: "visibility",
      className: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    };
  }

  return {
    label: inactiveLabel,
    icon: "visibility_off",
    className: "border border-rose-500/20 bg-rose-500/10 text-rose-300",
  };
}

function getUserApprovalTone(user: AdminUser): ApprovalTone {
  if (user.tipo_cuenta !== "candidato") {
    return "neutral";
  }

  return user.approval_status === "pending" ? "pending" : "approved";
}

function tabCopy(activeTab: AdminTab, totalPending: number) {
  if (activeTab === "users") {
    return {
      eyebrow: "Moderacion de perfiles",
      title: "Revision de postulantes en una cola mucho mas clara",
      description:
        "Los perfiles pendientes quedan al frente y el resto del directorio se mantiene visible en un layout mas limpio y facil de escanear.",
      statLabel: "Perfiles pendientes",
      statValue: totalPending,
    };
  }

  if (activeTab === "jobs") {
    return {
      eyebrow: "Moderacion de ofertas",
      title: "Ofertas laborales priorizadas para decidir rapido",
      description:
        "Las vacantes que esperan aprobacion se muestran como cola prioritaria y el historial completo queda debajo con acciones mas legibles.",
      statLabel: "Revision total",
      statValue: totalPending,
    };
  }

  return {
    eyebrow: "Centro de control",
    title: "Vista operativa del panel admin",
    description:
      "Un resumen inmediato de candidatos, empresas y vacantes con el foco puesto en lo que todavia necesita decision.",
    statLabel: "Pendientes totales",
    statValue: totalPending,
  };
}

function buttonClass(
  tone: "primary" | "warning" | "danger" | "ghost",
  disabled?: boolean
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all",
    disabled && "cursor-not-allowed opacity-60",
    tone === "primary" &&
      "border border-primary/30 bg-primary text-background-dark shadow-[0_0_24px_rgba(19,200,236,0.25)] hover:bg-primary/90",
    tone === "warning" &&
      "border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15",
    tone === "danger" &&
      "border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15",
    tone === "ghost" &&
      "border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500 hover:text-white"
  );
}

function MetricPanel({
  icon,
  label,
  value,
  helper,
}: {
  icon: string;
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-black tracking-tight text-white">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{helper}</p>
    </div>
  );
}

function SidebarButton({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-[1.2rem] border px-4 py-3 text-left transition-all",
        active
          ? "border-primary/30 bg-primary/12 text-white shadow-[0_18px_40px_rgba(19,200,236,0.12)]"
          : "border-transparent bg-transparent text-slate-400 hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl border",
            active
              ? "border-primary/20 bg-primary/12 text-primary"
              : "border-white/6 bg-slate-900/70 text-slate-500"
          )}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </span>
        <span className="text-sm font-bold">{label}</span>
      </span>
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold",
            active
              ? "bg-white/10 text-white"
              : count > 0
                ? "bg-amber-500/12 text-amber-300"
                : "bg-slate-800 text-slate-400"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/40 px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const pendingUsers = users.filter(
    (user) => user.tipo_cuenta === "candidato" && user.approval_status === "pending"
  );
  const candidateUsers = users.filter((user) => user.tipo_cuenta === "candidato");
  const approvedCandidates = candidateUsers.filter(
    (user) => user.approval_status !== "pending"
  ).length;
  const activeUsers = users.filter((user) => Boolean(user.is_active)).length;
  const suspendedUsers = users.length - activeUsers;
  const pendingJobs = jobs.filter((job) => job.approval_status === "pending");
  const visibleJobs = jobs.filter((job) => Boolean(job.is_active)).length;
  const hiddenJobs = jobs.length - visibleJobs;
  const totalPending =
    (stats?.pendingCandidates ?? pendingUsers.length) + (stats?.pendingJobs ?? pendingJobs.length);
  const copy = tabCopy(
    activeTab,
    activeTab === "users"
      ? stats?.pendingCandidates ?? pendingUsers.length
      : activeTab === "jobs"
        ? stats?.pendingJobs ?? pendingJobs.length
        : totalPending
  );

  useEffect(() => {
    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const token = localStorage.getItem("tt_session");
      if (!token) {
        router.push("/");
        return;
      }

      const [statsRes, usersRes, jobsRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/jobs", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if ([statsRes, usersRes, jobsRes].some((response) => response.status === 403)) {
        setErrorMsg("Acceso denegado. No eres Administrador.");
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const jobsData = await jobsRes.json();

      setStats(statsData.stats);
      setUsers(usersData.users || []);
      setJobs(jobsData.jobs || []);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error de conexion");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const runMutation = async (
    actionKey: string,
    mutation: () => Promise<Response>,
    successMessage: string,
    errorMessage: string
  ) => {
    setActiveAction(actionKey);
    setNotice(null);

    try {
      const response = await mutation();

      if (response.status === 403) {
        setErrorMsg("Acceso denegado. No eres Administrador.");
        return;
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      await fetchData(false);
      setNotice({ tone: "success", message: successMessage });
    } catch (error) {
      console.error(error);
      setNotice({ tone: "error", message: errorMessage });
    } finally {
      setActiveAction(null);
    }
  };

  const updateUserApproval = async (userId: number, approvalStatus: "pending" | "approved") => {
    const token = localStorage.getItem("tt_session");
    await runMutation(
      `user-approval-${userId}`,
      () =>
        fetch("/api/admin/users", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, approval_status: approvalStatus }),
        }),
      approvalStatus === "approved"
        ? "El perfil se aprobo correctamente."
        : "El perfil volvio a estado pendiente.",
      "No se pudo actualizar la aprobacion del perfil."
    );
  };

  const toggleUserBan = async (userId: number, currentStatus: number) => {
    const token = localStorage.getItem("tt_session");
    const nextStatus = !currentStatus;

    await runMutation(
      `user-status-${userId}`,
      () =>
        fetch("/api/admin/users", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, is_active: nextStatus }),
        }),
      nextStatus ? "El usuario fue reactivado." : "El usuario fue suspendido.",
      "No se pudo actualizar el estado del usuario."
    );
  };

  const updateJobApproval = async (jobId: number, approvalStatus: "pending" | "approved") => {
    const token = localStorage.getItem("tt_session");
    await runMutation(
      `job-approval-${jobId}`,
      () =>
        fetch("/api/admin/jobs", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId, approval_status: approvalStatus }),
        }),
      approvalStatus === "approved"
        ? "La oferta se aprobo correctamente."
        : "La oferta volvio a revision pendiente.",
      "No se pudo actualizar la aprobacion de la oferta."
    );
  };

  const toggleJobStatus = async (jobId: number, currentStatus: number) => {
    const token = localStorage.getItem("tt_session");
    const nextStatus = !currentStatus;

    await runMutation(
      `job-status-${jobId}`,
      () =>
        fetch("/api/admin/jobs", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId, is_active: nextStatus }),
        }),
      nextStatus ? "La oferta volvio a estar visible." : "La oferta fue ocultada.",
      "No se pudo actualizar la visibilidad de la oferta."
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071014] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-10 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
            </div>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.32em] text-slate-500">
              Cargando panel
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Preparando la consola admin</h2>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#071014] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
          <div className="max-w-lg rounded-[2rem] border border-rose-500/20 bg-rose-500/10 px-8 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-300">
              <span className="material-symbols-outlined text-4xl">gpp_bad</span>
            </div>
            <h2 className="mt-5 text-3xl font-black text-white">{errorMsg}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Verifica tu sesion y vuelve al inicio para ingresar nuevamente al panel.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/16"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#071014] pb-20 pt-10">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(19,200,236,0.12),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(255,107,0,0.1),transparent_20%),linear-gradient(180deg,#071014_0%,#0b1518_100%)]"></div>
          <div
            className="absolute inset-y-0 left-0 w-full opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "96px 96px",
            }}
          ></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 xl:grid-cols-[290px,minmax(0,1fr)]">
            <aside className="xl:sticky xl:top-10 xl:self-start">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Moderacion activa
                </div>

                <h1 className="mt-5 font-accent text-4xl font-black leading-none text-white">
                  Panel admin
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Un espacio mas claro para revisar perfiles y ofertas con foco primero en lo urgente.
                </p>

                <div className="mt-8 space-y-2">
                  <SidebarButton
                    active={activeTab === "overview"}
                    icon="dashboard"
                    label="Vista general"
                    onClick={() => setActiveTab("overview")}
                  />
                  <SidebarButton
                    active={activeTab === "users"}
                    icon="group"
                    label="Aprobar perfiles"
                    count={stats?.pendingCandidates ?? pendingUsers.length}
                    onClick={() => setActiveTab("users")}
                  />
                  <SidebarButton
                    active={activeTab === "jobs"}
                    icon="work"
                    label="Aprobar ofertas"
                    count={stats?.pendingJobs ?? pendingJobs.length}
                    onClick={() => setActiveTab("jobs")}
                  />
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                      Cola activa
                    </p>
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      {refreshing ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm text-primary">
                            sync
                          </span>
                          Sync
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm text-emerald-300">
                            check_circle
                          </span>
                          Lista
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-4 text-5xl font-black tracking-tight text-white">{totalPending}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    decisiones pendientes entre perfiles y ofertas publicadas.
                  </p>
                </div>
              </div>
            </aside>

            <main className="space-y-8">
              <section className="rounded-[2.25rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-primary/80">
                      {copy.eyebrow}
                    </p>
                    <h2 className="mt-4 font-accent text-4xl font-black leading-tight text-white md:text-5xl">
                      {copy.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
                      {copy.description}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-slate-500">
                        {copy.statLabel}
                      </p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-white">
                        {copy.statValue}
                      </p>
                    </div>
                    <div className="rounded-[1.6rem] border border-primary/15 bg-primary/10 px-5 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-primary/80">
                        Sincronizacion
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-lg font-bold text-white">
                        <span className="material-symbols-outlined text-primary">
                          {refreshing ? "sync" : "verified"}
                        </span>
                        {refreshing ? "Actualizando" : "Todo al dia"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {notice && (
                <div
                  className={cn(
                    "flex items-start gap-3 rounded-[1.5rem] border px-5 py-4 text-sm shadow-[0_18px_50px_rgba(0,0,0,0.2)]",
                    notice.tone === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-100"
                  )}
                >
                  <span className="material-symbols-outlined">
                    {notice.tone === "success" ? "check_circle" : "error"}
                  </span>
                  <p>{notice.message}</p>
                </div>
              )}

              {activeTab === "overview" && (
                <div className="space-y-6">
                  <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr),minmax(300px,0.85fr)]">
                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
                        Prioridad del dia
                      </p>
                      <h3 className="mt-4 text-4xl font-black tracking-tight text-white">
                        {totalPending} revisiones por resolver
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
                        Tenes {stats?.pendingCandidates ?? pendingUsers.length} perfiles esperando validacion y{" "}
                        {stats?.pendingJobs ?? pendingJobs.length} ofertas todavia sin aprobar.
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.7rem] border border-amber-500/20 bg-amber-500/10 p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-200">
                            Perfiles pendientes
                          </p>
                          <p className="mt-3 text-4xl font-black tracking-tight text-white">
                            {stats?.pendingCandidates ?? pendingUsers.length}
                          </p>
                          <p className="mt-3 text-sm text-amber-100/80">
                            Candidatos nuevos en espera de aprobacion.
                          </p>
                        </div>

                        <div className="rounded-[1.7rem] border border-primary/20 bg-primary/10 p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.26em] text-primary/85">
                            Ofertas pendientes
                          </p>
                          <p className="mt-3 text-4xl font-black tracking-tight text-white">
                            {stats?.pendingJobs ?? pendingJobs.length}
                          </p>
                          <p className="mt-3 text-sm text-slate-200/80">
                            Vacantes listas para aprobar o devolver a revision.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <MetricPanel
                        icon="groups"
                        label="Candidatos"
                        value={stats?.candidates ?? 0}
                        helper={`${approvedCandidates} aprobados y ${stats?.pendingCandidates ?? pendingUsers.length} en revision.`}
                      />
                      <MetricPanel
                        icon="apartment"
                        label="Empresas"
                        value={stats?.companies ?? 0}
                        helper="Empresas registradas dentro de la plataforma."
                      />
                      <MetricPanel
                        icon="send"
                        label="Postulaciones"
                        value={stats?.applications ?? 0}
                        helper="Movimiento total generado por las ofertas activas."
                      />
                    </div>
                  </section>

                  <section className="grid gap-4 md:grid-cols-3">
                    <MetricPanel
                      icon="work"
                      label="Puestos"
                      value={stats?.jobs ?? 0}
                      helper={`${visibleJobs} visibles y ${hiddenJobs} ocultos actualmente.`}
                    />
                    <MetricPanel
                      icon="person_off"
                      label="Usuarios suspendidos"
                      value={suspendedUsers}
                      helper="Cuentas pausadas por decision administrativa."
                    />
                    <MetricPanel
                      icon="travel_explore"
                      label="Ofertas visibles"
                      value={visibleJobs}
                      helper="Publicaciones activas mostradas a candidatos."
                    />
                  </section>
                </div>
              )}

              {activeTab === "users" && (
                <div className="space-y-6">
                  <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr),320px]">
                    <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/[0.07] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200">
                            Cola prioritaria
                          </p>
                          <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
                            Perfiles que requieren decision inmediata
                          </h3>
                        </div>
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-slate-950/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
                          <span className="material-symbols-outlined text-sm">pending_actions</span>
                          {stats?.pendingCandidates ?? pendingUsers.length} pendientes
                        </span>
                      </div>

                      <div className="mt-6">
                        {pendingUsers.length === 0 ? (
                          <EmptyState
                            icon="verified_user"
                            title="No hay perfiles pendientes"
                            description="La cola de moderacion esta limpia. Los nuevos candidatos pendientes van a aparecer automaticamente aca."
                          />
                        ) : (
                          <div className="grid gap-4 xl:grid-cols-2">
                            {pendingUsers.map((user) => {
                              const approvalMeta = getApprovalMeta(getUserApprovalTone(user));
                              const activityMeta = getVisibilityMeta(
                                Boolean(user.is_active),
                                "Activo",
                                "Suspendido"
                              );
                              const approvalBusy = activeAction === `user-approval-${user.id}`;
                              const statusBusy = activeAction === `user-status-${user.id}`;

                              return (
                                <article
                                  key={user.id}
                                  className="rounded-[1.8rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-lg font-black text-primary">
                                        {getInitials(user.nombre_completo)}
                                      </div>
                                      <div>
                                        <h4 className="text-xl font-black text-white">
                                          {user.nombre_completo}
                                        </h4>
                                        <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                                      </div>
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                      {formatAdminDate(user.created_at)}
                                    </span>
                                  </div>

                                  <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
                                      {user.tipo_cuenta}
                                    </span>
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                        approvalMeta.className
                                      )}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {approvalMeta.icon}
                                      </span>
                                      {approvalMeta.label}
                                    </span>
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                        activityMeta.className
                                      )}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {activityMeta.icon}
                                      </span>
                                      {activityMeta.label}
                                    </span>
                                  </div>

                                  <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                      onClick={() => updateUserApproval(user.id, "approved")}
                                      disabled={approvalBusy}
                                      className={buttonClass("primary", approvalBusy)}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {approvalBusy ? "sync" : "done"}
                                      </span>
                                      {approvalBusy ? "Procesando" : "Aprobar perfil"}
                                    </button>

                                    <button
                                      onClick={() => toggleUserBan(user.id, user.is_active)}
                                      disabled={statusBusy}
                                      className={buttonClass(
                                        user.is_active ? "danger" : "ghost",
                                        statusBusy
                                      )}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {statusBusy ? "sync" : user.is_active ? "person_off" : "restart_alt"}
                                      </span>
                                      {statusBusy
                                        ? "Procesando"
                                        : user.is_active
                                          ? "Suspender"
                                          : "Reactivar"}
                                    </button>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                        Pulso de usuarios
                      </p>
                      <div className="mt-6 space-y-4">
                        <MetricPanel
                          icon="person_check"
                          label="Aprobados"
                          value={approvedCandidates}
                          helper="Candidatos ya habilitados para operar en la plataforma."
                        />
                        <MetricPanel
                          icon="badge"
                          label="Activos"
                          value={activeUsers}
                          helper="Cuentas actualmente disponibles para usar la app."
                        />
                      </div>
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                    <div className="flex flex-col gap-3 border-b border-white/8 px-6 py-5 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                          Directorio completo
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-white">Todos los usuarios</h3>
                      </div>
                      <p className="text-sm text-slate-400">
                        {users.length} registros totales. Los pendientes siguen apareciendo primero.
                      </p>
                    </div>

                    <div className="divide-y divide-white/8">
                      {users.map((user) => {
                        const approvalMeta = getApprovalMeta(getUserApprovalTone(user));
                        const activityMeta = getVisibilityMeta(
                          Boolean(user.is_active),
                          "Activo",
                          "Suspendido"
                        );
                        const approvalBusy = activeAction === `user-approval-${user.id}`;
                        const statusBusy = activeAction === `user-status-${user.id}`;

                        return (
                          <div
                            key={user.id}
                            className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1.5fr),220px,240px,auto] lg:items-center"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] text-sm font-black text-white">
                                {getInitials(user.nombre_completo)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="truncate text-lg font-black text-white">
                                  {user.nombre_completo}
                                </h4>
                                <p className="truncate text-sm text-slate-400">{user.email}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                Tipo de cuenta
                              </p>
                              <p className="mt-2 text-sm font-bold capitalize text-slate-200">
                                {user.tipo_cuenta}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Alta: {formatAdminDate(user.created_at)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                  approvalMeta.className
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {approvalMeta.icon}
                                </span>
                                {approvalMeta.label}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                  activityMeta.className
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {activityMeta.icon}
                                </span>
                                {activityMeta.label}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 lg:justify-end">
                              {user.tipo_cuenta === "candidato" && (
                                <button
                                  onClick={() =>
                                    updateUserApproval(
                                      user.id,
                                      user.approval_status === "pending" ? "approved" : "pending"
                                    )
                                  }
                                  disabled={approvalBusy}
                                  className={buttonClass(
                                    user.approval_status === "pending" ? "primary" : "warning",
                                    approvalBusy
                                  )}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {approvalBusy
                                      ? "sync"
                                      : user.approval_status === "pending"
                                        ? "done"
                                        : "hourglass_top"}
                                  </span>
                                  {approvalBusy
                                    ? "Procesando"
                                    : user.approval_status === "pending"
                                      ? "Aprobar"
                                      : "Marcar pendiente"}
                                </button>
                              )}
                              {user.tipo_cuenta !== "admin" && (
                                <button
                                  onClick={() => toggleUserBan(user.id, user.is_active)}
                                  disabled={statusBusy}
                                  className={buttonClass(
                                    user.is_active ? "danger" : "ghost",
                                    statusBusy
                                  )}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {statusBusy ? "sync" : user.is_active ? "person_off" : "restart_alt"}
                                  </span>
                                  {statusBusy
                                    ? "Procesando"
                                    : user.is_active
                                      ? "Suspender"
                                      : "Reactivar"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "jobs" && (
                <div className="space-y-6">
                  <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr),320px]">
                    <div className="rounded-[2rem] border border-primary/20 bg-primary/[0.08] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary/85">
                            Revision prioritaria
                          </p>
                          <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
                            Ofertas listas para aprobar u ocultar
                          </h3>
                        </div>
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-slate-950/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-100">
                          <span className="material-symbols-outlined text-sm">inventory</span>
                          {stats?.pendingJobs ?? pendingJobs.length} pendientes
                        </span>
                      </div>

                      <div className="mt-6">
                        {pendingJobs.length === 0 ? (
                          <EmptyState
                            icon="work_history"
                            title="No hay ofertas pendientes"
                            description="La cola de aprobacion de puestos esta vacia. Las nuevas vacantes en revision se van a destacar automaticamente aca."
                          />
                        ) : (
                          <div className="grid gap-4 xl:grid-cols-2">
                            {pendingJobs.map((job) => {
                              const approvalMeta = getApprovalMeta(
                                job.approval_status === "pending" ? "pending" : "approved"
                              );
                              const visibilityMeta = getVisibilityMeta(
                                Boolean(job.is_active),
                                "Visible",
                                "Oculta"
                              );
                              const approvalBusy = activeAction === `job-approval-${job.id}`;
                              const statusBusy = activeAction === `job-status-${job.id}`;

                              return (
                                <article
                                  key={job.id}
                                  className="rounded-[1.8rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
                                        {job.empresa}
                                      </p>
                                      <h4 className="mt-3 text-2xl font-black leading-tight text-white">
                                        {job.posicion}
                                      </h4>
                                      <p className="mt-2 text-sm text-slate-400">{job.publisher_email}</p>
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                      {formatAdminDate(job.created_at)}
                                    </span>
                                  </div>

                                  <div className="mt-5 flex flex-wrap gap-2">
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                        approvalMeta.className
                                      )}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {approvalMeta.icon}
                                      </span>
                                      {approvalMeta.label}
                                    </span>
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                        visibilityMeta.className
                                      )}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {visibilityMeta.icon}
                                      </span>
                                      {visibilityMeta.label}
                                    </span>
                                  </div>

                                  <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                      onClick={() => updateJobApproval(job.id, "approved")}
                                      disabled={approvalBusy}
                                      className={buttonClass("primary", approvalBusy)}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {approvalBusy ? "sync" : "done"}
                                      </span>
                                      {approvalBusy ? "Procesando" : "Aprobar oferta"}
                                    </button>

                                    <button
                                      onClick={() => toggleJobStatus(job.id, job.is_active)}
                                      disabled={statusBusy}
                                      className={buttonClass(
                                        job.is_active ? "danger" : "ghost",
                                        statusBusy
                                      )}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {statusBusy ? "sync" : job.is_active ? "visibility_off" : "visibility"}
                                      </span>
                                      {statusBusy
                                        ? "Procesando"
                                        : job.is_active
                                          ? "Ocultar"
                                          : "Restaurar"}
                                    </button>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                        Pulso de ofertas
                      </p>
                      <div className="mt-6 space-y-4">
                        <MetricPanel
                          icon="travel_explore"
                          label="Visibles"
                          value={visibleJobs}
                          helper="Vacantes actualmente mostradas dentro de la web publica."
                        />
                        <MetricPanel
                          icon="visibility_off"
                          label="Ocultas"
                          value={hiddenJobs}
                          helper="Ofertas pausadas o fuera de circulacion."
                        />
                      </div>
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                    <div className="flex flex-col gap-3 border-b border-white/8 px-6 py-5 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                          Inventario completo
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-white">Todas las ofertas</h3>
                      </div>
                      <p className="text-sm text-slate-400">
                        {jobs.length} vacantes registradas con prioridad visual para las pendientes.
                      </p>
                    </div>

                    <div className="divide-y divide-white/8">
                      {jobs.map((job) => {
                        const approvalMeta = getApprovalMeta(
                          job.approval_status === "pending" ? "pending" : "approved"
                        );
                        const visibilityMeta = getVisibilityMeta(
                          Boolean(job.is_active),
                          "Visible",
                          "Oculta"
                        );
                        const approvalBusy = activeAction === `job-approval-${job.id}`;
                        const statusBusy = activeAction === `job-status-${job.id}`;

                        return (
                          <div
                            key={job.id}
                            className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1.5fr),220px,240px,auto] lg:items-center"
                          >
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                                {job.empresa}
                              </p>
                              <h4 className="mt-2 truncate text-lg font-black text-white">
                                {job.posicion}
                              </h4>
                              <p className="truncate text-sm text-slate-400">{job.publisher_email}</p>
                            </div>

                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                Publicacion
                              </p>
                              <p className="mt-2 text-sm font-bold text-slate-200">
                                {formatAdminDate(job.created_at)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">Empresa creadora</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                  approvalMeta.className
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {approvalMeta.icon}
                                </span>
                                {approvalMeta.label}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                                  visibilityMeta.className
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {visibilityMeta.icon}
                                </span>
                                {visibilityMeta.label}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 lg:justify-end">
                              <button
                                onClick={() =>
                                  updateJobApproval(
                                    job.id,
                                    job.approval_status === "pending" ? "approved" : "pending"
                                  )
                                }
                                disabled={approvalBusy}
                                className={buttonClass(
                                  job.approval_status === "pending" ? "primary" : "warning",
                                  approvalBusy
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {approvalBusy
                                    ? "sync"
                                    : job.approval_status === "pending"
                                      ? "done"
                                      : "hourglass_top"}
                                </span>
                                {approvalBusy
                                  ? "Procesando"
                                  : job.approval_status === "pending"
                                    ? "Aprobar"
                                    : "Marcar pendiente"}
                              </button>
                              <button
                                onClick={() => toggleJobStatus(job.id, job.is_active)}
                                disabled={statusBusy}
                                className={buttonClass(
                                  job.is_active ? "danger" : "ghost",
                                  statusBusy
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {statusBusy ? "sync" : job.is_active ? "visibility_off" : "visibility"}
                                </span>
                                {statusBusy
                                  ? "Procesando"
                                  : job.is_active
                                    ? "Ocultar"
                                    : "Restaurar"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
