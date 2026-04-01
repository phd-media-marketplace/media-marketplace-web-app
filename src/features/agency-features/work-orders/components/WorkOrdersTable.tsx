import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, Download, Mail } from "lucide-react";
import type { WorkOrder } from "../types";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";
import { MediaTypeBadge } from "./MediaTypeBadge";
import { formatCurrency } from "@/utils/formatters";

interface WorkOrdersTableProps {
  workOrders: WorkOrder[];
}

/**
 * WorkOrdersTable Component
 * Displays work orders in a sortable table with action buttons
 */
export function WorkOrdersTable({ workOrders }: WorkOrdersTableProps) {
  const navigate = useNavigate();

  if (workOrders.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No work orders found matching your filters
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>WO Number</TableHead>
          <TableHead>Media Partner</TableHead>
          <TableHead>Campaign</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Media Type</TableHead>
          <TableHead>Period</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workOrders.map((workOrder) => (
          <TableRow
            key={workOrder.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/agency/work-orders/${workOrder.id}`)}
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                {workOrder.workOrderNumber}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{workOrder.mediaPartnerName}</div>
                <div className="text-xs text-gray-500">{workOrder.channelName}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-xs truncate">{workOrder.header.campaignName}</div>
            </TableCell>
            <TableCell>{workOrder.header.brandName}</TableCell>
            <TableCell>
              <MediaTypeBadge mediaType={workOrder.mediaType} />
            </TableCell>
            <TableCell>
              <div className="text-xs">
                <div>{new Date(workOrder.header.startDate).toLocaleDateString()}</div>
                <div className="text-gray-500">
                  to {new Date(workOrder.header.endDate).toLocaleDateString()}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(workOrder.totalAmount)}
            </TableCell>
            <TableCell>
              <WorkOrderStatusBadge status={workOrder.status} />
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/agency/work-orders/${workOrder.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
