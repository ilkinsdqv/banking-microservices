import { Navigate, Outlet } from "react-router";

type RoleRouteProps = {
    allowedRoles: string[];
};

function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const userRoles: string[] = [];

    const hasRequiredRole = allowedRoles.some((role) =>
        userRoles.includes(role),
    );

    if (!hasRequiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;