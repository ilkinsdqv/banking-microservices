import { useState } from "react";
import {
    Activity,
    ArrowLeftRight,
    Banknote,
    ChevronRight,
    CircleUserRound,
    CreditCard,
    Landmark,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    ShieldCheck,
    Users,
    X,
    type LucideIcon,
} from "lucide-react";
import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router";

import { useAuth } from "../features/auth/hooks/use-auth";

type NavigationItem = {
    label: string;
    to: string;
    icon: LucideIcon;
    end?: boolean;
};

const customerNavigation: NavigationItem[] = [
    {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: "Accounts",
        to: "/accounts",
        icon: Landmark,
    },
    {
        label: "Transactions",
        to: "/transactions",
        icon: ArrowLeftRight,
    },
    {
        label: "Loans",
        to: "/loans",
        icon: CreditCard,
    },
    {
        label: "Complaints",
        to: "/complaints",
        icon: MessageSquare,
    },
];

const adminNavigation: NavigationItem[] = [
    {
        label: "Users",
        to: "/admin/users",
        icon: Users,
    },
    {
        label: "Accounts",
        to: "/admin/accounts",
        icon: Landmark,
    },
    {
        label: "Complaints",
        to: "/admin/complaints",
        icon: MessageSquare,
    },
    {
        label: "Audit",
        to: "/admin/audit",
        icon: Activity,
    },
];

function getInitials(userId?: string) {
    if (!userId) {
        return "U";
    }

    return userId.slice(0, 2).toUpperCase();
}

function isAdminRole(roles?: string[]) {
    return Boolean(
        roles?.some((role) => role === "ADMIN"),
    );
}

function NavigationLink({
                            item,
                            onNavigate,
                        }: {
    item: NavigationItem;
    onNavigate?: () => void;
}) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
                [
                    "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                    isActive
                        ? "bg-slate-950 text-white shadow-[0_8px_20px_rgba(15,23,42,0.16)]"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={[
                            "flex h-8 w-8 items-center justify-center rounded-lg transition",
                            isActive
                                ? "bg-white/10 text-white"
                                : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900",
                        ].join(" ")}
                    >
                        <Icon className="h-4 w-4" />
                    </span>

                    <span className="flex-1">
                        {item.label}
                    </span>

                    {isActive && (
                        <ChevronRight className="h-4 w-4 text-white/60" />
                    )}
                </>
            )}
        </NavLink>
    );
}

