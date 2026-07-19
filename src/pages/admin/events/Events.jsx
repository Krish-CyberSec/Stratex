import {
  ArrowRight,
  CalendarDays,
  Edit3,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { useAuth } from "../../../context/AuthContext";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../../../services/eventService";
import NoticeRichTextEditor from "../notices/components/create/NoticeRichTextEditor";
import { getNoticeText } from "../notices/noticeContentUtils";

const getList = (response) => response?.data?.data || [];
const getPagination = (response) => response?.data?.pagination || {};
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");
const getUserRoles = (user = {}) => [
  ...new Set([...(Array.isArray(user.roles) ? user.roles : []), user.primaryRole, user.role].filter(Boolean)),
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Inactive", value: "inactive" },
];

const statusLabel = (status = "scheduled") => {
  if (status === "cancelled") return "Cancelled";
  if (status === "completed") return "Completed";
  if (status === "inactive") return "Inactive";
  if (status === "live") return "Live";
  if (status === "postponed") return "Postponed";
  return "Scheduled";
};

const statusClasses = {
  scheduled: "bg-red-500 text-white",
  completed: "bg-green-600 text-white",
  cancelled: "bg-orange-600 text-white",
  inactive: "bg-slate-600 text-white",
  live: "bg-red-500 text-white",
  postponed: "bg-orange-500 text-white",
};

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
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getEventImage = (event) => event.banner || event.poster || event.image || "";

const EventFormModal = ({ error, event, loading, onClose, onSave }) => {
  const [form, setForm] = useState(getInitialForm(event));

  useEffect(() => {
    setForm(getInitialForm(event));
  }, [event]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canSubmit = form.title.trim().length >= 2 && getNoticeText(form.description).trim().length >= 2 && form.startDate && !loading;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-[var(--university-ink)]">{event ? "Edit Event" : "Create Event"}</h2>
            <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">Manage event title, schedule, location, and status.</p>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--university-muted)]">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(92vh-74px)] space-y-4 overflow-y-auto p-5">
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

          <div>
            <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Description</span>
            <NoticeRichTextEditor
              ariaLabel="Event description"
              maxLength={1000}
              onChange={(value) => updateField("description", value)}
              placeholder="Write event description..."
              resetKey={event?._id || "new-event"}
              value={form.description}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-4 sm:flex-row sm:justify-end">
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

const EventToolbar = ({
  date,
  onClear,
  onDateChange,
  onSearchChange,
  onStatusChange,
  onUpcomingChange,
  search,
  status,
  upcomingOnly,
}) => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-3 shadow-sm">
    <div className="grid items-center gap-3 xl:grid-cols-[minmax(260px,1fr)_170px_200px_150px_150px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search events by title, location..."
          className="h-11 w-full rounded-lg border border-[var(--border)] bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        />
      </div>
      <label className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-2">
        <span className="text-xs font-black text-[var(--university-ink)]">Status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        >
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label className="relative">
        <CalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
        <input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 pr-10 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
        />
      </label>
      <label className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-bold text-[var(--university-ink)]">
        <span>Upcoming Only</span>
        <button
          type="button"
          onClick={() => onUpcomingChange(!upcomingOnly)}
          className={`relative h-5 w-9 rounded-full transition ${upcomingOnly ? "bg-[var(--stratex-blue)]" : "bg-slate-200"}`}
        >
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${upcomingOnly ? "left-4" : "left-0.5"}`} />
        </button>
      </label>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-black text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
      >
        <RefreshCw size={15} />
        Clear Filters
      </button>
    </div>
  </section>
);

const EventCard = ({ canManage, event, index, onDelete, onEdit, onView }) => {
  const realStatus = event.status || "scheduled";
  const displayStatus = realStatus;
  const eventImage = getEventImage(event);

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--border-light)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        {eventImage ? (
          <img
            src={eventImage}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--surface-soft)] text-[var(--university-muted)]">
            <CalendarDays size={30} />
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-black uppercase tracking-wide ${statusClasses[displayStatus] || statusClasses.scheduled}`}>
          {statusLabel(displayStatus)}
        </span>
      </div>
      <div className="p-4">
        <button
          type="button"
          onClick={() => onView(event)}
          className="line-clamp-1 text-left text-base font-black text-[var(--university-ink)] transition hover:text-[var(--stratex-blue)]"
        >
          {event.title}
        </button>
        <p className="mt-2 line-clamp-3 min-h-[60px] text-sm font-semibold leading-5 text-[var(--university-muted)]">
          {getNoticeText(event.description) || "No description has been added for this event yet."}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[var(--university-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} className="text-[var(--success)]" />
            {formatDate(event.startDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-[var(--stratex-blue)]" />
            {event.location || "Location TBA"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onView(event)}
            className="inline-flex items-center gap-1.5 text-xs font-black text-[var(--stratex-blue)] transition hover:text-[var(--stratex-blue-dark)]"
          >
            Read More
            <ArrowRight size={13} />
          </button>
          <div className="flex items-center gap-2">
            {canManage ? (
              <>
                <button
                  type="button"
                  title="Edit event"
                  onClick={() => onEdit(event)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--university-muted)] hover:bg-blue-50 hover:text-[var(--stratex-blue)]"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  title="Delete event"
                  onClick={() => onDelete(event)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--university-muted)] hover:bg-red-50 hover:text-[var(--error)]"
                >
                  <Trash2 size={15} />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const roles = getUserRoles(user);
  const canCreate = roles.some((role) => ["superAdmin", "schoolAdmin"].includes(role));
  const isSuperAdmin = roles.includes("superAdmin");
  const canManageEvent = (event) =>
    Boolean(event?.canManage) || isSuperAdmin || getId(event?.createdBy) === getId(user);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEvents({
        page,
        limit: pageSize,
        sortBy: "startDate",
        order: upcomingOnly ? "asc" : "desc",
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(status ? { status } : {}),
        ...(date ? { date } : {}),
        ...(upcomingOnly ? { upcoming: true } : {}),
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
  }, [date, page, pageSize, search, status, upcomingOnly]);

  useEffect(() => {
    const timeout = setTimeout(loadEvents, 250);
    return () => clearTimeout(timeout);
  }, [loadEvents]);

  const openCreate = () => {
    if (!canCreate) return;
    navigate("/dashboard/events/create");
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
    if (!window.confirm(`Delete ${event.title}?`)) return;
    setError("");

    try {
      await deleteEvent(event._id);
      await loadEvents();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete event"));
    }
  };

  const displayEvents = events;
  const total = pagination.total || displayEvents.length;

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setDate("");
    setUpcomingOnly(false);
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
              <span className="text-[var(--university-ink)]">Events</span>
            </div>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[var(--university-ink)]">Events</h1>
            <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
              Browse and discover upcoming events, workshops, and activities.
            </p>
          </div>
          {canCreate ? (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
            >
              <Plus size={17} />
              Create Event
            </button>
          ) : null}
        </header>

        <EventToolbar
          date={date}
          onClear={clearFilters}
          onDateChange={(value) => {
            setDate(value);
            setPage(1);
          }}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onUpcomingChange={(value) => {
            setUpcomingOnly(value);
            setPage(1);
          }}
          search={search}
          status={status}
          upcomingOnly={upcomingOnly}
        />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">{error}</div>
        ) : null}

        {loading ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: pageSize }).map((_, index) => (
              <div key={index} className="h-[340px] animate-pulse rounded-lg bg-white shadow-sm" />
            ))}
          </section>
        ) : displayEvents.length ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayEvents.map((event, index) => (
              <EventCard
                key={event._id || index}
                event={event}
                index={index}
                canManage={canManageEvent(event)}
                onDelete={handleDelete}
                onEdit={openEdit}
                onView={(item) => navigate(`/dashboard/events/${item._id}`)}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-[var(--border-light)] bg-white px-5 py-14 text-center shadow-sm">
            <SlidersHorizontal className="mx-auto text-[var(--university-muted)]" size={34} />
            <p className="mt-4 text-sm font-bold text-[var(--university-muted)]">No events found.</p>
          </section>
        )}

        <Pagination
          count={displayEvents.length}
          itemLabel="events"
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={[6, 9, 12]}
          total={total}
          totalPages={pagination.totalPages}
        />
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
