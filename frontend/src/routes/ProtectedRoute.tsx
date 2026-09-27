import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../features/auth/hooks/use-auth";

function ProtectedRoute() {
    const { isAuthenticated, isInitializing } = useAuth();
    const location = useLocation();

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-sm text-slate-500">
                    Restoring session...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;