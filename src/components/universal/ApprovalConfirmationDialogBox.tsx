import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ApprovalConfirmationDialogBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmDisabled?: boolean;
  content?: ReactNode;
  className?: string;
}

export default function ApprovalConfirmationDialogBox({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm Approval",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  content,
  className,
}: ApprovalConfirmationDialogBoxProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[95vw] max-w-lg border-0 bg-white p-0 shadow-2xl",
          className
        )}
      >
        <DialogHeader className="space-y-3 bg-linear-to-b from-emerald-50/70 to-transparent px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold leading-tight text-slate-900">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </span>
            <span>{title}</span>
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-sm leading-relaxed text-slate-600">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {content ? <div className="px-6 py-2">{content}</div> : null}

        <DialogFooter className="flex-col-reverse gap-2 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100 sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { ApprovalConfirmationDialogBoxProps };
