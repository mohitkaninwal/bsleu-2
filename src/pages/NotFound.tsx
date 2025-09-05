import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, BookOpen, Globe, AlertTriangle, RefreshCw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleGoBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.history.back();
    }, 300);
  };

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-bounce">
              404
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-8 sm:p-12">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              URL: <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{location.pathname}</code>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGoHome}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                  isAnimating ? 'animate-pulse' : ''
                }`}
              >
                <Home className="h-5 w-5" />
                Go to Homepage
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </Button>
              
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Search className="h-6 w-6 text-blue-600" />
              Quick Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:animate-bounce" />
                <p className="font-medium text-gray-800">Exam Booking</p>
                <p className="text-sm text-gray-600">Book your language exam</p>
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:animate-bounce" />
                <p className="font-medium text-gray-800">Test Centers</p>
                <p className="text-sm text-gray-600">Find exam locations</p>
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:animate-bounce" />
                <p className="font-medium text-gray-800">Exam Info</p>
                <p className="text-sm text-gray-600">Learn about exams</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact us at{" "}
            <a href="mailto:support@bsleu.com" className="text-blue-600 hover:text-blue-800 underline">
              support@bsleu.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
