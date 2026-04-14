import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FileUpload, { type UploadTask } from "./FileUpload";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export interface FileUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, options: { signal: AbortSignal; onProgress: (progress: number) => void }) => Promise<{ url?: string; id?: string; fileName?: string; raw?: unknown }>;
  onTasksChange: (tasks: UploadTask[]) => void;
  uploadedFiles: string[];
}

export default function FileUploadDialog({ isOpen, onOpenChange, onUpload, onTasksChange, uploadedFiles }: FileUploadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Upload className="h-4 w-4 text-primary" />
							Upload Program Flyers / Images
						</DialogTitle>
						<DialogDescription>
							Upload package creatives. Successful uploads are saved to metadata.packageImages.
						</DialogDescription>
					</DialogHeader>

					<FileUpload
						label="Program Flyers / Images"
						helperText="Accepted: images, videos, and PDF, max 6 files, 8MB each"
						accept="image/*,video/*,.pdf"
						multiple
						maxFiles={6}
						maxFileSizeMB={8}
						onUpload={onUpload}
						onTasksChange={onTasksChange}
						onValidationError={(message) => toast.error(message)}
					/>

					<div className="flex items-center justify-between pt-2">
						{uploadedFiles.length > 0 ? (
							<p className="text-xs text-green-700">{uploadedFiles.length} uploaded file URL(s) ready for submit</p>
						) : (
							<p className="text-xs text-gray-500">No uploads completed yet</p>
						)}
						<Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            className="border-primary text-primary hover:bg-primary hover:text-white"
                        >
							Done
						</Button>
					</div>
				</DialogContent>
			</Dialog>
  )
}
