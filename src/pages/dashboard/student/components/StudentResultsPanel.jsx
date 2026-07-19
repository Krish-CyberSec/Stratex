import { LockKeyhole } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const StudentResultsPanel = () => (
  <DashboardPanel className="h-[270px] overflow-hidden" title="My Results">
    <div className="px-4 pb-4 pt-2">
      <div className="flex h-[194px] flex-col items-center justify-center rounded-xl border border-[#e8eef7] bg-[#f8fbff] px-4 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#94a3b8] shadow-sm">
          <LockKeyhole size={24} strokeWidth={2.35} />
        </span>
        <p className="mt-4 text-sm font-black text-[#64748b]">Results are currently disabled.</p>
        <p className="mt-1 max-w-md text-xs font-semibold leading-5 text-[#64748b]">
          Results will be available after they are published by the examination cell.
        </p>
        <span className="mt-3 rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#64748b] shadow-sm">
          Coming Soon
        </span>
      </div>
    </div>
  </DashboardPanel>
);

export default StudentResultsPanel;
