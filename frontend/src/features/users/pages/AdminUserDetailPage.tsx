import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Edit3,
    Fingerprint,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import {
    Button,
    Card,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import { useAuth } from "../../auth/hooks/use-auth";
import UserActions from "../components/UserActions";
import UserStatusBadge from "../components/UserStatusBadge";
import { useUser } from "../hooks/use-user";

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
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();

    const {
        data: user,
        isLoading,
        isError,
        refetch,
    } = useUser(id);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-48 rounded-3xl" />
                <div className="grid gap-6 lg:grid-cols-3">
                    <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
                    <Skeleton className="h-96 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <ErrorState
                title="User could not be loaded"
                description="The requested user does not exist or could not be retrieved."
                onRetry={() => refetch()}
            />
        );
    }

    const isOwnAccount = currentUser?.id === user.id;

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to users
            </button>

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                            <UserRound className="h-7 w-7" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm text-slate-400">
                                User details
                            </p>

                            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                                {user.firstName} {user.lastName}
                            </h1>

                            <p className="mt-1 truncate text-sm text-slate-400">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        className="text-slate-950 hover:bg-slate-100"
                        onClick={() =>
                            navigate(`/admin/users/${user.id}/edit`)
                        }
                    >
                        <Edit3 className="h-4 w-4" />
                        Edit user
                    </Button>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="overflow-hidden p-0 lg:col-span-2">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Profile
                            </p>

                            <h2 className="mt-2 text-lg font-semibold text-slate-950">
                                Personal information
                            </h2>
                        </div>

                        <UserStatusBadge user={user} />
                    </div>

                    <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                First name
                            </p>
                            <p className="mt-2 font-medium text-slate-900">
                                {user.firstName}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Last name
                            </p>
                            <p className="mt-2 font-medium text-slate-900">
                                {user.lastName}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Email
                                </p>
                            </div>
                            <p className="mt-2 break-all font-medium text-slate-900">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Phone
                                </p>
                            </div>
                            <p className="mt-2 font-medium text-slate-900">
                                {user.phoneNumber}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <Fingerprint className="h-4 w-4 text-slate-400" />
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    FIN
                                </p>
                            </div>
                            <p className="mt-2 font-mono font-medium text-slate-900">
                                {user.fin}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-slate-400" />
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Birth date
                                </p>
                            </div>
                            <p className="mt-2 font-medium text-slate-900">
                                {user.birthDate}
                            </p>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card style={{ padding: "1.5rem" }}>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-slate-600" />
                            <h2 className="font-semibold text-slate-950">
                                Account status
                            </h2>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-500">
                                    Enabled
                                </span>

                                <div className="flex items-center gap-2">
                                    {user.enabled ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="text-sm font-semibold text-slate-900">
                                        {user.enabled ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-500">
                                    Account locked
                                </span>

                                <div className="flex items-center gap-2">
                                    {user.accountLocked ? (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    )}
                                    <span className="text-sm font-semibold text-slate-900">
                                        {user.accountLocked ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-500">
                                    Email verified
                                </span>

                                <div className="flex items-center gap-2">
                                    {user.emailVerified ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-amber-600" />
                                    )}
                                    <span className="text-sm font-semibold text-slate-900">
                                        {user.emailVerified ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card style={{ padding: "1.5rem" }}>
                        <h2 className="font-semibold text-slate-950">
                            Roles
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {user.roles.map((role) => (
                                <span
                                    key={role}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                >
                                    {getRoleLabel(role)}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <UserActions
                        user={user}
                        isOwnAccount={isOwnAccount}
                    />
                </div>
            </div>
        </div>
    );
}