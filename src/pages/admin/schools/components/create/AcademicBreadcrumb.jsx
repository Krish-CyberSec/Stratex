import { ChevronRight } from "lucide-react";

const AcademicBreadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold text-[var(--university-muted)]">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex min-w-0 items-center gap-2">
          <span
            className={
              index === items.length - 1
                ? "text-[var(--university-ink)]"
                : "text-[var(--university-muted)]"
            }
          >
            {item}
          </span>
          {index < items.length - 1 ? <ChevronRight size={15} /> : null}
        </span>
      ))}
    </nav>
  );
};

export default AcademicBreadcrumb;
