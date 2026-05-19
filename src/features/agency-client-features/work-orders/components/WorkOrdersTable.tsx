import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Mail, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import type { WorkOrder } from "@/types/work-order";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";
import { MediaTypeBadge } from "./MediaTypeBadge";
import { formatCurrency } from "@/utils/formatters";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { DataTable } from "@/components/universal/DataTable";
import type { UniversalDataTableColumn } from "@/components/universal/DataTable";
import { useMemo, useCallback, useState } from "react";

interface WorkOrdersTableProps {
  workOrders: WorkOrder[];
}

/**
 * WorkOrdersTable Component
 * Displays work orders in a sortable table with action buttons
 */
export function WorkOrdersTable({ workOrders }: WorkOrdersTableProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const onView = useCallback((id: string) => {
    navigate(`/${user?.tenantType.toLowerCase()}/work-orders/${id}`);
  }, [navigate, user?.tenantType]);

  const onSend = useCallback((id: string) => {
    console.log("Send work order", id);
  }, []);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      if (workOrders.length === 0) return new Set();
      if (prev.size === workOrders.length) return new Set();
      return new Set(workOrders.map(w => w.id));
    });
  }, [workOrders]);

  const onDownloadSelected = useCallback(() => {
    console.log('Download selected', Array.from(selectedIds));
  }, [selectedIds]);

  const onSendSelected = useCallback(() => {
    console.log('Send selected', Array.from(selectedIds));
  }, [selectedIds]);

  const onFirstPage = useCallback(() => {
    console.log('First page clicked');
  }, []);

  const onPrevPage = useCallback(() => {
    console.log('Previous page clicked');
  }, []);

  const onNextPage = useCallback(() => {
    console.log('Next page clicked');
  }, []);

  const onLastPage = useCallback(() => {
    console.log('Last page clicked');
  }, []);

  const columns = useMemo<UniversalDataTableColumn<WorkOrder>[]>(() => {
    return [
      {
        id: 'select',
        header: (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            aria-label="Select all work orders"
            checked={workOrders.length > 0 && selectedIds.size === workOrders.length}
            onChange={toggleSelectAll}
          />
        ),
        cell: (wo) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            aria-label={`Select ${wo.workOrderNumber}`}
            checked={selectedIds.has(wo.id)}
            onChange={(e) => {
              e.stopPropagation();
              toggleRowSelection(wo.id);
            }}
          />
        ),
        widthPx: 30,
        minWidthPx: 30,
        sticky: true,
        headerClassName: 'px-0 pl-3 pr-2',
        cellClassName: 'px-0 pl-3 pr-2',
      },
      {
        id: 'workOrderNumber',
        header: 'WO #',
        cell: (wo) => (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{wo.workOrderNumber}</span>
          </div>
        ),
        widthPx: 140,
        cellClassName: 'font-medium text-slate-900',
        sticky: true,
      },
      {
        id: 'mediaPartner',
        header: 'Media Partner',
        cell: (wo) => (
          <div>
            <div className="font-medium">{wo.mediaPartnerName}</div>
            <div className="text-xs text-gray-500">{wo.channelName}</div>
          </div>
        ),
        widthPx: 220,
      },
      {
        id: 'campaign',
        header: 'Campaign',
        cell: (wo) => wo.header.campaignName,
        widthPx: 200,
      },
      {
        id: 'brand',
        header: 'Brand',
        cell: (wo) => wo.header.brandName,
        widthPx: 160,
      },
      {
        id: 'mediaType',
        header: 'Media Type',
        cell: (wo) => <MediaTypeBadge mediaType={wo.mediaType as 'FM'|'RADIO'|'TV'|'OOH'|'DIGITAL'} />,
        widthPx: 100,
      },
      {
        id: 'amount',
        header: 'Amount',
        cell: (wo) => formatCurrency(wo.totalAmount),
        widthPx: 120,
        cellClassName: 'font-semibold text-slate-900',
        align: 'center',
      },
      {
        id: 'status',
        header: 'Status',
        cell: (wo) => <WorkOrderStatusBadge status={wo.status} />,
        widthPx: 100,
      },
      {
        id: 'duration',
        header: 'Period',
        cell: (wo) => `${new Date(wo.header.startDate).toLocaleDateString()} - ${new Date(wo.header.endDate).toLocaleDateString()}`,
        widthPx: 160,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (wo) => (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onView(wo.id)} aria-label={`View ${wo.workOrderNumber}`}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => console.log('Download', wo.id)} aria-label={`Download ${wo.workOrderNumber}`}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onSend(wo.id)} aria-label={`Send ${wo.workOrderNumber}`}>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        ),
        widthPx: 120,
        align: 'center',
        headerAlign: 'center',
      },
    ];
  }, [onSend, onView, selectedIds, toggleRowSelection, toggleSelectAll, workOrders.length]);

  return (
    <DataTable
      rows={workOrders}
      columns={columns}
      rowKey={(wo) => wo.id}
      containerClassName="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs"
      minTableWidthClassName="min-w-full"
      emptyState={<div className="text-center text-gray-500 py-8">No work orders found matching your filters</div>}
      footerSlot={
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownloadSelected}
              disabled={selectedIds.size === 0}
              className="hover:bg-secondary/20 text-primary"
            >
              Download Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSendSelected}
              disabled={selectedIds.size === 0}
              className="hover:bg-primary/20 text-primary"
            >
              Send Selected
            </Button>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" aria-label="First page" onClick={onFirstPage}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" aria-label="Previous page" onClick={onPrevPage}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" aria-label="Next page" onClick={onNextPage}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600" aria-label="Last page" onClick={onLastPage}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      }
    />
  );
}
