import { Search } from "lucide-react";
import ProgramStatusBadge from "../ProgramStatusBadge";
import { getPersonName, getSubjectType } from "./programDetailUtils";

const ProgramSubjectTable = ({ loading, search, selectedSemester, subjects, onSearch }) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
    <div className="flex flex-col gap-3 border-b border-[var(--border-light)] px-4 py-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-bold text-[var(--university-ink)]">Semester {selectedSemester} Subjects</h2>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[var(--stratex-blue)]">
            {subjects.length} Subjects
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">Subjects offered in this semester.</p>
      </div>

      <label className="relative w-full lg:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={15} />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search subjects..."
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-white pl-9 pr-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        />
      </label>
    </div>

    <div className="hidden overflow-x-auto lg:block">
      <table className="min-w-full table-fixed text-left">
        <thead className="bg-[var(--surface-soft)] text-xs font-bold text-[var(--university-muted)]">
          <tr>
            <th className="w-[16%] px-5 py-3">Code</th>
            <th className="w-[32%] px-5 py-3">Subject Name</th>
            <th className="w-[10%] px-5 py-3">Credits</th>
            <th className="w-[14%] px-5 py-3">Type</th>
            <th className="w-[18%] px-5 py-3">Coordinator</th>
            <th className="w-[10%] px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)]">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td colSpan={6} className="px-5 py-4">
                  <div className="h-9 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
                </td>
              </tr>
            ))
          ) : subjects.length ? (
            subjects.map((subject) => (
              <tr key={subject._id} className="text-xs font-semibold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]">
                <td className="px-5 py-4">{subject.code}</td>
                <td className="px-5 py-4">
                  <p className="truncate font-bold">{subject.name}</p>
                  <p className="truncate text-[11px] text-[var(--university-muted)]">{subject.description || "No description available"}</p>
                </td>
                <td className="px-5 py-4">{subject.credits ?? "--"}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700">
                    {getSubjectType(subject)}
                  </span>
                </td>
                <td className="px-5 py-4">{getPersonName(subject.coordinatorId)}</td>
                <td className="px-5 py-4"><ProgramStatusBadge status={subject.status} /></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">
                No subjects found for this semester.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="grid gap-3 p-4 lg:hidden">
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        ))
      ) : subjects.length ? (
        subjects.map((subject) => (
          <article key={subject._id} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[var(--stratex-blue)]">{subject.code}</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold text-[var(--university-ink)]">{subject.name}</h3>
              </div>
              <ProgramStatusBadge status={subject.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-[var(--university-muted)]">
              <span>Credits: <strong className="text-[var(--university-ink)]">{subject.credits ?? "--"}</strong></span>
              <span>Type: <strong className="text-[var(--university-ink)]">{getSubjectType(subject)}</strong></span>
            </div>
            <p className="mt-2 truncate text-xs font-semibold text-[var(--university-muted)]">
              Coordinator: {getPersonName(subject.coordinatorId)}
            </p>
          </article>
        ))
      ) : (
        <div className="rounded-xl border border-[var(--border-light)] px-4 py-10 text-center text-sm font-semibold text-[var(--university-muted)]">
          No subjects found for this semester.
        </div>
      )}
    </div>
  </section>
);

export default ProgramSubjectTable;
