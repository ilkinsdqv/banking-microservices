import { Navigate, Outlet, useLocation } from "react-router";

function ProtectedRoute() {
    const location = useLocation();

    const isAuthenticated = true;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;