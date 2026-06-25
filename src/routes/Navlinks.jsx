import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../components/dashboard/ProtectedRoute";
import PublicRoute from "../components/dashboard/PublicRoute";

import DashboardHome from "../pages/dashboard/DashboardHome";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import SetupPassword from "../pages/auth/SetupPassword";
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
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/setup-password/:token" element={<SetupPassword />} />
      <Route path="/error" element={<Error />}></Route>

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["superAdmin", "schoolAdmin", "faculty", "student"]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
            path="users/create"
            element={
              <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />

        <Route
          path="schools"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <Schools />
            </ProtectedRoute>
          }
        />

        <Route
          path="programs"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <Programs />
            </ProtectedRoute>
          }
        />

        <Route
          path="subjects"
          element={
            <ProtectedRoute
              allowedRoles={["superAdmin", "schoolAdmin", "faculty"]}
            >
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route path="notifications" element={<Notifications />} />

        <Route path="notices" element={<Notices />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default Navlinks;
