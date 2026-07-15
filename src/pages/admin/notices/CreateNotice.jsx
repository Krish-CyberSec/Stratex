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
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createNotice } from "../../../services/noticeService";
import NoticeAttachmentField from "./components/create/NoticeAttachmentField";
import NoticeAudienceSelector from "./components/create/NoticeAudienceSelector";
import NoticeCreateAside from "./components/create/NoticeCreateAside";
import { getNoticeText } from "./noticeContentUtils";

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
  category: "general",
  attachment: null,
  audience: ["all"],
  audienceCriteria: { allUsers: true },
  status: "published",
  publishedAt: nowForInput(),
};

const noticeCategories = [
  { label: "Academic", value: "academic" },
  { label: "Examinations", value: "examinations" },
  { label: "Events", value: "events" },
  { label: "General", value: "general" },
  { label: "Holidays", value: "holidays" },
  { label: "Administrative", value: "administrative" },
  { label: "Urgent", value: "urgent" },
];

const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

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

const normalizeBlock = (value = "") => {
  const block = value.toLowerCase();
  if (block.includes("h2")) return "h2";
  if (block.includes("h3")) return "h3";
  return "p";
};

const CreateNotice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [activeEditorState, setActiveEditorState] = useState({});
  const [blockStyle, setBlockStyle] = useState("p");
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

  useEffect(() => {
    if (!isSchoolAdmin || !ownSchoolId || !form.audience.includes("all")) return;

    setForm((current) => ({
      ...current,
      audience: ["student"],
      audienceCriteria: {
        allUsers: false,
        roles: ["student"],
        schoolIds: [ownSchoolId],
      },
    }));
  }, [form.audience, isSchoolAdmin, ownSchoolId]);

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

  if (!isSuperAdmin && !isSchoolAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-black text-[var(--university-ink)]">Notice creation is restricted</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--university-muted)]">
            Only super admins and school admins can create notices.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/notices")}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-black text-white"
          >
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  const submit = async (status) => {
    if (!canSubmit) return;
    setSaving(true);
    setError("");

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("content", form.content.trim());
    payload.append("category", form.category);
    payload.append("audience", JSON.stringify(form.audience));
    payload.append("audienceCriteria", JSON.stringify(form.audienceCriteria));
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

                <label className="block">
                  <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Notice Category <span className="text-[var(--error)]">*</span></span>
                  <select
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--university-ink)] outline-none transition focus:border-[var(--stratex-blue)]"
                  >
                    {noticeCategories.map((category) => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </label>

                <div>
                  <span className="mb-2 block text-xs font-black text-[var(--university-ink)]">Notice Content <span className="text-[var(--error)]">*</span></span>
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
                      className="notice-rich-content min-h-48 w-full overflow-auto border-0 bg-white px-4 py-4 text-sm font-medium leading-6 text-[var(--university-ink)] outline-none empty:before:text-[var(--university-muted)] empty:before:content-[attr(data-placeholder)]"
                    />
                    <div className="border-t border-[var(--border-light)] px-4 py-2 text-right text-[11px] font-bold text-[var(--university-muted)]">{getNoticeText(form.content).length}/5000</div>
                  </div>
                </div>

                <NoticeAttachmentField file={form.attachment} onChange={(file) => updateField("attachment", file)} />
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-base font-black text-[var(--university-ink)]">Audience & Publishing</h2>

              <div className="mt-5 space-y-5">
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
