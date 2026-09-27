import type {
    HTMLAttributes,
    ReactNode,
} from "react";

interface TableProps
    extends HTMLAttributes<HTMLTableElement> {
    children: ReactNode;
}

export function Table({
                          children,
                          className = "",
                          ...props
                      }: TableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table
                className={[
                    "w-full min-w-[640px] text-sm",
                    className,
                ].join(" ")}
                {...props}
            >
                {children}
            </table>
        </div>
    );
}

interface TableHeaderProps
    extends HTMLAttributes<HTMLTableSectionElement> {
    children: ReactNode;
}

export function TableHeader({
                                children,
                                className = "",
                                ...props
                            }: TableHeaderProps) {
    return (
        <thead
            className={[
                "border-b border-slate-200 bg-slate-50",
                className,
            ].join(" ")}
            {...props}
        >
        {children}
        </thead>
    );
}

interface TableBodyProps
    extends HTMLAttributes<HTMLTableSectionElement> {
    children: ReactNode;
}

export function TableBody({
                              children,
                              className = "",
                              ...props
                          }: TableBodyProps) {
    return (
        <tbody
            className={[
                "divide-y divide-slate-100",
                className,
            ].join(" ")}
            {...props}
        >
        {children}
        </tbody>
    );
}

interface TableRowProps
    extends HTMLAttributes<HTMLTableRowElement> {
    children: ReactNode;
}

export function TableRow({
                             children,
                             className = "",
                             ...props
                         }: TableRowProps) {
    return (
        <tr
            className={[
                "transition-colors hover:bg-slate-50/80",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </tr>
    );
}

interface TableHeadProps
    extends HTMLAttributes<HTMLTableCellElement> {
    children: ReactNode;
}

export function TableHead({
                              children,
                              className = "",
                              ...props
                          }: TableHeadProps) {
    return (
        <th
            scope="col"
            className={[
                "px-4 py-3 text-left text-xs font-semibold",
                "uppercase tracking-wide text-slate-500",
                "whitespace-nowrap",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </th>
    );
}

interface TableCellProps
    extends HTMLAttributes<HTMLTableCellElement> {
    children: ReactNode;
}

export function TableCell({
                              children,
                              className = "",
                              ...props
                          }: TableCellProps) {
    return (
        <td
            className={[
                "px-4 py-3.5 text-sm text-slate-700",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </td>
    );
}

interface TableCaptionProps
    extends HTMLAttributes<HTMLTableCaptionElement> {
    children: ReactNode;
}

export function TableCaption({
                                 children,
                                 className = "",
                                 ...props
                             }: TableCaptionProps) {
    return (
        <caption
            className={[
                "px-4 py-3 text-left text-sm text-slate-500",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </caption>
    );
}