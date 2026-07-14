import { ArrowLeft, CalendarDays, Clock, MapPin, RefreshCw, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../../../services/eventService";

const getPayload = (response) => response?.data?.data || response?.data?.event || response?.data;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

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

const getCreatorName = (creator) =>
  [creator?.firstName, creator?.lastName].filter(Boolean).join(" ") || "Administration";

const statusTone = {
  scheduled: "bg-blue-50 text-[var(--stratex-blue)]",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-[var(--error)]",
  inactive: "bg-slate-100 text-slate-600",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-lg border border-[var(--border-light)] bg-white p-4">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[var(--stratex-blue)]">
      <Icon size={17} />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-black uppercase text-[var(--university-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-[var(--university-ink)]">{value}</p>
    </div>
  </div>
);

const EventView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEventById(id);
      setEvent(getPayload(response));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load event details"));
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1180px] space-y-4">
          <div className="h-16 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="h-[520px] animate-pulse rounded-xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-bold text-[var(--error)]">{error || "Event not found"}</p>
          <button type="button" onClick={loadEvent} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white">
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
              <span>Dashboard</span>
              <span>/</span>
              <span>Events</span>
              <span>/</span>
              <span className="line-clamp-1 text-[var(--university-ink)]">{event.title}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/events")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
                title="Back to events"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                <h1 className="line-clamp-2 text-2xl font-black leading-tight text-[var(--university-ink)]">{event.title}</h1>
              </div>
            </div>
          </div>
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-black capitalize ${statusTone[event.status] || statusTone.scheduled}`}>
            {event.status || "scheduled"}
          </span>
        </header>

        <main className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <section className="min-w-0 rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[11px] font-black uppercase text-[var(--stratex-blue)]">Event Details</p>
            <div className="mt-4 max-w-none text-sm font-medium leading-7 text-[var(--text-secondary)]">
              {event.description || "No event description is available."}
            </div>
          </section>

          <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <InfoRow icon={CalendarDays} label="Starts" value={formatDate(event.startDate)} />
            <InfoRow icon={Clock} label="Ends" value={formatDate(event.endDate)} />
            <InfoRow icon={MapPin} label="Location" value={event.location || "Not specified"} />
            <InfoRow icon={UserRound} label="Created By" value={getCreatorName(event.createdBy)} />
          </aside>
        </main>
      </div>
    </div>
  );
};

export default EventView;
