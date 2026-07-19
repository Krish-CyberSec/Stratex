import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getStudentDashboard } from "../../../services/dashboardService";
import StudentDashboardHeader from "./components/StudentDashboardHeader";
import StudentEvents from "./components/StudentEvents";
import StudentMetricGrid from "./components/StudentMetricGrid";
import StudentNotices from "./components/StudentNotices";
import StudentQuickLinks from "./components/StudentQuickLinks";
import StudentResultsPanel from "./components/StudentResultsPanel";
import StudentSubjects from "./components/StudentSubjects";
import { getErrorMessage } from "./components/studentDashboardUtils";

const StudentDashboardSkeleton = () => (
  <div className="space-y-4">
    <div className="h-36 animate-pulse rounded-xl bg-white shadow-sm" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-xl bg-white shadow-sm" />
      ))}
    </div>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <div className="h-80 animate-pulse rounded-xl bg-white shadow-sm" />
      <div className="h-80 animate-pulse rounded-xl bg-white shadow-sm" />
    </div>
  </div>
);

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getStudentDashboard();
      setData(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load student dashboard"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading && !data) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#f8fbff] px-3 py-4 sm:px-5 lg:px-7">
        <StudentDashboardSkeleton />
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#f8fbff] px-3 py-4 sm:px-5 lg:px-7">
        <section className="mx-auto flex max-w-xl flex-col items-center rounded-xl border border-red-200 bg-red-50 px-5 py-10 text-center shadow-sm">
          <p className="text-sm font-black text-[var(--error)]">{error}</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-black text-white"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8fbff] px-3 py-4 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <StudentDashboardHeader onRefresh={loadDashboard} refreshing={loading} student={data?.student} />
        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            {error}
          </div>
        ) : null}
        <StudentMetricGrid data={data} />

        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.05fr_0.9fr_0.92fr]">
          <StudentSubjects subjects={data?.subjects || []} />
          <StudentNotices notices={data?.notices || []} />
          <StudentEvents events={data?.events || []} />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.18fr_0.88fr]">
          <StudentResultsPanel />
          <StudentQuickLinks />
        </section>
      </div>
    </main>
  );
};

export default StudentDashboard;
