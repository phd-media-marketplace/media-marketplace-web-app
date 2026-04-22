import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Funnel, X, Eye, EyeOff } from "lucide-react";
import type { WorkOrderStatus } from "@/features/agency-features/work-orders/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/universal/DateRangePicker";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const handleClearAll = () => {
    onSearchChange("");
    onStatusChange("ALL");
    onMediaTypeChange("ALL");
    onStartDateChange("");
    onEndDateChange("");
    onBrandSearchChange("");
  };


  return (
    <Card className="bg-white shadow-sm lg:bg-none lg:shadow-none p-0 lg:mb-0">
      <CardHeader className="flex lg:hidden flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Funnel className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Filter</h2>
        </div>
        <div className=" flex gap-1 ml-auto text-sm text-gray-500">
          {/* Optional: Add a "Clear All" button here */}
          <Button
            className="text-primary border bg-transparent hover:bg-primary hover:text-white"
            onClick={handleClearAll}
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
          <Button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="text-white border bg-primary hover:bg-transparent hover:border-primary hover:text-primary"
          >
            {isFilterPanelOpen ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
            {isFilterPanelOpen ? "Hide" : "Show"}
          </Button>

        </div>
      </CardHeader>
      {isFilterPanelOpen && (
        <CardContent className="space-y-4">
          {/* First Row: Search and Brand/Campaign Search */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4">
            {/* General Search */}
            <div>
              <label className="lg:hidden text-sm font-medium text-gray-700 mb-1 block">
                Search Work Orders
              </label>
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by WO number, client, agency..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="filter-input-field"
                />
              </div>
            </div>

            {/* Brand/Campaign Search */}
            <div>
              <label className="lg:hidden text-sm font-medium text-gray-700 mb-1 block">
                Brand or Campaign
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by brand or campaign name..."
                  value={brandSearch}
                  onChange={(e) => onBrandSearchChange(e.target.value)}
                  className="filter-input-field"
                />
              </div>
            </div>
          {/* Second Row: Status, Media Type, and Date Range */}
            <div>
              <label className="lg:hidden text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full input-field">
                  <SelectValue placeholder="All Statuses"/>
                </SelectTrigger>
                <SelectContent className="bg-white border-0">
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="REVISED">Revised</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Media Type Filter */}
            <div>
              <label className="lg:hidden text-sm font-medium text-gray-700 mb-1 block">
                Media Type
              </label>
              <Select value={mediaTypeFilter} onValueChange={onMediaTypeChange}>
                <SelectTrigger className="w-full input-field">
                  <SelectValue placeholder="All Media Types" />
                </SelectTrigger>
                <SelectContent className="select-trigger-bg">
                  <SelectItem value="ALL">All Media Types</SelectItem>
                  <SelectItem value="FM">Radio</SelectItem>
                  <SelectItem value="TV">TV</SelectItem>
                  <SelectItem value="OOH">Out-of-Home (OOH)</SelectItem>
                  <SelectItem value="DIGITAL">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="lg:hidden text-sm font-medium text-gray-700 mb-1 block">
                Date Range
              </label>
              <DateRangePicker
                defaultStart={startDate}
                defaultEnd={endDate}
                onDateRangeChange={({ startDate: newStartDate, endDate: newEndDate }) => {
                  onStartDateChange(newStartDate);
                  onEndDateChange(newEndDate);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
