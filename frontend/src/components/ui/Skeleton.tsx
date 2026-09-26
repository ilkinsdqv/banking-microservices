import type { HTMLAttributes } from "react";

interface SkeletonProps
    extends HTMLAttributes<HTMLDivElement> {
    width?: string;
    height?: string;
}

export function Skeleton({
                             width,
                             height,
                             className = "",
                             style,
                             ...props
                         }: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={[
                "animate-pulse rounded-lg bg-slate-200",
                className,
            ].join(" ")}
            style={{
                width,
                height,
                ...style,
            }}
            {...props}
        />
    );
}