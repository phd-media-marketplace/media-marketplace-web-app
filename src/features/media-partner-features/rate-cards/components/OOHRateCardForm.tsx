import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { OOHMetadata } from "../types";

interface OOHRateCardFormProps {
  metadata: OOHMetadata;
  setMetadata: (metadata: OOHMetadata) => void;
}

/**
 * OOH (Out-of-Home) Rate Card Form Component
 * Manages OOH advertising rate card details including placement, format, and dimensions
 */
export default function OOHRateCardForm({ metadata, setMetadata }: OOHRateCardFormProps) {
  /**
   * Updates a field in the OOH metadata
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const updateField = (field: keyof OOHMetadata, value: string | number) => {
    setMetadata({
      ...metadata,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>OOH (Out-of-Home) Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <Input
              value={metadata.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Highway Billboard Campaign"
            />
            <p className="text-xs text-gray-500 mt-1">
              Descriptive name for this OOH campaign
            </p>
          </div>

          {/* Placement */}
          <div>
            <label className="block text-sm font-medium mb-2">Placement Location</label>
            <Input
              value={metadata.placement || ''}
              onChange={(e) => updateField('placement', e.target.value)}
              placeholder="e.g., City Center, Highway Exit 5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Specific location of the advertisement
            </p>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium mb-2">Format Type</label>
            <Select 
              value={metadata.format || ''} 
              onValueChange={(value) => updateField('format', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Billboard">Billboard</SelectItem>
                <SelectItem value="Bus Shelter">Bus Shelter</SelectItem>
                <SelectItem value="Transit">Transit</SelectItem>
                <SelectItem value="Street Furniture">Street Furniture</SelectItem>
                <SelectItem value="Digital Display">Digital Display</SelectItem>
                <SelectItem value="Poster">Poster</SelectItem>
                <SelectItem value="Wallscape">Wallscape</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Type of OOH advertising format
            </p>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium mb-2">Dimensions</label>
            <Input
              value={metadata.dimensions || ''}
              onChange={(e) => updateField('dimensions', e.target.value)}
              placeholder="e.g., 14' x 48', 6' x 3'"
            />
            <p className="text-xs text-gray-500 mt-1">
              Physical dimensions of the display
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">Duration (days)</label>
            <Input
              type="number"
              value={metadata.duration || 0}
              onChange={(e) => updateField('duration', Number(e.target.value))}
              placeholder="30"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Campaign duration in days
            </p>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <Select 
              value={metadata.unit || ''} 
              onValueChange={(value) => updateField('unit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per day">Per Day</SelectItem>
                <SelectItem value="per week">Per Week</SelectItem>
                <SelectItem value="per month">Per Month</SelectItem>
                <SelectItem value="per campaign">Per Campaign</SelectItem>
                <SelectItem value="per impression">Per Impression</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Billing unit for this rate
            </p>
          </div>

          {/* Base Rate */}
          <div>
            <label className="block text-sm font-medium mb-2">Base Rate *</label>
            <Input
              type="number"
              value={metadata.baseRate || 0}
              onChange={(e) => updateField('baseRate', Number(e.target.value))}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Standard rate for this placement
            </p>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">Currency *</label>
            <Select 
              value={metadata.currency || 'GHS'} 
              onValueChange={(value) => updateField('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GHS">GHS (₵)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Valid From */}
          <div>
            <label className="block text-sm font-medium mb-2">Valid From</label>
            <Input
              type="date"
              value={metadata.validFrom || ''}
              onChange={(e) => updateField('validFrom', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Start date for rate validity
            </p>
          </div>

          {/* Valid To */}
          <div>
            <label className="block text-sm font-medium mb-2">Valid To</label>
            <Input
              type="date"
              value={metadata.validTo || ''}
              onChange={(e) => updateField('validTo', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              End date for rate validity
            </p>
          </div>

          {/* Minimum Spend */}
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Spend</label>
            <Input
              type="number"
              value={metadata.minimumSpend || 0}
              onChange={(e) => updateField('minimumSpend', Number(e.target.value))}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum campaign spend requirement
            </p>
          </div>
        </div>

        {/* Notes - Full Width */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <Textarea
            value={metadata.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Additional details about this OOH placement, visibility, traffic patterns, etc..."
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            Include relevant information about location, visibility, audience demographics, or special features
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 OOH Rate Card Tips</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Include high-resolution photos of the location and display</li>
            <li>• Specify traffic counts and demographic data if available</li>
            <li>• Note any seasonal variations in visibility or audience</li>
            <li>• Mention production and installation requirements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
