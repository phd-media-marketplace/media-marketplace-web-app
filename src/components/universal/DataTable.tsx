import { useMemo, type CSSProperties, type ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableAlign = "left" | "center" | "right";

interface UniversalDataTableColumn<T> {
  id: string;
  header: ReactNode;
  accessor?: keyof T | ((row: T, index: number) => ReactNode);
  cell?: (row: T, index: number) => ReactNode;
  align?: DataTableAlign;
  headerAlign?: DataTableAlign;
  widthPx?: number;
  minWidthPx?: number;
  widthClassName?: string;
  minWidthClassName?: string;
  sticky?: boolean;
  stickyLeft?: number;
  stickyZIndex?: number;
  headerClassName?: string;
  cellClassName?: string;
}

interface UniversalDataTableProps<T> {
  rows: T[];
  columns: UniversalDataTableColumn<T>[];
  rowKey: (row: T, index: number) => string;
  containerClassName?: string;
  minTableWidthClassName?: string;
  tableClassName?: string;
  rowClassName?: string;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  emptyState?: ReactNode;
}

const alignClass: Record<DataTableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const stickyZClassByValue: Record<number, string> = {
  10: "z-10",
  20: "z-20",
  30: "z-30",
  40: "z-40",
  50: "z-50",
};

export type { UniversalDataTableColumn, UniversalDataTableProps, DataTableAlign };

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  containerClassName,
  minTableWidthClassName = "min-w-full",
  tableClassName,
  rowClassName,
  headerSlot,
  footerSlot,
  emptyState,
}: UniversalDataTableProps<T>) {
  const resolvedColumns = useMemo(() => {
    const result = columns.reduce<{
      nextStickyOffset: number;
      resolved: Array<UniversalDataTableColumn<T> & { isSticky: boolean; resolvedLeft?: number }>;
    }>(
      (state, column) => {
        const isSticky = column.sticky || column.stickyLeft !== undefined;
        const resolvedLeft =
          column.stickyLeft !== undefined
            ? column.stickyLeft
            : isSticky
              ? state.nextStickyOffset
              : undefined;
        const widthForOffset = column.widthPx ?? column.minWidthPx ?? 0;
        const nextStickyOffset =
          isSticky && column.stickyLeft === undefined
            ? state.nextStickyOffset + widthForOffset
            : state.nextStickyOffset;

        return {
          nextStickyOffset,
          resolved: [...state.resolved, { ...column, isSticky, resolvedLeft }],
        };
      },
      { nextStickyOffset: 0, resolved: [] },
    );

    return result.resolved;
  }, [columns]);

  return (
    <div className={cn("w-full", containerClassName)}>
      {headerSlot}
      <div className="w-full overflow-x-auto">
        <Table className={cn(minTableWidthClassName, "table-fixed", tableClassName)}>
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
              {resolvedColumns.map((column) => {
                const stickyStyles: CSSProperties | undefined =
                  column.resolvedLeft !== undefined
                    ? {
                        left: column.resolvedLeft,
                        width: column.widthPx,
                        minWidth: column.minWidthPx,
                        zIndex: column.stickyZIndex,
                      }
                    : {
                        width: column.widthPx,
                        minWidth: column.minWidthPx,
                      };

                return (
                  <TableHead
                    key={column.id}
                    style={stickyStyles}
                    className={cn(
                      alignClass[column.headerAlign ?? column.align ?? "left"],
                      column.widthClassName,
                      column.minWidthClassName,
                      column.isSticky ? "sticky bg-slate-50/70" : undefined,
                      column.isSticky
                        ? stickyZClassByValue[column.stickyZIndex ?? 30] ?? "z-30"
                        : undefined,
                      "text-slate-600",
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={resolvedColumns.length} className="py-12 text-center text-gray-500">
                  {emptyState}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={rowKey(row, index)} className={cn("group border-t border-slate-200/80 hover:bg-slate-50/60", rowClassName)}>
                  {resolvedColumns.map((column) => {
                    const value =
                      typeof column.accessor === "function"
                        ? column.accessor(row, index)
                        : column.accessor
                          ? row[column.accessor]
                          : undefined;
                    const content = column.cell ? column.cell(row, index) : (value as ReactNode);
                    const stickyStyles: CSSProperties | undefined =
                      column.resolvedLeft !== undefined
                        ? {
                            left: column.resolvedLeft,
                            width: column.widthPx,
                            minWidth: column.minWidthPx,
                            zIndex: column.stickyZIndex,
                          }
                        : {
                            width: column.widthPx,
                            minWidth: column.minWidthPx,
                          };

                    return (
                      <TableCell
                        key={column.id}
                        style={stickyStyles}
                        className={cn(
                          alignClass[column.align ?? "left"],
                          column.widthClassName,
                          column.minWidthClassName,
                          column.isSticky
                            ? "sticky z-20 bg-white group-hover:bg-slate-50/60"
                            : undefined,
                          column.cellClassName,
                        )}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {footerSlot}
    </div>
  );
}