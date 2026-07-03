import { ArrowLeft, Building2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSchool } from "../../../services/schoolService";
import SchoolForm from "./components/SchoolForm";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const CreateSchool = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await createSchool(payload);
      navigate("/dashboard/schools", {
        state: { message: "School created successfully" },
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create school"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard/schools")}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--university-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--university-blue-dark)] transition hover:bg-[var(--university-surface-soft)]"
        >
          <ArrowLeft size={16} />
          Back to Schools
        </button>

        <header className="rounded-2xl border border-[var(--university-border)] bg-[linear-gradient(135deg,var(--university-blue-dark),var(--university-blue))] px-5 py-6 text-white shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/14 text-white">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                Academic setup
              </p>
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
                Create School
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/78">
                Schools are required before programs can be created. Add a clean slug because it must be unique.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-[var(--university-border)] bg-[var(--university-surface)] p-5 shadow-sm sm:p-6">
          <SchoolForm
            mode="create"
            loading={loading}
            error={error}
            onCancel={() => navigate("/dashboard/schools")}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    </div>
  );
};

export default CreateSchool;
