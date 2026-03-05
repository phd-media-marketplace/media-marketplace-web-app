import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SegmentSelectionDialogProps<T extends string> {
  isDialogOpen: boolean;
  setIsDialogOpenValuefunc: (open: boolean) => void;
  selectedTypes: T[];
  toggleSegmentTypefunc: (type: T) => void;
  addSegment: () => void;
  SEGMENT_TYPE_OPTIONS: { value: T; label: string }[];
}

export default function SegmentSelectionDialog<T extends string>({
  isDialogOpen,
  setIsDialogOpenValuefunc,
  selectedTypes,
  toggleSegmentTypefunc,
  addSegment,
  SEGMENT_TYPE_OPTIONS,
}: SegmentSelectionDialogProps<T>) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpenValuefunc}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Segment Types</DialogTitle>
                <DialogDescription>
                  Each selected type will create a separate segment card
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-2 py-2">
                {SEGMENT_TYPE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(option.value)}
                      onChange={() => toggleSegmentTypefunc(option.value)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary checked:bg-primary checked:border-primary"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
    
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                   onClick={() => setIsDialogOpenValuefunc(false)}
                  className="border-secondary hover:bg-secondary hover:text-primary">
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={addSegment}
                  disabled={selectedTypes.length === 0}
                  className="bg-primary text-white hover:bg-transparent hover:text-primary border border-primary hover:border-primary"
                >
                  Add {selectedTypes.length} Segment{selectedTypes.length !== 1 ? 's' : ''}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
  )
}
