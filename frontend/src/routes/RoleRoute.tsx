import { Navigate, Outlet } from "react-router";

import { useAuth } from "../features/auth/hooks/use-auth";

interface RoleRouteProps {
    allowedRoles: string[];
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const { user } = useAuth();

    const hasRequiredRole = Boolean(
        user && allowedRoles.some((role) => user.roles.includes(role)),
    );

    if (!hasRequiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;