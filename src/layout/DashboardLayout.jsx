import Navbar from "../components/dashboard/Navbar";
import { Outlet } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const DashboardLayout = () => {
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />

      <main className="pt-16 h-full">
        <SimpleBar
          style={{
            height: "calc(100vh - 64px)", // 64px = pt-16
          }}
        >
          <div className="p-4">
            <Outlet />
          </div>
        </SimpleBar>
      </main>
    </div>
  );
};

export default DashboardLayout;