import { CheckCircle2 } from "lucide-react";
import { ProgramSideCard } from "./ProgramCreateShell";

const items = [
  "After creating the program, semesters will be generated automatically.",
  "Number of semesters = Duration (Years) x 2.",
  "You can increase duration later to create more semesters.",
  "Duration cannot be decreased if academic data exists in higher semesters.",
  "Program name must be unique within the selected school.",
  "Program code can be entered manually or auto-generated when left blank.",
];

const ProgramInfoCard = () => {
  return (
    <ProgramSideCard
      icon="info"
      title="Important Information"
      subtitle="Backend rules applied while creating programs."
    >
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-xs font-medium leading-5 text-[var(--text-secondary)]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[var(--success)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </ProgramSideCard>
  );
};

export default ProgramInfoCard;
