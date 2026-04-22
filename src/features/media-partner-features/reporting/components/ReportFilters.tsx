
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelectDropdown, { type MultiSelectOption } from "@/components/universal/MultiSelectDropdown";
import { FilterX } from "lucide-react";

import type { ReportQuarter, ReportFiltersProps  } from "../types";

// export type ReportQuarter = "ALL" | "Q1" | "Q2" | "Q3" | "Q4";

// export interface ReportFiltersState {
//   quarter: ReportQuarter;
//   startDate: string;
//   endDate: string;
//   clients: string[];
// }

// interface ReportFiltersProps {
//   value: ReportFiltersState;
//   clientOptions: string[];
//   onQuarterChange: (quarter: ReportQuarter) => void;
//   onStartDateChange: (startDate: string) => void;
//   onEndDateChange: (endDate: string) => void;
//   onClientsChange: (clients: string[]) => void;
//   onReset: () => void;
// }

export default function ReportFilters({
  value,
  clientOptions,
  onQuarterChange,
  onStartDateChange,
  onEndDateChange,
  onClientsChange,
  onReset,
}: ReportFiltersProps) {
  const clientDropdownOptions: MultiSelectOption<string>[] = clientOptions.map((client) => ({
    value: client,
    label: client,
  }));

  return (
    <div className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">Report Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="border-slate-300 text-slate-700"
        >
          <FilterX className="size-4" />
          Reset Filters
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Quarter</label>
          <Select value={value.quarter} onValueChange={(quarter) => onQuarterChange(quarter as ReportQuarter)}>
            <SelectTrigger className="w-full bg-white input-field">
              <SelectValue placeholder="Select quarter" />
            </SelectTrigger>
            <SelectContent className="bg-white border-none">
              <SelectItem value="ALL">All Quarters</SelectItem>
              <SelectItem value="Q1">Q1</SelectItem>
              <SelectItem value="Q2">Q2</SelectItem>
              <SelectItem value="Q3">Q3</SelectItem>
              <SelectItem value="Q4">Q4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={value.startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              max={value.endDate || undefined}
              className="bg-white"
            />
            <Input
              type="date"
              value={value.endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              min={value.startDate || undefined}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Clients</label>
            <MultiSelectDropdown
              options={clientDropdownOptions}
              selected={value.clients}
              onChange={onClientsChange}
              includeSelectAll
              selectAllLabel="All Clients"
            />
        </div>
      </div>
    </div>
  );
}
