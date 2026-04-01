import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { WorkOrderStatus } from "../types";

interface WorkOrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: WorkOrderStatus | "ALL";
  onStatusChange: (value: WorkOrderStatus | "ALL") => void;
  mediaTypeFilter: "ALL" | "FM" | "TV" | "OOH" | "DIGITAL";
  onMediaTypeChange: (value: "ALL" | "FM" | "TV" | "OOH" | "DIGITAL") => void;
}

/**
 * WorkOrdersFilters Component
 * Filter controls for work orders list
 */
export function WorkOrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  mediaTypeFilter,
  onMediaTypeChange,
}: WorkOrdersFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Search */}
      <div className="md:col-span-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by WO number, media partner, campaign..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
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
    </div>
  );
}
