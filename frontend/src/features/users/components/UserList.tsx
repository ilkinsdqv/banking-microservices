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

export default function UserList({
                                     users,
                                 }: UserListProps) {
    const navigate = useNavigate();

    if (users.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <h3 className="text-lg font-semibold">
                    No users found
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    There are no users to display.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b bg-muted/40">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            User
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Phone
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Role
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Verification
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Status
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y">
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className="cursor-pointer transition-colors hover:bg-muted/30"
                            onClick={() =>
                                navigate(`/admin/users/${user.id}`)
                            }
                        >
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {user.phoneNumber}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.map((role) => (
                                        <span
                                            key={role}
                                            className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                                        >
                        {getRoleLabel(role)}
                      </span>
                                    ))}
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                {user.emailVerified ? (
                                    <span className="text-sm font-medium text-green-700">
                      Verified
                    </span>
                                ) : (
                                    <span className="text-sm font-medium text-yellow-700">
                      Pending
                    </span>
                                )}
                            </td>

                            <td className="px-6 py-4">
                                <UserStatusBadge user={user} />
                            </td>

                            <td className="px-6 py-4 text-right">
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();

                                        navigate(
                                            `/admin/users/${user.id}`,
                                        );
                                    }}
                                    className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}