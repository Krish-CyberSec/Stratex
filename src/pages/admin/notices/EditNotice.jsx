import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  CalendarDays,
  Download,
  Eye,
  FileText,
  HelpCircle,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Paperclip,
  Redo2,
  Save,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getNoticeById, updateNotice } from "../../../services/noticeService";
import { audienceLabel, NoticeStatusBadge } from "./components/NoticeBadges";
import NoticeAttachmentField from "./components/create/NoticeAttachmentField";
import NoticeAudienceSelector from "./components/create/NoticeAudienceSelector";
import NoticeLivePreview from "./components/create/NoticeLivePreview";
import { formatFileSize } from "./components/detail/noticeDetailUtils";
import { getNoticeText, sanitizeNoticeHtml } from "./noticeContentUtils";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const toInputDateTime = (date) => {
  const parsed = date ? new Date(date) : new Date();
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setMinutes(parsed.getMinutes() - parsed.getTimezoneOffset());
  return parsed.toISOString().slice(0, 16);
};

const initialForm = {
  title: "",
  content: "",
  audience: ["all"],
  audienceCriteria: { allUsers: true },
  status: "published",
  priority: "normal",
  publishedAt: toInputDateTime(),
  attachment: null,
  existingAttachment: null,
  removeAttachment: false,
};

