import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-white to-secondary/10">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <motion.div
              className="text-[180px] md:text-[250px] font-bold text-secondary/20 leading-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              404
            </motion.div>
            
            {/* Floating media icon */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                <TrendingUp className="w-10 h-10 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Page Not Found
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back to your media marketplace.
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/">
              <Button
                size="lg"
                className="bg-linear-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 hover:scale-105 text-white px-8 py-6 text-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Button>
            </Link>
          </motion.div>

          {/* Back Button */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go back to previous page
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
