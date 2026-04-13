import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { PackageItem } from "../types";
// export interface PackageItemData {
//   rateCardId: string;
//   adType: string;
//   segmentId: string;
//   segmentClass?: string;
// programName?: string;
//   quantity: number;
//   unitRate: number;
// }

interface PackageItemProps {
  item: Omit<PackageItem, "totalPrice">;
  index: number;
  availableAdTypes: string[];
  segments: Array<{ class: string; className: string; unitRate: number; rateCardId: string }>;
  onAdTypeChange: (index: number, adType: string) => void;
  onSegmentClassChange: (index: number, segmentClass: string) => void;
  onUpdate: (index: number, field: keyof Omit<PackageItem, "totalPrice">, value: string | number) => void;
  onRemove: (index: number) => void;
}

export default function PackageItem({
  item,
  index,
  availableAdTypes,
  segments,
  onAdTypeChange,
  onSegmentClassChange,
  onUpdate,
  onRemove,
}: PackageItemProps) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Package Item</p>
            <h4 className="text-base py-2 font-semibold text-primary">Item {index + 1}</h4>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-gray-700">
              Ad Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={item.adType}
              onValueChange={(value) => onAdTypeChange(index, value)}
            >
              <SelectTrigger className="w-full text-sm input-field">
                <SelectValue placeholder="Select ad type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                {availableAdTypes.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No ad types available
                  </SelectItem>
                ) : (
                  availableAdTypes.map((adType) => (
                    <SelectItem key={adType} value={adType}>
                      {adType.replace(/_/g, ' ')}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-700">
              Segment <span className="text-red-500">*</span>
            </label>
            <Select
              value={item.segmentClass || ''}
              onValueChange={(value) => onSegmentClassChange(index, value)}
              disabled={!item.adType}
            >
              <SelectTrigger className="text-sm w-full input-field">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                {!item.adType ? (
                  <SelectItem value="none" disabled>
                    Select ad type first
                  </SelectItem>
                ) : (
                  segments.map((segment) => (
                    <SelectItem key={segment.class} value={segment.class}>
                      {segment.class} - {segment.className}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-700">Programme Name</label>
            <Input
              type="text"
              value={item.programmeName || ''}
              onChange={(e) => onUpdate(index, 'programmeName', e.target.value)}
              placeholder="eg. Telenoval"
              className="input-field text-sm w-full"
            /> 
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-700">Unit Rate (GH₵)</label>
            <Input
              type="number"
              value={item.unitRate}
              disabled
              className="cursor-not-allowed bg-gray-50 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Auto-populated from rate card</p>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-700">Quantity</label>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => onUpdate(index, 'quantity', parseInt(e.target.value) || 0)}
              min="1"
              className="input-field text-sm w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-700">Total</label>
            <div className="flex h-9 items-center rounded-md border border-violet-200 bg-linear-to-r from-purple-50 to-blue-50 px-3 py-2 text-sm font-semibold text-primary">
              GH₵ {(item.quantity * item.unitRate).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
