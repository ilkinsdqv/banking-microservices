import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function Card({
                         children,
                         className = "",
                         ...props
                     }: CardProps) {
    return (
        <div
            className={[
                "rounded-xl border border-slate-200",
                "bg-white shadow-sm",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps
    extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardHeader({
                               children,
                               className = "",
                               ...props
                           }: CardHeaderProps) {
    return (
        <div
            className={[
                "border-b border-slate-100 px-5 py-4",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardTitleProps
    extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}

export function CardTitle({
                              children,
                              className = "",
                              ...props
                          }: CardTitleProps) {
    return (
        <h3
            className={[
                "text-base font-semibold text-slate-900",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </h3>
    );
}

interface CardDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode;
}

export function CardDescription({
                                    children,
                                    className = "",
                                    ...props
                                }: CardDescriptionProps) {
    return (
        <p
            className={[
                "mt-1 text-sm text-slate-500",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </p>
    );
}

interface CardContentProps
    extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardContent({
                                children,
                                className = "",
                                ...props
                            }: CardContentProps) {
    return (
        <div
            className={[
                "px-5 py-5",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardFooterProps
    extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardFooter({
                               children,
                               className = "",
                               ...props
                           }: CardFooterProps) {
    return (
        <div
            className={[
                "border-t border-slate-100 px-5 py-4",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </div>
    );
}