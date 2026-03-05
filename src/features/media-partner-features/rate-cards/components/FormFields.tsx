import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import {DAYS} from "../constant";
import type { DayOfWeek } from "../types";

interface SectionHeaderProps {
  title: string;
  onAdd: () => void;
}

/**
 * Reusable section header with Add button
 */
export function SectionHeader({ title, onAdd }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h5 className="font-medium">{title}</h5>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onAdd}
        className="border-secondary hover:bg-secondary"
      >
        <Plus className="w-3 h-3 mr-1" /> Add
      </Button>
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

/**
 * Reusable empty state message
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="text-sm text-gray-500 text-center py-4">
      {message}
    </p>
  );
}

interface DeleteButtonProps {
  onDelete: () => void;
}

/**
 * Reusable delete button
 */
export function DeleteButton({ onDelete }: DeleteButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onDelete}
      className="text-red-600 hover:text-red-700 hover:bg-red-100"
    >
      <Trash2 className="w-4 h-4 text-red-600" />
    </Button>
  );
}

interface DaysSelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

/**
 * Reusable days of week selector with checkboxes
 */
export function DaysSelector({ selectedDays, onChange }: DaysSelectorProps) {
  const toggleDay = (day: DayOfWeek, isChecked: boolean) => {
    const newDays = isChecked
      ? [...selectedDays, day]
      : selectedDays.filter(d => d !== day);
    onChange(newDays);
  };

  return (
    <div className="col-span-full">
      <label className="block text-sm text-gray-900 mb-2">Associated Days</label>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <label key={day} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={(e) => toggleDay(day, e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-xs">{day.charAt(0) + day.slice(1, 3).toLowerCase()}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface TimeIntervalFieldsProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

/**
 * Reusable time interval fields (start time, end time)
 */
export function TimeIntervalFields({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  showDeleteButton = false,
  onDelete,
}: TimeIntervalFieldsProps) {
  return (
    <>
        <div>
            <label className="text-sm text-gray-900 mb-1 block">Start Time</label>
            <Input
                type="time"
                placeholder="Start time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
            />
        </div>
      
      {showDeleteButton && onDelete ? (
        <div className="flex gap-2">
            <div>

                <label className="text-sm text-gray-900 mb-1 block">End Time</label>
                <Input
                    type="time"
                    placeholder="End time"
                    value={endTime}
                    onChange={(e) => onEndTimeChange(e.target.value)}
                    className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
                />
            </div>
          <DeleteButton onDelete={onDelete} />
        </div>
      ) : (
        <div>
            <label className="text-sm text-gray-900 mb-1 block">End Time</label>
            <Input
                type="time"
                placeholder="End time"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
            />
        </div>
      )}
    </>
  );
}

interface FormRowProps {
  children: React.ReactNode;
  columns?: 3 | 4;
}

/**
 * Reusable form row container
 */
export function FormRow({ children, columns = 4 }: FormRowProps) {
  const gridCols = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-3 mb-3 p-3 bg-gray-50 rounded`}>
      {children}
    </div>
  );
}

interface RateInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

/**
 * Reusable rate input field
 */
export function RateInput({ value, onChange, placeholder = "Rate" }: RateInputProps) {
  return (
    <div>
        <label className="text-sm text-gray-900 mb-1 block">Rate <span className="text-xs text-gray-500">(GHC)</span></label>
        <Input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none"
        />
    </div>
  );
}

interface DurationSelectProps<T extends string> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  placeholder?: string;
}

/**
 * Reusable duration select dropdown
 */
export function DurationSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Duration"
}: DurationSelectProps<T>) {
  return (
    <div>
        <label className="text-sm text-gray-900 mb-1 block">Duration</label>
        <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border border-gray-300 focus:ring-1 focus:ring-secondary focus:outline-none">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border-none" >
            {options.map((option) => (
            <SelectItem key={option} value={option}>
                {option.replace(/_/g, ' ').toLowerCase()}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>
    </div>
  );
}
