import {
    CheckCircle2,
    LockKeyhole,
    PowerOff,
} from "lucide-react";

import type { User } from "../types/user";

interface UserStatusBadgeProps {
    user: User;
}

export default function UserStatusBadge({
                                            user,
                                        }: UserStatusBadgeProps) {
    if (user.accountLocked) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                <LockKeyhole className="h-3.5 w-3.5" />
                Locked
            </span>
        );
    }

    if (!user.enabled) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                <PowerOff className="h-3.5 w-3.5" />
                Disabled
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Active
        </span>
    );
}