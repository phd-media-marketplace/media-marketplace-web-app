import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-orange-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 403 Illustration */}
          <div className="mb-8 relative">
            <motion.div
              className="text-[180px] md:text-[250px] font-bold text-red-200 leading-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              403
            </motion.div>
            
            {/* Floating shield icon */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <ShieldAlert className="w-10 h-10 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              You don't have permission to access this page. This area is restricted to authorized users only.
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
                className="bg-linear-to-r from-red-500 to-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-105 text-white px-8 py-6 text-lg"
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
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-red-500 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go back to previous page
            </button>
          </motion.div>

          {/* Help Section */}
          <motion.div
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <p className="text-sm text-gray-600">
              If you believe this is an error, please contact your administrator or{" "}
              <a 
                href="mailto:support@mediamarketplace.com" 
                className="text-red-500 hover:underline font-medium"
              >
                contact support
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
