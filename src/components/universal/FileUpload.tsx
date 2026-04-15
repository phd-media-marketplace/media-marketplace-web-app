import { useEffect, useRef, useState } from "react";
import { Upload, X, RotateCcw, Loader2, FileText, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type UploadStatus = "queued" | "uploading" | "success" | "error" | "canceled";

export interface UploadedFileResult {
  id?: string;
  url?: string;
  fileName?: string;
  size?: number;
  mimeType?: string;
  raw?: unknown;
}

export interface UploadTask {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  result?: UploadedFileResult;
}

export interface FileUploadProps {
  onUpload: (
    file: File,
    options: {
      signal: AbortSignal;
      onProgress: (progress: number) => void;
    }
  ) => Promise<UploadedFileResult>;
  label?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSizeMB?: number;
  disabled?: boolean;
  autoUpload?: boolean;
  className?: string;
  onTasksChange?: (tasks: UploadTask[]) => void;
  onValidationError?: (message: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Fall back to a simple file icon when we do not have a preview thumbnail.
function getFileIcon(file: File) {
  if (file.type.startsWith("image/")) {
    return <ImageIcon className="h-4 w-4 text-primary" />;
  }
  if (file.type.startsWith("video/")) {
    return <Video className="h-4 w-4 text-primary" />;
  }
  return <FileText className="h-4 w-4 text-primary" />;
}

// Keep the video check separate so thumbnail rendering stays readable.
function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

// Support both MIME rules and file extensions in the same comma-separated allow list.
function isAccepted(file: File, accept?: string): boolean {
  if (!accept) return true;

  const rules = accept.split(",").map((item) => item.trim()).filter(Boolean);
  if (rules.length === 0) return true;

  return rules.some((rule) => {
    if (rule.endsWith("/*")) {
      return file.type.startsWith(rule.replace("*", ""));
    }

    if (rule.startsWith(".")) {
      return file.name.toLowerCase().endsWith(rule.toLowerCase());
    }

    return file.type === rule;
  });
}

export default function FileUpload({
  onUpload,
  label = "Upload files",
  helperText,
  accept,
  multiple = false,
  maxFiles = 5,
  maxFileSizeMB = 10,
  disabled = false,
  autoUpload = true,
  className,
  onTasksChange,
  onValidationError,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortControllersRef = useRef<Record<string, AbortController>>({});
  const previewUrlsRef = useRef<Record<string, string>>({});
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [dragging, setDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  // Sync tasks with parent component
  useEffect(() => {
    onTasksChange?.(tasks);
  }, [tasks, onTasksChange]);
  // Keep refs updated for cleanup
  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  }, [previewUrls]);
  // Cleanup on unmount: abort ongoing uploads and revoke preview URLs
  useEffect(() => {
    const controllers = abortControllersRef.current;
    return () => {
      Object.values(controllers).forEach((controller) => controller.abort());
    };
  }, []);
  // Cleanup preview URLs on unmount or when they change
  useEffect(() => {
    return () => {
      Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Update a specific task by ID with new properties
  const updateTask = (taskId: string, updates: Partial<UploadTask>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  // Start the upload process for a specific task
  const startUpload = async (taskId: string) => {
    const target = tasks.find((task) => task.id === taskId);
    if (!target || target.status === "uploading") return;

    const controller = new AbortController();
    abortControllersRef.current[taskId] = controller;

    updateTask(taskId, { status: "uploading", progress: 0, error: undefined });

    try {
      const result = await onUpload(target.file, {
        signal: controller.signal,
        onProgress: (progress) => {
          updateTask(taskId, { progress: Math.max(0, Math.min(100, progress)) });
        },
      });

      updateTask(taskId, { status: "success", progress: 100, result });
    } catch (error: unknown) {
      const wasCanceled = controller.signal.aborted;
      updateTask(taskId, {
        status: wasCanceled ? "canceled" : "error",
        error: wasCanceled
          ? "Upload canceled"
          : error instanceof Error
            ? error.message
            : "Upload failed",
      });
    } finally {
      delete abortControllersRef.current[taskId];
    }
  };

  const addFiles = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) return;

    const availableSlots = Math.max(0, maxFiles - tasks.length);
    if (availableSlots === 0) {
      onValidationError?.(`You can upload up to ${maxFiles} file(s).`);
      return;
    }

    const selected = incomingFiles.slice(0, availableSlots);

    const nextTasks: UploadTask[] = [];
    const nextPreviewUrls: Record<string, string> = {};

    selected.forEach((file) => {
      const tooLarge = file.size > maxFileSizeMB * 1024 * 1024;
      const invalidType = !isAccepted(file, accept);

      if (tooLarge) {
        onValidationError?.(`${file.name} exceeds ${maxFileSizeMB}MB.`);
        return;
      }

      if (invalidType) {
        onValidationError?.(`${file.name} has an unsupported file type.`);
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      nextTasks.push({ id, file, status: "queued", progress: 0 });

      // Use a local object URL so image and video files can show a thumbnail immediately.
      if (file.type.startsWith("image/") || isVideoFile(file)) {
        nextPreviewUrls[id] = URL.createObjectURL(file);
      }
    });

    if (nextTasks.length === 0) return;

    setPreviewUrls((prev) => ({ ...prev, ...nextPreviewUrls }));
    setTasks((prev) => {
      const merged = [...prev, ...nextTasks];
      return merged;
    });

    if (autoUpload) {
      // Start upload on next tick so state is consistent before progress updates.
      setTimeout(() => {
        nextTasks.forEach((task) => {
          void startUpload(task.id);
        });
      }, 0);
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    addFiles(selected);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    if (disabled) return;

    const selected = Array.from(event.dataTransfer.files || []);
    addFiles(selected);
  };

  const cancelUpload = (taskId: string) => {
    abortControllersRef.current[taskId]?.abort();
  };

  const retryUpload = (taskId: string) => {
    updateTask(taskId, { status: "queued", progress: 0, error: undefined });
    void startUpload(taskId);
  };

  const removeTask = (taskId: string) => {
    abortControllersRef.current[taskId]?.abort();
    delete abortControllersRef.current[taskId];

    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    const previewUrl = previewUrls[taskId];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrls((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }
  };

  return (
    <Card className={cn("border border-primary/15", className)}>
      <CardContent className="space-y-4 p-4">
        <div>
          <h3 className="text-sm font-semibold text-primary">{label}</h3>
          {helperText ? <p className="mt-1 text-xs text-gray-500">{helperText}</p> : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={onFileInputChange}
          disabled={disabled}
        />

        <div
          className={cn(
            "rounded-xl border border-dashed p-6 text-center transition-colors",
            dragging ? "border-primary bg-primary/5" : "border-primary/30 bg-white",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          )}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-medium text-gray-800">Drop files here or click to browse</p>
          <p className="mt-1 text-xs text-gray-500">
            Max {maxFiles} file(s), up to {maxFileSizeMB}MB each
            {accept ? `, allowed: ${accept}` : ""}
          </p>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const isUploading = task.status === "uploading";
            const canRetry = task.status === "error" || task.status === "canceled";
            const previewUrl = previewUrls[task.id];

            return (
              <div key={task.id} className="rounded-lg border border-primary/15 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5">
                      {previewUrl ? (
                        isVideoFile(task.file) ? (
                          <video
                            src={previewUrl}
                            className="h-10 w-10 rounded-md object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={previewUrl}
                            alt={task.file.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          {getFileIcon(task.file)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{task.file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(task.file.size)}</p>
                      <p className="mt-1 text-xs">
                        {task.status === "success" && <span className="text-green-600">Uploaded</span>}
                        {task.status === "uploading" && <span className="text-primary">Uploading...</span>}
                        {task.status === "queued" && <span className="text-gray-500">Queued</span>}
                        {task.status === "canceled" && <span className="text-amber-600">Canceled</span>}
                        {task.status === "error" && <span className="text-red-600">{task.error || "Upload failed"}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {isUploading && (
                      <Button size="icon-xs" variant="outline" type="button" onClick={() => cancelUpload(task.id)} className="text-red-700">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {canRetry && (
                      <Button size="icon-xs" variant="outline" type="button" onClick={() => retryUpload(task.id)} className="text-primary">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button size="icon-xs" variant="ghost" type="button" onClick={() => removeTask(task.id)} className="text-red-700">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full transition-all",
                      task.status === "success" ? "bg-green-500" : "bg-primary"
                    )}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {!autoUpload && tasks.some((task) => task.status === "queued") && (
          <Button
            type="button"
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => {
              tasks
                .filter((task) => task.status === "queued")
                .forEach((task) => {
                  void startUpload(task.id);
                });
            }}
            disabled={disabled}
          >
            <Loader2 className="mr-2 h-4 w-4" />
            Upload queued files
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
