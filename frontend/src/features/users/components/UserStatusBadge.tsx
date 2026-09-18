import type { User } from "../types/user";

interface UserStatusBadgeProps {
    user: User;
}

export default function UserStatusBadge({
                                            user,
                                        }: UserStatusBadgeProps) {
    if (user.accountLocked) {
        return (
            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        Locked
      </span>
        );
    }

    if (!user.enabled) {
        return (
            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        Disabled
      </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      Active
    </span>
    );
}