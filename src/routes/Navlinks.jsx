import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../components/dashboard/ProtectedRoute";
import PublicRoute from "../components/dashboard/PublicRoute";
import DashboardHome from "../pages/dashboard/DashboardHome";
import Home from "../pages/main/Home";
import Login from "../pages/auth/Login";
import SetupPassword from "../pages/auth/SetupPassword";
import Support from "../pages/main/Support";
import Error from "../pages/main/Error";
import Users from "../pages/admin/users/Users";
import CreateUser from "../pages/admin/users/CreateUser";
import Schools from "../pages/admin/schools/Schools";
import CreateSchool from "../pages/admin/schools/CreateSchool";
import BulkSchools from "../pages/admin/schools/BulkSchools";
import EditSchool from "../pages/admin/schools/EditSchool";
import SchoolView from "../pages/admin/schools/SchoolView";
import Programs from "../pages/admin/programs/Programs";
import CreateProgram from "../pages/admin/programs/CreateProgram";
import BulkPrograms from "../pages/admin/programs/BulkPrograms";
import ProgramView from "../pages/admin/programs/ProgramView";
import Subjects from "../pages/admin/subjects/Subjects";
import CreateSubject from "../pages/admin/subjects/CreateSubject";
import BulkSubjects from "../pages/admin/subjects/BulkSubjects";
import SubjectView from "../pages/admin/subjects/SubjectView";
import Specializations from "../pages/admin/specializations/Specializations";
import CreateSpecialization from "../pages/admin/specializations/CreateSpecialization";
import EditSpecialization from "../pages/admin/specializations/EditSpecialization";
import SpecializationView from "../pages/admin/specializations/SpecializationView";
import Notification from "../components/dashboard/Notifications";
import NotificationDetail from "../components/dashboard/NotificationDetail";
import Notices from "../pages/admin/notices/Notices";
import CreateNotice from "../pages/admin/notices/CreateNotice";
import EditNotice from "../pages/admin/notices/EditNotice";
import NoticeView from "../pages/admin/notices/NoticeView";
import Events from "../pages/admin/events/Events";
import CreateEvent from "../pages/admin/events/CreateEvent";
import EventView from "../pages/admin/events/EventView";
import Profile from "../pages/profile/Profile";

const Navlinks = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Error />} />
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
            allowedRoles={["superAdmin", "schoolAdmin", "faculty", "coordinator", "student", "examCell"]}
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
          path="schools/create"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <CreateSchool />
            </ProtectedRoute>
          }
        />
        <Route
          path="schools/bulk"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <BulkSchools />
            </ProtectedRoute>
          }
        />
        <Route
          path="schools/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <EditSchool />
            </ProtectedRoute>
          }
        />
        <Route
          path="schools/:id"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <SchoolView />
            </ProtectedRoute>
          }
        />

        <Route
          path="programs/create"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <CreateProgram />
            </ProtectedRoute>
          }
        />
        <Route
          path="programs/bulk"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <BulkPrograms />
            </ProtectedRoute>
          }
        />
        <Route
          path="programs/:id"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <ProgramView />
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
          path="subjects/create"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <CreateSubject />
            </ProtectedRoute>
          }
        />
        <Route
          path="subjects/bulk"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <BulkSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="subjects/:id"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin", "faculty", "coordinator", "student"]}>
              <SubjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="subjects"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin", "faculty", "coordinator", "student"]}>
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="specializations/create"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <CreateSpecialization />
            </ProtectedRoute>
          }
        />
        <Route
          path="specializations/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <EditSpecialization />
            </ProtectedRoute>
          }
        />
        <Route
          path="specializations/:id"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <SpecializationView />
            </ProtectedRoute>
          }
        />
        <Route
          path="specializations"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <Specializations />
            </ProtectedRoute>
          }
        />

        <Route path="notifications" element={<Notification />} />
        <Route path="notifications/:id" element={<NotificationDetail />} />

        <Route
          path="notices/create"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin", "examCell"]}>
              <CreateNotice />
            </ProtectedRoute>
          }
        />
        <Route
          path="notices/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin", "examCell"]}>
              <EditNotice />
            </ProtectedRoute>
          }
        />
        <Route path="notices/:id" element={<NoticeView />} />
        <Route path="notices" element={<Notices />} />
        <Route
          path="events/create"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "schoolAdmin"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route path="events/:id" element={<EventView />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default Navlinks;
