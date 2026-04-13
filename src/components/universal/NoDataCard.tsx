import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Plus } from "lucide-react";

export interface NoDataCardProps {
  title?: string;
  message?: string;
  btnText?: string;
  redirectFunc?: () => void;
  className?: string;
}

export default function NoDataCard({
  title,
  message,
  btnText,
  redirectFunc,
  className = "",
}: NoDataCardProps) {
  return (
    <Card className={`border-dashed border-primary/30 bg-linear-to-br from-white via-primary/5 to-secondary/10 shadow-sm ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <motion.div
          className="mb-5"
          animate={{ y: [0, -6, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-white shadow-sm">
            <Layers className="h-7 w-7 text-primary" />
          </div>
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900">
          {title || "No data available"}
        </h3>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          {message || "No records were found for this section yet."}
        </p>

        {btnText && redirectFunc && (
          <Button
            className="mt-6 bg-primary text-white hover:bg-primary/90"
            onClick={redirectFunc}
          >
            <Plus className="mr-2 h-4 w-4" />
            {btnText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
