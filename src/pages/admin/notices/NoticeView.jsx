import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNoticeById, markNoticeRead } from "../../../services/noticeService";
import NoticeAttachmentCard from "./components/detail/NoticeAttachmentCard";
import NoticeContentCard from "./components/detail/NoticeContentCard";
import NoticeDetailHeader from "./components/detail/NoticeDetailHeader";
import NoticeDetailSidebar from "./components/detail/NoticeDetailSidebar";

const sampleNotice = {
  _id: "sample-notice",
  title: "End Term Examination Schedule - Semester 3",
  content:
    "This is to inform all students that the end term examinations for Semester 3 will commence from 15th May 2024.\n\nPlease check the detailed schedule and guidelines below:\n\n- Examinations will be conducted in offline mode.\n- Carry your valid ID card to the examination hall.\n- Use of any unfair means will lead to strict disciplinary action.\n- Students must report 30 minutes before the exam time.\n\nAll the best for your examinations!\n\n- Examination Cell",
  audience: ["student"],
  status: "published",
  publishedAt: "2024-05-16T10:30:00.000Z",
  createdAt: "2024-05-16T10:30:00.000Z",
  updatedAt: "2024-05-16T10:30:00.000Z",
  createdBy: { firstName: "Dr.", lastName: "Neha Sharma" },
  attachment: null,
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

const getPayload = (response) => response?.data?.data || response?.data?.notice || response?.data;

const NoticeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotice = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNoticeById(id);
      const fetchedNotice = getPayload(response);
      setNotice(fetchedNotice);

      if (fetchedNotice?._id && !fetchedNotice.isRead) {
        try {
          const readResponse = await markNoticeRead(fetchedNotice._id);
          setNotice(getPayload(readResponse));
        } catch {
          setNotice({ ...fetchedNotice, isRead: true });
        }
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load notice details"));
      setNotice(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadNotice();
  }, [loadNotice]);

  const displayNotice = notice || (!loading && error ? sampleNotice : null);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1480px] space-y-4">
          <div className="h-16 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="h-[620px] animate-pulse rounded-xl bg-white shadow-sm" />
            <div className="h-[420px] animate-pulse rounded-xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!displayNotice) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#ffffff_0%,var(--background)_52%,#f5f7ff_100%)] px-3 py-5 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-bold text-[var(--error)]">{error || "Notice not found"}</p>
          <button type="button" onClick={loadNotice} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-xs font-bold text-white">
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
        <NoticeDetailHeader notice={displayNotice} onBack={() => navigate("/dashboard/notices")} />

        {error && !notice ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-semibold text-[var(--stratex-blue)]">
            Showing sample notice detail because the selected notice could not be loaded.
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          <main className="min-w-0 space-y-4">
            <NoticeContentCard notice={displayNotice} />
            <NoticeAttachmentCard attachment={displayNotice.attachment} />
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-[var(--stratex-blue)]">
              This notice was sent to {displayNotice.audience?.includes("all") ? "all users" : "the selected audience"}. For any queries, contact the notice author.
            </div>
          </main>

          <NoticeDetailSidebar notice={displayNotice} onBack={() => navigate("/dashboard/notices")} />
        </div>
      </div>
    </div>
  );
};

export default NoticeView;
