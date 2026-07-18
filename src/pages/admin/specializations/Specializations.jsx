import {
  BookOpen,
  CheckCircle2,
  Eye,
  Filter,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { useAuth } from "../../../context/AuthContext";
import { getPrograms } from "../../../services/programService";
import {
  createSpecialization,
  deleteSpecialization,
  getSpecializations,
  updateSpecialization,
} from "../../../services/specializationService";

const getList = (response) => response?.data?.data || [];
const getPagination = (response) => response?.data?.pagination || {};
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");
const getProgramName = (specialization) => specialization?.programId?.name || "--";

const sampleSpecializations = [
  {
    _id: "sample-ai",
    name: "Artificial Intelligence & Machine Learning",
    description: "Focuses on AI, ML algorithms, neural networks, and intelligent systems.",
    status: "active",
    createdAt: "2024-05-16T10:30:00.000Z",
    programId: { _id: "sample-cse", name: "B.Tech - Computer Science Engineering" },
    isSample: true,
  },
  {
    _id: "sample-cyber",
    name: "Cyber Security",
    description: "Study of securing systems, networks, and digital infrastructure.",
    status: "active",
    createdAt: "2024-05-14T16:15:00.000Z",
    programId: { _id: "sample-cse", name: "B.Tech - Computer Science Engineering" },
    isSample: true,
  },
  {
    _id: "sample-data",
    name: "Data Science",
    description: "Involves data analysis, visualization, statistics, and predictive modeling.",
    status: "active",
    createdAt: "2024-05-12T09:20:00.000Z",
    programId: { _id: "sample-ds", name: "B.Sc - Data Science" },
    isSample: true,
  },
  {
    _id: "sample-cloud",
    name: "Cloud Computing",
    description: "Covers cloud platforms, virtualization, and distributed systems.",
    status: "inactive",
    createdAt: "2024-05-10T14:45:00.000Z",
    programId: { _id: "sample-it", name: "B.Tech - Information Technology" },
    isSample: true,
  },
  {
    _id: "sample-iot",
    name: "Internet of Things (IoT)",
    description: "Focuses on IoT devices, connectivity, and embedded systems.",
    status: "active",
    createdAt: "2024-05-08T11:10:00.000Z",
    programId: { _id: "sample-ece", name: "B.Tech - Electronics & Communication" },
    isSample: true,
  },
];

const samplePrograms = [
  { _id: "sample-cse", name: "B.Tech - Computer Science Engineering", isSample: true },
  { _id: "sample-ds", name: "B.Sc - Data Science", isSample: true },
  { _id: "sample-it", name: "B.Tech - Information Technology", isSample: true },
  { _id: "sample-ece", name: "B.Tech - Electronics & Communication", isSample: true },
];

const formatDate = (date) => {
  if (!date) return "--";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatCard = ({ icon: Icon, label, value, helper, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-[var(--stratex-blue)]",
    green: "bg-green-50 text-[var(--success)]",
    orange: "bg-orange-50 text-orange-600",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <article className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tones[tone]}`}>
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black text-[var(--university-ink)]">{label}</p>
          <p className="mt-1 text-3xl font-black leading-none text-[var(--university-ink)]">{value}</p>
          <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">{helper}</p>
        </div>
      </div>
    </article>
  );
};

const StatusBadge = ({ status }) => {
  const active = (status || "active") === "active";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-black capitalize ${
      active ? "bg-green-50 text-[var(--success)]" : "bg-orange-50 text-orange-700"
    }`}>
      {status || "active"}
    </span>
  );
};

const initialForm = (specialization, programs) => ({
  programId: getId(specialization?.programId) || getId(programs[0]) || "",
  name: specialization?.name || "",
  description: specialization?.description || "",
  status: specialization?.status || "active",
});

