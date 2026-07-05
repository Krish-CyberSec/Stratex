const SchoolHeroBanner = ({ school }) => {
  return (
    <section className="relative min-h-40 overflow-hidden rounded-xl border border-[var(--border-light)] bg-[var(--stratex-navy)] shadow-sm sm:min-h-52">
      {school.banner ? (
        <img
          src={school.banner}
          alt={`${school.name} banner`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f2744_0%,#173f68_52%,#0b1829_100%)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,24,43,0.92),rgba(10,24,43,0.62),rgba(10,24,43,0.18))]" />

      <div className="relative flex min-h-40 max-w-3xl flex-col justify-center px-4 py-5 text-white sm:min-h-52 sm:px-6 sm:py-6">
        <span className="mb-3 w-fit rounded-md bg-[color-mix(in_srgb,var(--success)_78%,white)] px-3 py-1 text-xs font-bold capitalize text-white sm:mb-4">
          {school.status || "active"}
        </span>
        <p className="max-w-2xl text-sm font-medium leading-6 text-white/88">
          {school.description ||
            `${school.name} is committed to providing world-class education and academic opportunities.`}
        </p>
      </div>
    </section>
  );
};

export default SchoolHeroBanner;
