import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";
import type { WorkOrderStatus } from "@/features/agency-features/work-orders/types";

interface MediaPartnerWorkOrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: WorkOrderStatus | "ALL";
  onStatusChange: (value: WorkOrderStatus | "ALL") => void;
  mediaTypeFilter: "ALL" | "FM" | "TV" | "OOH" | "DIGITAL";
  onMediaTypeChange: (value: "ALL" | "FM" | "TV" | "OOH" | "DIGITAL") => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  brandSearch: string;
  onBrandSearchChange: (value: string) => void;
}

/**
 * MediaPartnerWorkOrdersFilters Component
 * Comprehensive filter controls for media partner work orders
 * Always visible (non-collapsible) at the top
 */
export function MediaPartnerWorkOrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  mediaTypeFilter,
  onMediaTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  brandSearch,
  onBrandSearchChange,
}: MediaPartnerWorkOrdersFiltersProps) {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      {/* First Row: Search and Brand/Campaign Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* General Search */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Search Work Orders
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by WO number, client, agency..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Brand/Campaign Search */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Brand or Campaign
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by brand or campaign name..."
              value={brandSearch}
              onChange={(e) => onBrandSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Second Row: Status, Media Type, and Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Status
          </label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="REVISED">Revised</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Media Type
          </label>
          <Select value={mediaTypeFilter} onValueChange={onMediaTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Media Types" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">All Media Types</SelectItem>
              <SelectItem value="FM">FM Radio</SelectItem>
              <SelectItem value="TV">TV</SelectItem>
              <SelectItem value="OOH">Out-of-Home</SelectItem>
              <SelectItem value="DIGITAL">Digital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