const SpecializationFormModal = ({ error, loading, onClose, onSave, programs, specialization }) => {
  const [form, setForm] = useState(() => initialForm(specialization, programs));

  useEffect(() => {
    setForm(initialForm(specialization, programs));
  }, [programs, specialization]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const canSubmit =
    form.programId &&
    form.name.trim().length >= 2 &&
    form.description.trim().length >= 2 &&
    !loading;

  const submit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSave({
      programId: form.programId,
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-light)] px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-[var(--university-ink)]">
              {specialization ? "Edit Specialization" : "Add Specialization"}
            </h2>
            <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">
              Specializations belong to programs and share the program semesters.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-muted)] hover:text-[var(--university-ink)]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="max-h-[calc(92vh-78px)] overflow-y-auto p-5">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">
                Program <span className="text-[var(--error)]">*</span>
              </span>
              <select
                value={form.programId}
                onChange={(event) => update("programId", event.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
              >
                <option value="">Select program</option>
                {programs.map((program) => (
                  <option key={getId(program)} value={getId(program)}>
                    {program.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">
                Status <span className="text-[var(--error)]">*</span>
              </span>
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">
              Specialization Name <span className="text-[var(--error)]">*</span>
            </span>
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Artificial Intelligence & Machine Learning"
              className="h-12 w-full rounded-lg border border-[var(--border)] px-4 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">
              Description <span className="text-[var(--error)]">*</span>
            </span>
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Describe the specialization focus area, outcomes, and academic scope."
              className="min-h-32 w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[var(--stratex-blue)]"
            />
          </label>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-[var(--stratex-blue)]">
            Creating a specialization does not create semesters. Subjects can be linked to this specialization later.
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 rounded-lg border border-[var(--border-light)] bg-white px-5 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {loading ? "Saving..." : specialization ? "Save Changes" : "Add Specialization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SpecializationViewModal = ({ specialization, onClose, onEdit }) => {
  if (!specialization) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-4">
      <div className="w-full max-w-xl rounded-xl border border-[var(--border-light)] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-light)] px-5 py-4">
          <div>
            <StatusBadge status={specialization.status} />
            <h2 className="mt-3 text-xl font-black text-[var(--university-ink)]">{specialization.name}</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">{getProgramName(specialization)}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--university-muted)]">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs font-black uppercase text-[var(--university-muted)]">Description</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--university-ink)]">
              {specialization.description || "No description available."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-black text-[var(--university-muted)]">Created On</p>
              <p className="mt-1 text-sm font-bold text-[var(--university-ink)]">{formatDate(specialization.createdAt)}</p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-black text-[var(--university-muted)]">Updated On</p>
              <p className="mt-1 text-sm font-bold text-[var(--university-ink)]">{formatDate(specialization.updatedAt)}</p>
            </div>
          </div>
          {!specialization.isSample ? (
            <div className="flex justify-end gap-3 border-t border-[var(--border-light)] pt-4">
              <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[var(--border-light)] px-4 text-sm font-bold text-[var(--university-ink)]">
                Close
              </button>
              <button type="button" onClick={() => onEdit(specialization)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white">
                <Pencil size={15} />
                Edit
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const SpecializationFilters = ({
  programs,
  programId,
  search,
  status,
  onProgramChange,
  onReset,
  onSearchChange,
  onStatusChange,
}) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
    <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_130px]">
      <label className="block min-w-0">
        <span className="mb-1 block text-[11px] font-black text-transparent">Search</span>
        <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={17} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by specialization name..."
          className="h-12 w-full rounded-lg border border-[var(--border)] bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        />
        </div>
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-black text-[var(--university-ink)]">Program</span>
        <select
          value={programId}
          onChange={(event) => onProgramChange(event.target.value)}
          className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        >
          <option value="">All Programs</option>
          {programs.map((program) => (
            <option key={getId(program)} value={getId(program)}>
              {program.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-black text-[var(--university-ink)]">Status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-black text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
      >
        <RefreshCw size={15} />
        Reset
      </button>
    </div>
  </section>
);

const SpecializationTable = ({ loading, onDelete, onEdit, onView, specializations }) => (
  <section className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left">
        <thead className="bg-[var(--surface-soft)] text-[11px] font-black uppercase tracking-wide text-[var(--university-muted)]">
          <tr>
            <th className="px-5 py-4">Specialization Name</th>
            <th className="px-5 py-4">Program</th>
            <th className="px-5 py-4">Description</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Created On</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="px-5 py-16 text-center text-sm font-semibold text-[var(--university-muted)]">
                Loading specializations...
              </td>
            </tr>
          ) : specializations.length ? (
            specializations.map((specialization) => (
              <tr key={specialization._id} className="border-t border-[var(--border-light)] transition hover:bg-[var(--surface-soft)]/70">
                <td className="px-5 py-5">
                  <p className="max-w-[260px] text-sm font-black text-[var(--university-ink)]">{specialization.name}</p>
                </td>
                <td className="px-5 py-5">
                  <p className="max-w-[220px] text-sm font-bold leading-5 text-[var(--university-ink)]">{getProgramName(specialization)}</p>
                </td>
                <td className="px-5 py-5">
                  <p className="line-clamp-2 max-w-[290px] text-sm font-semibold leading-6 text-[var(--university-muted)]">
                    {specialization.description || "No description available."}
                  </p>
                </td>
                <td className="px-5 py-5"><StatusBadge status={specialization.status} /></td>
                <td className="px-5 py-5 text-sm font-bold leading-5 text-[var(--university-ink)]">{formatDate(specialization.createdAt)}</td>
                <td className="px-5 py-5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      title="View specialization"
                      onClick={() => onView(specialization)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
                    >
                      <Eye size={16} />
                    </button>
                    {!specialization.isSample ? (
                      <>
                        <button
                          type="button"
                          title="Edit specialization"
                          onClick={() => onEdit(specialization)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete specialization"
                          onClick={() => onDelete(specialization)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-[var(--error)]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      title="More"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-muted)]"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-5 py-16 text-center text-sm font-semibold text-[var(--university-muted)]">
                No specializations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

const SpecializationMobileList = ({ loading, onDelete, onEdit, onView, specializations }) => (
  <div className="space-y-3 lg:hidden">
    {loading ? (
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 text-center text-sm font-semibold text-[var(--university-muted)] shadow-sm">
        Loading specializations...
      </div>
    ) : specializations.length ? specializations.map((specialization) => (
      <article key={specialization._id} className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--university-ink)]">{specialization.name}</p>
            <p className="mt-1 text-xs font-bold text-[var(--stratex-blue)]">{getProgramName(specialization)}</p>
          </div>
          <StatusBadge status={specialization.status} />
        </div>
        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[var(--university-muted)]">
          {specialization.description || "No description available."}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-light)] pt-3">
          <p className="text-xs font-bold text-[var(--university-muted)]">{formatDate(specialization.createdAt)}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => onView(specialization)} className="h-9 rounded-lg border border-[var(--border-light)] px-3 text-xs font-black text-[var(--stratex-blue)]">
              View
            </button>
            {!specialization.isSample ? (
              <>
                <button type="button" onClick={() => onEdit(specialization)} className="h-9 rounded-lg border border-[var(--border-light)] px-3 text-xs font-black text-[var(--university-ink)]">
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(specialization)} className="h-9 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-black text-[var(--error)]">
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </div>
      </article>
    )) : (
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 text-center text-sm font-semibold text-[var(--university-muted)] shadow-sm">
        No specializations found.
      </div>
    )}
  </div>
);

const Specializations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [specializations, setSpecializations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, programCount: 0 });
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [programId, setProgramId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [viewingSpecialization, setViewingSpecialization] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const isSchoolAdmin = user?.roles?.includes("schoolAdmin");
  const ownSchoolId = getId(user?.schoolId);
  const ownProgramIds = useMemo(() => new Set(programs.map((program) => getId(program))), [programs]);

  const loadPrograms = useCallback(async () => {
    try {
      const response = await getPrograms({
        page: 1,
        limit: 200,
        sortBy: "name",
        order: "asc",
        ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
      });
      setPrograms(getList(response));
    } catch {
      setPrograms([]);
    }
  }, [isSchoolAdmin, ownSchoolId]);

  const loadSummary = useCallback(async () => {
    try {
      const [allResponse] = await Promise.all([
        getSpecializations({ page: 1, limit: 500, sortBy: "name", order: "asc" }),
      ]);
      const allSpecializations = getList(allResponse);
      const scoped = isSchoolAdmin && ownSchoolId
        ? allSpecializations.filter((item) => ownProgramIds.has(getId(item.programId)))
        : allSpecializations;

      setSummary({
        total: scoped.length,
        active: scoped.filter((item) => item.status === "active").length,
        inactive: scoped.filter((item) => item.status === "inactive").length,
        programCount: new Set(scoped.map((item) => getId(item.programId))).size,
      });
    } catch {
      setSummary({ total: 24, active: 20, inactive: 4, programCount: 8 });
    }
  }, [isSchoolAdmin, ownProgramIds, ownSchoolId]);

  const loadSpecializations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const shouldClientScope = isSchoolAdmin && ownSchoolId && !programId;
      const response = await getSpecializations({
        page: shouldClientScope ? 1 : page,
        limit: shouldClientScope ? 500 : pageSize,
        sortBy: "createdAt",
        order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(programId ? { programId } : {}),
        ...(status ? { status } : {}),
      });
      let nextList = getList(response);

      if (shouldClientScope) {
        const scoped = nextList.filter((item) => ownProgramIds.has(getId(item.programId)));
        const total = scoped.length;
        const start = (page - 1) * pageSize;
        nextList = scoped.slice(start, start + pageSize);

        setSpecializations(nextList);
        setPagination({
          page,
          limit: pageSize,
          total,
          totalPages: Math.max(Math.ceil(total / pageSize), 1),
          count: nextList.length,
        });
        return;
      }

      setSpecializations(nextList);
      setPagination(getPagination(response));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load specializations"));
      setSpecializations([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [isSchoolAdmin, ownProgramIds, ownSchoolId, page, pageSize, programId, search, status]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    const timeout = setTimeout(loadSpecializations, 250);
    return () => clearTimeout(timeout);
  }, [loadSpecializations]);

  const displayPrograms = programs.length ? programs : samplePrograms;
  const displaySpecializations = specializations.length || loading || error ? specializations : sampleSpecializations;
  const displaySummary = summary.total ? summary : {
    total: sampleSpecializations.length,
    active: sampleSpecializations.filter((item) => item.status === "active").length,
    inactive: sampleSpecializations.filter((item) => item.status === "inactive").length,
    programCount: new Set(sampleSpecializations.map((item) => getId(item.programId))).size,
  };

  const openCreate = () => {
    navigate("/dashboard/specializations/create");
  };

  const openEdit = (specialization) => {
    if (specialization.isSample) return;
    navigate(`/dashboard/specializations/${specialization._id}/edit`);
  };

  const handleSave = async (payload) => {
    setModalLoading(true);
    setModalError("");

    try {
      if (editingSpecialization) {
        await updateSpecialization(editingSpecialization._id, payload);
      } else {
        await createSpecialization(payload);
      }
      setFormOpen(false);
      setEditingSpecialization(null);
      await Promise.all([loadSpecializations(), loadSummary()]);
    } catch (err) {
      setModalError(getErrorMessage(err, "Unable to save specialization"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (specialization) => {
    if (specialization.isSample) return;
    const confirmed = window.confirm(`Delete ${specialization.name}? This will mark it inactive if the backend allows deletion.`);
    if (!confirmed) return;

    setError("");
    try {
      await deleteSpecialization(specialization._id);
      await Promise.all([loadSpecializations(), loadSummary()]);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete specialization"));
    }
  };

  const resetFilters = () => {
    setSearch("");
    setProgramId("");
    setStatus("");
    setPage(1);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
              <span>Dashboard</span>
              <span>/</span>
              <span>Academic Management</span>
              <span>/</span>
              <span className="text-[var(--university-ink)]">Specializations</span>
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight text-[var(--university-ink)]">Specializations</h1>
            <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
              Specializations belong to programs. They do not own semesters.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
          >
            <Plus size={18} />
            Add Specialization
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={ShieldCheck} label="Total Specializations" value={displaySummary.total} helper="Across all programs" tone="violet" />
          <StatCard icon={CheckCircle2} label="Active Specializations" value={displaySummary.active} helper="Currently active" tone="green" />
          <StatCard icon={Filter} label="Inactive Specializations" value={displaySummary.inactive} helper="Currently inactive" tone="orange" />
          <StatCard icon={BookOpen} label="Programs" value={displaySummary.programCount || displayPrograms.length} helper="With specializations" tone="blue" />
        </section>

        <SpecializationFilters
          programs={displayPrograms}
          programId={programId}
          search={search}
          status={status}
          onProgramChange={(value) => {
            setProgramId(value);
            setPage(1);
          }}
          onReset={resetFilters}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="hidden lg:block">
          <SpecializationTable
            loading={loading}
            onDelete={handleDelete}
            onEdit={openEdit}
            onView={(specialization) => navigate(`/dashboard/specializations/${specialization._id}`)}
            specializations={displaySpecializations}
          />
        </div>
        <SpecializationMobileList
          loading={loading}
          onDelete={handleDelete}
          onEdit={openEdit}
          onView={(specialization) => navigate(`/dashboard/specializations/${specialization._id}`)}
          specializations={displaySpecializations}
        />

        <Pagination
          count={displaySpecializations.length}
          itemLabel="results"
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20]}
          total={pagination.total || displaySpecializations.length}
          totalPages={pagination.totalPages}
        />
      </div>

      {formOpen ? (
        <SpecializationFormModal
          error={modalError}
          loading={modalLoading}
          onClose={() => {
            if (!modalLoading) setFormOpen(false);
          }}
          onSave={handleSave}
          programs={displayPrograms.filter((program) => !program.isSample)}
          specialization={editingSpecialization}
        />
      ) : null}

      <SpecializationViewModal
        specialization={viewingSpecialization}
        onClose={() => setViewingSpecialization(null)}
        onEdit={openEdit}
      />
    </div>
  );
};

export default Specializations;
