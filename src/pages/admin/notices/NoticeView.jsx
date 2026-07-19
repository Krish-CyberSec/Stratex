import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNoticeById, markNoticeRead } from "../../../services/noticeService";
import NoticeAttachmentCard from "./components/detail/NoticeAttachmentCard";
import NoticeContentCard from "./components/detail/NoticeContentCard";
import NoticeDetailHeader from "./components/detail/NoticeDetailHeader";
import NoticeDetailSidebar from "./components/detail/NoticeDetailSidebar";

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

  const displayNotice = notice;

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
        <NoticeDetailHeader
          notice={displayNotice}
          onBack={() => navigate("/dashboard/notices")}
          onEdit={() => navigate(`/dashboard/notices/${displayNotice._id || id}/edit`)}
        />

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
