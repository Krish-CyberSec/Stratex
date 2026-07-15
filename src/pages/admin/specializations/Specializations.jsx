import { Edit3, Plus, Search, Trash2, Verified, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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

const getInitialForm = (specialization = {}, programs = []) => ({
  programId: getId(specialization.programId) || getId(programs[0]) || "",
  name: specialization.name || "",
  description: specialization.description || "",
  status: specialization.status || "active",
});

const SpecializationFormModal = ({ error, loading, onClose, onSave, programs, specialization }) => {
  const [form, setForm] = useState(getInitialForm(specialization, programs));

  useEffect(() => {
    setForm(getInitialForm(specialization, programs));
  }, [programs, specialization]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canSubmit =
    form.programId &&
    form.name.trim().length >= 2 &&
    form.description.trim().length >= 2 &&
    !loading;

  const handleSubmit = (event) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-[var(--university-ink)]">
              {specialization ? "Edit Specialization" : "Create Specialization"}
            </h2>
            <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">
              Assign specialization details to a program.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--university-muted)]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Program</span>
            <select
              value={form.programId}
              onChange={(event) => updateField("programId", event.target.value)}
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
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
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Name</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
              placeholder="Artificial Intelligence"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="min-h-24 w-full rounded-lg border border-[var(--border)] px-3 py-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
              placeholder="Describe the specialization focus area."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 border-t border-[var(--border-light)] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-10 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Specialization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Specializations = () => {
  const { user } = useAuth();
  const [specializations, setSpecializations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [programId, setProgramId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const isSchoolAdmin = user?.roles?.includes("schoolAdmin");
  const ownSchoolId = getId(user?.schoolId);

  const loadPrograms = useCallback(async () => {
    try {
      const response = await getPrograms({
        page: 1,
        limit: 100,
        sortBy: "name",
        order: "asc",
        ...(isSchoolAdmin && ownSchoolId ? { schoolId: ownSchoolId } : {}),
      });
      setPrograms(getList(response));
    } catch {
      setPrograms([]);
    }
  }, [isSchoolAdmin, ownSchoolId]);

  const loadSpecializations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSpecializations({
        page,
        limit: pageSize,
        sortBy: "name",
        order: "asc",
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(programId ? { programId } : {}),
        ...(status ? { status } : {}),
      });
      setSpecializations(getList(response));
      setPagination(getPagination(response));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load specializations"));
      setSpecializations([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, programId, search, status]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    const timeout = setTimeout(loadSpecializations, 250);
    return () => clearTimeout(timeout);
  }, [loadSpecializations]);

  const openCreate = () => {
    setModalError("");
    setEditingSpecialization(null);
    setFormOpen(true);
  };

  const openEdit = (specialization) => {
    setModalError("");
    setEditingSpecialization(specialization);
    setFormOpen(true);
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
      await loadSpecializations();
    } catch (err) {
      setModalError(getErrorMessage(err, "Unable to save specialization"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (specialization) => {
    setError("");

    try {
      await deleteSpecialization(specialization._id);
      await loadSpecializations();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete specialization"));
    }
  };

  const activeCount = useMemo(
    () => specializations.filter((item) => item.status === "active").length,
    [specializations],
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--stratex-blue)]">
              <Verified size={23} />
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl font-black text-[var(--university-ink)]">Specializations</h1>
              <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
                {activeCount} active specializations in this view.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white"
          >
            <Plus size={17} />
            Add Specialization
          </button>
        </header>

        <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px_180px]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search specializations"
                className="h-11 w-full rounded-lg border border-[var(--border)] pl-10 pr-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
              />
            </div>
            <select
              value={programId}
              onChange={(event) => {
                setProgramId(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
            >
              <option value="">All programs</option>
              {programs.map((program) => (
                <option key={getId(program)} value={getId(program)}>
                  {program.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
              {error}
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border-light)]">
            <table className="w-full min-w-[780px] text-left">
              <thead className="bg-[var(--surface-soft)] text-[11px] font-black uppercase text-[var(--university-muted)]">
                <tr>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">
                      Loading specializations...
                    </td>
                  </tr>
                ) : specializations.length ? specializations.map((specialization) => (
                  <tr key={specialization._id} className="border-t border-[var(--border-light)]">
                    <td className="px-4 py-4">
                      <p className="font-black text-[var(--university-ink)]">{specialization.name}</p>
                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-[var(--university-muted)]">
                        {specialization.description || "No description"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[var(--university-muted)]">
                      {getProgramName(specialization)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black capitalize text-[var(--stratex-blue)]">
                        {specialization.status || "active"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Edit specialization"
                          onClick={() => openEdit(specialization)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--stratex-blue)]"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          title="Delete specialization"
                          onClick={() => handleDelete(specialization)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-[var(--error)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">
                      No specializations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            className="mt-4"
            count={specializations.length}
            itemLabel="specializations"
            onPageChange={setPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            total={pagination.total || specializations.length}
            totalPages={pagination.totalPages}
          />
        </section>
      </div>

      {formOpen ? (
        <SpecializationFormModal
          error={modalError}
          loading={modalLoading}
          onClose={() => {
            if (!modalLoading) setFormOpen(false);
          }}
          onSave={handleSave}
          programs={programs}
          specialization={editingSpecialization}
        />
      ) : null}
    </div>
  );
};

export default Specializations;
