import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { MediaPartnerWorkOrdersFilters, MediaPartnerWorkOrdersTable } from "../components";
import { getMediaPartnerWorkOrders } from "../api";
import { useMe } from "@/features/auth/hooks/useMe";
import type { WorkOrderStatus } from "@/types/work-order";
import SummaryCards from "@/components/universal/SummaryCards";
import type { SummaryCardsProps } from "@/components/universal/SummaryCards";
import Header from "@/components/universal/Header";
import Loader from "@/components/universal/Loader";
import LoadingError from "@/components/universal/LoadingError";

/**
 * MediaPartnerWorkOrdersList Component
 * List view for work orders received by media partners
 */
export default function MediaPartnerWorkOrdersList() {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const mediaPartnerId = user?.mediaPartner?.id;
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | "ALL">("ALL");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"ALL" | "FM" | "TV" | "OOH" | "DIGITAL">("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  // Build query params from filter state
  const queryParams = {
    mediaPartnerId,
    search: searchQuery || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    mediaType: mediaTypeFilter !== "ALL" ? mediaTypeFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    brandSearch: brandSearch || undefined,
  };

  // Fetch work orders based on filters
  const workOrdersQuery = useQuery({
    queryKey: ["media-partner-work-orders", queryParams],
    queryFn: () => getMediaPartnerWorkOrders(mediaPartnerId || ""),
    enabled: !!mediaPartnerId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const statusTabs: Array<{ label: string; value: WorkOrderStatus | "ALL"; countKey: "all" | "approved" | "revised" | "pending" | "rejected"| "paused" }> = [
    { label: "All Orders", value: "ALL", countKey: "all" },
    { label: "Completed", value: "APPROVED", countKey: "approved" },
    { label: "In Progress", value: "REVISED", countKey: "revised" },
    { label: "Pending Approval", value: "PENDING", countKey: "pending" },
    { label: "Rejected", value: "REJECTED", countKey: "rejected" },
    { label: "Paused", value: "PAUSED", countKey: "paused" },

  ];

  const formatStatusLabel = (status: WorkOrderStatus) => {
    const labels: Record<WorkOrderStatus, string> = {
      PENDING: "Pending",
      APPROVED: "Completed",
      REJECTED: "Rejected",
      REVISED: "In Progress",
      PAUSED: "Paused",
    };

    return labels[status];
  };

  const getStatusPillClasses = (status: WorkOrderStatus) => {
    const styles: Record<WorkOrderStatus, string> = {
      APPROVED: "bg-emerald-50 text-emerald-700",
      PENDING: "bg-amber-50 text-amber-700",
      REVISED: "bg-sky-50 text-sky-700",
      REJECTED: "bg-rose-50 text-rose-700",
      PAUSED: "bg-gray-50 text-gray-700",
    };

    return styles[status];
  };

  // Filter work orders (client-side filtering on fetched data)
  const { filteredWorkOrders, tabCounts } = useMemo(() => {
    const workOrders = Array.isArray(workOrdersQuery.data) ? workOrdersQuery.data : [];
    const baseFiltered = workOrders.filter((workOrder) => {

      // Media type filter
      if (mediaTypeFilter !== "ALL" && workOrder.mediaType !== mediaTypeFilter) {
        return false;
      }

      // Search query (WO number, client, channel)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesWO = workOrder.workOrderNumber.toLowerCase().includes(query);
        const matchesChannel = workOrder.channelName.toLowerCase().includes(query);
        const matchesClient = workOrder.header.clientName.toLowerCase().includes(query);
        
        if (!matchesWO && !matchesChannel && !matchesClient) {
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

    const statusFiltered =
      statusFilter === "ALL"
        ? baseFiltered
        : baseFiltered.filter((workOrder) => workOrder.status === statusFilter);

    return {
      filteredWorkOrders: statusFiltered,
      tabCounts: {
        all: baseFiltered.length,
        approved: baseFiltered.filter((workOrder) => workOrder.status === "APPROVED").length,
        revised: baseFiltered.filter((workOrder) => workOrder.status === "REVISED").length,
        pending: baseFiltered.filter((workOrder) => workOrder.status === "PENDING").length,
        rejected: baseFiltered.filter((workOrder) => workOrder.status === "REJECTED").length,
      },
    };
  }, [workOrdersQuery.data, searchQuery, statusFilter, mediaTypeFilter, startDate, endDate, brandSearch]);

  // Summary statistics (based on the currently filtered list)
  const summaryStats = useMemo(() => {
    const pending = filteredWorkOrders.filter((wo) => wo.status === "PENDING").length;
    const approved = filteredWorkOrders.filter((wo) => wo.status === "APPROVED").length;
    const rejected = filteredWorkOrders.filter((wo) => wo.status === "REJECTED").length;
    const paused = filteredWorkOrders.filter((wo) => wo.status === "PAUSED").length;
    const total = filteredWorkOrders.length;

    return { totalCount: total, pendingCount: pending, approvedCount: approved, rejectedCount: rejected, pausedCount: paused };
  }, [filteredWorkOrders]);

  const workOrdersSummaryCardsData = useMemo<SummaryCardsProps[]>(() => {
    return [
      {
        title: "Total Work Orders",
        value: summaryStats.totalCount,
        icon: FileText,
        footerText: "Matching current filters",
        bgColor: "from-indigo-500 to-blue-700",
      },
      {
        title: "Pending",
        value: summaryStats.pendingCount,
        icon: Clock3,
        footerText: `${summaryStats.totalCount ? Math.round((summaryStats.pendingCount / summaryStats.totalCount) * 100) : 0}% of filtered`,
        bgColor: "from-amber-500 to-orange-700",
      },
      {
        title: "Approved",
        value: summaryStats.approvedCount,
        icon: CheckCircle2,
        footerText: `${summaryStats.totalCount ? Math.round((summaryStats.approvedCount / summaryStats.totalCount) * 100) : 0}% of filtered`,
        bgColor: "from-emerald-500 to-green-700",
      },
      {
        title: "Rejected/Paused",
        value: summaryStats.rejectedCount + summaryStats.pausedCount,
        icon: XCircle,
        footerText: `${summaryStats.totalCount ? Math.round(((summaryStats.rejectedCount + summaryStats.pausedCount) / summaryStats.totalCount) * 100) : 0}% of filtered`,
        bgColor: "from-rose-500 to-red-700",
      },
    ];
  }, [summaryStats]);

  const handleViewWorkOrder = (id: string) => {          
    navigate(`/media-partner/work-orders/${id}`);
  };

  const handleSendWorkOrder = (id: string) => {
    console.log("Send work order", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        title="Work Orders"
        description="Manage work orders received from agencies and clients"
        backbtnVisible={false}
      />

      {/* Filters */}
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

      {/* Loading State */}
      {workOrdersQuery.isLoading ? (
        <Loader title="Loading Work Orders..." message="Fetching your work orders." />
      ) : workOrdersQuery.isError ? (
        <LoadingError
          title="Unable to load work orders"
          message={workOrdersQuery.error instanceof Error ? workOrdersQuery.error.message : "An error occurred"}
          onRetry={() => workOrdersQuery.refetch()}
          OnReturn={() => navigate("/media-partner/work-orders")}
          returnBtnText="Retry"
          className="w-full"
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {workOrdersSummaryCardsData.map((card, index) => (
              <SummaryCards key={index} {...card} />
            ))}
          </div>

          {/* Work Orders Table */}
          <MediaPartnerWorkOrdersTable
            workOrders={filteredWorkOrders}
            onViewWorkOrder={handleViewWorkOrder}
            onSendWorkOrder={handleSendWorkOrder}
            formatStatusLabel={formatStatusLabel}
            getStatusPillClasses={getStatusPillClasses}
            headerSlot={
              <div className="border-b border-slate-200 px-3 sm:px-6">
                <div className="flex items-center gap-4 overflow-x-auto">
                  {statusTabs.map((tab) => {
                    const isActive = statusFilter === tab.value;
                    return (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setStatusFilter(tab.value)}
                        className={`relative flex items-center gap-2 border-b-2 px-2 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                          isActive
                            ? "border-primary text-slate-900"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.value === "PENDING" && tabCounts.pending > 0 ? (
                          <span className="inline-flex min-w-5 items-center justify-center rounded-md bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700">
                            {tabCounts.pending}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          />
        </>
      )}
    </div>
  );
}
