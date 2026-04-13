import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface LoaderProps {
    title?: string;
    message?: string;
    className?: string;
}

export default function Loader({ title, message, className = "" }: LoaderProps) {
  return (
        <div className={`w-full py-10 ${className}`}>
            <motion.div
                className="mx-auto max-w-lg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-white via-primary/5 to-secondary/10 p-8 shadow-sm">
                    <motion.div
                        className="absolute inset-0 opacity-40"
                        animate={{ x: ["-40%", "40%"] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            background:
                                "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%)",
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-white shadow-sm">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        </div>

                        <motion.div
                            className="h-1.5 w-32 overflow-hidden rounded-full bg-primary/15"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <motion.div
                                className="h-full rounded-full bg-primary"
                                animate={{ x: ["-100%", "130%"] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        <h2 className="mt-6 text-xl font-bold text-gray-900">
                            {title || "Loading..."}
                        </h2>
                        <p className="mt-2 max-w-sm text-sm text-gray-600">
                            {message || "Please wait while we prepare your content."}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
