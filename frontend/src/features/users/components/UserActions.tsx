import {
    Lock,
    LockOpen,
    Power,
    PowerOff,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "../../../components/ui";
import type { User } from "../types/user";
import {
    useDeleteUser,
    useDisableUser,
    useEnableUser,
    useLockUser,
    useUnlockUser,
} from "../hooks/use-user-actions";

interface UserActionsProps {
    user: User;
    isOwnAccount: boolean;
}

export default function UserActions({
                                        user,
                                        isOwnAccount,
                                    }: UserActionsProps) {
    const navigate = useNavigate();

    const enableUser = useEnableUser();
    const disableUser = useDisableUser();
    const lockUser = useLockUser();
    const unlockUser = useUnlockUser();
    const deleteUser = useDeleteUser();

    const isPending =
        enableUser.isPending ||
        disableUser.isPending ||
        lockUser.isPending ||
        unlockUser.isPending ||
        deleteUser.isPending;

    if (isOwnAccount) {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                    <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                    <div>
                        <p className="text-sm font-semibold text-amber-900">
                            Protected account
                        </p>
                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            Your own account cannot be disabled, locked or
                            deleted from the admin panel.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const handleDisable = () => {
        if (
            !window.confirm(
                `Disable ${user.firstName} ${user.lastName}'s account?`,
            )
        ) {
            return;
        }

        disableUser.mutate(user.id);
    };

    const handleEnable = () => {
        enableUser.mutate(user.id);
    };

    const handleLock = () => {
        if (
            !window.confirm(
                `Lock ${user.firstName} ${user.lastName}'s account?`,
            )
        ) {
            return;
        }

        lockUser.mutate(user.id);
    };

    const handleUnlock = () => {
        unlockUser.mutate(user.id);
    };

    const handleDelete = () => {
        if (
            !window.confirm(
                `Delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
            )
        ) {
            return;
        }

        deleteUser.mutate(user.id, {
            onSuccess: () => {
                navigate("/admin/users");
            },
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5">
                <h2 className="text-base font-semibold text-slate-950">
                    Account actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Manage access and account state.
                </p>
            </div>

            <div className="space-y-3 p-5">
                {user.enabled ? (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleDisable}
                        className="w-full justify-start"
                    >
                        <PowerOff className="h-4 w-4" />
                        {disableUser.isPending
                            ? "Disabling..."
                            : "Disable account"}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        disabled={isPending}
                        onClick={handleEnable}
                        className="w-full justify-start"
                    >
                        <Power className="h-4 w-4" />
                        {enableUser.isPending
                            ? "Enabling..."
                            : "Enable account"}
                    </Button>
                )}

                {user.accountLocked ? (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleUnlock}
                        className="w-full justify-start"
                    >
                        <LockOpen className="h-4 w-4" />
                        {unlockUser.isPending
                            ? "Unlocking..."
                            : "Unlock account"}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleLock}
                        className="w-full justify-start"
                    >
                        <Lock className="h-4 w-4" />
                        {lockUser.isPending
                            ? "Locking..."
                            : "Lock account"}
                    </Button>
                )}

                <div className="my-2 border-t border-slate-100" />

                <Button
                    type="button"
                    variant="danger"
                    disabled={isPending}
                    onClick={handleDelete}
                    className="w-full justify-start"
                >
                    <Trash2 className="h-4 w-4" />
                    {deleteUser.isPending
                        ? "Deleting..."
                        : "Delete user"}
                </Button>
            </div>
        </div>
    );
}