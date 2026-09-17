import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

    const onSubmit = async (
        values: CreateComplaintFormValues,
    ) => {
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
            className="space-y-5"
        >
            <div>
                <label
                    htmlFor="complaint-subject"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Subject
                </label>

                <input
                    id="complaint-subject"
                    type="text"
                    maxLength={200}
                    placeholder="Describe the issue briefly"
                    {...register("subject")}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.subject.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="complaint-description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>

                <textarea
                    id="complaint-description"
                    rows={7}
                    maxLength={5000}
                    placeholder="Explain the issue in detail..."
                    {...register("description")}
                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.priority.message}
                    </p>
                )}
            </div>

            {createComplaint.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">
                        The complaint could not be submitted. Please try
                        again.
                    </p>
                </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={createComplaint.isPending}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={createComplaint.isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {createComplaint.isPending
                        ? "Submitting..."
                        : "Submit complaint"}
                </button>
            </div>
        </form>
    );
}

export default CreateComplaintForm;