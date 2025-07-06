import { Lock, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotAuthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-100 relative overflow-hidden flex items-center justify-center">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-16 left-12 w-16 h-16 bg-red-400 rounded-xl rotate-12"></div>
        <div className="absolute bottom-12 right-24 w-20 h-20 bg-pink-600 rounded-lg -rotate-6"></div>
        <div className="absolute top-1/2 left-1/3 w-14 h-14 bg-yellow-600 rounded-full rotate-45"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center text-center py-20 px-6 space-y-8">
        <div className="flex items-center justify-center space-x-3">
          <Lock className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-blue-700">Access Denied</h1>
        </div>
        <p className="text-lg text-blue-600 max-w-md">
          You don’t have permission to view this page. Only administrators are allowed to access this section.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-red-50 font-medium"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>

        <p className="text-sm text-red-500 mt-4">
          🚫 This page is restricted. Contact an admin if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
