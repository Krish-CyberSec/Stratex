import { ArrowRight, CheckCircle2, CircleHelp } from "lucide-react";
import NoticeLivePreview from "./NoticeLivePreview";

const guidelines = [
  "Use a clear and relevant title.",
  "Provide complete and accurate information.",
  "Select the appropriate audience.",
  "Attach supporting documents if needed.",
  "Review before publishing.",
];

const NoticeCreateAside = ({ form }) => (
  <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
    <NoticeLivePreview form={form} />

    <section className="rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black text-[var(--university-ink)]">Guidelines</h2>
      <div className="mt-4 space-y-3">
        {guidelines.map((item) => (
          <p key={item} className="flex gap-2 text-xs font-semibold leading-5 text-[var(--university-muted)]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[var(--stratex-blue)]" />
            {item}
          </p>
        ))}
      </div>
    </section>

    <section className="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[var(--stratex-blue)]">
        <CircleHelp size={17} />
        <h2 className="text-sm font-black">Need Help?</h2>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[var(--university-muted)]">
        If you have any questions regarding notices, contact the help center.
      </p>
      <button type="button" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white text-xs font-black text-[var(--stratex-blue)]">
        Go to Help Center
        <ArrowRight size={14} />
      </button>
    </section>
  </aside>
);

export default NoticeCreateAside;
