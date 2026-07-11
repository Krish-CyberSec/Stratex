const ProfileSectionCard = ({ children, description, icon: Icon, title }) => {
  return (
    <section className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        {Icon ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--stratex-blue)_10%,white)] text-[var(--stratex-blue)]">
            <Icon size={16} />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[var(--university-ink)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs font-medium leading-5 text-[var(--university-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
};

export default ProfileSectionCard;
