import { ChevronRight, Eye } from "lucide-react";
import { SubjectStatusBadge, SubjectTypeBadge } from "./SubjectBadges";

const getPersonName = (person) => {
  if (!person) return "Not assigned";
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ");
  return name || person.universityAccount?.universityEmail || "Not assigned";
};

const SubjectTable = ({ canManage, loading, onDelete, onView, subjects }) => {
  return (
  <div className="overflow-hidden rounded-xl border border-[var(--border-light)]">
    <div className="hidden overflow-visible lg:block">
      <table className="min-w-full table-fixed text-left">
        <thead className="bg-[var(--surface-soft)] text-xs font-bold text-[var(--university-muted)]">
          <tr>
            <th className="w-[12%] px-5 py-3">Code</th>
            <th className="w-[30%] px-5 py-3">Subject Name</th>
            <th className="w-[14%] px-5 py-3">Type</th>
            <th className="w-[10%] px-5 py-3">Credits</th>
            <th className="w-[22%] px-5 py-3">Faculty / Coordinator</th>
            <th className="w-[10%] px-5 py-3">Status</th>
            <th className="w-[80px] px-5 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)] bg-white">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td colSpan={7} className="px-5 py-4">
                  <div className="h-9 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
                </td>
              </tr>
            ))
          ) : subjects.length ? (
            subjects.map((subject) => (
              <tr key={subject._id} className="text-xs font-semibold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]">
                <td className="px-5 py-4">{subject.code}</td>
                <td className="px-5 py-4">
                  <button type="button" onClick={() => onView(subject)} className="block max-w-full truncate text-left font-bold hover:text-[var(--stratex-blue)]">
                    {subject.name}
                  </button>
                  <p className="truncate text-[11px] text-[var(--university-muted)]">{subject.programId?.name || subject.description || "No description"}</p>
                </td>
                <td className="px-5 py-4"><SubjectTypeBadge subject={subject} /></td>
                <td className="px-5 py-4">{subject.credits ?? 0}</td>
                <td className="px-5 py-4">
                  <p className="truncate font-bold">{getPersonName(subject.coordinatorId)}</p>
                  <p className="text-[11px] text-[var(--university-muted)]">Coordinator</p>
                </td>
                <td className="px-5 py-4"><SubjectStatusBadge status={subject.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {canManage ? (
                      <button
                        type="button"
                        onClick={() => onView(subject)}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--stratex-blue)_28%,white)] bg-blue-50 px-3 text-xs font-black text-[var(--stratex-blue)] transition hover:border-[var(--stratex-blue)] hover:bg-[var(--stratex-blue)] hover:text-white"
                        title="View subject details"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onView(subject)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
                        title="View subject"
                      >
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">
                No subjects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="grid gap-3 bg-white p-4 lg:hidden">
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        ))
      ) : subjects.length ? (
        subjects.map((subject) => (
          <article key={subject._id} className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[var(--stratex-blue)]">{subject.code}</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold text-[var(--university-ink)]">{subject.name}</h3>
              </div>
              <SubjectStatusBadge status={subject.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <SubjectTypeBadge subject={subject} />
              <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--university-muted)]">{subject.credits ?? 0} Credits</span>
            </div>
            <p className="mt-3 truncate text-xs font-semibold text-[var(--university-muted)]">Coordinator: {getPersonName(subject.coordinatorId)}</p>
            <div className={`mt-4 grid gap-2 ${canManage ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              <button type="button" onClick={() => onView(subject)} className="rounded-lg border border-[var(--stratex-blue)] bg-blue-50 px-3 py-2 text-xs font-bold text-[var(--stratex-blue)]">View Details</button>
              {canManage ? (
                <button type="button" onClick={() => onDelete(subject)} className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-[var(--error)]">Deactivate</button>
              ) : null}
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-10 text-center text-sm font-semibold text-[var(--university-muted)]">
          No subjects found.
        </div>
      )}
    </div>
  </div>
  );
};

export default SubjectTable;
