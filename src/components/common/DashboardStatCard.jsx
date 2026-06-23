import { ArrowUpRight } from "lucide-react";

const DashboardStatCard = ({
  title,
  value,
  trend,

  // style overrides
  className = "",
  titleClassName = "",
  valueClassName = "",
  trendClassName = "",
  actionClassName = "",

  // custom content
  icon,
  action,
  footer,

  onClick,
}) => {
  const hasCustomBg = className.includes("bg-");

  return (
    <div
      onClick={onClick}
      className={`
        min-h-[180px]
        rounded-3xl
        border
        ${hasCustomBg ? "" : "border-gray-200 bg-white"}
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {icon}

          <h3
            className={`
              text-sm
              font-semibold
              text-[var(--university-blue-dark)]
              ${titleClassName}
            `}
          >
            {title}
          </h3>
        </div>

        {action || (
          <button
            className={`
              h-9
              w-9
              rounded-full
              border
              border-[var(--university-border)]
              flex
              items-center
              justify-center
              text-[var(--university-blue-dark)]
              ${actionClassName}
            `}
          >
            <ArrowUpRight size={16} />
          </button>
        )}
      </div>

      {/* Value */}
      <h2
        className={`
          mt-5
          text-5xl
          font-semibold
          tracking-tight
          text-[var(--university-ink)]
          ${valueClassName}
        `}
      >
        {value}
      </h2>

      {/* Footer */}
      {(trend || footer) && (
        <div
          className={`
            mt-3
            text-xs
            font-medium
            text-[var(--university-muted)]
            ${trendClassName}
          `}
        >
          {footer || trend}
        </div>
      )}
    </div>
  );
};

export default DashboardStatCard;
