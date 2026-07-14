import { Bell } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { clearNotice, createNotice, deleteNotice, getNotices, updateNotice } from "../../../services/noticeService";
import { getUsers } from "../../../services/userService";
import DeleteNoticeModal from "./components/DeleteNoticeModal";
import NoticeFormModal from "./components/NoticeFormModal";
import NoticeList from "./components/NoticeList";
import NoticeSidebar from "./components/NoticeSidebar";
import NoticeToolbar from "./components/NoticeToolbar";

const sampleNotices = [
  {
    _id: "sample-1",
    title: "End Term Examination Schedule - Semester 3",
    content: "The end term examinations for Semester 3 will commence from 15th May 2024. Please check the detailed schedule and guidelines.",
    audience: ["student"],
    status: "published",
    publishedAt: "2024-05-10T10:30:00.000Z",
    isSample: true,
  },
  {
    _id: "sample-2",
    title: "Workshop on Data Structures using Python",
    content: "Department of Computer Science is organizing a hands-on workshop on Data Structures using Python.",
    audience: ["student", "faculty"],
    status: "published",
    publishedAt: "2024-05-08T15:45:00.000Z",
    isSample: true,
  },
  {
    _id: "sample-3",
    title: "Internship Registration 2025",
    content: "Internship registration for Summer 2025 batch has been temporarily disabled. Further updates will be notified soon.",
    audience: ["student"],
    status: "inactive",
    publishedAt: "2024-04-20T17:10:00.000Z",
    isSample: true,
  },
];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const getList = (response) => response?.data?.data || [];
const getPagination = (response) => response?.data?.pagination || {};
const getId = (value) => (typeof value === "object" ? value?._id || value?.id || "" : value || "");

