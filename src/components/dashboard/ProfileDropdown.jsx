import React from "react";
import { NavLink } from "react-router-dom";
import {
  XIcon,
  HomeFillIcon,
  SignOutIcon,
} from "@primer/octicons-react";

import { menuConfig } from "../../config/menuConfig";

const ProfileDropdown = ({ onClose }) => {
  const role = "superAdmin";
  const menuItems = menuConfig[role] || [];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
     transition-all duration-200 hover:translate-x-1
     ${
       isActive
         ? "bg-[var(--navbar-hover)] text-white"
         : "text-[var(--navbar-text)] hover:bg-[var(--navbar-hover)] hover:text-white"
     }`;

  return (
    <div
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
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Profile"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10"
            />

            <div>
              <h3 className="text-sm font-semibold text-white">
                John Doe
              </h3>

              <p className="text-xs text-[var(--sidebar-text)]">
                School of Engineering & Technology
              </p>

              <span
                className="
                  mt-1 inline-block rounded-full
                  bg-blue-500/10 px-2 py-0.5
                  text-[10px] font-medium
                  text-blue-300
                "
              >
                Super Admin
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
      <nav className="p-2">
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
        <NavLink
          to="/"
          onClick={onClose}
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
        </NavLink>
      </nav>
    </div>
  );
};

export default ProfileDropdown;