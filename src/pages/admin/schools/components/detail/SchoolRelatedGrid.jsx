import {
  CalendarDays,
  GraduationCap,
  Mail,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import Pagination from "../../../../../components/common/Pagination";

const getUserName = (user) =>
  [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ") ||
  "Unnamed User";

const getUserEmail = (user) =>
  user?.personalEmail || user?.email || user?.universityAccount?.universityEmail || "No email";

const getProgramMeta = (program) =>
  [program?.degreeType, program?.duration ? `${program.duration} Years` : ""]
    .filter(Boolean)
    .join(" / ");

const statusClass = (status) =>
  status === "active"
    ? "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]"
    : "bg-[color-mix(in_srgb,var(--error)_9%,white)] text-[var(--error)]";

const EmptyState = ({ title }) => (
  <div className="rounded-xl border border-dashed border-[var(--border-light)] bg-white px-4 py-10 text-center shadow-sm sm:px-5 sm:py-12">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--university-muted)]">
      <UsersRound size={20} />
    </div>
    <p className="mt-3 text-sm font-bold text-[var(--university-ink)]">No {title} found</p>
    <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
      Records linked to this school will appear here.
    </p>
  </div>
);

const ProgramCard = ({ item }) => (
  <article className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
        <GraduationCap size={20} />
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(item.status)}`}>
        {item.status || "active"}
      </span>
    </div>
    <h3 className="mt-4 line-clamp-2 text-sm font-bold text-[var(--university-ink)]">
      {item.name}
    </h3>
    <p className="mt-2 line-clamp-3 min-h-12 text-xs font-medium leading-5 text-[var(--text-secondary)]">
      {item.description || "No description added for this program."}
    </p>
    <div className="mt-4 flex items-center gap-2 border-t border-[var(--border-light)] pt-3 text-xs font-semibold text-[var(--university-muted)]">
      <CalendarDays size={15} />
      {getProgramMeta(item) || "Program details unavailable"}
    </div>
  </article>
);

const UserCard = ({ item, roleLabel }) => (
  <article className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--success)_10%,white)] text-[var(--success)]">
        {roleLabel === "Coordinator" ? <ShieldCheck size={20} /> : <UserRound size={20} />}
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(item.status)}`}>
        {item.status || "active"}
      </span>
    </div>
    <h3 className="mt-4 line-clamp-2 text-sm font-bold text-[var(--university-ink)]">
      {getUserName(item)}
    </h3>
    <p className="mt-1 text-xs font-bold text-[var(--stratex-blue)]">{roleLabel}</p>
    <div className="mt-4 space-y-2 border-t border-[var(--border-light)] pt-3">
      <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--university-muted)]">
        <Mail size={14} className="shrink-0" />
        <span className="truncate">{getUserEmail(item)}</span>
      </p>
    </div>
  </article>
);

const SchoolRelatedGrid = ({ items = [], onPageChange, onPageSizeChange, pageSize, pagination, title, type }) => {
  const list = items;

  if (!list.length) {
    return <EmptyState title={title.toLowerCase()} />;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--university-ink)]">{title}</h2>
        <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
          {list.length} records shown for this school
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((item) => {
          if (type === "programs") {
            return <ProgramCard key={item._id || item.id || item.name} item={item} />;
          }

          return (
            <UserCard
              key={item._id || item.id || getUserEmail(item)}
              item={item}
              roleLabel={type === "coordinators" ? "Coordinator" : type === "faculty" ? "Faculty" : "Student"}
            />
          );
        })}
      </div>

      {pagination ? (
        <Pagination
          count={list.length}
          itemLabel={title.toLowerCase()}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          page={pagination.page}
          pageSize={pageSize}
          pageSizeOptions={[6, 9, 12, 24]}
          total={pagination.total}
          totalPages={pagination.totalPages}
        />
      ) : null}
    </section>
  );
};

export default SchoolRelatedGrid;
