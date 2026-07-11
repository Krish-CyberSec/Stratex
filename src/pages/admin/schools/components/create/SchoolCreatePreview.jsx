import { useEffect, useState } from "react";
import { Building2, Eye } from "lucide-react";

const useObjectUrl = (file) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  return url;
};

const SchoolCreatePreview = ({ form }) => {
  const banner = useObjectUrl(form.banner);
  const logo = useObjectUrl(form.logo);

  return (
    <section className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
          <Eye size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--university-ink)]">Preview</h2>
          <p className="mt-1 text-sm font-medium text-[var(--university-muted)]">
            This is how the school will appear.
          </p>
        </div>
      </div>

      <article className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
        <div className="relative h-36 bg-[linear-gradient(135deg,var(--stratex-navy),var(--university-blue))] sm:h-40">
          {banner ? (
            <img src={banner} alt="School banner preview" className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,39,68,0.72),rgba(15,39,68,0.14))]" />
        </div>

        <div className="relative px-5 pb-5 pt-11">
          <div className="absolute -top-10 left-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)] shadow-sm">
            {logo ? (
              <img src={logo} alt="School logo preview" className="h-full w-full object-cover" />
            ) : (
              <Building2 size={28} />
            )}
          </div>

          <div className="mb-4 flex justify-end">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--success)_12%,white)] px-3 py-1 text-xs font-bold capitalize text-[var(--success)]">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              {form.status}
            </span>
          </div>

          <h3 className="line-clamp-2 text-xl font-bold text-[var(--university-ink)]">
            {form.name || "School Name"}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-[var(--text-secondary)]">
            {form.description ||
              "This is a short description of the school. It will give users an overview of the school's focus areas and objectives."}
          </p>
        </div>
      </article>
    </section>
  );
};

export default SchoolCreatePreview;
