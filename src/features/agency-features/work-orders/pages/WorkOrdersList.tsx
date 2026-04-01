import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { dummyWorkOrders } from "../dummy-data";
import type { WorkOrderStatus } from "../types";
import { WorkOrdersFilters } from "../components/WorkOrdersFilters";
import { WorkOrdersSummaryCards } from "../components/WorkOrdersSummaryCards";
import { WorkOrdersTable } from "../components/WorkOrdersTable";

/**
 * WorkOrdersList Component
 * Displays all work orders with filtering and status management
 * Agency view: see all work orders sent to media partners
 * Media Partner view: see work orders received from agencies
 */
export default function WorkOrdersList() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | "ALL">("ALL");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"ALL" | "FM" | "TV" | "OOH" | "DIGITAL">("ALL");

  // Filter work orders
  const filteredWorkOrders = useMemo(() => {
    return dummyWorkOrders.filter(workOrder => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workOrder.mediaPartnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workOrder.header.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workOrder.header.brandName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "ALL" || workOrder.status === statusFilter;

      // Media type filter
      const matchesMediaType = mediaTypeFilter === "ALL" || workOrder.mediaType === mediaTypeFilter;

      return matchesSearch && matchesStatus && matchesMediaType;
    });
  }, [searchQuery, statusFilter, mediaTypeFilter]);

  // Calculate summary stats
  const summaryStats = useMemo(() => ({
    totalCount: dummyWorkOrders.length,
    pendingCount: dummyWorkOrders.filter(wo => wo.status === 'PENDING').length,
    approvedCount: dummyWorkOrders.filter(wo => wo.status === 'APPROVED').length,
    rejectedCount: dummyWorkOrders.filter(wo => wo.status === 'REJECTED').length,
  }), []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Work Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track work orders sent to media partners
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <WorkOrdersFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={(value) => setStatusFilter(value)}
            mediaTypeFilter={mediaTypeFilter}
            onMediaTypeChange={(value) => setMediaTypeFilter(value)}
          />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <WorkOrdersSummaryCards
        totalCount={summaryStats.totalCount}
        pendingCount={summaryStats.pendingCount}
        approvedCount={summaryStats.approvedCount}
        rejectedCount={summaryStats.rejectedCount}
      />

      {/* Work Orders Table */}
      <Card>
        <CardContent className="p-0">
          <WorkOrdersTable workOrders={filteredWorkOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
