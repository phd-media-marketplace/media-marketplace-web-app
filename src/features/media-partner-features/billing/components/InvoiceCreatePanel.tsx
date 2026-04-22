import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Calendar, MessageSquare, Zap } from "lucide-react";

interface InvoiceCreatePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderNumber: string;
  dueDate: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onWorkOrderNumberChange: (workOrderNumber: string) => void;
  onAmountChange: (amount: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onGenerateInvoiceAndSend: () => void;
  onGenerateInvoiceAndSaveAsDraft: () => void;
  saving: boolean;
  generating: boolean;
}

export function InvoiceCreatePanel({
  open,
  onOpenChange,
  workOrderNumber,
  dueDate,
  notes,
  onNotesChange,
  onWorkOrderNumberChange,
  onDueDateChange,
  onGenerateInvoiceAndSend,
  onGenerateInvoiceAndSaveAsDraft,
  saving,
  generating,
}: InvoiceCreatePanelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Or Generate Invoice</DialogTitle>
          <DialogDescription>
            Fill out invoice fields and create manually, or generate directly from a work order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-primary" />
              Work Order Number
            </label>
            <Input
              placeholder="Enter work order number"
              value={workOrderNumber}
              onChange={(event) => onWorkOrderNumberChange(event.target.value)}
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-primary" />
              Due Date
            </label>
            <Input 
              type="date" 
              value={dueDate} 
              onChange={(event) => onDueDateChange(event.target.value)}
              className="input-field" 
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MessageSquare className="w-4 h-4 text-primary" />
              Notes
            </label>
            <Textarea
              placeholder="Enter any notes for the invoice (optional)"
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              className="input-field h-24 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button
            onClick={onGenerateInvoiceAndSaveAsDraft}
            disabled={saving || !workOrderNumber}
            variant="outline"
            className="custom-secondary-outline-btn"
          >
            {saving ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            onClick={onGenerateInvoiceAndSend}
            disabled={generating || !workOrderNumber || !dueDate}
            className="bg-primary text-white hover:bg-primary/90 gap-2"
          >
            <Zap className="w-4 h-4" />
            {generating ? "Generating..." : "Generate & Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
