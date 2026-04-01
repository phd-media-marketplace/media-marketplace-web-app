import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SegmentSelectionDialogProps<T extends string> {
  AD_TYPE_OPTIONS: { value: T; label: string }[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedAdType: T | null;
  setSelectedAdType: (adType: T | null) => void;
  addRateConfiguration: () => void;
}

export default function AdTypeSelectionDialog<T extends string>({
  AD_TYPE_OPTIONS,
  isDialogOpen,
  setIsDialogOpen,
  selectedAdType,
  setSelectedAdType,
  addRateConfiguration
}: SegmentSelectionDialogProps<T>) {
  return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Ad Type</DialogTitle>
            <DialogDescription>
              Choose the type of ad to include all related rates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {AD_TYPE_OPTIONS.map(option => (
              <label
                key={option.value}
                className="flex items-center space-x-3 p-3 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="adType"
                  value={option.value}
                  checked={selectedAdType === option.value}
                  onChange={(e) => setSelectedAdType(e.target.value as T)}
                  className="w-4 h-4"
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedAdType(null);
              }}
              className="border-secondary hover:bg-secondary hover:text-primary"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={addRateConfiguration}
              disabled={!selectedAdType}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Add Rate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  )
}