function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);
    const [isLoggingOut, setIsLoggingOut] =
        useState(false);

    const admin = isAdminRole(user?.roles);

    const isAdminArea =
        location.pathname.startsWith("/admin");

    const navigation =
        admin && isAdminArea
            ? adminNavigation
            : customerNavigation;

    const sectionLabel = isAdminArea
        ? "Administration"
        : "Personal banking";

    const portalLabel = isAdminArea
        ? "Admin Console"
        : "Customer Portal";

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await logout();
            navigate("/login", { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
                <div className="flex h-full flex-col">
                    <div className="px-5 pb-5 pt-6">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    admin && isAdminArea
                                        ? "/admin/users"
                                        : "/dashboard",
                                )
                            }
                            className="flex w-full items-center gap-3 text-left"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]">
                                <Banknote className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-[15px] font-bold tracking-tight text-slate-950">
                                    Banking System
                                </p>

                                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                    Digital banking
                                </p>
                            </div>
                        </button>
                    </div>

                    <div className="px-4">
                        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            {sectionLabel}
                        </div>

                        <nav className="space-y-1">
                            {navigation.map((item) => (
                                <NavigationLink
                                    key={item.to}
                                    item={item}
                                />
                            ))}
                        </nav>
                    </div>

                    {admin && (
                        <div className="mt-5 px-4">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        isAdminArea
                                            ? "/dashboard"
                                            : "/admin/users",
                                    )
                                }
                                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left transition hover:border-slate-300 hover:bg-white"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    {isAdminArea ? (
                                        <LayoutDashboard className="h-4 w-4" />
                                    ) : (
                                        <ShieldCheck className="h-4 w-4" />
                                    )}
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block text-xs font-bold text-slate-900">
                                        {isAdminArea
                                            ? "Customer view"
                                            : "Admin console"}
                                    </span>

                                    <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                                        {isAdminArea
                                            ? "Return to banking"
                                            : "Manage the platform"}
                                    </span>
                                </span>

                                <ChevronRight className="h-4 w-4 text-slate-300" />
                            </button>
                        </div>
                    )}

                    <div className="mt-auto p-4">
                        <div className="rounded-2xl bg-slate-950 p-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
                                    {getInitials(user?.id)}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold">
                                        {admin
                                            ? "Administrator"
                                            : "Banking customer"}
                                    </p>

                                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                        {user?.id ??
                                            "Authenticated user"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    void handleLogout()
                                }
                                disabled={isLoggingOut}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                            >
                                <LogOut className="h-4 w-4" />

                                {isLoggingOut
                                    ? "Signing out..."
                                    : "Sign out"}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl lg:hidden">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen(true)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
                        aria-label="Open navigation"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                admin && isAdminArea
                                    ? "/admin/users"
                                    : "/dashboard",
                            )
                        }
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                            <Banknote className="h-4 w-4" />
                        </div>

                        <span className="text-sm font-bold tracking-tight">
                            Banking System
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen(true)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
                        aria-label="Open profile menu"
                    >
                        <CircleUserRound className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() =>
                            setIsMobileMenuOpen(false)
                        }
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                    />

                    <aside className="relative flex h-full w-[min(86vw,330px)] flex-col bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                    <Banknote className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-bold">
                                        Banking System
                                    </p>

                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        {portalLabel}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileMenuOpen(false)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                                aria-label="Close navigation"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-5">
                            <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                {sectionLabel}
                            </div>

                            <nav className="space-y-1">
                                {navigation.map((item) => (
                                    <NavigationLink
                                        key={item.to}
                                        item={item}
                                        onNavigate={() =>
                                            setIsMobileMenuOpen(
                                                false,
                                            )
                                        }
                                    />
                                ))}
                            </nav>

                            {admin && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(
                                            false,
                                        );

                                        navigate(
                                            isAdminArea
                                                ? "/dashboard"
                                                : "/admin/users",
                                        );
                                    }}
                                    className="mt-5 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        {isAdminArea ? (
                                            <LayoutDashboard className="h-4 w-4" />
                                        ) : (
                                            <ShieldCheck className="h-4 w-4" />
                                        )}
                                    </span>

                                    <span className="flex-1">
                                        <span className="block text-xs font-bold">
                                            {isAdminArea
                                                ? "Customer view"
                                                : "Admin console"}
                                        </span>

                                        <span className="mt-0.5 block text-[11px] text-slate-500">
                                            {isAdminArea
                                                ? "Return to banking"
                                                : "Manage the platform"}
                                        </span>
                                    </span>

                                    <ChevronRight className="h-4 w-4 text-slate-300" />
                                </button>
                            )}
                        </div>

                        <div className="border-t border-slate-200 p-4">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                                    {getInitials(user?.id)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-slate-900">
                                        {admin
                                            ? "Administrator"
                                            : "Banking customer"}
                                    </p>

                                    <p className="truncate text-[10px] text-slate-400">
                                        {user?.id}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    void handleLogout()
                                }
                                disabled={isLoggingOut}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                <LogOut className="h-4 w-4" />

                                {isLoggingOut
                                    ? "Signing out..."
                                    : "Sign out"}
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className="lg:pl-[270px]">
                <div className="hidden h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-8 backdrop-blur-xl lg:flex">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            {portalLabel}
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-slate-800">
                            {isAdminArea
                                ? "Platform management"
                                : "Personal financial space"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAdminArea && (
                            <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Admin
                            </div>
                        )}

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                            {getInitials(user?.id)}
                        </div>
                    </div>
                </div>

                <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="mx-auto w-full max-w-[1500px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;