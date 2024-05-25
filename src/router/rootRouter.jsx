import { createBrowserRouter } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage.jsx";
import RootLayout from "../layout/RootLayout.jsx";
import SignInPage from "../pages/SignInPage.jsx";
import MainPage from "../pages/MainPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import SalonSettingsPage from "../pages/SalonSettingsPage.jsx";
import SalonBookingPage from "../pages/SalonBookingPage.jsx";
import MasterBookingPage from "../pages/MasterBookingPage.jsx";
import AppointmentsPage from "../pages/AppointmentPage.jsx";

const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute page={<MainPage />} />,
      },
      {
        path: "/appointments",
        element: <ProtectedRoute page={<AppointmentsPage />} />,
      },
      {
        path: "/masters/salon",
        element: (
          <ProtectedRoute
            roles={["ROLE_MASTER"]}
            page={<SalonSettingsPage />}
          />
        ),
      },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        path: "/salons/:salonLinkName",
        element: <SalonBookingPage />,
      },
      {
        path: "/salons/:salonLinkName/masters/:masterId",
        element: <MasterBookingPage />,
      },
    ],
  },
]);

export default rootRouter;
