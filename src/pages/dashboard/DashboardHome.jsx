import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { menuConfig } from "../../config/menuConfig";
import { useAuth } from "../../context/AuthContext";
import StudentDashboard from "./student/StudentDashboard";
import SuperAdminDashboard from "./superAdmin/SuperAdminDashboard";

const getRoles = (user = {}) => [
  ...new Set([...(Array.isArray(user.roles) ? user.roles : []), user.primaryRole, user.role].filter(Boolean)),
];

const roleLabels = {
  coordinator: "Coordinator",
  examCell: "Exam Cell",
  faculty: "Faculty",
  schoolAdmin: "School Admin",
  student: "Student",
  superAdmin: "Super Admin",
};

const RoleWorkspace = ({ role }) => {
  const links = menuConfig[role] || [];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1100px] space-y-5">
        <header className="rounded-xl border border-[var(--border-light)] bg-white px-5 py-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--stratex-blue)]">{roleLabels[role] || "Dashboard"}</p>
          <h1 className="mt-2 text-2xl font-black text-[var(--university-ink)] sm:text-3xl">Your Workspace</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--university-muted)]">
            Use the tools available for your role from this dashboard.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition hover:border-[var(--stratex-blue)] hover:bg-[var(--surface-soft)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--stratex-blue)]">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1 text-sm font-black text-[var(--university-ink)]">{item.name}</span>
                <ArrowRight size={16} className="text-[var(--university-muted)]" />
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
};

const DashboardHome = () => {
  const { user } = useAuth();
  const roles = getRoles(user);

  if (roles.includes("student")) {
    return <StudentDashboard />;
  }

  if (roles.some((role) => ["superAdmin", "schoolAdmin"].includes(role))) {
    return <SuperAdminDashboard />;
  }

  return <RoleWorkspace role={roles[0]} />;
};

export default DashboardHome;
