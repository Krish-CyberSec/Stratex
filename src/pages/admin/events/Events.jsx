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
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { useAuth } from "../../../context/AuthContext";
import { deleteEvent, getEvents } from "../../../services/eventService";
import { getNoticeText } from "../notices/noticeContentUtils";

const getList = (response) => response?.data?.data || [];
const getPagination = (response) => response?.data?.pagination || {};
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");
const getUserRoles = (user = {}) => [
  ...new Set([...(Array.isArray(user.roles) ? user.roles : []), user.primaryRole, user.role].filter(Boolean)),
];

const sampleEvents = [
  {
    _id: "sample-south-france",
    title: "South Of France: Nice",
    description: "Break-taking sea-side beaches in the later hours of the afternoon. Explore the ancient town, stone pathways, and quiet plazas.",
    location: "Nice, France",
    startDate: "2026-08-22T09:30:00.000Z",
    endDate: "2026-08-22T16:30:00.000Z",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    isSample: true,
  },
  {
    _id: "sample-scotland",
    title: "Hiking In Scotland",
    description: "Mountain trails and quiet lakes create the perfect weekend field activity for students and faculty.",
    location: "Scotland",
    startDate: "2026-09-12T07:00:00.000Z",
    endDate: "2026-09-12T18:00:00.000Z",
    status: "postponed",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    isSample: true,
  },
  {
    _id: "sample-memphis",
    title: "Walking In Memphis",
    description: "A cultural walk through city stories, street music, and public spaces for the university travel group.",
    location: "Memphis, USA",
    startDate: "2026-09-27T10:00:00.000Z",
    endDate: "2026-09-27T15:00:00.000Z",
    status: "live",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    isSample: true,
  },
  {
    _id: "sample-nyc",
    title: "NYC: Greatest Place",
    description: "A campus travel showcase featuring architecture, public transit, and urban management planning.",
    location: "New York, USA",
    startDate: "2026-10-23T11:00:00.000Z",
    endDate: "2026-10-23T17:00:00.000Z",
    status: "live",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    isSample: true,
  },
  {
    _id: "sample-snow",
    title: "First Snow Storm",
    description: "Nature photography, weather systems, and outdoor preparedness workshop for student clubs.",
    location: "Switzerland",
    startDate: "2026-11-21T08:30:00.000Z",
    endDate: "2026-11-21T14:00:00.000Z",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=900&q=80",
    isSample: true,
  },
  {
    _id: "sample-berlin",
    title: "Breathing Berlin",
    description: "A seminar about sustainable cities, transport, culture, and public design in Berlin.",
    location: "Berlin, Germany",
    startDate: "2026-12-11T12:00:00.000Z",
    endDate: "2026-12-11T16:00:00.000Z",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    isSample: true,
  },
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

const getEventImage = (event, index = 0) =>
  event.banner || event.poster || event.image || sampleEvents[index % sampleEvents.length]?.image || sampleEvents[0].image;

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
  const displayStatus = event.isSample ? realStatus : realStatus;

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--border-light)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <img
          src={getEventImage(event, index)}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
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
            {!event.isSample && canManage ? (
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
  const [error, setError] = useState("");
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
    if (event.isSample) return;
    navigate(`/dashboard/events/${event._id}`, { state: { edit: true } });
  };

  const handleDelete = async (event) => {
    if (event.isSample) return;
    if (!window.confirm(`Delete ${event.title}?`)) return;
    setError("");

    try {
      await deleteEvent(event._id);
      await loadEvents();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete event"));
    }
  };

  const displayEvents = events.length || loading || error ? events : sampleEvents;
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
    </div>
  );
};

export default Events;
