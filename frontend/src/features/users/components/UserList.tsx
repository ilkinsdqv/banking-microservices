import {
    ChevronRight,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";

import type { User } from "../types/user";
import UserStatusBadge from "./UserStatusBadge";

interface UserListProps {
    users: User[];
}

function getRoleLabel(role: string): string {
    switch (role) {
        case "ADMIN":
            return "Admin";
        case "INTERNAL_SERVICE":
            return "Internal";
        case "USER":
            return "User";
        default:
            return role;
    }
}

export default function UserList({ users }: UserListProps) {
    const navigate = useNavigate();

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                    <UserRound className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-950">
                    No users found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    There are no users to display.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            User
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Phone
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Role
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Verification
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Status
                        </th>
                        <th className="w-10 px-4" />
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            onClick={() =>
                                navigate(`/admin/users/${user.id}`)
                            }
                            className="cursor-pointer transition hover:bg-slate-50"
                        >
                            <td className="px-5 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <UserRound className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">
                                            {user.firstName} {user.lastName}
                                        </p>

                                        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="max-w-xs truncate">
                                                    {user.email}
                                                </span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className="px-5 py-5">
                                <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    {user.phoneNumber}
                                </div>
                            </td>

                            <td className="px-5 py-5">
                                <div className="flex flex-wrap gap-1.5">
                                    {user.roles.map((role) => (
                                        <span
                                            key={role}
                                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                                        >
                                                {getRoleLabel(role)}
                                            </span>
                                    ))}
                                </div>
                            </td>

                            <td className="px-5 py-5">
                                {user.emailVerified ? (
                                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                                            <ShieldCheck className="h-4 w-4" />
                                            Verified
                                        </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
                                            Pending
                                        </span>
                                )}
                            </td>

                            <td className="px-5 py-5">
                                <UserStatusBadge user={user} />
                            </td>

                            <td className="px-4 py-5">
                                <ChevronRight className="h-5 w-5 text-slate-400" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="divide-y divide-slate-100 bg-white md:hidden">
                {users.map((user) => (
                    <button
                        key={user.id}
                        type="button"
                        onClick={() =>
                            navigate(`/admin/users/${user.id}`)
                        }
                        className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-900">
                                        {user.firstName} {user.lastName}
                                    </p>

                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        {user.email}
                                    </p>
                                </div>

                                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <UserStatusBadge user={user} />

                                {user.roles.map((role) => (
                                    <span
                                        key={role}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                                    >
                                        {getRoleLabel(role)}
                                    </span>
                                ))}
                            </div>

                            <p className="mt-2 text-xs text-slate-400">
                                {user.phoneNumber}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}