import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Info,
  MapPin,
  RefreshCw,
  Tag,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../../../services/eventService";
import { getNoticeText, hasNoticeHtml, sanitizeNoticeHtml } from "../notices/noticeContentUtils";

const tabs = ["About", "Details", "Venue", "Organized By"];

const getPayload = (response) => response?.data?.data || response?.data?.event || response?.data;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const formatDateTime = (date) => {
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

const formatDateRange = (startDate, endDate) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (!start || Number.isNaN(start.getTime())) return { primary: "--", secondary: "Date" };

  const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const dayFormatter = new Intl.DateTimeFormat("en-IN", { weekday: "long" });
  const startText = dateFormatter.format(start);
  const endText = end && !Number.isNaN(end.getTime()) ? dateFormatter.format(end) : startText;
  const dayText = end && !Number.isNaN(end.getTime()) ? `${dayFormatter.format(start)} - ${dayFormatter.format(end)}` : dayFormatter.format(start);

  return { primary: startText === endText ? startText : `${startText} - ${endText}`, secondary: dayText };
};

const formatTimeRange = (startDate, endDate) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (!start || Number.isNaN(start.getTime())) return { primary: "--", secondary: "Local Time" };

  const formatter = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" });
  const startText = formatter.format(start);
  const endText = end && !Number.isNaN(end.getTime()) ? formatter.format(end) : "TBA";
  return { primary: `${startText} - ${endText}`, secondary: "Local Time" };
};

const getCreatorName = (creator) =>
  [creator?.firstName, creator?.lastName].filter(Boolean).join(" ") || "K.R. Mangalam University";

const MediaPlaceholder = ({ className = "", label = "No event media uploaded" }) => (
  <div className={`flex items-center justify-center bg-[var(--surface-soft)] text-center text-sm font-bold text-[var(--university-muted)] ${className}`}>
    <span className="inline-flex items-center gap-2">
      <CalendarDays size={18} />
      {label}
    </span>
  </div>
);

const statusClasses = {
  scheduled: "bg-[var(--stratex-blue)] text-white",
  completed: "bg-emerald-600 text-white",
  cancelled: "bg-red-600 text-white",
  inactive: "bg-slate-600 text-white",
};

const DetailCard = ({ children, className = "" }) => (
  <section className={`rounded-xl border border-[var(--border-light)] bg-white shadow-sm ${className}`}>{children}</section>
);

const MetaTile = ({ icon: Icon, primary, secondary }) => (
  <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--border-light)] bg-white px-4 py-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[var(--stratex-blue)]">
      <Icon size={17} />
    </span>
    <div className="min-w-0">
      <p className="truncate text-sm font-black text-[var(--university-ink)]">{primary}</p>
      <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--university-muted)]">{secondary}</p>
    </div>
  </div>
);

const InfoLine = ({ label, value }) => (
  <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 py-2.5 text-xs sm:grid-cols-[145px_minmax(0,1fr)]">
    <span className="font-bold text-[var(--university-muted)]">{label}</span>
    <span className="break-words font-black text-[var(--university-ink)]">{value || "--"}</span>
  </div>
);

const QuickLink = ({ icon: Icon, label }) => (
  <button
    type="button"
    className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left text-sm font-bold text-[var(--university-ink)] transition hover:bg-blue-50 hover:text-[var(--stratex-blue)]"
  >
    <span className="inline-flex min-w-0 items-center gap-2">
      <Icon size={15} className="shrink-0 text-[var(--stratex-blue)]" />
      <span className="truncate">{label}</span>
    </span>
    <ChevronRight size={15} className="shrink-0 text-[var(--university-muted)]" />
  </button>
);

const EventDescription = ({ content }) => {
  if (content && hasNoticeHtml(content)) {
    return (
      <div
        className="notice-rich-content text-sm font-medium leading-7 text-[var(--text-secondary)]"
        dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(content) }}
      />
    );
  }

  return (
    <p className="whitespace-pre-line text-sm font-medium leading-7 text-[var(--text-secondary)]">
      {content || "No event description is available yet."}
    </p>
  );
};

