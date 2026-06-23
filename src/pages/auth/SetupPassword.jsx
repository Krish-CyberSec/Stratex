import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setupPassword } from "../../services/authService";

const SetupPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await setupPassword({ token, password });
      setMessage("Password set successfully. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to set password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--university-surface-soft)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-[var(--university-border)] bg-white p-6 shadow-[0_18px_50px_rgba(6,77,131,0.16)]"
      >
        <h1 className="text-2xl font-semibold text-[var(--university-ink)]">
          Set Password
        </h1>
        <p className="mt-2 text-sm text-[var(--university-muted)]">
          Create a password to activate your university account.
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            {message}
          </p>
        )}

        <label className="mt-5 block text-sm font-semibold text-[var(--university-ink)]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-10 w-full rounded-md border border-[var(--university-border)] px-3 text-sm outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[rgba(19,164,220,0.18)]"
          required
          minLength={8}
        />

        <label className="mt-4 block text-sm font-semibold text-[var(--university-ink)]">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-2 h-10 w-full rounded-md border border-[var(--university-border)] px-3 text-sm outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[rgba(19,164,220,0.18)]"
          required
          minLength={8}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 h-11 w-full rounded-md bg-[var(--university-blue)] px-4 text-sm font-bold text-white transition hover:bg-[var(--university-blue-dark)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Setting Password..." : "Set Password"}
        </button>
      </form>
    </main>
  );
};

export default SetupPassword;
