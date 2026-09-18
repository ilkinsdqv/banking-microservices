import { useNavigate } from "react-router";

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
            <div className="rounded-lg border border-yellow-300/50 bg-yellow-50 p-4 text-sm text-yellow-800">
                Your own account cannot be disabled, locked or deleted
                from the admin panel.
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
        <div className="space-y-4">
            <h2 className="font-semibold">
                Account actions
            </h2>

            <div className="flex flex-wrap gap-3">
                {user.enabled ? (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleDisable}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {disableUser.isPending
                            ? "Disabling..."
                            : "Disable"}
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleEnable}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {enableUser.isPending
                            ? "Enabling..."
                            : "Enable"}
                    </button>
                )}

                {user.accountLocked ? (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleUnlock}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {unlockUser.isPending
                            ? "Unlocking..."
                            : "Unlock"}
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleLock}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {lockUser.isPending
                            ? "Locking..."
                            : "Lock"}
                    </button>
                )}

                <button
                    type="button"
                    disabled={isPending}
                    onClick={handleDelete}
                    className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {deleteUser.isPending
                        ? "Deleting..."
                        : "Delete user"}
                </button>
            </div>
        </div>
    );
}