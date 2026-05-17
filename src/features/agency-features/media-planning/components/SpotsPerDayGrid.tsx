import { Controller } from "react-hook-form";
import type { Control, UseFormSetValue, UseFormWatch, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { DayOfWeek } from "../types";

interface SpotsPerDayGridProps {
  channelIndex: number;
  segmentIndex: number;
  selectedDays: DayOfWeek[];
  totalSpots: number;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  startDate?: string;
  endDate?: string;
}

/**
 * Calculate how many times each day of the week occurs in the date range
 */
const calculateDayOccurrences = (startDate: string, endDate: string): Partial<Record<DayOfWeek, number>> => {
  const occurrences: Partial<Record<DayOfWeek, number>> = {};
  const dayMap: Record<number, DayOfWeek> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
  };

  if (!startDate || !endDate) return occurrences;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Initialize all days to 0
  Object.values(dayMap).forEach(day => {
    occurrences[day] = 0;
  });

  // Count occurrences
  for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    const dayOfWeek = dayMap[current.getDay()];
    if (dayOfWeek && occurrences[dayOfWeek] !== undefined) {
      occurrences[dayOfWeek]!++;
    }
  }

  return occurrences;
};

export default function SpotsPerDayGrid({
  channelIndex,
  segmentIndex,
  selectedDays,
  totalSpots,
  control,
  setValue,
  watch,
  startDate,
  endDate,
}: SpotsPerDayGridProps) {
  const spotsPerDay = watch(`channels.${channelIndex}.segments.${segmentIndex}.spotsPerDay`) || {};

  // Calculate day occurrences in the campaign period
  const dayOccurrences = calculateDayOccurrences(startDate || '', endDate || '');

  // Calculate total distributed: sum of (spotsPerDay[day] × occurrences[day])
  const totalCalculated = selectedDays.reduce((sum, day) => {
    const spotsValue = spotsPerDay[day] || 0;
    const occurrences = dayOccurrences[day] || 0;
    return sum + (spotsValue * occurrences);
  }, 0);

  // Compute validation status
  const isValid = totalCalculated === totalSpots;
  const exceeds = totalCalculated > totalSpots;
  const validationError =
    selectedDays.length > 0 && totalSpots > 0 && !isValid
      ? {
          message: exceeds
            ? `Calculated total (${totalCalculated}) exceeds Total Spots (${totalSpots}) by ${totalCalculated - totalSpots}`
            : `Calculated total (${totalCalculated}) is less than Total Spots (${totalSpots}) by ${totalSpots - totalCalculated}`,
          exceeds,
        }
      : null;

  const handleSpotChange = (day: DayOfWeek, value: number) => {
    const newSpotsPerDay = { ...spotsPerDay, [day]: value || 0 };
    setValue(`channels.${channelIndex}.segments.${segmentIndex}.spotsPerDay`, newSpotsPerDay);
  };

  if (selectedDays.length === 0) {
    return <p className="text-sm text-gray-500 italic">Select days above to add spots distribution</p>;
  }

  if (!startDate || !endDate) {
    return <p className="text-sm text-gray-500 italic">Set campaign start and end dates to enable spots distribution</p>;
  }

  return (
    <div className="space-y-4">
      {/* Day-by-day input grid with occurrence counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {selectedDays.map((day) => {
          const occurrences = dayOccurrences[day] || 0;
          // const spotsValue = spotsPerDay[day] || 0;
          // const calculated = spotsValue * occurrences;

          return (
            <div key={day} className="space-y-1 p-3 rounded border border-gray-200 bg-gray-50">
              <label className="text-xs font-semibold text-gray-700">
                {day.substring(0, 3)} <span className="text-gray-500">({occurrences}x)</span>
              </label>
              <Controller
                name={`channels.${channelIndex}.segments.${segmentIndex}.spotsPerDay.${day}`}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min="0"
                    value={field.value || ""}
                    onChange={(e) => handleSpotChange(day, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-sm input-field font-medium"
                  />
                )}
              />
              {/* <p className="text-xs text-gray-600 mt-1">
                {spotsValue} × {occurrences} = <span className="font-semibold text-gray-900">{calculated}</span>
              </p> */}
            </div>
          );
        })}
      </div>

      {/* Calculation summary
      <div className={`p-3 rounded-md border ${isValid ? 'bg-green-50 border-green-300' : exceeds ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-700">Campaign Distribution Calculation</p>
            <p className={`text-sm font-semibold mt-1 ${isValid ? 'text-green-700' : exceeds ? 'text-red-700' : 'text-amber-700'}`}>
              {selectedDays.map(day => {
                const spotsValue = spotsPerDay[day] || 0;
                const occurrences = dayOccurrences[day] || 0;
                return `${day.substring(0, 3)}(${spotsValue}×${occurrences})`;
              }).join(' + ')} = <span className="font-bold">{totalCalculated}</span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${isValid ? 'text-green-700' : exceeds ? 'text-red-700' : 'text-amber-700'}`}>
              {totalCalculated} / {totalSpots}
            </p>
          </div>
        </div>
      </div> */}

      {/* Validation message */}
      {validationError && (
        <div className={`p-3 rounded-md border ${exceeds ? 'bg-red-100 border-red-300' : 'bg-amber-100 border-amber-400'}`}>
          <p className={`text-sm font-medium ${exceeds ? 'text-red-800/70' : 'text-amber-800/70'}`}>
            {exceeds ? '⚠️ Exceeds total' : '⚠️ Below total'}: {validationError.message}
          </p>
        </div>
      )}

      {/* Success message */}
      {isValid && selectedDays.length > 0 && (
        <div className="p-3 rounded-md bg-green-100 border border-green-300">
          <p className="text-sm font-medium text-green-800/70">✓ Distribution valid! Total spots match the campaign period.</p>
        </div>
      )}
    </div>
  );
}
