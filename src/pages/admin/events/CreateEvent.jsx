import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Image as ImageIcon,
  MapPin,
  Plus,
  UploadCloud,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../../services/eventService";
import NoticeRichTextEditor from "../notices/components/create/NoticeRichTextEditor";
import { getNoticeText, hasNoticeHtml, sanitizeNoticeHtml } from "../notices/noticeContentUtils";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const nowTime = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(11, 16);
};

const defaultPreviewImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80";

const initialForm = {
  title: "",
  description: "",
  startDate: today(),
  startTime: nowTime(),
  endDate: "",
  endTime: "",
  location: "",
  status: "scheduled",
  upcoming: true,
  banner: null,
  poster: null,
};

const statusClasses = {
  scheduled: "bg-red-50 text-red-600 ring-red-100",
  completed: "bg-green-50 text-[var(--success)] ring-green-100",
  cancelled: "bg-orange-50 text-orange-700 ring-orange-100",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

const Field = ({ children, label, required }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">
      {label} {required ? <span className="text-[var(--error)]">*</span> : null}
    </span>
    {children}
  </label>
);

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[var(--stratex-blue)]" : "bg-slate-200"}`}
  >
    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
  </button>
);

const UploadPanel = ({ file, helper, label, onChange }) => (
  <div>
    <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">{label}</span>
    <label className="flex min-h-36 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white px-4 py-5 text-center transition hover:border-[var(--stratex-blue)] hover:bg-blue-50">
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      <div className="flex flex-col items-center gap-2">
        <ImageIcon size={28} className="text-[var(--university-muted)]" />
        <span className="text-xs font-semibold text-[var(--university-muted)]">Drag & drop image here</span>
        <span className="text-xs font-semibold text-[var(--university-muted)]">or</span>
        <span className="rounded-lg border border-[var(--stratex-blue)] px-4 py-2 text-xs font-black text-[var(--stratex-blue)]">
          Choose {label.split(" ")[0]}
        </span>
        {file ? <span className="max-w-full truncate text-xs font-bold text-[var(--university-ink)]">{file.name}</span> : null}
      </div>
    </label>
    <p className="mt-2 text-xs font-semibold text-[var(--university-muted)]">{helper}</p>
  </div>
);

