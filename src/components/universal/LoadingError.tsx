import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RotateCw } from "lucide-react";

export interface LoadingErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  OnReturn?: () => void;
  returnBtnText?: string;
  className?: string;
}

export default function LoadingError({
  title,
  message,
  onRetry,
  OnReturn,
  returnBtnText,
  className = "",
}: LoadingErrorProps) {
//   const navigate = useNavigate();

  return (
    <div className={`w-full py-10 ${className}`}>
      <motion.div
        className="mx-auto max-w-xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-red-200 bg-linear-to-br from-white via-red-50/80 to-orange-50/70 p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-white shadow-sm">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {title || "Unable to load"}
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              {message || "An error occurred while loading this content."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {onRetry && (
                <Button variant="outline" onClick={onRetry} className="border-secondary text-primary hover:bg-secondary transition-colors duration-200">
                  <RotateCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              )}
              {OnReturn && (
                <Button onClick={OnReturn} className=" bg-primary text-white px-4 py-2 rounded-md hover:bg-transparent hover:text-primary border border-primary transition-colors duration-200">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {returnBtnText || "Back"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