const toolbarButtons = [
  { icon: Bold, label: "Bold", command: "bold", state: "bold" },
  { icon: Italic, label: "Italic", command: "italic", state: "italic" },
  { icon: Underline, label: "Underline", command: "underline", state: "underline" },
  { icon: List, label: "Bulleted list", command: "insertUnorderedList", state: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList", state: "insertOrderedList" },
  { icon: AlignLeft, label: "Align left", command: "justifyLeft", state: "justifyLeft" },
  { icon: AlignCenter, label: "Align center", command: "justifyCenter", state: "justifyCenter" },
  { icon: AlignRight, label: "Align right", command: "justifyRight", state: "justifyRight" },
  { icon: LinkIcon, label: "Insert link", command: "createLink" },
  { icon: Undo2, label: "Undo", command: "undo" },
  { icon: Redo2, label: "Redo", command: "redo" },
];

const editorStateCommands = [
  "bold",
  "italic",
  "underline",
  "insertUnorderedList",
  "insertOrderedList",
  "justifyLeft",
  "justifyCenter",
  "justifyRight",
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const normalizeBlock = (value = "") => {
  const block = value.toLowerCase();
  if (block.includes("h2")) return "h2";
  if (block.includes("h3")) return "h3";
  return "p";
};

const getNotice = (response) => response?.data?.data || response?.data?.notice || response?.data || null;
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

const ExistingAttachment = ({ attachment, onRemove }) => {
  if (!attachment?.url) return null;

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <FileText size={19} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[var(--university-ink)]">
              {attachment.name || "Notice attachment"}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--university-muted)]">
              {attachment.fileType || "File"} • {formatFileSize(attachment.size)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <a
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            title="View attachment"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
          >
            <Eye size={15} />
          </a>
          <a
            href={attachment.url}
            download
            title="Download attachment"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-muted)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
          >
            <Download size={15} />
          </a>
          <button
            type="button"
            title="Remove attachment"
            onClick={onRemove}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

const EditNoticeAside = ({ form, noticeId, onView }) => {
  const previewForm = {
    ...form,
    attachment: form.attachment || form.existingAttachment,
  };

  return (
    <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
      <NoticeLivePreview form={previewForm} />

      <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[var(--university-ink)]">Related Actions</h2>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={onView}
            className="flex w-full items-center justify-between rounded-lg border border-[var(--border-light)] bg-white px-3 py-3 text-left text-sm font-bold text-[var(--university-ink)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
          >
            <span className="inline-flex items-center gap-2"><Eye size={15} /> View Notice</span>
            <span>→</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-between rounded-lg border border-[var(--border-light)] bg-white px-3 py-3 text-left text-sm font-bold text-[var(--university-ink)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
          >
            <span className="inline-flex items-center gap-2"><Download size={15} /> Download as PDF</span>
            <span>→</span>
          </button>
          <a
            href={`/dashboard/notices/create?duplicate=${noticeId}`}
            className="flex w-full items-center justify-between rounded-lg border border-[var(--border-light)] bg-white px-3 py-3 text-left text-sm font-bold text-[var(--university-ink)] transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
          >
            <span className="inline-flex items-center gap-2"><FileText size={15} /> Duplicate Notice</span>
            <span>→</span>
          </a>
        </div>
      </section>

      <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 shrink-0 text-[var(--stratex-blue)]" size={18} />
          <div>
            <h2 className="text-sm font-black text-[var(--university-ink)]">Need Help?</h2>
            <p className="mt-2 text-xs font-semibold leading-5 text-[var(--university-muted)]">
              Review the audience, status, and attachment before saving changes.
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
};

const EditNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [noticeTitle, setNoticeTitle] = useState("Notice");
  const [activeEditorState, setActiveEditorState] = useState({});
  const [blockStyle, setBlockStyle] = useState("p");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes("superAdmin");
  const isSchoolAdmin = roles.includes("schoolAdmin");
  const ownSchoolId = getId(user?.schoolId);
  const ownSchoolLabel = typeof user?.schoolId === "object" ? user.schoolId?.name : "";
  const allowedAudienceRoles = isSuperAdmin
    ? ["all", "superAdmin", "schoolAdmin", "faculty", "coordinator", "student", "examCell"]
    : ["faculty", "coordinator", "student"];

  const loadNotice = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNoticeById(id);
      const notice = getNotice(response);
      const nextContent = notice?.content || "";

      setNoticeTitle(notice?.title || "Notice");
      setForm({
        title: notice?.title || "",
        content: nextContent,
        audience: notice?.audience?.length ? notice.audience : ["all"],
        audienceCriteria: notice?.audienceCriteria || { allUsers: !notice?.audience?.length || notice.audience.includes("all") },
        status: notice?.status || "published",
        priority: notice?.priority || "normal",
        publishedAt: toInputDateTime(notice?.publishedAt || notice?.createdAt),
        attachment: null,
        existingAttachment: notice?.attachment?.url ? notice.attachment : null,
        removeAttachment: false,
      });

      window.setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = sanitizeNoticeHtml(nextContent);
      }, 0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load notice"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadNotice();
  }, [loadNotice]);

  const canSubmit = useMemo(
    () => form.title.trim().length >= 2 && getNoticeText(form.content).trim().length >= 2 && !saving,
    [form.content, form.title, saving],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const syncEditorContent = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const text = editor.textContent?.trim() || "";
    updateField("content", text ? editor.innerHTML : "");
  };

  const refreshEditorState = () => {
    if (!editorRef.current) return;
    const nextState = editorStateCommands.reduce((state, command) => ({
      ...state,
      [command]: document.queryCommandState(command),
    }), {});

    setActiveEditorState(nextState);
    setBlockStyle(normalizeBlock(document.queryCommandValue("formatBlock")));
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const runEditorCommand = (command) => {
    focusEditor();

    if (command === "createLink") {
      const url = window.prompt("Enter link URL");
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, null);
    }

    syncEditorContent();
    refreshEditorState();
  };

  const applyBlockStyle = (value) => {
    focusEditor();
    document.execCommand("formatBlock", false, value);
    syncEditorContent();
    setBlockStyle(value);
    refreshEditorState();
  };

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError("");

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("content", form.content.trim());
    payload.append("audience", JSON.stringify(form.audience));
    payload.append("audienceCriteria", JSON.stringify(form.audienceCriteria));
    payload.append("status", form.status);
    payload.append("priority", form.priority);
    if (form.publishedAt) payload.append("publishedAt", new Date(form.publishedAt).toISOString());
    if (form.removeAttachment) payload.append("removeAttachment", "true");
    if (form.attachment) payload.append("attachment", form.attachment);

    try {
      await updateNotice(id, payload);
      navigate(`/dashboard/notices/${id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save notice changes"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--university-muted)]">
              <span>Dashboard</span>
              <span>/</span>
              <span>Notices</span>
              <span>/</span>
              <span className="max-w-[220px] truncate sm:max-w-md">{noticeTitle}</span>
              <span>/</span>
              <span className="text-[var(--university-ink)]">Edit Notice</span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/notices")}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                <h1 className="text-3xl font-black leading-tight text-[var(--university-ink)]">Edit Notice</h1>
                <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
                  Update the details of this notice below.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:min-w-[440px]">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/notices/${id}`)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:border-[var(--stratex-blue)] hover:text-[var(--stratex-blue)]"
            >
              <Eye size={16} />
              View Notice
            </button>
            <button
              type="button"
              onClick={() => navigate(`/dashboard/notices/${id}`)}
              className="h-11 rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] shadow-sm transition hover:bg-[var(--surface-soft)]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmit || loading}
              onClick={handleSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
            <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-5 w-44 animate-pulse rounded bg-slate-100" />
                  <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-black text-[var(--university-ink)]">1. Notice Information</h2>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Title <span className="text-[var(--error)]">*</span></span>
                      <div className="relative">
                        <input
                          maxLength={100}
                          value={form.title}
                          onChange={(event) => updateField("title", event.target.value)}
                          className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-4 pr-16 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[var(--university-muted)]">{form.title.length}/100</span>
                      </div>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Priority</span>
                      <select
                        value={form.priority}
                        onChange={(event) => updateField("priority", event.target.value)}
                        className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)]"
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <NoticeAudienceSelector
                    audience={form.audience}
                    audienceCriteria={form.audienceCriteria}
                    allowedRoles={allowedAudienceRoles}
                    canTargetAll={isSuperAdmin}
                    lockedSchoolId={isSchoolAdmin ? ownSchoolId : ""}
                    lockedSchoolLabel={isSchoolAdmin ? ownSchoolLabel : ""}
                    onChange={(value) => updateField("audience", value)}
                    onCriteriaChange={(value) => updateField("audienceCriteria", value)}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
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
                  </div>

                  <div>
                    <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Content <span className="text-[var(--error)]">*</span></span>
                    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white focus-within:border-[var(--stratex-blue)]">
                      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border-light)] bg-[var(--surface-soft)] px-3 py-2">
                        <select
                          value={blockStyle}
                          onChange={(event) => applyBlockStyle(event.target.value)}
                          onFocus={refreshEditorState}
                          className={`mr-2 h-8 rounded-md border px-2 text-xs font-bold outline-none transition ${
                            blockStyle !== "p"
                              ? "border-[var(--stratex-blue)] bg-blue-50 text-[var(--stratex-blue)]"
                              : "border-[var(--border-light)] bg-white text-[var(--university-ink)]"
                          }`}
                        >
                          <option value="p">Paragraph</option>
                          <option value="h2">Heading</option>
                          <option value="h3">Subheading</option>
                        </select>
                        {toolbarButtons.map(({ command, icon: Icon, label, state }) => {
                          const active = state ? activeEditorState[state] : false;

                          return (
                            <button
                              key={label}
                              type="button"
                              title={label}
                              onClick={() => runEditorCommand(command)}
                              aria-pressed={active}
                              className={`flex h-8 w-8 items-center justify-center rounded-md border transition ${
                                active
                                  ? "border-[var(--stratex-blue)] bg-blue-50 text-[var(--stratex-blue)] shadow-sm"
                                  : "border-transparent text-[var(--university-muted)] hover:bg-white hover:text-[var(--stratex-blue)]"
                              }`}
                            >
                              <Icon size={15} />
                            </button>
                          );
                        })}
                      </div>
                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        role="textbox"
                        aria-label="Notice content"
                        data-placeholder="Write the notice details here..."
                        onInput={syncEditorContent}
                        onBlur={syncEditorContent}
                        onKeyUp={refreshEditorState}
                        onMouseUp={refreshEditorState}
                        onFocus={refreshEditorState}
                        className="notice-rich-content min-h-64 w-full overflow-auto border-0 bg-white px-4 py-4 text-sm font-medium leading-6 text-[var(--university-ink)] outline-none empty:before:text-[var(--university-muted)] empty:before:content-[attr(data-placeholder)]"
                      />
                      <div className="border-t border-[var(--border-light)] px-4 py-2 text-right text-[11px] font-bold text-[var(--university-muted)]">
                        {getNoticeText(form.content).split(/\s+/).filter(Boolean).length} words
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-[var(--border-light)] pt-5">
                    <h2 className="text-base font-black text-[var(--university-ink)]">2. Attachments</h2>
                    <ExistingAttachment
                      attachment={form.existingAttachment}
                      onRemove={() => setForm((current) => ({
                        ...current,
                        existingAttachment: null,
                        removeAttachment: true,
                      }))}
                    />
                    <NoticeAttachmentField
                      file={form.attachment}
                      onChange={(file) => setForm((current) => ({
                        ...current,
                        attachment: file,
                        removeAttachment: file ? current.removeAttachment : current.removeAttachment,
                      }))}
                    />
                  </div>
                </div>
              )}
            </section>
          </main>

          <EditNoticeAside form={form} noticeId={id} onView={() => navigate(`/dashboard/notices/${id}`)} />
        </div>
      </div>
    </div>
  );
};

export default EditNotice;
