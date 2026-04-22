import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmationVariant = "default" | "destructive";

interface contentProps {
  contentLabel: string;
  contentPlaceholder: string;
  contentValue: string;
  setContentValue: (value: string) => void;
}

interface RejectionConfirmationDialogBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?: ConfirmationVariant;
  content: contentProps;
  className?: string;
}

export default function RejectionConfirmationDialogBox({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "default",
  content,
  className,
}: RejectionConfirmationDialogBoxProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[95vw] max-w-lg border-0 bg-white p-0 shadow-2xl",
          className
        )}
      >
        <DialogHeader className="space-y-3 bg-linear-to-b from-red-50/70 to-transparent px-6 pt-6 ">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold leading-tight text-slate-900">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 shadow-sm">
              <CircleAlert className="h-5 w-5 text-red-600" />
            </span>
            <span>{title}</span>
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-sm leading-relaxed text-slate-600">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
       
        <div className="space-y-2 px-6 py-5">
            <label className="mb-1 block text-sm font-medium text-slate-700">
                {content.contentLabel} <span className="text-red-500">*</span>
            </label>
            <Textarea
                placeholder={content.contentPlaceholder}
                value={content.contentValue}
                onChange={(e) => content.setContentValue(e.target.value)}
                rows={5}
                className="min-h-32 resize-none border-slate-200 bg-white text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-red-200"
            />
        </div>
        
        <DialogFooter className="flex-col-reverse gap-2 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100 sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={!content.contentValue.trim()}
            className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 sm:w-auto"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { RejectionConfirmationDialogBoxProps, ConfirmationVariant };
