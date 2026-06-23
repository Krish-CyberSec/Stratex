import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";

import DashboardHome from "../pages/dashboard/DashboardHome";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Support from "../pages/Support";
import Error from "../pages/Error";
import Users from "../pages/admin/users/Users";
import CreateUser from "../pages/admin/users/CreateUser";
import Schools from "../pages/admin/schools/Schools";
import Programs from "../pages/admin/programs/Programs";
import Subjects from "../pages/admin/subjects/Subjects";
import Notifications from "../components/dashboard/Notifications";
import Notices from "../pages/admin/notices/Notices";
import Events from "../pages/admin/events/Events";
import Profile from "../pages/admin/profile/profile";

const Navlinks = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/support" element={<Support />} />
      <Route path="/login" element={<Login />} />
      <Route path="/error" element={<Error />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<Users />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="schools" element={<Schools />} />
        <Route path="programs" element={<Programs />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="notices" element={<Notices />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default Navlinks;
