import {
    AlertTriangle,
    FileText,
    MessageSquare,
    ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, Textarea } from "../../../components/ui";
import { useCreateComplaint } from "../hooks/use-create-complaint";
import {
    createComplaintSchema,
    type CreateComplaintFormValues,
} from "../schemas/create-complaint-schema";

interface CreateComplaintFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

function CreateComplaintForm({
                                 onSuccess,
                                 onCancel,
                             }: CreateComplaintFormProps) {
    const createComplaint = useCreateComplaint();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateComplaintFormValues>({
        resolver: zodResolver(createComplaintSchema),
        defaultValues: {
            subject: "",
            description: "",
            priority: "MEDIUM",
        },
    });

    const onSubmit = async (values: CreateComplaintFormValues) => {
        try {
            await createComplaint.mutateAsync(values);
            onSuccess();
        } catch {
            // Server error is displayed below.
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                        <MessageSquare className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Contact support
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Provide enough detail so our support team can
                            investigate your issue efficiently.
                        </p>
                    </div>
                </div>
            </div>

            <Input
                label="Subject"
                placeholder="Describe the issue briefly"
                maxLength={200}
                error={errors.subject?.message}
                leftElement={<FileText className="h-4 w-4" />}
                {...register("subject")}
            />

            <Textarea
                label="Description"
                placeholder="Explain the issue in detail..."
                rows={7}
                maxLength={5000}
                error={errors.description?.message}
                {...register("description")}
            />

            <div>
                <label
                    htmlFor="complaint-priority"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Priority
                </label>

                <select
                    id="complaint-priority"
                    {...register("priority")}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                {errors.priority && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.priority.message}
                    </p>
                )}
            </div>

            {createComplaint.isError && (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <div>
                        <p className="text-sm font-semibold text-red-800">
                            Submission failed
                        </p>
                        <p className="mt-1 text-sm text-red-700">
                            The complaint could not be submitted. Please try
                            again.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-xs leading-5 text-slate-500">
                    Your complaint will be securely submitted to the bank's
                    support team.
                </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={createComplaint.isPending}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={createComplaint.isPending}
                >
                    {createComplaint.isPending
                        ? "Submitting..."
                        : "Submit complaint"}
                </Button>
            </div>
        </form>
    );
}

export default CreateComplaintForm;