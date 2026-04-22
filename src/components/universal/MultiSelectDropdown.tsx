import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
}

interface MultiSelectDropdownProps<T extends string> {
  label?: string;
  options: MultiSelectOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
  includeSelectAll?: boolean;
  selectAllLabel?: string;
}

function toggleSelection<T extends string>(current: T[], value: T): T[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export default function MultiSelectDropdown<T extends string>({
  label,
  options,
  selected,
  onChange,
  includeSelectAll = false,
  selectAllLabel = "All",
}: MultiSelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    selected.length === 0
      ? "None selected"
      : selected.length === options.length
      ? "All selected"
      : `${selected.length} selected`;

  const allSelected = options.length > 0 && selected.length === options.length;

  const handleSelectAllToggle = () => {
    if (allSelected) {
      onChange([]);
      return;
    }

    onChange(options.map((option) => option.value));
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <p className="mb-1 text-xs text-gray-500">{label}</p>}
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-200 bg-white p-2 shadow-md">
          {includeSelectAll && (
            <label className="flex items-center gap-2 rounded px-1 py-1 text-sm font-medium text-gray-800 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAllToggle}
              />
              {selectAllLabel}
            </label>
          )}
          {options.map((option) => (
            <label key={option.value} className="flex items-center gap-2 rounded px-1 py-1 text-sm text-gray-700 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => onChange(toggleSelection(selected, option.value))}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}