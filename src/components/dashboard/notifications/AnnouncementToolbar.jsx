import React from "react";
import { Search } from "lucide-react";

const tabs = [
  { label: "All", value: "" },
  { label: "Unread", value: "false" },
  { label: "Read", value: "true" },
];

const AnnouncementToolbar = ({ filters, onChange }) => {
  return (
    <div className="mb-6 rounded-3xl border border-[var(--university-border)] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-fit rounded-2xl bg-[color-mix(in_srgb,var(--stratex-teal)_10%,white)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => onChange("isRead", tab.value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                filters.isRead === tab.value
                  ? "bg-white text-[var(--university-ink)] shadow-sm"
                  : "text-[var(--university-muted)] hover:text-[var(--university-ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="relative w-full md:w-72 lg:w-80">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--university-muted)]"
          />
          <input
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Search announcements..."
            className="h-11 w-full rounded-2xl border border-[var(--university-border)] bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[var(--university-muted)] focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--university-blue)_16%,transparent)]"
          />
        </label>
      </div>
    </div>
  );
};

export default AnnouncementToolbar;
