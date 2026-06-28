import { Search, ChevronDown } from "lucide-react";

const SearchBar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  roleFilter = "all",
  setRoleFilter = () => {},
  sortBy = "name",
  setSortBy = () => {},
}) => {
  return (
    <div
      className="
        rounded-2xl sm:rounded-[30px]
        border
        border-[var(--university-border)]
        bg-white
        p-3 sm:p-5
        shadow-[0_8px_30px_rgba(15,23,42,0.05)]
      "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        
        <div className="relative flex-1">
          <Search
            size={18}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[var(--university-blue)]
            "
          />

          <input
            type="text"
            aria-label="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="
              h-12 sm:h-14
              w-full
              rounded-2xl
              border
              border-transparent
              bg-[var(--background)]
              pl-10 sm:pl-12
              pr-4
              text-sm
              font-medium
              text-[var(--stratex-navy)]
              shadow-sm
              outline-none
              transition-all
              placeholder:text-[var(--text-secondary)]
              focus:border-[var(--university-blue)]
              focus:bg-white
              focus:ring-4
              focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
            "
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
       
          <div className="relative">
            <select
              aria-label="Filter by role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="
                appearance-none
                h-12 sm:h-14
                w-full
                sm:min-w-[170px]  
                sm:w-auto
                rounded-2xl
                border
                border-[var(--university-border)]
                bg-[var(--background)]
                pl-5
                pr-12
                text-sm
                font-medium
                text-[var(--stratex-navy)]
                shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                transition-all
                duration-200
                md:hover:border-[var(--university-blue)]
                md:hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)]
                focus:border-[var(--university-blue)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
                focus:outline-none
                cursor-pointer
              "
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="schoolAdmin">School Admin</option>
            </select>

            <ChevronDown
              size={16}
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[var(--text-secondary)]
              "
            />
          </div>

          <div className="relative">
            <select
              aria-label="Sort users"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
                appearance-none
                h-12 sm:h-14
                w-full
                sm:min-w-[170px]    
                sm:w-auto
                rounded-2xl
                border
                border-[var(--university-border)]
                bg-[var(--background)]
                pl-5
                pr-12
                text-sm
                font-medium
                text-[var(--stratex-navy)]
                shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                transition-all
                duration-200
                md:hover:border-[var(--university-blue)]
                md:hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)]
                focus:border-[var(--university-blue)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--university-blue)_10%,white)]
                focus:outline-none
                cursor-pointer
              "
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
            </select>

            <ChevronDown
              size={16}
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[var(--text-secondary)]
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