const PreviewCard = ({ form, previewImage }) => {
  const description = form.description || "Event description will appear here once you start typing. It will be visible to users in the events list.";
  const start = form.startDate || "Start Date";
  const end = form.endDate || "End Date";

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Event Preview</h2>
      <article className="mt-4 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
        <div className="h-40 bg-slate-100">
          <img src={previewImage || defaultPreviewImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="p-4">
          <span className={`inline-flex rounded px-2.5 py-1 text-[10px] font-black uppercase ring-1 ${statusClasses[form.status] || statusClasses.scheduled}`}>
            {form.status || "scheduled"}
          </span>
          <h3 className="mt-3 text-lg font-black text-[var(--university-ink)]">{form.title || "Event Title"}</h3>
          {form.description && hasNoticeHtml(form.description) ? (
            <div
              className="notice-rich-content notice-preview-content mt-2 line-clamp-3 min-h-14 text-sm font-semibold leading-5 text-[var(--university-muted)]"
              dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(description) }}
            />
          ) : (
            <p className="mt-2 line-clamp-3 min-h-14 text-sm font-semibold leading-5 text-[var(--university-muted)]">{description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-[var(--university-muted)]">
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {start} - {end}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {form.location || "Location"}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-black text-[var(--stratex-blue)]">Read More <ArrowRight className="inline" size={13} /></span>
          </div>
        </div>
      </article>
    </section>
  );
};

const AdditionalInfo = () => (
  <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
    <h2 className="text-sm font-black text-[var(--university-ink)]">Additional Information</h2>
    {["Created By", "Last Updated By", "Created At", "Last Updated"].map((label) => (
      <div key={label} className="flex items-center justify-between border-b border-[var(--border-light)] py-4 last:border-b-0">
        <span className="text-xs font-bold text-[var(--university-muted)]">{label}</span>
        <span className="text-xs font-black text-[var(--university-ink)]">-</span>
      </div>
    ))}
  </section>
);

const NoteCard = () => (
  <section className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[var(--stratex-blue)]">
      <UploadCloud size={17} />
    </span>
    <div>
      <h2 className="text-sm font-black text-[var(--university-ink)]">Note</h2>
      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--university-muted)]">
        After creating the event, it will be visible to users based on the selected status and dates.
      </p>
    </div>
  </section>
);

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  useEffect(() => {
    if (!form.banner) {
      setBannerPreview("");
      return undefined;
    }

    const url = URL.createObjectURL(form.banner);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.banner]);

  const canSubmit = useMemo(
    () =>
      form.title.trim().length >= 2 &&
      getNoticeText(form.description).trim().length >= 2 &&
      form.startDate &&
      form.startTime &&
      form.location.trim().length >= 2 &&
      !saving,
    [form.description, form.location, form.startDate, form.startTime, form.title, saving],
  );

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const buildIso = (date, time) => {
    if (!date || !time) return "";
    return new Date(`${date}T${time}`).toISOString();
  };

  const submit = async (statusOverride) => {
    if (!canSubmit) return;
    setSaving(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("location", form.location.trim());
      payload.append("startDate", buildIso(form.startDate, form.startTime));
      payload.append("status", statusOverride || form.status);

      if (form.endDate && form.endTime) payload.append("endDate", buildIso(form.endDate, form.endTime));
      if (form.banner) payload.append("banner", form.banner);
      if (form.poster) payload.append("poster", form.poster);

      await createEvent(payload);
      navigate("/dashboard/events");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create event"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
            <span>Dashboard</span>
            <span>/</span>
            <span>Events</span>
            <span>/</span>
            <span className="text-[var(--university-ink)]">Create Event</span>
          </div>
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/events")}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black leading-tight text-[var(--university-ink)]">Create New Event</h1>
              <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
                Fill in the details below to create a new event for the community.
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">{error}</div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
          <main className="min-w-0 rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
            <div className="space-y-7 p-5 sm:p-6">
              <section>
                <h2 className="text-sm font-black text-[var(--stratex-blue)]">1. Event Information</h2>
                <div className="mt-5 space-y-5">
                  <Field label="Title" required>
                    <input
                      value={form.title}
                      onChange={(event) => update("title", event.target.value)}
                      placeholder="Enter event title"
                      className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[var(--stratex-blue)]"
                    />
                  </Field>
                  <div>
                    <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">
                      Description <span className="text-[var(--error)]">*</span>
                    </span>
                    <NoticeRichTextEditor
                      ariaLabel="Event description"
                      maxLength={1000}
                      onChange={(value) => update("description", value)}
                      placeholder="Write event description..."
                      value={form.description}
                    />
                  </div>
                </div>
              </section>

              <section className="border-t border-[var(--border-light)] pt-6">
                <h2 className="text-sm font-black text-[var(--stratex-blue)]">2. Date, Time & Location</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Start Date" required>
                    <div className="relative">
                      <input type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 pr-10 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
                      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
                    </div>
                  </Field>
                  <Field label="Start Time" required>
                    <div className="relative">
                      <input type="time" value={form.startTime} onChange={(event) => update("startTime", event.target.value)} className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 pr-10 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
                      <Clock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
                    </div>
                  </Field>
                  <Field label="End Date">
                    <div className="relative">
                      <input type="date" value={form.endDate} onChange={(event) => update("endDate", event.target.value)} className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 pr-10 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
                      <CalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
                    </div>
                  </Field>
                  <Field label="End Time">
                    <div className="relative">
                      <input type="time" value={form.endTime} onChange={(event) => update("endTime", event.target.value)} className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 pr-10 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
                      <Clock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
                    </div>
                  </Field>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Location" required>
                    <input value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="Enter event location" className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]" />
                  </Field>
                  <Field label="Status" required>
                    <select value={form.status} onChange={(event) => update("status", event.target.value)} className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--stratex-blue)]">
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                </div>
                <div className="mt-5 rounded-xl border border-[var(--border-light)] bg-[var(--surface-soft)] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="shrink-0">
                      <Toggle checked={form.upcoming} onChange={(value) => update("upcoming", value)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[var(--university-ink)]">Upcoming Event</p>
                      <p className="text-xs font-semibold leading-5 text-[var(--university-muted)]">
                        Show this event in the upcoming events section.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="border-t border-[var(--border-light)] pt-6">
                <h2 className="text-sm font-black text-[var(--stratex-blue)]">3. Event Media (Poster & Banner)</h2>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <UploadPanel
                    file={form.banner}
                    label="Banner (Recommended size: 1200 x 400px)"
                    helper="JPG, PNG or WEBP. Max size: 2MB"
                    onChange={(file) => update("banner", file)}
                  />
                  <UploadPanel
                    file={form.poster}
                    label="Poster (Recommended size: 800 x 1000px)"
                    helper="JPG, PNG or WEBP. Max size: 2MB"
                    onChange={(file) => update("poster", file)}
                  />
                </div>
              </section>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-light)] px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
              <button type="button" onClick={() => navigate("/dashboard/events")} className="h-11 rounded-lg border border-[var(--border-light)] bg-white px-5 text-sm font-bold text-[var(--university-ink)]">
                Cancel
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" disabled={!canSubmit} onClick={() => submit("inactive")} className="h-11 rounded-lg border border-[var(--border-light)] bg-white px-5 text-sm font-black text-[var(--university-ink)] disabled:opacity-60">
                  Save as Draft
                </button>
                <button type="button" disabled={!canSubmit} onClick={() => submit(form.status)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-5 text-sm font-black text-white shadow-sm disabled:opacity-60">
                  <Plus size={16} />
                  {saving ? "Creating..." : "Create Event"}
                </button>
              </div>
            </div>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
            <PreviewCard form={form} previewImage={bannerPreview} />
            <AdditionalInfo />
            <NoteCard />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
