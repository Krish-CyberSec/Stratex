import { ArrowRight, Link2 } from "lucide-react";

const SchoolQuickLinks = ({ onNavigate }) => {
  const links = [
    { label: "View Programs", target: "programs" },
    { label: "View Faculty", target: "faculty" },
    { label: "View Students", target: "students" },
    { label: "View Coordinators", target: "coordinators" },
    { label: "View Documents", target: "documents", disabled: true },
  ];

  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--university-ink)]">
        <Link2 size={16} />
        Quick Links
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <button
            key={link.target}
            type="button"
            disabled={link.disabled}
            onClick={() => {
              if (!link.disabled) onNavigate(link.target);
            }}
            className={`flex h-11 items-center justify-between rounded-lg border px-3 text-xs font-bold transition ${
              link.disabled
                ? "cursor-not-allowed border-[var(--border-light)] bg-[var(--surface-soft)] text-[var(--university-muted)] opacity-60"
                : "border-[color-mix(in_srgb,var(--stratex-blue)_12%,white)] bg-[color-mix(in_srgb,var(--stratex-blue)_5%,white)] text-[var(--stratex-blue)] hover:border-[color-mix(in_srgb,var(--stratex-blue)_30%,white)] hover:bg-[color-mix(in_srgb,var(--stratex-blue)_9%,white)]"
            }`}
          >
            <span>
              {link.label}
              {link.disabled ? " (Soon)" : ""}
            </span>
            <ArrowRight size={15} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default SchoolQuickLinks;
