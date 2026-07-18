import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getNoticeText } from "../../noticeContentUtils";

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

const placeCaretAtEnd = (element) => {
  const selection = window.getSelection?.();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

const NoticeRichTextEditor = ({
  ariaLabel = "Description",
  maxLength = 5000,
  onChange,
  placeholder = "Write details here...",
  resetKey,
  value,
}) => {
  const editorRef = useRef(null);
  const [activeEditorState, setActiveEditorState] = useState({});
  const [blockStyle, setBlockStyle] = useState("p");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor || editor.innerHTML === value) return;
    editor.innerHTML = value || "";
  }, [resetKey, value]);

  const syncEditorContent = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const text = editor.textContent?.trim() || "";
    onChange(text ? editor.innerHTML : "");
  };

  const prepareEmptyEditorForTyping = () => {
    const editor = editorRef.current;
    if (!editor) return;

    if (!editor.textContent?.trim() && !editor.innerHTML.trim()) {
      editor.innerHTML = "<p><br></p>";
      placeCaretAtEnd(editor);
    }
  };

  const handleEditorBlur = () => {
    const editor = editorRef.current;
    if (!editor) return;

    if (!editor.textContent?.trim()) {
      editor.innerHTML = "";
    }

    syncEditorContent();
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

  const applyBlockStyle = (nextBlockStyle) => {
    focusEditor();
    document.execCommand("formatBlock", false, nextBlockStyle);
    syncEditorContent();
    setBlockStyle(nextBlockStyle);
    refreshEditorState();
  };

  return (
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
        aria-label={ariaLabel}
        data-placeholder={placeholder}
        onInput={syncEditorContent}
        onBlur={handleEditorBlur}
        onKeyUp={refreshEditorState}
        onMouseUp={refreshEditorState}
        onFocus={() => {
          prepareEmptyEditorForTyping();
          refreshEditorState();
        }}
        className="notice-rich-content min-h-32 w-full cursor-text overflow-auto border-0 bg-white px-4 py-4 text-sm font-medium leading-6 text-[var(--university-ink)] caret-[var(--stratex-blue)] outline-none empty:before:pointer-events-none empty:before:text-[var(--university-muted)] empty:before:content-[attr(data-placeholder)]"
      />
      <div className="border-t border-[var(--border-light)] px-4 py-2 text-right text-[11px] font-bold text-[var(--university-muted)]">
        {getNoticeText(value).length} / {maxLength}
      </div>
    </div>
  );
};

export default NoticeRichTextEditor;