const EventHero = ({ event }) => {
  const dateRange = formatDateRange(event.startDate, event.endDate);
  const timeRange = formatTimeRange(event.startDate, event.endDate);
  const heroImage = event.banner || event.image;

  return (
    <DetailCard className="overflow-hidden">
      <div className="relative h-52 overflow-hidden bg-slate-100 sm:h-72 lg:h-[310px]">
        {heroImage ? (
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <MediaPlaceholder className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/10 to-transparent" />
        <span className={`absolute left-4 top-4 rounded px-2.5 py-1 text-[10px] font-black uppercase shadow ${statusClasses[event.status] || statusClasses.scheduled}`}>
          {event.status || "scheduled"}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <h1 className="text-2xl font-black leading-tight text-[var(--university-ink)] sm:text-3xl">{event.title}</h1>
        <p className="mt-2 line-clamp-2 max-w-4xl text-sm font-semibold leading-6 text-[var(--university-muted)]">
          {getNoticeText(event.description) || "View complete event information, schedule, venue, and organizer details."}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetaTile icon={CalendarDays} primary={dateRange.primary} secondary={dateRange.secondary} />
          <MetaTile icon={Clock} primary={timeRange.primary} secondary={timeRange.secondary} />
          <MetaTile icon={MapPin} primary={event.location || "Location TBA"} secondary="Venue" />
          <MetaTile icon={Tag} primary={event.status || "Scheduled"} secondary="Event Status" />
        </div>
      </div>
    </DetailCard>
  );
};

const EventMainContent = ({ event }) => {
  const [activeTab, setActiveTab] = useState("About");
  const posterImage = event.poster || event.banner || event.image;

  return (
    <DetailCard className="p-4 sm:p-5">
      <div className="-mx-4 -mt-4 overflow-x-auto border-b border-[var(--border-light)] px-4 sm:-mx-5 sm:-mt-5 sm:px-5">
        <div className="flex min-w-max gap-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 py-4 text-xs font-black transition ${
                activeTab === tab
                  ? "border-[var(--stratex-blue)] text-[var(--stratex-blue)]"
                  : "border-transparent text-[var(--university-muted)] hover:text-[var(--university-ink)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {activeTab === "About" ? (
            <>
              <EventDescription content={event.description} />
              <div>
                <h2 className="text-sm font-black text-[var(--university-ink)]">Highlights</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    "Well-planned schedule and university coordination",
                    "Open participation based on event status",
                    "Venue and timing details available in one place",
                    "Updates managed by the administration team",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--stratex-blue)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {activeTab === "Details" ? (
            <div className="divide-y divide-[var(--border-light)]">
              <InfoLine label="Event Title" value={event.title} />
              <InfoLine label="Status" value={event.status} />
              <InfoLine label="Starts" value={formatDateTime(event.startDate)} />
              <InfoLine label="Ends" value={formatDateTime(event.endDate)} />
              <InfoLine label="Location" value={event.location || "Not specified"} />
              <InfoLine label="Created By" value={getCreatorName(event.createdBy)} />
              <InfoLine label="Updated By" value={getCreatorName(event.updatedBy)} />
            </div>
          ) : null}

          {activeTab === "Venue" ? (
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-black uppercase text-[var(--stratex-blue)]">Venue</p>
              <p className="mt-2 text-lg font-black text-[var(--university-ink)]">{event.location || "Location TBA"}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--university-muted)]">
                Please check the final location details before the event starts.
              </p>
            </div>
          ) : null}

          {activeTab === "Organized By" ? (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[var(--stratex-blue)]">
                {getCreatorName(event.createdBy).slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="font-black text-[var(--university-ink)]">{getCreatorName(event.createdBy)}</p>
                <p className="mt-1 text-xs font-semibold text-[var(--university-muted)]">Event Organizer</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-3">
          <p className="mb-3 text-[11px] font-black uppercase text-[var(--university-muted)]">Event Poster</p>
          <div className="relative overflow-hidden rounded-lg">
            {posterImage ? (
              <>
                <img src={posterImage} alt="" className="h-64 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-2xl font-black uppercase leading-tight text-white">{event.title}</p>
                  <div className="mt-3 space-y-1 text-xs font-bold text-white/90">
                    <p className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {formatDateRange(event.startDate, event.endDate).primary}</p>
                    <p className="flex items-center gap-1.5"><MapPin size={13} /> {event.location || "Location TBA"}</p>
                  </div>
                </div>
              </>
            ) : (
              <MediaPlaceholder className="h-64 w-full" label="No poster uploaded" />
            )}
              </div>
          </div>
      </div>
    </DetailCard>
  );
};

const EventSidebar = ({ event }) => (
  <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
    <DetailCard className="p-4">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Event Banner</h2>
      {event.banner || event.image ? (
        <img src={event.banner || event.image} alt="" className="mt-3 h-36 w-full rounded-lg object-cover" />
      ) : (
        <MediaPlaceholder className="mt-3 h-36 w-full rounded-lg" />
      )}
    </DetailCard>

    <DetailCard className="p-4">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Event Information</h2>
      <div className="mt-3 divide-y divide-[var(--border-light)]">
        <InfoLine label="Event Type" value="University Event" />
        <InfoLine label="Audience" value="All Students" />
        <InfoLine label="Registration" value="Disabled" />
        <InfoLine label="Published On" value={formatDateTime(event.createdAt)} />
        <InfoLine label="Last Updated" value={formatDateTime(event.updatedAt)} />
      </div>
      <button
        type="button"
        disabled
        className="mt-4 h-10 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 text-xs font-black text-slate-500"
      >
        Registration Disabled
      </button>
    </DetailCard>

    <DetailCard className="p-4">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Organizer</h2>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[var(--stratex-blue)]">
          {getCreatorName(event.createdBy).slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[var(--university-ink)]">{getCreatorName(event.createdBy)}</p>
          <p className="mt-1 truncate text-xs font-semibold text-[var(--university-muted)]">K.R. Mangalam University</p>
        </div>
      </div>
    </DetailCard>

    <DetailCard className="p-4">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Quick Links</h2>
      <div className="mt-2 divide-y divide-[var(--border-light)]">
        <QuickLink icon={CalendarDays} label="Add to Calendar" />
        <QuickLink icon={Download} label="Download Event Details" />
        <QuickLink icon={FileText} label="View Event Notice" />
      </div>
    </DetailCard>
  </aside>
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

  const pageTitle = useMemo(() => event?.title || "Event Details", [event?.title]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1480px] space-y-4">
          <div className="h-14 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="h-[640px] animate-pulse rounded-xl bg-white shadow-sm" />
            <div className="h-[640px] animate-pulse rounded-xl bg-white shadow-sm" />
          </div>
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
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
            <span>Dashboard</span>
            <span>/</span>
            <span>Events</span>
            <span>/</span>
            <span className="line-clamp-1 text-[var(--university-ink)]">{pageTitle}</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard/events")}
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-black text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
            >
              <ArrowLeft size={16} />
              Back to Events
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 text-xs font-black text-[var(--stratex-blue)] shadow-sm transition hover:bg-blue-50"
            >
              <UsersRound size={15} />
              Share Event
            </button>
          </div>
        </header>

        <main className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <EventHero event={event} />
            <EventMainContent event={event} />
            <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-xs font-semibold text-[var(--stratex-blue)]">
              <Info size={15} className="mt-0.5 shrink-0" />
              <span>Please arrive 15 minutes before the event starts. Carry your university ID card for verification.</span>
            </div>
          </div>
          <EventSidebar event={event} />
        </main>
      </div>
    </div>
  );
};

export default EventView;
