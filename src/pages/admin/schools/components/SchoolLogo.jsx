const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const SchoolLogo = ({ logo, name, size = "md", className = "" }) => {
  const sizes = {
    sm: "h-10 w-10 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] font-bold text-[var(--university-blue-dark)] ${sizes[size]} ${className}`}
    >
      {logo ? (
        <img src={logo} alt={`${name} logo`} className="h-full w-full object-cover" />
      ) : (
        getInitials(name) || "SC"
      )}
    </div>
  );
};

export default SchoolLogo;
