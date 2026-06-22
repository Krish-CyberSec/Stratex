import Navbar from "../components/dashboard/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <Navbar />

      <main className="pt-16 p-4">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;