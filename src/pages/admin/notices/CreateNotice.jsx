import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  CalendarDays,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Save,
  Underline,
  Undo2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNotice } from "../../../services/noticeService";
import NoticeAttachmentField from "./components/create/NoticeAttachmentField";
import NoticeAudienceSelector from "./components/create/NoticeAudienceSelector";
import NoticeCreateAside from "./components/create/NoticeCreateAside";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const nowForInput = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const initialForm = {
  title: "",
  content: "",
  attachment: null,
  audience: ["all"],
  status: "published",
  publishedAt: nowForInput(),
};

const toolbarButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: List, label: "Bulleted list" },
  { icon: ListOrdered, label: "Numbered list" },
  { icon: AlignLeft, label: "Align left" },
  { icon: AlignCenter, label: "Align center" },
  { icon: AlignRight, label: "Align right" },
  { icon: LinkIcon, label: "Insert link" },
  { icon: Undo2, label: "Undo" },
  { icon: Redo2, label: "Redo" },
];

const CreateNotice = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => form.title.trim().length >= 2 && form.content.trim().length >= 2 && !saving,
    [form.content, form.title, saving],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (status) => {
    if (!canSubmit) return;
    setSaving(true);
    setError("");

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("content", form.content.trim());
    payload.append("audience", JSON.stringify(form.audience));
    payload.append("status", status);
    if (form.publishedAt) payload.append("publishedAt", new Date(form.publishedAt).toISOString());
    if (form.attachment) payload.append("attachment", form.attachment);

    try {
      await createNotice(payload);
      navigate("/dashboard/notices");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create notice"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
              <span>Dashboard</span>
              <span>/</span>
              <span>Notices</span>
              <span>/</span>
              <span className="text-[var(--university-ink)]">Create Notice</span>
            </div>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[var(--university-ink)]">Create New Notice</h1>
            <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
              Create and publish a notice for the selected audience.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/notices")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
          >
            <ArrowLeft size={16} />
            Back to Notices
          </button>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-4">
            <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-base font-black text-[var(--university-ink)]">Notice Information</h2>

              <div className="mt-5 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Notice Title <span className="text-[var(--error)]">*</span></span>
                  <div className="relative">
                    <input
                      maxLength={100}
                      value={form.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Enter a short and clear title for the notice"
                      className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-4 pr-16 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[var(--university-muted)]">{form.title.length}/100</span>
                  </div>
                </label>

                <div>
                  <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Notice Content <span className="text-[var(--error)]">*</span></span>
                  <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white focus-within:border-[var(--stratex-blue)]">
                    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border-light)] bg-[var(--surface-soft)] px-3 py-2">
                      <select className="mr-2 h-8 rounded-md border border-[var(--border-light)] bg-white px-2 text-xs font-bold text-[var(--university-ink)] outline-none">
                        <option>Paragraph</option>
                        <option>Heading</option>
                      </select>
                      {toolbarButtons.map(({ icon: Icon, label }) => (
                        <button key={label} type="button" title={label} className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--university-muted)] transition hover:bg-white hover:text-[var(--stratex-blue)]">
                          <Icon size={15} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      maxLength={5000}
                      value={form.content}
                      onChange={(event) => updateField("content", event.target.value)}
                      placeholder="Write the notice details here..."
                      className="min-h-48 w-full resize-y border-0 bg-white px-4 py-4 text-sm font-medium leading-6 text-[var(--university-ink)] outline-none"
                    />
                    <div className="border-t border-[var(--border-light)] px-4 py-2 text-right text-[11px] font-bold text-[var(--university-muted)]">{form.content.length}/5000</div>
                  </div>
                </div>

                <NoticeAttachmentField file={form.attachment} onChange={(file) => updateField("attachment", file)} />
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-base font-black text-[var(--university-ink)]">Audience & Publishing</h2>

              <div className="mt-5 space-y-5">
                <NoticeAudienceSelector audience={form.audience} onChange={(value) => updateField("audience", value)} />

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Status <span className="text-[var(--error)]">*</span></span>
                    <select
                      value={form.status}
                      onChange={(event) => updateField("status", event.target.value)}
                      className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)]"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Publish Date & Time <span className="text-[var(--error)]">*</span></span>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-muted)]" size={16} />
                      <input
                        type="datetime-local"
                        value={form.publishedAt}
                        onChange={(event) => updateField("publishedAt", event.target.value)}
                        className="h-12 w-full rounded-lg border border-[var(--border)] bg-white pl-10 pr-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)]"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/notices")}
                  className="h-11 rounded-lg border border-[var(--border)] bg-white px-5 text-sm font-bold text-[var(--university-ink)] hover:bg-[var(--surface-soft)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => submit("draft")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-5 text-sm font-black text-[var(--university-ink)] shadow-sm hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => submit("published")}
                  className="h-11 rounded-lg bg-[var(--stratex-blue)] px-5 text-sm font-black text-white shadow-sm hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Publishing..." : "Publish Notice"}
                </button>
              </div>
            </section>
          </main>

          <NoticeCreateAside form={form} />
        </div>
      </div>
    </div>
  );
};

export default CreateNotice;