const Notices = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({});
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [editingNotice, setEditingNotice] = useState(null);
  const [deletingNotice, setDeletingNotice] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const roles = user?.roles || [];
  const canManage = roles.some((role) => ["superAdmin", "schoolAdmin"].includes(role));
  const isSuperAdmin = roles.includes("superAdmin");
  const isSchoolAdmin = roles.includes("schoolAdmin");
  const ownSchoolId = getId(user?.schoolId);

  useEffect(() => {
    const loadCreators = async () => {
      if (!isSuperAdmin && !isSchoolAdmin) {
        setCreatorOptions([]);
        return;
      }

      try {
        if (isSchoolAdmin) {
          const response = await getUsers({
            page: 1,
            limit: 200,
            role: "coordinator",
            ...(ownSchoolId ? { schoolId: ownSchoolId } : {}),
            sortBy: "firstName",
            order: "asc",
          });
          setCreatorOptions(getList(response));
          return;
        }

        const responses = await Promise.all([
          getUsers({ page: 1, limit: 200, role: "superAdmin", sortBy: "firstName", order: "asc" }),
          getUsers({ page: 1, limit: 200, role: "schoolAdmin", sortBy: "firstName", order: "asc" }),
          getUsers({ page: 1, limit: 200, role: "coordinator", sortBy: "firstName", order: "asc" }),
        ]);
        const users = responses.flatMap(getList);
        const uniqueUsers = Array.from(new Map(users.map((item) => [getId(item), item])).values());
        setCreatorOptions(uniqueUsers);
      } catch {
        setCreatorOptions([]);
      }
    };

    loadCreators();
  }, [isSchoolAdmin, isSuperAdmin, ownSchoolId]);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNotices({
        page,
        limit: 5,
        sortBy: "publishedAt",
        order: "desc",
        ...(createdBy ? { createdBy } : {}),
        ...(["read", "unread"].includes(activeStatus) ? { readStatus: activeStatus } : {}),
        ...(activeStatus !== "all" && !["read", "unread"].includes(activeStatus) ? { status: activeStatus } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      setNotices(getList(response));
      setPagination(getPagination(response));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load notices"));
      setNotices([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [activeStatus, createdBy, page, search]);

  useEffect(() => {
    const timeout = setTimeout(loadNotices, 250);
    return () => clearTimeout(timeout);
  }, [loadNotices]);

  const displayNotices = notices.length || loading || error ? notices : sampleNotices;
  const totalPages = pagination.totalPages || 1;
  const total = pagination.total ?? displayNotices.length;

  const statusCounts = useMemo(() => {
    const source = notices.length ? notices : sampleNotices;
    return source.reduce((acc, notice) => {
      const key = notice.category || "general";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [notices]);

  const handleSave = async (payload) => {
    setModalLoading(true);
    setModalError("");

    try {
      const data = new FormData();
      data.append("title", payload.title);
      data.append("content", payload.content);
      data.append("category", payload.category || "general");
      data.append("audience", JSON.stringify(payload.audience));
      data.append("status", payload.status);
      if (payload.publishedAt) data.append("publishedAt", payload.publishedAt);
      if (payload.attachment) data.append("attachment", payload.attachment);

      if (editingNotice) {
        await updateNotice(editingNotice._id, data);
      } else {
        await createNotice(data);
      }
      setFormOpen(false);
      setEditingNotice(null);
      await loadNotices();
    } catch (err) {
      setModalError(getErrorMessage(err, "Unable to save notice"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingNotice) return;
    setModalLoading(true);
    setModalError("");

    try {
      await deleteNotice(deletingNotice._id);
      setDeletingNotice(null);
      await loadNotices();
    } catch (err) {
      setModalError(getErrorMessage(err, "Unable to delete notice"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleClear = async (notice) => {
    if (!notice?._id || notice.isSample) return;

    setError("");

    try {
      await clearNotice(notice._id);
      await loadNotices();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to clear notice"));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--stratex-blue)]">
                <Bell size={23} />
              </span>
              <div>
                <h1 className="text-3xl font-black leading-tight text-[var(--university-ink)]">Notices</h1>
                <p className="mt-1 text-sm font-semibold text-[var(--university-muted)]">
                  Stay updated with important announcements and information.
                </p>
              </div>
            </div>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-[var(--stratex-blue)]" />
          </div>
        </header>

        <NoticeToolbar
          activeStatus={activeStatus}
          canCreate={canManage}
          onCreate={() => navigate("/dashboard/notices/create")}
          creatorOptions={creatorOptions}
          createdBy={createdBy}
          onCreatorChange={(value) => {
            setCreatedBy(value);
            setPage(1);
          }}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setActiveStatus(value);
            setPage(1);
          }}
          search={search}
          showStatusTabs
        />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[var(--error)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
          <main className="min-w-0 space-y-4">
            <NoticeList
              canManage={canManage}
              loading={loading}
              notices={displayNotices}
              onDelete={(notice) => {
                setModalError("");
                setDeletingNotice(notice);
              }}
              onClear={handleClear}
              onEdit={(notice) => {
                setModalError("");
                setEditingNotice(notice);
                setFormOpen(true);
              }}
              onView={(notice) => navigate(`/dashboard/notices/${notice._id || notice.id}`)}
            />

            <div className="flex flex-col gap-3 text-xs font-bold text-[var(--university-muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {displayNotices.length ? `1 to ${displayNotices.length}` : "0"} of {total} notices</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="h-9 w-9 rounded-lg border border-[var(--border-light)] bg-white disabled:opacity-50">{"<"}</button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-9 w-9 rounded-lg border text-xs font-black ${page === pageNumber ? "border-[var(--stratex-blue)] bg-[var(--stratex-blue)] text-white" : "border-[var(--border-light)] bg-white text-[var(--university-ink)]"}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="h-9 w-9 rounded-lg border border-[var(--border-light)] bg-white disabled:opacity-50">{">"}</button>
              </div>
            </div>
          </main>

          <NoticeSidebar counts={{
            academic: statusCounts.academic || 0,
            examinations: statusCounts.examinations || 0,
            events: statusCounts.events || 0,
            general: statusCounts.general || 0,
            holidays: notices.length || sampleNotices.length,
          }} />
        </div>
      </div>

      <NoticeFormModal
        error={modalError}
        loading={modalLoading}
        notice={editingNotice}
        onClose={() => {
          setFormOpen(false);
          setEditingNotice(null);
        }}
        onSubmit={handleSave}
        open={formOpen}
      />

      <DeleteNoticeModal
        error={modalError}
        loading={modalLoading}
        notice={deletingNotice}
        onClose={() => setDeletingNotice(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Notices;

