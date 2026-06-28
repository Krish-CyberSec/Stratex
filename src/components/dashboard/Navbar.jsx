import React, { useState,useEffect } from "react";
import logo from "../../assets/logo.png";
import { InboxIcon } from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
// import {} from 'lucide-react'
const Navbar = () => {
  const [profileClicked, setProfileClicked] = useState(false);
  

  //
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center bg-[var(--university-ink)] text-white">
        <div className="w-[40%] flex items-center ps-2 ">
          <img
            src={logo}
            alt=""
            className="rounded-full  bg-[#eef7fc] w-9.5 "
          />
          <nav className="ps-2">
            <NavLink to="/dashboard" end>
              <p className="font-bold text-[--navbar-text] text-[12px] lg:text-[16px]">
                Dashboard
              </p>
              <p className="font-light text-[7px] lg:text-[8px]">
                Powered by Stratex
              </p>
            </NavLink>
          </nav>
        </div>
        {/* profile dropdown */}
        {profileClicked && (
  <div className="fixed top-16 right-3 z-50 w-72">
    <ProfileDropdown onClose={() => setProfileClicked(false)} />
  </div>
)}
        <div className="w-[60%]  flex flex-row-reverse  items-center px-2 gap-3">
          <div className="group">
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt=""
              className="rounded-full  bg-[#eef7fc] w-9 cursor-pointer "
              onClick={() => setProfileClicked((prev) => !prev)}
            />
            <div className="absolute top-10 right-3 z-10 h-8 w-45 flex items-center rounded-lg rounded-tr-xs bg-[var(--stratex-navy-light20)] opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
              <p className="pl-3 text-xs text-[var(--text-inverse)]">
                Open user navigation menu
              </p>
            </div>
          </div>

          {/* quick links  */}

          <div className="hidden sm:block">
            <div>
              <nav>
                <NavLink className="relative group">
                  <InboxIcon className="w-8 h-8 p-2 border-white border-[0.2px] rounded-lg group-hover:bg-[var(--navbar-hover)]" />

                  <div className="absolute top-8 right-0 z-10 h-8 w-65 flex items-center rounded-lg rounded-tr-xs bg-[var(--stratex-navy-light20)] opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
                    <p className="pl-3 text-xs text-[var(--text-inverse)]">
                      You have no unread notifications
                    </p>
                  </div>
                </NavLink>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
