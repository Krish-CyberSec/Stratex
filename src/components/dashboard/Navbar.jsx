import React from "react";
import logo from "../../assets/logo.png";
import { InboxIcon } from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
// import {} from 'lucide-react'
const Navbar = () => {
//   
  return (
    <>
      <div className="flex h-16 bg-[var(--university-ink)] items-center text-white w-screen fixed ">
        <div className="w-[40%] flex items-center ps-2 ">
          <img
            src={logo}
            alt=""
            className="rounded-full  bg-[#eef7fc] w-[38px] "
          />
          <nav className="ps-2">
            <NavLink to="/" end>
              <p className="font-bold text-[var(--navbar-text)] text-[12px] lg:text-[16px]">
                Dashboard
              </p>
              <p className="font-light text-[7px] lg:text-[8px]">
                Powered by Stratex
              </p>
            </NavLink>
          </nav>
        </div>
        <div className="w-[60%]  flex flex-row-reverse  items-center px-2 gap-3">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt=""
            className="rounded-full  bg-[#eef7fc] w-[36px] cursor-pointer " 
          />
          {/* quick links  */}

          <div className="hidden sm:block">
            <div>
              <nav>
                <NavLink to="/" className="flex items-center">
                  <InboxIcon className="w-8 h-8 p-2 border-white border-[0.2px] rounded-lg" />
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
