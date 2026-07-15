import { Eye, Trash2 } from "lucide-react";
import DegreeBadge from "./DegreeBadge";
import ProgramStatusBadge from "./ProgramStatusBadge";

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getSchoolName = (program) => program.schoolId?.name || "Not assigned";

const ProgramTable = ({ loading, onDelete, onView, programs }) => {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
      <div className="border-b border-[var(--border-light)] px-4 py-4">
        <h2 className="text-sm font-bold text-[var(--university-ink)]">All Programs</h2>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full table-fixed text-left">
          <thead className="bg-[var(--surface-soft)] text-xs font-bold text-[var(--university-muted)]">
            <tr>
              <th className="w-[28%] px-5 py-3">Program Name</th>
              <th className="w-[18%] px-5 py-3">School</th>
              <th className="w-[11%] px-5 py-3">Degree Type</th>
              <th className="w-[10%] px-5 py-3">Duration</th>
              <th className="w-[10%] px-5 py-3">Semesters</th>
              <th className="w-[10%] px-5 py-3">Status</th>
              <th className="w-[13%] px-5 py-3">Created At</th>
              <th className="w-[96px] px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-light)]">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={8} className="px-5 py-4">
                    <div className="h-10 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
                  </td>
                </tr>
              ))
            ) : programs.length ? (
              programs.map((program) => (
                <tr key={program._id} className="text-sm text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]">
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--stratex-blue)]">
                        {program.name?.slice(0, 1)?.toUpperCase() || "P"}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold">{program.name}</p>
                        <p className="line-clamp-1 max-w-full text-xs font-medium text-[var(--university-muted)]">
                          {program.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[var(--university-ink)]">{getSchoolName(program)}</td>
                  <td className="px-5 py-4"><DegreeBadge type={program.degreeType} /></td>
                  <td className="px-5 py-4 text-xs font-semibold">{program.duration} Years</td>
                  <td className="px-5 py-4 text-xs font-semibold">{Number(program.duration || 0) * 2}</td>
                  <td className="px-5 py-4"><ProgramStatusBadge status={program.status} /></td>
                  <td className="px-5 py-4 text-xs font-semibold">{formatDate(program.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => onView(program)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] hover:text-[var(--stratex-blue)]" title="View program">
                        <Eye size={15} />
                      </button>
                      <button type="button" onClick={() => onDelete(program)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)] hover:text-[var(--error)]" title="Delete program">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">
                  No programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
          ))
        ) : programs.length ? (
          programs.map((program) => (
            <article key={program._id} className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-[var(--university-ink)]">{program.name}</h3>
                  <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">{getSchoolName(program)}</p>
                </div>
                <button type="button" onClick={() => onView(program)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--university-muted)]">
                  <Eye size={16} />
                </button>
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{program.description || "No description available"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <DegreeBadge type={program.degreeType} />
                <ProgramStatusBadge status={program.status} />
                <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-bold text-[var(--university-muted)]">{program.duration} Years</span>
                <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-bold text-[var(--university-muted)]">{Number(program.duration || 0) * 2} Semesters</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => onView(program)} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--stratex-blue)]">View Details</button>
                <button type="button" onClick={() => onDelete(program)} className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-[var(--error)]">Delete</button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-10 text-center text-sm font-semibold text-[var(--university-muted)]">
            No programs found.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramTable;
