import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircleX, Clock, Download, FileText, Zap } from "lucide-react";
import { dummyWorkOrders } from "../dummy-data";
import type { WorkOrderStatus } from "@/types/work-order";
import { WorkOrdersFilters } from "../components/WorkOrdersFilters";
import { WorkOrdersTable } from "../components/WorkOrdersTable";
import Header from "@/components/universal/Header";
import { toast } from "sonner";
import type { SummaryCardsProps } from "@/components/universal/SummaryCards";
import SummaryCards from "@/components/universal/SummaryCards";

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

  const handleExport = () => {
    // Implement export functionality (e.g., generate CSV or Excel file)
    console.log("Exporting work orders...");
    toast.success("Work orders exported successfully!");
  }

  const workOrdersSummaryCardsData = useMemo<SummaryCardsProps[]>(() => {
    return [
      { 
        title: "Total Work Orders", 
        value: summaryStats.totalCount,
        icon: FileText , // You can replace this with a more relevant icon
        footerText: ` work orders in the system`,
        bgColor: "from-blue-500 to-blue-700", 
      },
      { title: "Approved", 
        value: summaryStats.approvedCount, 
        icon: Zap, 
        footerText: `${summaryStats.approvedCount ? Math.round(summaryStats.approvedCount / summaryStats.totalCount * 100) : 0}% approved work orders`, 
        bgColor: "from-green-500 to-green-700" 
      },
      { 
        title: "Pending Approval", 
        value: summaryStats.pendingCount,
        icon: Clock,
        footerText: `${summaryStats.pendingCount ? Math.round(summaryStats.pendingCount / summaryStats.totalCount * 100) : 0}% work orders pending approval`,
        bgColor: "from-yellow-500 to-yellow-700",
      },
      { 
        title: "Rejected", 
        value: summaryStats.rejectedCount, 
        icon: CircleX, 
        footerText: `${summaryStats.rejectedCount ? Math.round(summaryStats.rejectedCount / summaryStats.totalCount * 100) : 0}% rejected work orders`, 
        bgColor: "from-rose-500 to-red-700" },
    ];
  }, [summaryStats]);


  return (
    <div className="space-y-4">
      {/* Header */}
      <Header 
        title="Work Orders"
        description="Manage and track work orders sent to media partners"
        backbtnVisible={false}
        ctabtnText="Export"
        ctaIcon={Download}
          ctaFunc={handleExport}
      />
    

      {/* Filters */}
      <Card>
        <CardContent className="">
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

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {workOrdersSummaryCardsData.map((card, index) => (
          <SummaryCards key={index} {...card} />
        ))}
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardContent className="p-0">
          <WorkOrdersTable workOrders={filteredWorkOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
