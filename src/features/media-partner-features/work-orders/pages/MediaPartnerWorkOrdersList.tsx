import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, FileText } from "lucide-react";
import { MediaPartnerWorkOrdersFilters } from "../components";
import { WorkOrderStatusBadge, MediaTypeBadge, WorkOrdersSummaryCards } from "@/features/agency-features/work-orders/components";
import { dummyWorkOrders } from "@/features/agency-features/work-orders/dummy-data";
import type { WorkOrderStatus } from "@/features/agency-features/work-orders/types";

/**
 * MediaPartnerWorkOrdersList Component
 * List view for work orders received by media partners
 */
export default function MediaPartnerWorkOrdersList() {
  const navigate = useNavigate();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | "ALL">("ALL");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"ALL" | "FM" | "TV" | "OOH" | "DIGITAL">("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  // Summary statistics
  const summaryStats = useMemo(() => {
    const pending = dummyWorkOrders.filter(wo => wo.status === 'PENDING').length;
    const approved = dummyWorkOrders.filter(wo => wo.status === 'APPROVED').length;
    const rejected = dummyWorkOrders.filter(wo => wo.status === 'REJECTED').length;
    const total = dummyWorkOrders.length;

    return { totalCount: total, pendingCount: pending, approvedCount: approved, rejectedCount: rejected };
  }, []);

  // Filter work orders
  const filteredWorkOrders = useMemo(() => {
    return dummyWorkOrders.filter((workOrder) => {
      // Status filter
      if (statusFilter !== "ALL" && workOrder.status !== statusFilter) {
        return false;
      }

      // Media type filter
      if (mediaTypeFilter !== "ALL" && workOrder.mediaType !== mediaTypeFilter) {
        return false;
      }

      // Search query (WO number, client, agency, channel)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesWO = workOrder.workOrderNumber.toLowerCase().includes(query);
        const matchesChannel = workOrder.channelName.toLowerCase().includes(query);
        const matchesClient = workOrder.header.clientName?.toLowerCase().includes(query);
        const matchesAgency = workOrder.header.agencyName?.toLowerCase().includes(query);
        
        if (!matchesWO && !matchesChannel && !matchesClient && !matchesAgency) {
          return false;
        }
      }

      // Brand search
      if (brandSearch) {
        const query = brandSearch.toLowerCase();
        const matchesBrand = workOrder.header.brandName.toLowerCase().includes(query);
        const matchesCampaign = workOrder.header.campaignName.toLowerCase().includes(query);
        
        if (!matchesBrand && !matchesCampaign) {
          return false;
        }
      }

      // Date range filter
      if (startDate) {
        const woStartDate = new Date(workOrder.header.startDate);
        const filterStartDate = new Date(startDate);
        if (woStartDate < filterStartDate) {
          return false;
        }
      }

      if (endDate) {
        const woEndDate = new Date(workOrder.header.endDate);
        const filterEndDate = new Date(endDate);
        if (woEndDate > filterEndDate) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, statusFilter, mediaTypeFilter, startDate, endDate, brandSearch]);

  const handleViewWorkOrder = (id: string) => {
    navigate(`/media-partner/work-orders/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Work Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage work orders received from agencies and clients
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <WorkOrdersSummaryCards
        totalCount={summaryStats.totalCount}
        pendingCount={summaryStats.pendingCount}
        approvedCount={summaryStats.approvedCount}
        rejectedCount={summaryStats.rejectedCount}
      />

      {/* Filters - Always visible */}
      <MediaPartnerWorkOrdersFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        mediaTypeFilter={mediaTypeFilter}
        onMediaTypeChange={setMediaTypeFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        brandSearch={brandSearch}
        onBrandSearchChange={setBrandSearch}
      />

      {/* Work Orders Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>WO Number</TableHead>
                <TableHead>Client/Agency</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Media Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No work orders found matching your filters</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkOrders.map((workOrder) => (
                  <TableRow key={workOrder.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {workOrder.workOrderNumber}
                    </TableCell>
                    <TableCell>
                      {workOrder.header.clientType === 'AGENCY' 
                        ? workOrder.header.agencyName 
                        : workOrder.header.clientName}
                    </TableCell>
                    <TableCell>{workOrder.header.brandName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {workOrder.header.campaignName}
                    </TableCell>
                    <TableCell>
                      <MediaTypeBadge mediaType={workOrder.mediaType} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(workOrder.header.startDate).toLocaleDateString()} - {new Date(workOrder.header.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold">
                      GHS {workOrder.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <WorkOrderStatusBadge status={workOrder.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewWorkOrder(workOrder.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* Download handler */}}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
