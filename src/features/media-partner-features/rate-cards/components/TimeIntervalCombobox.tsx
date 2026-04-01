import { useState } from "react";
import type { TimeInterval, TVTimeInterval } from "../types";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxChips, ComboboxChip, ComboboxChipsInput, useComboboxAnchor } from "@/components/ui/combobox";

/**
 * TimeIntervalCombobox Component
 * Multi-select combobox for selecting time intervals
 */
interface TimeIntervalComboboxProps {
  selectedIntervals:  TimeInterval[] |TVTimeInterval[];
  onIntervalsChange: (intervals: string[]) => void;
  timeIntervalOptions: readonly { readonly value: string; readonly label: string }[];
}

export default function TimeIntervalCombobox({ selectedIntervals, onIntervalsChange, timeIntervalOptions }: TimeIntervalComboboxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const anchorRef = useComboboxAnchor();

  const filteredIntervals = timeIntervalOptions.filter(interval =>
    interval.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Combobox
      multiple
      value={selectedIntervals}
      onValueChange={onIntervalsChange}
    >
      <ComboboxChips ref={anchorRef} className="w-full input-field">
        {selectedIntervals.map((interval) => {
          const option = timeIntervalOptions.find(opt => opt.value === interval);
          return (
            <ComboboxChip key={interval}>
              {option?.label || interval}
            </ComboboxChip>
          );
        })}
        <ComboboxChipsInput
          placeholder={selectedIntervals.length === 0 ? "Select time intervals..." : ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          
        />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef} className="bg-white">
        <ComboboxList>
          <ComboboxEmpty>No time intervals found.</ComboboxEmpty>
          {filteredIntervals.map((interval) => (
            <ComboboxItem
              key={interval.value}
              value={interval.value}
              className="text-black"
            >
              {interval.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}