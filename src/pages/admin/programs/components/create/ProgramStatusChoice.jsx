import { Circle } from "lucide-react";

const choices = [
  {
    value: "active",
    label: "Active",
    help: "Program will be visible and available for use.",
  },
  {
    value: "inactive",
    label: "Inactive",
    help: "Program will be hidden and not available.",
  },
];

const ProgramStatusChoice = ({ onChange, value }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {choices.map((choice) => {
        const selected = value === choice.value;
        return (
          <button
            key={choice.value}
            type="button"
            onClick={() => onChange(choice.value)}
            className={`rounded-lg border p-3 text-left transition ${
              selected
                ? "border-[var(--stratex-blue)] bg-[color-mix(in_srgb,var(--stratex-blue)_5%,white)]"
                : "border-[var(--border)] bg-white hover:bg-[var(--surface-soft)]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Circle
                size={15}
                className={selected ? "fill-[var(--stratex-blue)] text-[var(--stratex-blue)]" : "text-[var(--university-muted)]"}
              />
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${choice.value === "active" ? "bg-green-50 text-[var(--success)]" : "bg-red-50 text-[var(--error)]"}`}>
                {choice.label}
              </span>
            </span>
            <span className="mt-2 block text-xs font-medium leading-5 text-[var(--university-muted)]">
              {choice.help}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ProgramStatusChoice;

