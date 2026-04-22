import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { InvoiceStatus } from "@/types/invoice";

export interface InvoiceFilterOption {
  label: string;
  value: "ALL" | InvoiceStatus;
}

export interface InvoiceFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: "ALL" | InvoiceStatus;
  onStatusChange: (status: "ALL" | InvoiceStatus) => void;
  statusOptions: InvoiceFilterOption[];
  resultsCount?: number;
}

export default function InvoiceFilters({ 
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  resultsCount,
}: InvoiceFiltersProps) {
  const handleClearAll = () => {
    onSearchChange("");
    onStatusChange("ALL");
  };

  return (
    <Card className="border border-violet-100 lg:border-0">
      <CardContent className="space-y-4 p-6 lg:py-0">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by invoice # or client"
              className="filter-input-field"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as "ALL" | InvoiceStatus)}>
            <SelectTrigger className="w-full input-field">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-none">
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={handleClearAll}
            className=" custom-secondary-outline-btn"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>

          <div className="flex items-center text-sm text-slate-500">
            {typeof resultsCount === "number" ? `${resultsCount} invoice(s)` : ""}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
