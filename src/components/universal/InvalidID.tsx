import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link2Off } from "lucide-react";

export interface InvalidIDProps {
  title?: string;
  message?: string;
  btnText?: string;
  redirectPath?: string;
  className?: string;
}

export default function InvalidID({
  title,
  message,
  btnText,
  redirectPath,
  className = "",
}: InvalidIDProps) {
  const navigate = useNavigate();

  return (
    <div className={`w-full py-10 ${className}`}>
      <motion.div
        className="mx-auto max-w-xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-white via-amber-50/70 to-yellow-50/60 p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-amber-200 bg-white shadow-sm">
              <Link2Off className="h-7 w-7 text-amber-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {title || "Invalid Rate Card"}
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              {message || "A valid rate card ID is required."}
            </p>

            <Button
              className="mt-6"
              onClick={() => navigate(redirectPath || "/media-partner/rate-cards")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {btnText || "Back"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
