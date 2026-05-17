import { apiClient } from "@/services/https";

const DEFAULT_UPLOAD_PATH = import.meta.env.VITE_UPLOAD_URL || "/uploads";

export interface UploadFileOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
  uploadPath?: string;
  optimizeImages?: boolean;
}

export interface UploadFileResponse {
  objectName?: string;
  downloadUrl?: string;
  size?: number;
  contentType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw?: any;
}

function fileToBase64(file: File, signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Upload canceled", "AbortError"));
      return;
    }

    const reader = new FileReader();

    const abortHandler = () => {
      reader.abort();
      reject(new DOMException("Upload canceled", "AbortError"));
    };

    if (signal) {
      signal.addEventListener("abort", abortHandler, { once: true });
    }

    reader.onload = () => {
      if (signal) {
        signal.removeEventListener("abort", abortHandler);
      }

      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file for upload."));
        return;
      }

      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };

    reader.onerror = () => {
      if (signal) {
        signal.removeEventListener("abort", abortHandler);
      }
      reject(new Error("Failed to read file for upload."));
    };

    reader.readAsDataURL(file);
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("Failed to process image for upload."));
    };
    img.src = src;
  });
}

async function maybeOptimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Keep small files untouched to avoid unnecessary processing time.
  if (file.size < 1024 * 1024) {
    return file;
  }

  const image = await loadImage(file);
  const maxDimension = 1920;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  if (targetWidth === image.width && targetHeight === image.height && !["image/jpeg", "image/webp"].includes(file.type)) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const quality = 0.82;
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, file.type, quality);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File([blob], file.name, {
    type: blob.type || file.type,
    lastModified: file.lastModified,
  });
}

export async function uploadFile(file: File, options?: UploadFileOptions): Promise<UploadFileResponse> {
  options?.onProgress?.(0);

  const preparedFile = options?.optimizeImages === false ? file : await maybeOptimizeImage(file);
  options?.onProgress?.(20);

  // The upload API accepts JSON with base64 payload, so we first encode the file client-side.
  const data = await fileToBase64(preparedFile, options?.signal);
  options?.onProgress?.(40);

  const response = await apiClient.post(
    options?.uploadPath || DEFAULT_UPLOAD_PATH,
    {
      fileName: preparedFile.name,
      contentType: preparedFile.type || "application/octet-stream",
      data,
    },
    {
      signal: options?.signal,
    }
  );

  options?.onProgress?.(100);

  const raw = response.data as Record<string, unknown>;
  return {
    objectName: typeof raw?.objectName === "string" ? raw.objectName : undefined,
    downloadUrl: typeof raw?.downloadUrl === "string" ? raw.downloadUrl : undefined,
    size: typeof raw?.size === "number" ? raw.size : undefined,
    contentType: typeof raw?.contentType === "string" ? raw.contentType : undefined,
    raw,
  };
}
