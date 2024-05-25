import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ page, roles }) {
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.user);
  const isRouteNotAllowed =
    !currentUser || (roles && !roles?.includes(currentUser.role));

  if (isRouteNotAllowed) {
    return <Navigate to="/sign-in" replace state={{ redirectTo: location }} />;
  }

  return <>{page}</>;
}
