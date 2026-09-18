import {useNavigate, useParams} from "react-router";

import {useAuth} from "../../auth/hooks/use-auth";
import UserActions from "../components/UserActions";

import {useUser} from "../hooks/use-user";
import UserStatusBadge from "../components/UserStatusBadge";

function getRoleLabel(role: string): string {
    switch (role) {
        case "ADMIN":
            return "Admin";
        case "INTERNAL_SERVICE":
            return "Internal Service";
        case "USER":
            return "User";
        default:
            return role;
    }
}

export default function AdminUserDetailPage() {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {user: currentUser} = useAuth();

    const {
        data: user,
        isLoading,
        isError,
    } = useUser(id);



    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-muted"/>
                <div className="h-80 animate-pulse rounded-xl bg-muted"/>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to users
                </button>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <h2 className="font-semibold">
                        User could not be loaded
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        The requested user does not exist or could not be retrieved.
                    </p>
                </div>
            </div>
        );
    }


    const isOwnAccount = currentUser?.id === user.id;

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                ← Back to users
            </button>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        User details
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage user account information and status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(`/admin/users/${user.id}/edit`)
                    }
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Edit user
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Full name
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                {user.firstName} {user.lastName}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>

                        <UserStatusBadge user={user}/>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                First name
                            </p>

                            <p className="mt-1">{user.firstName}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Last name
                            </p>

                            <p className="mt-1">{user.lastName}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Email
                            </p>

                            <p className="mt-1 break-all">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Phone number
                            </p>

                            <p className="mt-1">{user.phoneNumber}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                FIN
                            </p>

                            <p className="mt-1 font-mono">
                                {user.fin}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Birth date
                            </p>

                            <p className="mt-1">{user.birthDate}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="font-semibold">
                            Account status
                        </h2>

                        <div className="mt-5 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Enabled
                </span>

                                <span className="text-sm font-medium">
                  {user.enabled ? "Yes" : "No"}
                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Account locked
                </span>

                                <span className="text-sm font-medium">
                                  {user.accountLocked ? "Yes" : "No"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">
                                  Email verified
                                </span>

                                <span className="text-sm font-medium">
                                  {user.emailVerified ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="font-semibold">
                            Roles
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {user.roles.map((role) => (
                                <span
                                    key={role}
                                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                >
                                  {getRoleLabel(role)}
                                </span>
                            ))}
                        </div>
                    </div>
                    <UserActions
                        user={user}
                        isOwnAccount={isOwnAccount}
                    />
                </div>
            </div>
        </div>
    );
}