import { CalendarDays, Edit3, Eye, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../../../services/eventService";

const getList = (response) => response?.data?.data || [];
const getPagination = (response) => response?.data?.pagination || {};
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const toDateTimeLocal = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const getInitialForm = (event = {}) => ({
  title: event.title || "",
  description: event.description || "",
  location: event.location || "",
  startDate: toDateTimeLocal(event.startDate),
  endDate: event.endDate ? toDateTimeLocal(event.endDate) : "",
  status: event.status || "scheduled",
});

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventFormModal = ({ error, event, loading, onClose, onSave }) => {
  const [form, setForm] = useState(getInitialForm(event));

  useEffect(() => {
    setForm(getInitialForm(event));
  }, [event]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canSubmit = form.title.trim().length >= 2 && form.startDate && !loading;

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    if (!canSubmit) return;

    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-[var(--university-ink)]">{event ? "Edit Event" : "Create Event"}</h2>
            <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">Manage event title, schedule, location, and status.</p>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--university-muted)]">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">{error}</div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Title</span>
            <input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Start Date</span>
              <input type="datetime-local" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">End Date</span>
              <input type="datetime-local" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Location</span>
              <input value={form.location} onChange={(e) => updateField("location", e.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Status</span>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Description</span>
            <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="min-h-28 w-full rounded-lg border border-[var(--border)] px-3 py-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
          </label>

          <div className="flex justify-end gap-3 border-t border-[var(--border-light)] pt-4">
            <button type="button" onClick={onClose} disabled={loading} className="h-10 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)]">Cancel</button>
            <button type="submit" disabled={!canSubmit} className="h-10 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEvents({
        page,
        limit: pageSize,
        sortBy: "startDate",
        order: "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(status ? { status } : {}),
      });
      setEvents(getList(response));
      setPagination(getPagination(response));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load events"));
      setEvents([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, status]);

  useEffect(() => {
    const timeout = setTimeout(loadEvents, 250);
    return () => clearTimeout(timeout);
  }, [loadEvents]);

  const openCreate = () => {
    setModalError("");
    setEditingEvent(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setModalError("");
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSave = async (payload) => {
    setModalLoading(true);
    setModalError("");

    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, payload);
      } else {
        await createEvent(payload);
      }
      setFormOpen(false);
      setEditingEvent(null);
      await loadEvents();
    } catch (err) {
      setModalError(getErrorMessage(err, "Unable to save event"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (event) => {
    setError("");

    try {
      await deleteEvent(event._id);
      await loadEvents();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete event"));
    }
  };

  const activeCount = useMemo(() => events.filter((event) => event.status !== "inactive").length, [events]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--stratex-blue)]">
              <CalendarDays size={23} />
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl font-black text-[var(--university-ink)]">Events</h1>
              <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">{activeCount} active events in this view.</p>
            </div>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white">
            <Plus size={17} />
            Create Event
          </button>
        </header>

        <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search events" className="h-11 w-full rounded-lg border border-[var(--border)] pl-10 pr-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
            </div>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
              <option value="">All statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">{error}</div>
          ) : null}

          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border-light)]">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-[var(--surface-soft)] text-[11px] font-black uppercase text-[var(--university-muted)]">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">End</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="px-4 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">Loading events...</td></tr>
                ) : events.length ? events.map((event) => (
                  <tr key={event._id} className="border-t border-[var(--border-light)]">
                    <td className="px-4 py-4">
                      <p className="font-black text-[var(--university-ink)]">{event.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-[var(--university-muted)]">{event.description || "No description"}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[var(--university-muted)]">{formatDate(event.startDate)}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-[var(--university-muted)]">{formatDate(event.endDate)}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-[var(--university-muted)]">{event.location || "--"}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black capitalize text-[var(--stratex-blue)]">{event.status || "scheduled"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button type="button" title="View event" onClick={() => navigate(`/dashboard/events/${event._id}`)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--university-muted)]"><Eye size={15} /></button>
                        <button type="button" title="Edit event" onClick={() => openEdit(event)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--stratex-blue)]"><Edit3 size={15} /></button>
                        <button type="button" title="Delete event" onClick={() => handleDelete(event)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-[var(--error)]"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="px-4 py-12 text-center text-sm font-semibold text-[var(--university-muted)]">No events found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            className="mt-4"
            count={events.length}
            itemLabel="events"
            onPageChange={setPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            total={pagination.total || events.length}
            totalPages={pagination.totalPages}
          />
        </section>
      </div>

      {formOpen ? (
        <EventFormModal
          error={modalError}
          event={editingEvent}
          loading={modalLoading}
          onClose={() => {
            if (!modalLoading) setFormOpen(false);
          }}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
};

export default Events;
