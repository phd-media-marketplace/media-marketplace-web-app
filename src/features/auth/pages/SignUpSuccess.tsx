import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-white to-secondary/10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2 
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md"
              >
                <Mail className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Registration Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for signing up to our Media Marketplace platform.
            </p>
          </motion.div>

          {/* Email Instruction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Check Your Email
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We've sent a verification email to your registered email address. 
                  Please check your inbox and follow the instructions to activate your account 
                  and complete the setup process.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm text-gray-600 mb-8"
          >
            <p>
              Didn't receive the email? Check your spam folder or{" "}
              <button className="text-primary hover:underline font-medium">
                resend verification email
              </button>
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                className="w-full bg-linear-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 hover:scale-105 text-white px-8"
              >
                Go to Login
              </Button>
            </Link>
            <Link to="/" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 px-8"
              >
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Support Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a 
                href="mailto:support@mediamarketplace.com" 
                className="text-primary hover:underline font-medium"
              >
                support@mediamarketplace.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
