import { Button } from "@/components/ui/button";
import { FileText, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Eye, Send } from "lucide-react";
import type { WorkOrder, WorkOrderStatus } from "@/features/agency-features/work-orders/types";
import { DataTable } from "@/components/universal/DataTable";
import { useMemo, type ReactNode } from "react";
import type { UniversalDataTableColumn } from "@/components/universal/DataTable";

interface MediaPartnerWorkOrdersTableProps {
  workOrders: WorkOrder[];
  onViewWorkOrder: (id: string) => void;
  onSendWorkOrder: (id: string) => void;
  formatStatusLabel: (status: WorkOrderStatus) => string;
  getStatusPillClasses: (status: WorkOrderStatus) => string;
  headerSlot?: ReactNode;
}

export function MediaPartnerWorkOrdersTable({
  workOrders,
  onViewWorkOrder,
  onSendWorkOrder,
  formatStatusLabel,
  getStatusPillClasses,
  headerSlot,
}: MediaPartnerWorkOrdersTableProps) {
  const columns = useMemo<UniversalDataTableColumn<WorkOrder>[]>(() => {
    return [
      {
        id: "select",
        header: <input type="checkbox" className="h-4 w-4 rounded border-slate-300" aria-label="Select all work orders" />,
        cell: (workOrder: WorkOrder) => (
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300" aria-label={`Select ${workOrder.workOrderNumber}`} />
        ),
        widthPx: 56,
        minWidthPx: 56,
        widthClassName: "w-14",
        minWidthClassName: "min-w-14",
        sticky: true,
        headerClassName: "px-0 pl-3 pr-2",
        cellClassName: "px-0 pl-3 pr-2",
      },
      {
        id: "workOrderNumber",
        header: "Work Order #",
        cell: (workOrder: WorkOrder) => workOrder.workOrderNumber,
        widthPx: 144,
        minWidthPx: 144,
        widthClassName: "w-36",
        minWidthClassName: "min-w-36",
        sticky: true,
        cellClassName: "font-medium text-slate-900",
      },
      {
        id: "clientAgency",
        header: "Client/Agency",
        cell: (workOrder: WorkOrder) =>
          workOrder.header.clientType === "AGENCY"
            ? workOrder.header.agencyName
            : workOrder.header.clientName,
        widthPx: 160,
        minWidthPx: 160,
        widthClassName: "w-40",
        minWidthClassName: "min-w-40",
        cellClassName: "font-semibold text-slate-900",
      },
      {
        id: "brand",
        header: "Brand",
        cell: (workOrder: WorkOrder) => workOrder.header.brandName,
        widthPx: 128,
        minWidthPx: 128,
        widthClassName: "w-32",
        minWidthClassName: "min-w-32",
        cellClassName: "text-slate-700",
      },
      {
        id: "campaign",
        header: "Campaign",
        cell: (workOrder: WorkOrder) => workOrder.header.campaignName,
        widthPx: 176,
        minWidthPx: 176,
        widthClassName: "w-44",
        minWidthClassName: "min-w-44",
        cellClassName: "text-slate-700",
      },
      {
        id: "amount",
        header: "Amount",
        cell: (workOrder: WorkOrder) => `GHS ${workOrder.totalAmount.toLocaleString()}`,
        widthPx: 112,
        minWidthPx: 112,
        widthClassName: "w-28",
        minWidthClassName: "min-w-28",
        cellClassName: "font-semibold text-slate-900",
      },
      {
        id: "duration",
        header: "Duration",
        cell: (workOrder: WorkOrder) =>
          `${new Date(workOrder.header.startDate).toLocaleDateString()} - ${new Date(workOrder.header.endDate).toLocaleDateString()}`,
        widthPx: 160,
        minWidthPx: 160,
        widthClassName: "w-40",
        minWidthClassName: "min-w-40",
        cellClassName: "text-slate-600",
      },
      {
        id: "mediaType",
        header: "Media Type",
        cell: (workOrder: WorkOrder) => workOrder.mediaType,
        widthPx: 96,
        minWidthPx: 96,
        widthClassName: "w-24",
        minWidthClassName: "min-w-24",
        cellClassName: "text-slate-700",
      },
      {
        id: "station",
        header: "Station",
        cell: (workOrder: WorkOrder) => workOrder.channelName,
        widthPx: 144,
        minWidthPx: 144,
        widthClassName: "w-36",
        minWidthClassName: "min-w-36",
        cellClassName: "text-slate-700",
      },
      {
        id: "status",
        header: "Status",
        cell: (workOrder: WorkOrder) => (
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPillClasses(workOrder.status)}`}>
            {formatStatusLabel(workOrder.status)}
          </span>
        ),
        widthPx: 112,
        minWidthPx: 112,
        widthClassName: "w-28",
        minWidthClassName: "min-w-28",
      },
      {
        id: "actions",
        header: "Actions",
        cell: (workOrder: WorkOrder) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:bg-primary/10 hover:text-primary"
              onClick={() => onViewWorkOrder(workOrder.id)}
              aria-label={`View ${workOrder.workOrderNumber}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:bg-primary/10 hover:text-primary"
              onClick={() => onSendWorkOrder(workOrder.id)}
              aria-label={`Send ${workOrder.workOrderNumber}`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ),
        widthPx: 96,
        minWidthPx: 96,
        widthClassName: "w-24",
        minWidthClassName: "min-w-24",
        align: "center",
        headerAlign: "center",
      },
    ];
  }, [formatStatusLabel, getStatusPillClasses, onSendWorkOrder, onViewWorkOrder]);

  return (
    <DataTable
      rows={workOrders}
      columns={columns}
      rowKey={(workOrder) => workOrder.id}
      containerClassName="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      headerSlot={headerSlot}
      minTableWidthClassName="min-w-270"
      emptyState={
        <>
          <FileText className="mx-auto mb-2 h-12 w-12 text-gray-300" />
          <p>No work orders found matching your filters</p>
        </>
      }
      footerSlot={
        <div className="flex items-center justify-end gap-1 border-t border-slate-200 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" aria-label="First page">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" aria-label="Last page">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      }
    />
  );
}
