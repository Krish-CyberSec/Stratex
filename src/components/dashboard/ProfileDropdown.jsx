import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  XIcon,
  HomeFillIcon,
  SignOutIcon,
} from "@primer/octicons-react";

import { menuConfig } from "../../config/menuConfig";
import { useAuth } from "../../context/AuthContext";
import { getUserById } from "../../services/userService";

const roleLabels = {
  superAdmin: "Super Admin",
  schoolAdmin: "School Admin",
  faculty: "Faculty",
  coordinator: "Coordinator",
  student: "Student",
  examCell: "Exam Cell",
};

const getFullName = (user) =>
  user?.fullName ||
  [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ") ||
  "Profile User";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const getPrimaryRole = (user) => user?.primaryRole || user?.roles?.[0] || "student";

const getSchoolLabel = (user, role) => {
  if (role === "superAdmin") return "University Administration";
  if (role === "examCell") return "Examination Cell";
  return user?.schoolId?.name || user?.school?.name || "School not assigned";
};

const getProfileImage = (user) => user?.profileImage || user?.profilePicture || "";

const ProfileDropdown = ({ onClose }) => {
  const dropdownRef = useRef(null);
  const { logout, user } = useAuth();
  const [profileUser, setProfileUser] = useState(user);
  const role = getPrimaryRole(profileUser || user);
  const menuItems = menuConfig[role] || (role === "coordinator" ? menuConfig.faculty : []);
  const navigate = useNavigate();
  const displayUser = profileUser || user;
  const name = getFullName(displayUser);
  const schoolLabel = getSchoolLabel(displayUser, role);
  const profileImage = getProfileImage(displayUser);

  const roleLabel = useMemo(() => roleLabels[role] || "User", [role]);

  useEffect(() => {
    let isMounted = true;

    const loadProfileUser = async () => {
      if (!user?._id) {
        setProfileUser(user);
        return;
      }

      try {
        const response = await getUserById(user._id);
        const nextUser = response.data?.user || response.data?.data || response.data;
        if (isMounted) setProfileUser(nextUser);
      } catch {
        if (isMounted) setProfileUser(user);
      }
    };

    loadProfileUser();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, [onClose]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
     transition-all duration-200 hover:translate-x-1
     ${
       isActive
         ? "bg-[var(--navbar-hover)] text-white"
         : "text-[var(--navbar-text)] hover:bg-[var(--navbar-hover)] hover:text-white"
     }`;

  return (
    <div ref={dropdownRef}
      className="
        w-full overflow-hidden rounded-2xl
        bg-[var(--navbar-bg)]
        border border-white/10
        shadow-[0_20px_50px_rgba(0,0,0,0.35)]
        backdrop-blur-md
      "
    >
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--stratex-blue)] text-sm font-bold text-white ring-2 ring-white/10">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(name)
              )}
            </div>

            <div className="min-w-0">
              <h3 className="max-w-40 truncate text-sm font-semibold text-white">
                {name}
              </h3>

              <p className="max-w-44 truncate text-xs text-[var(--sidebar-text)]">
                {schoolLabel}
              </p>

              <span
                className="
                  mt-1 inline-block rounded-full
                  bg-blue-500/10 px-2 py-0.5
                  text-[10px] font-medium
                  text-blue-300
                "
              >
                {roleLabel}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-lg p-2 text-white
              transition-all duration-200
              hover:bg-[var(--navbar-hover)]
            "
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-2">
        {/* Home */}
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={navLinkClass}
        >
          <HomeFillIcon size={16} />
          <span>Home</span>
        </NavLink>

        {/* Dynamic Menu */}
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={navLinkClass}
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-white/10" />

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex items-center gap-3 rounded-lg
            px-3 py-2.5 text-sm
            text-red-300
            transition-all duration-200
            hover:bg-red-500/10
            hover:text-red-200
            hover:translate-x-1
          "
        >
          <SignOutIcon size={16} />
          <span>Sign Out</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfileDropdown;
